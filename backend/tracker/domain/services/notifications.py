"""Notifications domain service (P6-01, P6-02, P6-03, P6-14, P6-15).

Handles notification creation, preferences, deduplication, and delivery.
"""
from datetime import datetime, time, timedelta
from typing import Optional

from django.db import transaction
from django.utils import timezone

from ...models import Notification, NotificationPreference, NotificationDeduplication, User
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.notifications")


class NotificationService:
    """Service for managing in-app notifications."""

    def get_preferences(self, user) -> NotificationPreference:
        """Get or create notification preferences for user."""
        prefs, _ = NotificationPreference.objects.get_or_create(user=user)
        return prefs

    def update_preferences(self, user, data: dict) -> NotificationPreference:
        """Update notification preferences."""
        prefs = self.get_preferences(user)

        # Type toggles
        type_fields = [
            'goal_deadline_enabled', 'habit_reminder_enabled', 'budget_alert_enabled',
            'streak_alert_enabled', 'achievement_enabled', 'weekly_summary_enabled',
            'monthly_summary_enabled', 'recurring_transaction_enabled', 'system_enabled',
        ]
        for field in type_fields:
            if field in data:
                setattr(prefs, field, bool(data[field]))

        # Channel toggles
        channel_fields = ['in_app_enabled', 'email_enabled', 'push_enabled']
        for field in channel_fields:
            if field in data:
                setattr(prefs, field, bool(data[field]))

        # Quiet hours
        if 'quiet_hours_start' in data:
            prefs.quiet_hours_start = self._parse_time(data['quiet_hours_start']) if data['quiet_hours_start'] else None
        if 'quiet_hours_end' in data:
            prefs.quiet_hours_end = self._parse_time(data['quiet_hours_end']) if data['quiet_hours_end'] else None
        if 'timezone' in data:
            prefs.timezone = data['timezone'][:50]

        prefs.save()
        logger.info("notifications.preferences_updated user_id=%s", user.id)
        return prefs

    def _parse_time(self, value) -> Optional[time]:
        if isinstance(value, time):
            return value
        if isinstance(value, str):
            for fmt in ('%H:%M', '%H:%M:%S'):
                try:
                    return datetime.strptime(value, fmt).time()
                except ValueError:
                    continue
        return None

    def should_send(self, user, notification_type: str, priority: str = 'normal') -> bool:
        """Check if notification should be sent based on preferences and quiet hours."""
        prefs = self.get_preferences(user)

        if not prefs.is_type_enabled(notification_type):
            return False

        if not prefs.in_app_enabled:
            return False

        # Skip low priority during quiet hours
        if priority == 'low' and prefs.is_in_quiet_hours():
            return False

        return True

    def create_notification(
        self,
        user,
        notification_type: str,
        title: str,
        message: str,
        priority: str = 'normal',
        data: dict = None,
        dedupe_key: str = None,
        dedupe_window_hours: int = 24,
    ) -> Optional[Notification]:
        """Create a notification with deduplication (P6-14)."""
        if not self.should_send(user, notification_type, priority):
            return None

        # Check deduplication
        if dedupe_key:
            window_start = timezone.now() - timedelta(hours=dedupe_window_hours)
            exists = NotificationDeduplication.objects.filter(
                user=user,
                notification_type=notification_type,
                dedupe_key=dedupe_key,
                sent_at__gte=window_start,
            ).exists()
            if exists:
                logger.debug("notifications.deduplicated user_id=%s type=%s key=%s", user.id, notification_type, dedupe_key)
                return None

        with transaction.atomic():
            notification = Notification.objects.create(
                user=user,
                type=notification_type,
                priority=priority,
                title=title,
                message=message,
                data=data or {},
            )

            if dedupe_key:
                NotificationDeduplication.objects.create(
                    user=user,
                    notification_type=notification_type,
                    dedupe_key=dedupe_key,
                )

        logger.info("notifications.created user_id=%s type=%s priority=%s", user.id, notification_type, priority)
        return notification

    def list_notifications(
        self,
        user,
        *,
        is_read: bool = None,
        notification_type: str = None,
        limit: int = 50,
        offset: int = 0,
    ):
        qs = Notification.objects.filter(user=user)
        if is_read is not None:
            qs = qs.filter(is_read=is_read)
        if notification_type:
            qs = qs.filter(type=notification_type)
        return list(qs[offset:offset + limit])

    def get_unread_count(self, user) -> int:
        return Notification.objects.filter(user=user, is_read=False).count()

    def mark_read(self, user, notification_id: int) -> Notification:
        notification = Notification.objects.filter(id=notification_id, user=user).first()
        if not notification:
            raise NotFoundError("Notification not found")
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=['is_read', 'read_at', 'updated_at'])
        return notification

    def mark_all_read(self, user) -> int:
        count, _ = Notification.objects.filter(user=user, is_read=False).update(
            is_read=True, read_at=timezone.now()
        )
        return count

    def delete(self, user, notification_id: int) -> bool:
        notification = Notification.objects.filter(id=notification_id, user=user).first()
        if not notification:
            raise NotFoundError("Notification not found")
        notification.delete()
        return True

    def delete_all_read(self, user) -> int:
        count, _ = Notification.objects.filter(user=user, is_read=True).delete()
        return count


