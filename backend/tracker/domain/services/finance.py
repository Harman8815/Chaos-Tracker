"""Finance (expenses) domain service.

Owns expense CRUD plus the analytics/summary queries. All queries are
scoped to the requesting user.
"""

from datetime import date

from ...models import Expense
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.finance")


def _normalize_period(year, month):
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
    return y, m


def _apply_period_filters(qs, *, year, month):
    y, m = _normalize_period(year, month)
    if m is None:
        return qs.filter(date__year=y)
    return qs.filter(date__year=y, date__month=m)


def _apply_filters(
    qs,
    *,
    year=None,
    month=None,
    category=None,
    start_date=None,
    end_date=None,
):
    if year is not None or month is not None:
        qs = _apply_period_filters(qs, year=year, month=month)
    if category:
        qs = qs.filter(category__iexact=category)
    parsed_start_date = None
    parsed_end_date = None
    if start_date:
        parsed_start_date = validation.parse_date(start_date, field="start_date")
        qs = qs.filter(date__gte=parsed_start_date)
    if end_date:
        parsed_end_date = validation.parse_date(end_date, field="end_date")
        qs = qs.filter(date__lte=parsed_end_date)
    if parsed_start_date and parsed_end_date and parsed_start_date > parsed_end_date:
        raise ValidationError("start_date must be on or before end_date")
    return qs


class ExpenseService:
    def list(self, user, *, year=None, month=None, category=None, start_date=None, end_date=None):
        qs = Expense.objects.filter(user=user)
        qs = _apply_filters(
            qs,
            year=year,
            month=month,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        return list(qs)

    def list_with_summary(
        self, user, *, year=None, month=None, category=None, start_date=None, end_date=None
    ):
        expenses = self.list(
            user,
            year=year,
            month=month,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        total_amount = sum(float(expense.total) for expense in expenses)
        category_breakdown = {}
        for expense in expenses:
            category_breakdown[expense.category] = category_breakdown.get(
                expense.category, 0.0
            ) + float(expense.total)
        return {
            "count": len(expenses),
            "total_amount": round(total_amount, 2),
            "category_breakdown": category_breakdown,
            "expenses": expenses,
        }

    def get_by_id(self, user, expense_id):
        expense = Expense.objects.filter(id=expense_id, user=user).first()
        if expense is None:
            raise NotFoundError("Expense not found")
        return expense

    def create(self, user, data):
        item = validation.bounded_text(data.get("item"), max_length=255, field="item")
        category = validation.bounded_text(data.get("category"), max_length=100, field="category")
        quantity = validation.positive_int(data.get("quantity", 1), field="quantity", minimum=1)
        price = validation.bounded_decimal(data.get("price"), field="price")
        if price < 0:
            raise ValidationError("price must be non-negative")
        expense_date = validation.parse_date(data.get("date"), field="date")
        expense = Expense.objects.create(
            user=user,
            date=expense_date,
            item=item,
            category=category,
            quantity=quantity,
            price=price,
        )
        logger.info("expenses.create user_id=%s id=%s", user.id, expense.id)
        return expense

    def update(self, user, expense_id, data, *, partial=True):
        expense = Expense.objects.filter(id=expense_id, user=user).first()
        if expense is None:
            raise NotFoundError("Expense not found")
        if "item" in data:
            expense.item = validation.bounded_text(data["item"], max_length=255, field="item")
        if "category" in data:
            expense.category = validation.bounded_text(
                data["category"], max_length=100, field="category"
            )
        if "quantity" in data:
            expense.quantity = validation.positive_int(
                data["quantity"], field="quantity", minimum=1
            )
        if "price" in data:
            price = validation.bounded_decimal(data["price"], field="price")
            if price < 0:
                raise ValidationError("price must be non-negative")
            expense.price = price
        if "date" in data:
            expense.date = validation.parse_date(data["date"], field="date")
        expense.save()
        logger.info("expenses.update user_id=%s id=%s", user.id, expense.id)
        return expense

    def delete(self, user, expense_id):
        expense = Expense.objects.filter(id=expense_id, user=user).first()
        if expense is None:
            raise NotFoundError("Expense not found")
        expense.delete()
        logger.info("expenses.delete user_id=%s id=%s", user.id, expense_id)
        return True

    # --- analytics ---

    def summary(
        self, user, *, year=None, month=None, category=None, start_date=None, end_date=None
    ):
        qs = _apply_filters(
            Expense.objects.filter(user=user),
            year=year,
            month=month,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        expenses = list(qs)
        total_count = len(expenses)
        total_amount = sum(float(e.total) for e in expenses)
        avg = (total_amount / total_count) if total_count else 0.0
        categories = sorted({e.category for e in expenses})
        return {
            "total_expenses": total_count,
            "total_amount": round(total_amount, 2),
            "average_per_expense": round(avg, 2),
            "categories_count": len(categories),
            "unique_categories": categories,
        }

    def categories(
        self, user, *, year=None, month=None, category=None, start_date=None, end_date=None
    ):
        qs = _apply_filters(
            Expense.objects.filter(user=user),
            year=year,
            month=month,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        totals = {}
        for e in qs:
            entry = totals.setdefault(e.category, {"name": e.category, "count": 0, "total": 0.0})
            entry["count"] += 1
            entry["total"] += float(e.total)
        return sorted(totals.values(), key=lambda x: x["total"], reverse=True)

    def analytics(
        self, user, *, year=None, month=None, category=None, start_date=None, end_date=None
    ):
        y, m = _normalize_period(year, month)
        if m is None:
            m = date.today().month

        qs = _apply_filters(
            Expense.objects.filter(user=user),
            year=y,
            month=m - 1,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        daily_totals = {}
        category_totals = {}
        for e in qs:
            daily_totals[e.date.day] = daily_totals.get(e.date.day, 0.0) + float(e.total)
            category_totals[e.category] = category_totals.get(e.category, 0.0) + float(e.total)

        import calendar

        days_in_month = calendar.monthrange(y, m)[1]
        total_month = sum(daily_totals.values())
        return {
            "year": y,
            "month": m - 1,
            "days_in_month": days_in_month,
            "total_amount": round(total_month, 2),
            "daily_breakdown": [
                {"day": day, "total": round(total, 2)}
                for day, total in sorted(daily_totals.items())
            ],
            "category_breakdown": [
                {"name": cat, "value": round(total, 2)}
                for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
            ],
            "average_per_day": round(total_month / days_in_month, 2) if days_in_month else 0.0,
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
        for e in Expense.objects.filter(user=user, date__year=y):
            monthly_data[e.date.month]["count"] += 1
            monthly_data[e.date.month]["total"] += float(e.total)
        monthly_list = list(monthly_data.values())
        year_total = sum(m["total"] for m in monthly_list)
        return {
            "year": y,
            "total_amount": round(year_total, 2),
            "monthly_stats": monthly_list,
        }

    def top_items(
        self,
        user,
        *,
        limit=10,
        year=None,
        month=None,
        category=None,
        start_date=None,
        end_date=None,
    ):
        try:
            limit = int(limit)
        except (TypeError, ValueError):
            limit = 10
        if limit < 0:
            limit = 0
        qs = _apply_filters(
            Expense.objects.filter(user=user),
            year=year,
            month=month,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
        items = [
            {
                "id": e.id,
                "date": e.date.isoformat(),
                "item": e.item,
                "category": e.category,
                "quantity": e.quantity,
                "price": float(e.price),
                "total": float(e.total),
            }
            for e in qs
        ]
        items.sort(key=lambda x: x["total"], reverse=True)
        return items[:limit]


expense_service = ExpenseService()
