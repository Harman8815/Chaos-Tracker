"""UserEvent domain service.

Provides a single place to record important application events and to
query them. All other domain services will call into this service when
they perform measurable actions so that achievements, daily aggregates
and analytics can be derived from one chronological source of truth.
"""
from datetime import date, datetime

from django.db import models
from django.utils import timezone

from ...models import UserEvent
from .. import validation
from ..exceptions import NotFoundError
from ..logging import get_logger

logger = get_logger("tracker.domain.events")


class EventService:
    def list(self, user, *, event_type=None, subject_type=None, limit=None, offset=None):
        qs = UserEvent.objects.filter(user=user)
        if event_type:
            qs = qs.filter(event_type=event_type)
        if subject_type:
            qs = qs.filter(subject_type=subject_type)
        if offset:
            qs = qs[offset:]
        if limit:
            qs = qs[:limit]
        return list(qs)

    def get_by_id(self, user, event_id):
        instance = UserEvent.objects.filter(id=event_id, user=user).first()
        if instance is None:
            raise NotFoundError("Event not found")
        return instance

    def record(
            self,
            user,
            event_type,
            *,
            subject_type="",
            subject_id="",
            payload=None,
            occurred_at=None):
        event_type = validation.choice(event_type, UserEvent.EVENT_TYPE_KEYS, field="event_type")
        subject_type = validation.bounded_text(
            subject_type, max_length=100, field="subject_type", allow_blank=True,
        )
        subject_id = validation.bounded_text(
            subject_id, max_length=100, field="subject_id", allow_blank=True,
        )
        payload = validation.bounded_dict(payload or {}, max_length=50, field="payload")
        if occurred_at is None:
            occurred_at = timezone.now()
        elif isinstance(occurred_at, date) and not isinstance(occurred_at, datetime):
            occurred_at = datetime.combine(occurred_at, datetime.min.time())

        instance = UserEvent.objects.create(
            user=user,
            event_type=event_type,
            subject_type=subject_type,
            subject_id=subject_id,
            occurred_at=occurred_at,
            payload=payload,
        )
        logger.info("events.record user_id=%s type=%s subject=%s/%s",
                    user.id, event_type, subject_type, subject_id)
        return instance

    def count_by_type(self, user, *, start_date=None, end_date=None):
        qs = UserEvent.objects.filter(user=user)
        if start_date:
            qs = qs.filter(occurred_at__date__gte=start_date)
        if end_date:
            qs = qs.filter(occurred_at__date__lte=end_date)
        rows = (
            qs.values("event_type")
            .order_by()
            .annotate(count=models.Count("id"))
        )
        return {row["event_type"]: row["count"] for row in rows}

    def delete_before(self, user, cutoff_date):
        qs = UserEvent.objects.filter(user=user, occurred_at__date__lt=cutoff_date)
        count, _ = qs.delete()
        logger.info("events.compact user_id=%s deleted=%s", user.id, count)
        return count


event_service = EventService()
