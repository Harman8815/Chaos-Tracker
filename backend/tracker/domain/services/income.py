"""Finance (income) domain service.

Owns Income CRUD plus analytics. All queries are scoped to the requesting user.
"""
from datetime import date

from ...models import Income, RecurringIncome
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.income")


class IncomeService:
    def list(self, user, *, year=None, month=None, source=None, start_date=None, end_date=None):
        qs = Income.objects.filter(user=user)
        if year is not None or month is not None:
            qs = self._apply_period_filters(qs, year=year, month=month)
        if source:
            qs = qs.filter(source=source)
        if start_date:
            qs = qs.filter(date__gte=validation.parse_date(start_date, field="start_date"))
        if end_date:
            qs = qs.filter(date__lte=validation.parse_date(end_date, field="end_date"))
        return list(qs)

    def _apply_period_filters(self, qs, *, year, month):
        today = date.today()
        try:
            y = int(year) if year is not None else today.year
            m = int(month) + 1 if month is not None else None
        except (TypeError, ValueError):
            raise ValidationError("Invalid year or month")
        if y < 1 or y > 9999:
            raise ValidationError("Year must be between 1 and 9999")
        if m is not None and (m < 1 or m > 12):
            raise ValidationError("Month must be between 0 and 11")
        if m is None:
            return qs.filter(date__year=y)
        return qs.filter(date__year=y, date__month=m)

    def list_with_summary(
            self,
            user,
            *,
            year=None,
            month=None,
            source=None,
            start_date=None,
            end_date=None):
        incomes = self.list(
            user,
            year=year,
            month=month,
            source=source,
            start_date=start_date,
            end_date=end_date,
        )
        total_amount = sum(float(income.amount) for income in incomes)
        source_breakdown = {}
        for income in incomes:
            source_breakdown[income.source] = source_breakdown.get(
                income.source, 0.0) + float(income.amount)
        return {
            "count": len(incomes),
            "total_amount": round(total_amount, 2),
            "source_breakdown": source_breakdown,
            "incomes": incomes,
        }

    def get_by_id(self, user, income_id):
        income = Income.objects.filter(id=income_id, user=user).first()
        if income is None:
            raise NotFoundError("Income not found")
        return income

    def create(self, user, data):
        source = validation.bounded_text(data.get("source"), max_length=20, field="source")
        amount = validation.bounded_decimal(data.get("amount"), field="amount")
        if amount < 0:
            raise ValidationError("amount must be non-negative")
        income_date = validation.parse_date(data.get("date"), field="date")
        description = data.get("description", "")
        income = Income.objects.create(
            user=user,
            date=income_date,
            source=source,
            amount=amount,
            description=description,
        )
        logger.info("income.create user_id=%s id=%s", user.id, income.id)
        return income

    def update(self, user, income_id, data, *, partial=True):
        income = Income.objects.filter(id=income_id, user=user).first()
        if income is None:
            raise NotFoundError("Income not found")
        if "source" in data:
            income.source = validation.bounded_text(data["source"], max_length=20, field="source")
        if "amount" in data:
            amount = validation.bounded_decimal(data["amount"], field="amount")
            if amount < 0:
                raise ValidationError("amount must be non-negative")
            income.amount = amount
        if "date" in data:
            income.date = validation.parse_date(data["date"], field="date")
        if "description" in data:
            income.description = data["description"]
        income.save()
        logger.info("income.update user_id=%s id=%s", user.id, income.id)
        return income

    def delete(self, user, income_id):
        income = Income.objects.filter(id=income_id, user=user).first()
        if income is None:
            raise NotFoundError("Income not found")
        income.delete()
        logger.info("income.delete user_id=%s id=%s", user.id, income_id)
        return True

    def summary(self, user, *, year=None, month=None, source=None, start_date=None, end_date=None):
        qs = Income.objects.filter(user=user)
        if year is not None or month is not None:
            qs = self._apply_period_filters(qs, year=year, month=month)
        if source:
            qs = qs.filter(source=source)
        if start_date:
            qs = qs.filter(date__gte=validation.parse_date(start_date, field="start_date"))
        if end_date:
            qs = qs.filter(date__lte=validation.parse_date(end_date, field="end_date"))
        incomes = list(qs)
        total_count = len(incomes)
        total_amount = sum(float(i.amount) for i in incomes)
        avg = (total_amount / total_count) if total_count else 0.0
        sources = sorted({i.source for i in incomes})
        return {
            "total_income": total_count,
            "total_amount": round(total_amount, 2),
            "average_per_income": round(avg, 2),
            "sources_count": len(sources),
            "unique_sources": sources,
        }

    def monthly_stats(self, user, *, year=None):
        today = date.today()
        try:
            y = int(year) if year is not None else today.year
        except (TypeError, ValueError):
            raise ValidationError("Invalid year")
        if y < 1 or y > 9999:
            raise ValidationError("Year must be between 1 and 9999")

        monthly_data = {}
        for month in range(1, 13):
            monthly_data[month] = {
                "month": month - 1,
                "month_name": date(y, month, 1).strftime("%B"),
                "count": 0,
                "total": 0.0,
            }
        for i in Income.objects.filter(user=user, date__year=y):
            monthly_data[i.date.month]["count"] += 1
            monthly_data[i.date.month]["total"] += float(i.amount)
        monthly_list = list(monthly_data.values())
        year_total = sum(m["total"] for m in monthly_list)
        return {
            "year": y,
            "total_amount": round(year_total, 2),
            "monthly_stats": monthly_list,
        }

    # --- Recurring Income ---

    def list_recurring(self, user, *, is_active=None):
        qs = RecurringIncome.objects.filter(user=user)
        if is_active is not None:
            qs = qs.filter(is_active=is_active)
        return list(qs)

    def get_recurring_by_id(self, user, recurring_id):
        recurring = RecurringIncome.objects.filter(id=recurring_id, user=user).first()
        if recurring is None:
            raise NotFoundError("Recurring income not found")
        return recurring

    def create_recurring_income(self, user, data):
        name = validation.bounded_text(data.get("name"), max_length=255, field="name")
        source = validation.bounded_text(data.get("source"), max_length=20, field="source")
        amount = validation.bounded_decimal(data.get("amount"), field="amount")
        if amount < 0:
            raise ValidationError("amount must be non-negative")
        frequency = validation.choice(
            data.get(
                "frequency", "monthly"), RecurringIncome.FREQUENCY_CHOICES if hasattr(
                RecurringIncome, 'FREQUENCY_CHOICES') else [
                ('monthly', 'Monthly'), ('yearly', 'Yearly')], field="frequency", )
        start_date = validation.parse_date(data.get("start_date"), field="start_date")
        end_date = validation.parse_date(data["end_date"],
                                         field="end_date") if data.get("end_date") else None
        day_of_month = data.get("day_of_month")
        if day_of_month is not None:
            day_of_month = validation.in_range(day_of_month, 1, 31, field="day_of_month")
        next_occurrence = validation.parse_date(
            data.get(
                "next_occurrence",
                start_date),
            field="next_occurrence")
        is_active = bool(data.get("is_active", True))

        recurring = RecurringIncome.objects.create(
            user=user,
            name=name,
            source=source,
            amount=amount,
            frequency=frequency,
            start_date=start_date,
            end_date=end_date,
            day_of_month=day_of_month,
            next_occurrence=next_occurrence,
            is_active=is_active,
        )
        logger.info("recurring_income.create user_id=%s id=%s", user.id, recurring.id)
        return recurring

    def update_recurring_income(self, user, recurring_id, data, *, partial=True):
        recurring = RecurringIncome.objects.filter(id=recurring_id, user=user).first()
        if recurring is None:
            raise NotFoundError("Recurring income not found")
        if "name" in data:
            recurring.name = validation.bounded_text(data["name"], max_length=255, field="name")
        if "source" in data:
            recurring.source = validation.bounded_text(
                data["source"], max_length=20, field="source")
        if "amount" in data:
            amount = validation.bounded_decimal(data["amount"], field="amount")
            if amount < 0:
                raise ValidationError("amount must be non-negative")
            recurring.amount = amount
        if "frequency" in data:
            recurring.frequency = validation.choice(
                data["frequency"], RecurringIncome.FREQUENCY_CHOICES if hasattr(
                    RecurringIncome, 'FREQUENCY_CHOICES') else [
                    ('monthly', 'Monthly'), ('yearly', 'Yearly')], field="frequency", )
        if "start_date" in data:
            recurring.start_date = validation.parse_date(data["start_date"], field="start_date")
        if "end_date" in data:
            recurring.end_date = validation.parse_date(
                data["end_date"], field="end_date") if data["end_date"] else None
        if "day_of_month" in data:
            recurring.day_of_month = validation.in_range(
                data["day_of_month"], 1, 31, field="day_of_month") if data["day_of_month"] else None
        if "next_occurrence" in data:
            recurring.next_occurrence = validation.parse_date(
                data["next_occurrence"], field="next_occurrence")
        if "is_active" in data:
            recurring.is_active = bool(data["is_active"])
        recurring.save()
        logger.info("recurring_income.update user_id=%s id=%s", user.id, recurring.id)
        return recurring


income_service = IncomeService()
