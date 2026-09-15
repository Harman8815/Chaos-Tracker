"""Thin v1 controller for notifications and scheduled jobs."""
from rest_framework import status
from rest_framework import serializers

from ._base import TrackerAPIView
from ...domain.services import (
    notification_service,
    scheduled_job_service,
    goal_deadline_alert_service,
    habit_reminder_service,
    budget_alert_service,
    streak_alert_service,
    summary_notification_service,
    recurring_expense_job_service,
    recurring_income_job_service,
    subscription_billing_job_service,
)
from ...serializers import (
    NotificationSerializer,
    NotificationPreferenceSerializer,
    ScheduledJobSerializer,
    RecurringIncomeSerializer,
)


class NotificationQuerySerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=False)
    notification_type = serializers.CharField(required=False, max_length=30, allow_blank=True)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=50)
    offset = serializers.IntegerField(required=False, min_value=0, default=0)


class NotificationListView(TrackerAPIView):
    """GET /api/v1/notifications/ - List notifications with filters"""

    def get(self, request):
        query = self.validated_query(NotificationQuerySerializer)
        notifications = notification_service.list_notifications(
            request.user,
            is_read=query.get("is_read"),
            notification_type=query.get("notification_type"),
            limit=query.get("limit", 50),
            offset=query.get("offset", 0),
        )
        serializer = NotificationSerializer(notifications, many=True)
        return self.ok(data=serializer.data, count=len(notifications))


class NotificationUnreadCountView(TrackerAPIView):
    """GET /api/v1/notifications/unread-count/ - Get unread notification count"""

    def get(self, request):
        count = notification_service.get_unread_count(request.user)
        return self.ok(data={"count": count})


class NotificationMarkReadView(TrackerAPIView):
    """POST /api/v1/notifications/<id>/read/ - Mark notification as read"""

    def post(self, request, id):
        notification = notification_service.mark_read(request.user, int(id))
        serializer = NotificationSerializer(notification)
        return self.ok(data=serializer.data, message="Notification marked as read")


class NotificationMarkAllReadView(TrackerAPIView):
    """POST /api/v1/notifications/mark-all-read/ - Mark all notifications as read"""

    def post(self, request):
        count = notification_service.mark_all_read(request.user)
        return self.ok(data={"marked_count": count},
                       message=f"Marked {count} notifications as read")


class NotificationDeleteView(TrackerAPIView):
    """DELETE /api/v1/notifications/<id>/ - Delete notification"""

    def delete(self, request, id):
        notification_service.delete(request.user, int(id))
        return self.ok(message="Notification deleted", status_code=status.HTTP_204_NO_CONTENT)


class NotificationDeleteAllReadView(TrackerAPIView):
    """DELETE /api/v1/notifications/delete-read/ - Delete all read notifications"""

    def delete(self, request):
        count = notification_service.delete_all_read(request.user)
        return self.ok(data={"deleted_count": count}, message=f"Deleted {count} read notifications")


class NotificationPreferenceView(TrackerAPIView):
    """GET/PUT /api/v1/notifications/preferences/ - Get/update notification preferences"""

    def get(self, request):
        prefs = notification_service.get_preferences(request.user)
        serializer = NotificationPreferenceSerializer(prefs)
        return self.ok(data=serializer.data)

    def put(self, request):
        prefs = notification_service.update_preferences(request.user, request.data)
        serializer = NotificationPreferenceSerializer(prefs)
        return self.ok(data=serializer.data, message="Preferences updated")


class ScheduledJobQuerySerializer(serializers.Serializer):
    status = serializers.CharField(required=False, max_length=20, allow_blank=True)
    job_type = serializers.CharField(required=False, max_length=50, allow_blank=True)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=50)
    offset = serializers.IntegerField(required=False, min_value=0, default=0)


class ScheduledJobListView(TrackerAPIView):
    """GET /api/v1/jobs/ - List scheduled jobs"""

    def get(self, request):
        query = self.validated_query(ScheduledJobQuerySerializer)
        # Filter by user for non-staff
        from ...models import ScheduledJob
        qs = ScheduledJob.objects.filter(user=request.user)
        if query.get("status"):
            qs = qs.filter(status=query["status"])
        if query.get("job_type"):
            qs = qs.filter(job_type=query["job_type"])
        qs = qs.order_by('-scheduled_at')

        offset = query.get("offset", 0)
        limit = query.get("limit", 50)
        jobs = list(qs[offset:offset + limit])

        serializer = ScheduledJobSerializer(jobs, many=True)
        return self.ok(data=serializer.data, count=len(jobs))


