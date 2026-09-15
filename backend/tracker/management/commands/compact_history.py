"""Management command to compact historical UserEvent rows.

Deletes raw event rows older than the configured retention window
(default 24 months) after ensuring DailyActivityAggregate rows are
current for the affected period.
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from tracker.domain.services import analytics_service, event_service
from tracker.models import User


class Command(BaseCommand):
    help = "Compact historical UserEvent rows older than the retention window."

    def add_arguments(self, parser):
        parser.add_argument(
            "--months",
            type=int,
            default=24,
            help="Retention window in months (default 24).",
        )
        parser.add_argument(
            "--user",
            type=str,
            default=None,
            help="Optional username to compact only that user.",
        )

    def handle(self, *args, **options):
        months = options["months"]
        username = options.get("user")
        cutoff = timezone.now().date() - timedelta(days=30 * months)

        queryset = User.objects.all()
        if username:
            queryset = queryset.filter(username=username)

        total_deleted = 0
        for user in queryset:
            # Ensure aggregates are current up to cutoff before pruning.
            analytics_service.compute_day(user, cutoff)
            deleted = event_service.delete_before(user, cutoff)
            total_deleted += deleted
            self.stdout.write(
                f"compacted user={user.username} deleted={deleted} cutoff={cutoff.isoformat()}"
            )

        self.stdout.write(f"total_deleted={total_deleted}")