class ScheduledJobService:
    """Service for managing background scheduled jobs (P6-04, P6-12, P6-13)."""

    def create_job(
        self,
        job_type: str,
        scheduled_at: datetime,
        user=None,
        payload: dict = None,
        max_retries: int = 3,
    ) -> 'ScheduledJob':
        from ...models import ScheduledJob
        job = ScheduledJob.objects.create(
            user=user,
            job_type=job_type,
            scheduled_at=scheduled_at,
            payload=payload or {},
            max_retries=max_retries,
        )
        logger.info("jobs.created type=%s scheduled_at=%s user_id=%s", job_type, scheduled_at, user.id if user else None)
        return job

    def get_due_jobs(self, limit: int = 100):
        from ...models import ScheduledJob
        now = timezone.now()
        return list(ScheduledJob.objects.filter(
            status='pending',
            scheduled_at__lte=now,
        ).order_by('scheduled_at')[:limit])

    def get_job(self, job_id: int):
        from ...models import ScheduledJob
        job = ScheduledJob.objects.filter(id=job_id).first()
        if not job:
            raise NotFoundError("Job not found")
        return job

    def start_job(self, job) -> None:
        from ...models import ScheduledJob
        job.status = 'running'
        job.started_at = timezone.now()
        job.save(update_fields=['status', 'started_at', 'updated_at'])

    def complete_job(self, job, result: dict = None) -> None:
        job.status = 'completed'
        job.completed_at = timezone.now()
        if result:
            job.result = result
        job.save(update_fields=['status', 'completed_at', 'result', 'updated_at'])

    def fail_job(self, job, error_message: str) -> None:
        job.status = 'failed'
        job.error_message = error_message
        job.completed_at = timezone.now()
        job.save(update_fields=['status', 'error_message', 'completed_at', 'updated_at'])

        if job.can_retry():
            job.schedule_retry()
            logger.info("jobs.scheduled_retry job_id=%s attempt=%s", job.id, job.retry_count + 1)

    def retry_job(self, job) -> None:
        if not job.can_retry():
            raise ValidationError("Job cannot be retried")
        job.status = 'pending'
        job.started_at = None
        job.error_message = ''
        job.save(update_fields=['status', 'started_at', 'error_message', 'updated_at'])

    def cancel_job(self, job) -> None:
        job.status = 'cancelled'
        job.save(update_fields=['status', 'updated_at'])

    def cleanup_old_jobs(self, days: int = 30) -> int:
        from ...models import ScheduledJob
        cutoff = timezone.now() - timedelta(days=days)
        count, _ = ScheduledJob.objects.filter(
            completed_at__lt=cutoff,
            status__in=['completed', 'failed', 'cancelled'],
        ).delete()
        return count


# Import ScheduledJob model for type hints
from ...models import ScheduledJob  # noqa: E402

notification_service = NotificationService()
scheduled_job_service = ScheduledJobService()