class ScheduledJobDetailView(TrackerAPIView):
    """GET /api/v1/jobs/<id>/ - Get job details"""

    def get(self, request, id):
        job = scheduled_job_service.get_job(int(id))
        if job.user != request.user:
            return self.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)
        serializer = ScheduledJobSerializer(job)
        return self.ok(data=serializer.data)


class ScheduledJobRetryView(TrackerAPIView):
    """POST /api/v1/jobs/<id>/retry/ - Retry failed job"""

    def post(self, request, id):
        job = scheduled_job_service.get_job(int(id))
        if job.user != request.user:
            return self.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)
        scheduled_job_service.retry_job(job)
        serializer = ScheduledJobSerializer(job)
        return self.ok(data=serializer.data, message="Job scheduled for retry")


class ScheduledJobCancelView(TrackerAPIView):
    """POST /api/v1/jobs/<id>/cancel/ - Cancel pending job"""

    def post(self, request, id):
        job = scheduled_job_service.get_job(int(id))
        if job.user != request.user:
            return self.error("Permission denied", status_code=status.HTTP_403_FORBIDDEN)
        scheduled_job_service.cancel_job(job)
        serializer = ScheduledJobSerializer(job)
        return self.ok(data=serializer.data, message="Job cancelled")


class RunJobNowView(TrackerAPIView):
    """POST /api/v1/jobs/run-now/ - Manually trigger a job type"""

    class JobRunSerializer(serializers.Serializer):
        job_type = serializers.CharField(max_length=50)

    def post(self, request):
        serializer = self.JobRunSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job_type = serializer.validated_data["job_type"]

        # Map job types to services
        job_map = {
            "goal_deadline_check": goal_deadline_alert_service,
            "habit_reminder": habit_reminder_service,
            "budget_alert_check": budget_alert_service,
            "streak_alert_check": streak_alert_service,
            "weekly_summary": summary_notification_service,
            "monthly_summary": summary_notification_service,
            "recurring_expense_process": recurring_expense_job_service,
            "recurring_income_process": recurring_income_job_service,
            "subscription_billing": subscription_billing_job_service,
        }

        service = job_map.get(job_type)
        if not service:
            return self.error(
                f"Unknown job type: {job_type}",
                status_code=status.HTTP_400_BAD_REQUEST)

        if job_type == "weekly_summary":
            service.send_weekly_summary(request.user)
        elif job_type == "monthly_summary":
            service.send_monthly_summary(request.user)
        else:
            service.check_user(request.user)

        return self.ok(message=f"Job {job_type} executed")


class RecurringIncomeListCreateView(TrackerAPIView):
    serializer_class = RecurringIncomeSerializer

    def list(self, request, *args, **kwargs):
        from ...models import RecurringIncome
        is_active = request.query_params.get("is_active")
        if is_active is not None:
            is_active = is_active.lower() == "true"
        incomes = RecurringIncome.objects.filter(user=request.user)
        if is_active is not None:
            incomes = incomes.filter(is_active=is_active)
        serializer = self.serializer_class(incomes, many=True)
        return self.ok(data=serializer.data, count=len(incomes))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        from ...domain.services import income_service
        instance = income_service.create_recurring_income(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class RecurringIncomeDetailView(TrackerAPIView):
    serializer_class = RecurringIncomeSerializer

    def retrieve(self, request, *args, **kwargs):
        from ...models import RecurringIncome
        instance = RecurringIncome.objects.filter(id=kwargs["id"], user=request.user).first()
        if not instance:
            return self.error("Recurring income not found", status_code=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        from ...models import RecurringIncome
        instance = RecurringIncome.objects.filter(id=kwargs["id"], user=request.user).first()
        if not instance:
            return self.error("Recurring income not found", status_code=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        from ...domain.services import income_service
        instance = income_service.update_recurring_income(
            request.user, kwargs["id"], serializer.validated_data, partial=True)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, message="Recurring income updated")

    def destroy(self, request, *args, **kwargs):
        from ...models import RecurringIncome
        instance = RecurringIncome.objects.filter(id=kwargs["id"], user=request.user).first()
        if not instance:
            return self.error("Recurring income not found", status_code=status.HTTP_404_NOT_FOUND)
        instance.delete()
        return self.ok(message="Recurring income deleted", status_code=status.HTTP_204_NO_CONTENT)
