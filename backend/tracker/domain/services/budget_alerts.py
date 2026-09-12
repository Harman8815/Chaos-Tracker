"""Finance (budget alerts) domain service.

Owns BudgetAlert CRUD plus alert generation logic. All queries are scoped to the requesting user.
"""
from datetime import date
from decimal import Decimal

from django.db.models import Sum

from ...models import BudgetAlert, Budget, Expense
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.budget_alerts")


class BudgetAlertService:
    def list(self, user, *, is_read=None, is_dismissed=None):
        qs = BudgetAlert.objects.filter(user=user)
        if is_read is not None:
            qs = qs.filter(is_read=is_read)
        if is_dismissed is not None:
            qs = qs.filter(is_dismissed=is_dismissed)
        return list(qs)

    def get_by_id(self, user, alert_id):
        alert = BudgetAlert.objects.filter(id=alert_id, user=user).first()
        if alert is None:
            raise NotFoundError("Budget alert not found")
        return alert

    def mark_read(self, user, alert_id):
        alert = BudgetAlert.objects.filter(id=alert_id, user=user).first()
        if alert is None:
            raise NotFoundError("Budget alert not found")
        alert.is_read = True
        alert.save()
        logger.info("budget_alerts.mark_read user_id=%s id=%s", user.id, alert.id)
        return alert

    def mark_dismissed(self, user, alert_id):
        alert = BudgetAlert.objects.filter(id=alert_id, user=user).first()
        if alert is None:
            raise NotFoundError("Budget alert not found")
        alert.is_dismissed = True
        alert.save()
        logger.info("budget_alerts.mark_dismissed user_id=%s id=%s", user.id, alert.id)
        return alert

    def mark_all_read(self, user):
        """Mark all unread alerts as read."""
        count = BudgetAlert.objects.filter(user=user, is_read=False).update(is_read=True)
        logger.info("budget_alerts.mark_all_read user_id=%s count=%s", user.id, count)
        return count

    def check_and_create_alerts(self, user, *, year, month):
        """Check budgets against actual spending and create alerts if thresholds are reached."""
        from .budgets import budget_service
        from .finance import expense_service
        
        actual_vs_budget = budget_service.actual_vs_budget(user, year=year, month=month)
        alerts_created = []
        
        for budget_data in actual_vs_budget.get('budgets', []):
            budget = Budget.objects.filter(
                user=user,
                category=budget_data['category'],
                year=year,
                month=month
            ).first()
            if not budget:
                continue
            
            spent_pct = budget_data['spent_percent']
            actual = budget_data['actual_amount']
            budget_amount = budget_data['budget_amount']
            
            # Check for exceeded budget
            if budget_data['is_over_budget']:
                existing = BudgetAlert.objects.filter(
                    user=user,
                    budget=budget,
                    alert_type='exceeded'
                ).first()
                if not existing:
                    alert = BudgetAlert.objects.create(
                        user=user,
                        budget=budget,
                        alert_type='exceeded',
                        threshold_percent=100,
                        message=f"Budget for {budget.category} exceeded! Spent ${actual:.2f} of ${budget_amount:.2f} ({spent_pct:.1f}%)"
                    )
                    alerts_created.append(alert)
                    logger.info("budget_alerts.created user_id=%s budget_id=%s type=exceeded", user.id, budget.id)
            
            # Check for threshold alerts (80%, 90%, etc.)
            for threshold in [80, 90]:
                if spent_pct >= threshold and spent_pct < 100:
                    existing = BudgetAlert.objects.filter(
                        user=user,
                        budget=budget,
                        alert_type='threshold',
                        threshold_percent=threshold
                    ).first()
                    if not existing:
                        alert = BudgetAlert.objects.create(
                            user=user,
                            budget=budget,
                            alert_type='threshold',
                            threshold_percent=threshold,
                            message=f"Budget for {budget.category} reached {threshold}% threshold! Spent ${actual:.2f} of ${budget_amount:.2f} ({spent_pct:.1f}%)"
                        )
                        alerts_created.append(alert)
                        logger.info("budget_alerts.created user_id=%s budget_id=%s type=threshold pct=%s", user.id, budget.id, threshold)
        
        return alerts_created

    def get_unread_count(self, user):
        """Get count of unread, non-dismissed alerts."""
        return BudgetAlert.objects.filter(user=user, is_read=False, is_dismissed=False).count()


budget_alert_service = BudgetAlertService()