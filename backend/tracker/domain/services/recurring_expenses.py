"""Finance (recurring expenses) domain service.

Owns RecurringExpense CRUD plus processing logic. All queries are scoped to the requesting user.
"""
from datetime import date, timedelta
from decimal import Decimal

from ...models import RecurringExpense, Expense
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.recurring_expenses")


class RecurringExpenseService:
    def list(self, user, *, is_active=None):
        qs = RecurringExpense.objects.filter(user=user)
        if is_active is not None:
            qs = qs.filter(is_active=is_active)
        return list(qs)

    def get_by_id(self, user, recurring_id):
        recurring = RecurringExpense.objects.filter(id=recurring_id, user=user).first()
        if recurring is None:
            raise NotFoundError("Recurring expense not found")
        return recurring

    def create(self, user, data):
        item = validation.bounded_text(data.get("item"), max_length=255, field="item")
        category = validation.bounded_text(data.get("category"), max_length=100, field="category")
        quantity = validation.positive_int(data.get("quantity", 1), field="quantity", minimum=1)
        price = validation.bounded_decimal(data.get("price"), field="price")
        if price < 0:
            raise ValidationError("price must be non-negative")
        frequency = validation.bounded_text(data.get("frequency"), max_length=20, field="frequency")
        if frequency not in dict(RecurringExpense.FREQUENCY_CHOICES):
            raise ValidationError(f"Invalid frequency. Must be one of: {[k for k, _ in RecurringExpense.FREQUENCY_CHOICES]}")
        start_date = validation.parse_date(data.get("start_date"), field="start_date")
        end_date = None
        if data.get("end_date"):
            end_date = validation.parse_date(data.get("end_date"), field="end_date")
        day_of_month = None
        day_of_week = None
        if frequency == 'monthly':
            day_of_month = validation.positive_int(data.get("day_of_month", start_date.day), field="day_of_month", minimum=1, maximum=31)
        elif frequency == 'weekly':
            day_of_week = validation.positive_int(data.get("day_of_week", start_date.weekday()), field="day_of_week", minimum=0, maximum=6)
        next_occurrence = self._calculate_next_occurrence(frequency, start_date, day_of_month, day_of_week)
        is_active = data.get("is_active", True)
        recurring = RecurringExpense.objects.create(
            user=user,
            item=item,
            category=category,
            quantity=quantity,
            price=price,
            frequency=frequency,
            start_date=start_date,
            end_date=end_date,
            day_of_month=day_of_month,
            day_of_week=day_of_week,
            next_occurrence=next_occurrence,
            is_active=is_active,
        )
        logger.info("recurring_expenses.create user_id=%s id=%s", user.id, recurring.id)
        return recurring

    def _calculate_next_occurrence(self, frequency, start_date, day_of_month=None, day_of_week=None):
        """Calculate the next occurrence date based on frequency."""
        if frequency == 'daily':
            return start_date
        elif frequency == 'weekly':
            # Find the next occurrence of the specified day of week
            days_ahead = day_of_week - start_date.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            return start_date + timedelta(days=days_ahead)
        elif frequency == 'monthly':
            # Find the next occurrence of the specified day of month
            try:
                next_date = start_date.replace(day=day_of_month)
                if next_date < start_date:
                    # Move to next month
                    if start_date.month == 12:
                        next_date = start_date.replace(year=start_date.year + 1, month=1, day=day_of_month)
                    else:
                        next_date = start_date.replace(month=start_date.month + 1, day=day_of_month)
                return next_date
            except ValueError:
                # Day doesn't exist in month (e.g., Feb 30), use last day of month
                import calendar
                last_day = calendar.monthrange(start_date.year, start_date.month)[1]
                return start_date.replace(day=min(day_of_month, last_day))
        elif frequency == 'yearly':
            return start_date
        return start_date

    def update(self, user, recurring_id, data, *, partial=True):
        recurring = RecurringExpense.objects.filter(id=recurring_id, user=user).first()
        if recurring is None:
            raise NotFoundError("Recurring expense not found")
        if "item" in data:
            recurring.item = validation.bounded_text(data["item"], max_length=255, field="item")
        if "category" in data:
            recurring.category = validation.bounded_text(data["category"], max_length=100, field="category")
        if "quantity" in data:
            recurring.quantity = validation.positive_int(data["quantity"], field="quantity", minimum=1)
        if "price" in data:
            price = validation.bounded_decimal(data["price"], field="price")
            if price < 0:
                raise ValidationError("price must be non-negative")
            recurring.price = price
        if "frequency" in data:
            frequency = validation.bounded_text(data["frequency"], max_length=20, field="frequency")
            if frequency not in dict(RecurringExpense.FREQUENCY_CHOICES):
                raise ValidationError(f"Invalid frequency. Must be one of: {[k for k, _ in RecurringExpense.FREQUENCY_CHOICES]}")
            recurring.frequency = frequency
        if "start_date" in data:
            recurring.start_date = validation.parse_date(data["start_date"], field="start_date")
        if "end_date" in data:
            recurring.end_date = validation.parse_date(data["end_date"], field="end_date") if data["end_date"] else None
        if "day_of_month" in data:
            recurring.day_of_month = validation.positive_int(data["day_of_month"], field="day_of_month", minimum=1, maximum=31) if data["day_of_month"] else None
        if "day_of_week" in data:
            recurring.day_of_week = validation.positive_int(data["day_of_week"], field="day_of_week", minimum=0, maximum=6) if data["day_of_week"] else None
        if "is_active" in data:
            recurring.is_active = data["is_active"]
        # Recalculate next_occurrence if relevant fields changed
        if any(k in data for k in ['frequency', 'start_date', 'day_of_month', 'day_of_week']):
            recurring.next_occurrence = self._calculate_next_occurrence(
                recurring.frequency,
                recurring.start_date,
                recurring.day_of_month,
                recurring.day_of_week
            )
        recurring.save()
        logger.info("recurring_expenses.update user_id=%s id=%s", user.id, recurring.id)
        return recurring

    def delete(self, user, recurring_id):
        recurring = RecurringExpense.objects.filter(id=recurring_id, user=user).first()
        if recurring is None:
            raise NotFoundError("Recurring expense not found")
        recurring.delete()
        logger.info("recurring_expenses.delete user_id=%s id=%s", user.id, recurring_id)
        return True

    def process_due(self, user):
        """Process all due recurring expenses and create actual expense records."""
        today = date.today()
        due_recurring = RecurringExpense.objects.filter(
            user=user,
            is_active=True,
            next_occurrence__lte=today
        ).exclude(
            end_date__lt=today
        )
        created_expenses = []
        for recurring in due_recurring:
            # Create the expense
            expense = Expense.objects.create(
                user=user,
                date=recurring.next_occurrence,
                item=recurring.item,
                category=recurring.category,
                quantity=recurring.quantity,
                price=recurring.price,
            )
            created_expenses.append(expense)
            # Update next_occurrence
            recurring.next_occurrence = self._calculate_next_occurrence(
                recurring.frequency,
                recurring.next_occurrence,
                recurring.day_of_month,
                recurring.day_of_week
            )
            # Check if we've passed the end_date
            if recurring.end_date and recurring.next_occurrence > recurring.end_date:
                recurring.is_active = False
            recurring.save()
            logger.info("recurring_expenses.processed user_id=%s recurring_id=%s expense_id=%s", user.id, recurring.id, expense.id)
        return created_expenses


recurring_expense_service = RecurringExpenseService()