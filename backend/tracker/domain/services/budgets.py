"""Finance (budgets) domain service.

Owns Budget CRUD plus budget-vs-actual analytics. Budgets are scoped
to ``(user, category, year, month)`` and compared against Expense
records for the same period.
"""
from datetime import date

from django.db.models import Sum

from ...models import Budget, Expense
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.budgets")


def _normalize_month(month):
    try:
        m = int(month)
    except (TypeError, ValueError):
        raise ValidationError("Month must be an integer")
    if m < 1 or m > 12:
        raise ValidationError("Month must be between 1 and 12")
    return m


def _normalize_year(year):
    try:
        y = int(year)
    except (TypeError, ValueError):
        raise ValidationError("Year must be an integer")
    if y < 1 or y > 9999:
        raise ValidationError("Year must be between 1 and 9999")
    return y


class BudgetService:
    def list(self, user, *, year=None, month=None, category=None):
        qs = Budget.objects.filter(user=user)
        if year is not None:
            qs = qs.filter(year=_normalize_year(year))
        if month is not None:
            qs = qs.filter(month=_normalize_month(month))
        if category:
            qs = qs.filter(category__iexact=category)
        return list(qs)

    def get_by_id(self, user, budget_id):
        budget = Budget.objects.filter(id=budget_id, user=user).first()
        if budget is None:
            raise NotFoundError("Budget not found")
        return budget

    def create(self, user, data):
        category = validation.bounded_text(data.get("category"), max_length=100, field="category")
        year = _normalize_year(data.get("year"))
        month = _normalize_month(data.get("month"))
        amount = validation.bounded_decimal(data.get("amount"), field="amount")
        if amount < 0:
            raise ValidationError("amount must be non-negative")
        budget = Budget.objects.create(
            user=user, category=category, year=year, month=month, amount=amount,
        )
        logger.info("budgets.create user_id=%s id=%s", user.id, budget.id)
        return budget

    def update(self, user, budget_id, data, *, partial=True):
        budget = Budget.objects.filter(id=budget_id, user=user).first()
        if budget is None:
            raise NotFoundError("Budget not found")
        if "category" in data:
            budget.category = validation.bounded_text(data["category"], max_length=100, field="category")
        if "year" in data:
            budget.year = _normalize_year(data["year"])
        if "month" in data:
            budget.month = _normalize_month(data["month"])
        if "amount" in data:
            amount = validation.bounded_decimal(data["amount"], field="amount")
            if amount < 0:
                raise ValidationError("amount must be non-negative")
            budget.amount = amount
        budget.save()
        logger.info("budgets.update user_id=%s id=%s", user.id, budget.id)
        return budget

    def delete(self, user, budget_id):
        budget = Budget.objects.filter(id=budget_id, user=user).first()
        if budget is None:
            raise NotFoundError("Budget not found")
        budget.delete()
        logger.info("budgets.delete user_id=%s id=%s", user.id, budget_id)
        return True

    def actual_vs_budget(self, user, *, year, month, category=None):
        """Compare actual spending against budgets for a period."""
        y = _normalize_year(year)
        m = _normalize_month(month)
        budgets = self.list(user, year=y, month=m, category=category)
        actual_map = {}
        for e in Expense.objects.filter(user=user, date__year=y, date__month=m):
            actual_map[e.category] = actual_map.get(e.category, 0.0) + float(e.total)
        result = []
        for budget in budgets:
            actual = round(actual_map.get(budget.category, 0.0), 2)
            spent_pct = round((actual / float(budget.amount)) * 100, 2) if float(budget.amount) > 0 else 0.0
            result.append({
                "id": budget.id,
                "category": budget.category,
                "budget_amount": float(budget.amount),
                "actual_amount": actual,
                "remaining": round(float(budget.amount) - actual, 2),
                "spent_percent": spent_pct,
                "is_over_budget": actual > float(budget.amount),
            })
        return {
            "year": y,
            "month": m,
            "budgets": result,
            "total_budget": round(sum(b["budget_amount"] for b in result), 2),
            "total_actual": round(sum(b["actual_amount"] for b in result), 2),
        }


budget_service = BudgetService()