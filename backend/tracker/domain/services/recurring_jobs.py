"""Recurring transaction job services (P6-12).

Handles processing of recurring expenses, income, and subscription billing.
"""

from datetime import date, timedelta

from django.db import transaction
from django.utils import timezone

from ...models import (
    RecurringExpense,
    Expense,
    RecurringIncome,
    Income,
    Subscription,
)
from .notifications import notification_service
from ..logging import get_logger

logger = get_logger("tracker.domain.recurring_jobs")


class RecurringExpenseJobService:
    """Process due recurring expenses (P6-12)."""

    def process_due(self, user=None) -> int:
        """Process all due recurring expenses, optionally for a specific user."""
        now = timezone.now()
        today = now.date()

        qs = RecurringExpense.objects.filter(
            is_active=True,
            next_occurrence__lte=today,
        )
        if user:
            qs = qs.filter(user=user)

        count = 0
        for recurring in qs:
            try:
                self._create_expense(recurring)
                self._update_next_occurrence(recurring)
                count += 1
            except Exception as e:
                logger.error("recurring_expense.failed id=%s error=%s", recurring.id, e)
                self._notify_failure(recurring.user, recurring, str(e))

        if count > 0:
            logger.info("recurring_expense.processed count=%s", count)

        return count

    def _create_expense(self, recurring: RecurringExpense) -> Expense:
        with transaction.atomic():
            expense = Expense.objects.create(
                user=recurring.user,
                date=recurring.next_occurrence,
                item=recurring.item,
                category=recurring.category,
                quantity=recurring.quantity,
                price=recurring.price,
            )

            # Notify user
            notification_service.create_notification(
                user=recurring.user,
                notification_type="recurring_transaction",
                title=f"Recurring expense created: {
                    recurring.item}",
                message=f"${
                    recurring.total:.2f} for {
                    recurring.item} ({
                    recurring.category}) has been recorded.",
                priority="low",
                data={
                    "expense_id": expense.id,
                    "recurring_expense_id": recurring.id,
                    "amount": float(recurring.total),
                },
                dedupe_key=f"recurring_expense_{
                                recurring.id}_{
                                    recurring.next_occurrence}",
                dedupe_window_hours=24,
            )

        return expense

    def _update_next_occurrence(self, recurring: RecurringExpense) -> None:
        """Calculate and set the next occurrence date."""
        current = recurring.next_occurrence

        if recurring.frequency == "daily":
            next_date = current + timedelta(days=1)
        elif recurring.frequency == "weekly":
            next_date = current + timedelta(weeks=1)
        elif recurring.frequency == "monthly":
            # Handle day of month
            if recurring.day_of_month:
                # Find next month with this day
                if current.month == 12:
                    next_date = date(current.year + 1, 1, min(recurring.day_of_month, 31))
                else:
                    next_month = current.month + 1
                    # Handle months with fewer days
                    import calendar

                    max_day = calendar.monthrange(current.year, next_month)[1]
                    day = min(recurring.day_of_month, max_day)
                    next_date = date(current.year, next_month, day)
            else:
                # Same day next month
                next_date = self._add_months(current, 1)
        elif recurring.frequency == "yearly":
            next_date = self._add_months(current, 12)
        else:
            next_date = current + timedelta(days=1)

        # Check end date
        if recurring.end_date and next_date > recurring.end_date:
            recurring.is_active = False
            recurring.next_occurrence = next_date
            recurring.save(update_fields=["is_active", "next_occurrence", "updated_at"])
        else:
            recurring.next_occurrence = next_date
            recurring.save(update_fields=["next_occurrence", "updated_at"])

    def _add_months(self, dt: date, months: int) -> date:
        """Add months to a date, handling year rollover."""
        month = dt.month - 1 + months
        year = dt.year + month // 12
        month = month % 12 + 1
        # Handle day overflow
        import calendar

        max_day = calendar.monthrange(year, month)[1]
        day = min(dt.day, max_day)
        return date(year, month, day)

    def _notify_failure(self, user, recurring: RecurringExpense, error: str) -> None:
        notification_service.create_notification(
            user=user,
            notification_type="recurring_transaction",
            title=f"Failed to process recurring expense: {recurring.item}",
            message=f"Error: {error}",
            priority="high",
            data={"recurring_expense_id": recurring.id, "error": error},
            dedupe_key=f"recurring_expense_failed_{recurring.id}",
            dedupe_window_hours=12,
        )


