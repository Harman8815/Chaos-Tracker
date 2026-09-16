"""Finance (subscriptions) domain service.

Owns Subscription CRUD plus analytics. All queries are scoped to the requesting user.
"""

from datetime import date, timedelta

from ...models import Subscription
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.subscriptions")


class SubscriptionService:
    def list(self, user, *, status=None):
        qs = Subscription.objects.filter(user=user)
        if status:
            qs = qs.filter(status=status)
        return list(qs)

    def get_by_id(self, user, subscription_id):
        subscription = Subscription.objects.filter(id=subscription_id, user=user).first()
        if subscription is None:
            raise NotFoundError("Subscription not found")
        return subscription

    def create(self, user, data):
        name = validation.bounded_text(data.get("name"), max_length=255, field="name")
        category = validation.bounded_text(data.get("category"), max_length=100, field="category")
        amount = validation.bounded_decimal(data.get("amount"), field="amount")
        if amount < 0:
            raise ValidationError("amount must be non-negative")
        billing_cycle = validation.bounded_text(
            data.get("billing_cycle"), max_length=20, field="billing_cycle"
        )
        if billing_cycle not in dict(Subscription.BILLING_CYCLES):
            raise ValidationError(
                f"Invalid billing_cycle. Must be one of: {[k for k, _ in Subscription.BILLING_CYCLES]}"  # noqa: E501
            )
        next_billing_date = validation.parse_date(
            data.get("next_billing_date"), field="next_billing_date"
        )
        start_date = validation.parse_date(data.get("start_date"), field="start_date")
        end_date = None
        if data.get("end_date"):
            end_date = validation.parse_date(data.get("end_date"), field="end_date")
        status = validation.bounded_text(
            data.get("status", "active"), max_length=20, field="status"
        )
        if status not in dict(Subscription.STATUS_CHOICES):
            raise ValidationError(
                f"Invalid status. Must be one of: {[k for k, _ in Subscription.STATUS_CHOICES]}"
            )
        description = data.get("description", "")
        subscription = Subscription.objects.create(
            user=user,
            name=name,
            category=category,
            amount=amount,
            billing_cycle=billing_cycle,
            next_billing_date=next_billing_date,
            start_date=start_date,
            end_date=end_date,
            status=status,
            description=description,
        )
        logger.info("subscriptions.create user_id=%s id=%s", user.id, subscription.id)
        return subscription

    def update(self, user, subscription_id, data, *, partial=True):
        subscription = Subscription.objects.filter(id=subscription_id, user=user).first()
        if subscription is None:
            raise NotFoundError("Subscription not found")
        if "name" in data:
            subscription.name = validation.bounded_text(data["name"], max_length=255, field="name")
        if "category" in data:
            subscription.category = validation.bounded_text(
                data["category"], max_length=100, field="category"
            )
        if "amount" in data:
            amount = validation.bounded_decimal(data["amount"], field="amount")
            if amount < 0:
                raise ValidationError("amount must be non-negative")
            subscription.amount = amount
        if "billing_cycle" in data:
            billing_cycle = validation.bounded_text(
                data["billing_cycle"], max_length=20, field="billing_cycle"
            )
            if billing_cycle not in dict(Subscription.BILLING_CYCLES):
                raise ValidationError(
                    f"Invalid billing_cycle. Must be one of: {[k for k, _ in Subscription.BILLING_CYCLES]}"  # noqa: E501
                )
            subscription.billing_cycle = billing_cycle
        if "next_billing_date" in data:
            subscription.next_billing_date = validation.parse_date(
                data["next_billing_date"], field="next_billing_date"
            )
        if "start_date" in data:
            subscription.start_date = validation.parse_date(data["start_date"], field="start_date")
        if "end_date" in data:
            subscription.end_date = (
                validation.parse_date(data["end_date"], field="end_date")
                if data["end_date"]
                else None
            )
        if "status" in data:
            status = validation.bounded_text(data["status"], max_length=20, field="status")
            if status not in dict(Subscription.STATUS_CHOICES):
                raise ValidationError(
                    f"Invalid status. Must be one of: {[k for k, _ in Subscription.STATUS_CHOICES]}"
                )
            subscription.status = status
        if "description" in data:
            subscription.description = data["description"]
        subscription.save()
        logger.info("subscriptions.update user_id=%s id=%s", user.id, subscription.id)
        return subscription

    def delete(self, user, subscription_id):
        subscription = Subscription.objects.filter(id=subscription_id, user=user).first()
        if subscription is None:
            raise NotFoundError("Subscription not found")
        subscription.delete()
        logger.info("subscriptions.delete user_id=%s id=%s", user.id, subscription_id)
        return True

    def get_active(self, user):
        """Get all active subscriptions."""
        return list(Subscription.objects.filter(user=user, status="active"))

    def get_upcoming(self, user, days=30):
        """Get subscriptions with upcoming billing dates."""
        today = date.today()
        end_date = today + timedelta(days=days)
        return list(
            Subscription.objects.filter(
                user=user,
                status="active",
                next_billing_date__gte=today,
                next_billing_date__lte=end_date,
            )
        )

    def monthly_cost(self, user):
        """Calculate total monthly subscription cost."""
        active = self.get_active(user)
        monthly_total = 0.0
        for sub in active:
            if sub.billing_cycle == "monthly":
                monthly_total += float(sub.amount)
            elif sub.billing_cycle == "quarterly":
                monthly_total += float(sub.amount) / 3
            elif sub.billing_cycle == "yearly":
                monthly_total += float(sub.amount) / 12
        return round(monthly_total, 2)

    def summary(self, user):
        """Get subscription summary."""
        active = self.get_active(user)
        cancelled = list(Subscription.objects.filter(user=user, status="cancelled"))
        paused = list(Subscription.objects.filter(user=user, status="paused"))
        monthly_cost = self.monthly_cost(user)
        category_breakdown = {}
        for sub in active:
            category_breakdown[sub.category] = category_breakdown.get(sub.category, 0.0) + float(
                sub.amount
            )
        return {
            "active_count": len(active),
            "cancelled_count": len(cancelled),
            "paused_count": len(paused),
            "monthly_cost": monthly_cost,
            "category_breakdown": category_breakdown,
        }


subscription_service = SubscriptionService()