class RecurringIncomeJobService:
    """Process due recurring income (P6-12)."""

    def process_due(self, user=None) -> int:
        """Process all due recurring income."""
        now = timezone.now()
        today = now.date()

        qs = RecurringIncome.objects.filter(
            is_active=True,
            next_occurrence__lte=today,
        )
        if user:
            qs = qs.filter(user=user)

        count = 0
        for recurring in qs:
            try:
                self._create_income(recurring)
                self._update_next_occurrence(recurring)
                count += 1
            except Exception as e:
                logger.error("recurring_income.failed id=%s error=%s", recurring.id, e)
                self._notify_failure(recurring.user, recurring, str(e))

        return count

    def _create_income(self, recurring: "RecurringIncome") -> Income:
        with transaction.atomic():
            income = Income.objects.create(
                user=recurring.user,
                date=recurring.next_occurrence,
                source=recurring.source,
                amount=recurring.amount,
                description=f"Recurring: {recurring.name}",
            )

            notification_service.create_notification(
                user=recurring.user,
                notification_type="recurring_transaction",
                title=f"Recurring income received: {
                    recurring.name}",
                message=f"${
                    recurring.amount:.2f} from {
                    recurring.get_source_display()} has been recorded.",
                priority="low",
                data={
                    "income_id": income.id,
                    "recurring_income_id": recurring.id,
                    "amount": float(recurring.amount),
                },
                dedupe_key=f"recurring_income_{
                            recurring.id}_{
                                recurring.next_occurrence}",
                dedupe_window_hours=24,
            )

        return income

    def _update_next_occurrence(self, recurring: "RecurringIncome") -> None:
        current = recurring.next_occurrence

        if recurring.frequency == "monthly":
            next_date = self._add_months(current, 1)
        elif recurring.frequency == "yearly":
            next_date = self._add_months(current, 12)
        else:
            next_date = current + timedelta(days=1)

        if recurring.end_date and next_date > recurring.end_date:
            recurring.is_active = False

        recurring.next_occurrence = next_date
        recurring.save(update_fields=["next_occurrence", "is_active", "updated_at"])

    def _add_months(self, dt: date, months: int) -> date:
        month = dt.month - 1 + months
        year = dt.year + month // 12
        month = month % 12 + 1
        import calendar

        max_day = calendar.monthrange(year, month)[1]
        day = min(dt.day, max_day)
        return date(year, month, day)

    def _notify_failure(self, user, recurring: "RecurringIncome", error: str) -> None:
        notification_service.create_notification(
            user=user,
            notification_type="recurring_transaction",
            title=f"Failed to process recurring income: {recurring.name}",
            message=f"Error: {error}",
            priority="high",
            data={"recurring_income_id": recurring.id, "error": error},
            dedupe_key=f"recurring_income_failed_{recurring.id}",
            dedupe_window_hours=12,
        )


class SubscriptionBillingJobService:
    """Process subscription billing (P6-12)."""

    def process_due(self, user=None) -> int:
        """Process due subscription payments."""
        now = timezone.now()
        today = now.date()

        qs = Subscription.objects.filter(
            status="active",
            next_billing_date__lte=today,
        )
        if user:
            qs = qs.filter(user=user)

        count = 0
        for subscription in qs:
            try:
                self._process_billing(subscription)
                count += 1
            except Exception as e:
                logger.error("subscription_billing.failed id=%s error=%s", subscription.id, e)
                self._notify_failure(subscription.user, subscription, str(e))

        return count

    def _process_billing(self, subscription: Subscription) -> None:
        with transaction.atomic():
            # Create expense for subscription payment
            expense = Expense.objects.create(
                user=subscription.user,
                date=subscription.next_billing_date,
                item=subscription.name,
                category=subscription.category,
                quantity=1,
                price=subscription.amount,
            )

            # Update subscription next billing date
            subscription.next_billing_date = self._next_billing_date(subscription)
            subscription.save(update_fields=["next_billing_date", "updated_at"])

            # Notify
            notification_service.create_notification(
                user=subscription.user,
                notification_type="recurring_transaction",
                title=f"Subscription payment: {subscription.name}",
                message=f"${subscription.amount:.2f} charged for {subscription.name}.",
                priority="low",
                data={
                    "expense_id": expense.id,
                    "subscription_id": subscription.id,
                    "amount": float(subscription.amount),
                },
                dedupe_key=f"subscription_{subscription.id}_{subscription.next_billing_date}",
                dedupe_window_hours=24,
            )

    def _next_billing_date(self, subscription: Subscription) -> date:
        current = subscription.next_billing_date
        if subscription.billing_cycle == "monthly":
            return self._add_months(current, 1)
        elif subscription.billing_cycle == "quarterly":
            return self._add_months(current, 3)
        elif subscription.billing_cycle == "yearly":
            return self._add_months(current, 12)
        return current + timedelta(days=1)

    def _add_months(self, dt: date, months: int) -> date:
        month = dt.month - 1 + months
        year = dt.year + month // 12
        month = month % 12 + 1
        import calendar

        max_day = calendar.monthrange(year, month)[1]
        day = min(dt.day, max_day)
        return date(year, month, day)

    def _notify_failure(self, user, subscription: Subscription, error: str) -> None:
        notification_service.create_notification(
            user=user,
            notification_type="recurring_transaction",
            title=f"Failed to process subscription: {subscription.name}",
            message=f"Error: {error}",
            priority="high",
            data={"subscription_id": subscription.id, "error": error},
            dedupe_key=f"subscription_failed_{subscription.id}",
            dedupe_window_hours=12,
        )


# Import RecurringIncome model for type hints
from ...models import RecurringIncome  # noqa: E402

recurring_expense_job_service = RecurringExpenseJobService()
recurring_income_job_service = RecurringIncomeJobService()
subscription_billing_job_service = SubscriptionBillingJobService()
