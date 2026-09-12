"""Analytics domain service.

Computes :class:`DailyActivityAggregate` rows from the canonical domain
models. Aggregates are derived caches: the individual models remain the
source of truth, and this service recomputes them on demand.
"""
from datetime import date, datetime, timedelta

from django.db import transaction
from django.db.models import Count, Sum

from ...models import (
    DailyActivityAggregate,
    DailyHabitScore,
    Expense,
    Goal,
    Achievement,
    JournalEntry,
    Mood,
    PlannerTask,
    Water,
)
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.analytics")


class AnalyticsService:
    """Computes and stores daily activity aggregates."""

    def compute_day(self, user, target_date):
        """Recompute the aggregate for a single ``(user, date)``."""
        target_date = _coerce_date(target_date)
        data = self._gather(user, target_date)
        aggregate, _created = DailyActivityAggregate.objects.update_or_create(
            user=user, date=target_date, defaults=data,
        )
        return aggregate

    def compute_range(self, user, start_date, end_date):
        """Recompute aggregates for every day in ``[start_date, end_date]``."""
        start_date = _coerce_date(start_date)
        end_date = _coerce_date(end_date)
        if start_date > end_date:
            raise ValidationError("start_date must be on or before end_date")
        results = []
        current = start_date
        while current <= end_date:
            results.append(self.compute_day(user, current))
            current += timedelta(days=1)
        return results

    def get_day(self, user, target_date):
        """Return the aggregate for a date, computing it if missing."""
        target_date = _coerce_date(target_date)
        aggregate = DailyActivityAggregate.objects.filter(
            user=user, date=target_date,
        ).first()
        if aggregate is None:
            aggregate = self.compute_day(user, target_date)
        return aggregate

    def list_days(self, user, *, start_date=None, end_date=None, limit=None):
        qs = DailyActivityAggregate.objects.filter(user=user)
        if start_date:
            qs = qs.filter(date__gte=_coerce_date(start_date))
        if end_date:
            qs = qs.filter(date__lte=_coerce_date(end_date))
        qs = qs.order_by('-date')
        if limit:
            qs = qs[:limit]
        return list(qs)

    # --- internal helpers ---

    def _gather(self, user, target_date):
        habit_scores = DailyHabitScore.objects.filter(user=user, date=target_date)
        habits_completed = sum(1 for s in habit_scores if s.score > 0)
        habits_total = habit_scores.count()

        goals_completed = Goal.objects.filter(
            user=user, status='completed', completed_at__date=target_date,
        ).count()
        goals_created = Goal.objects.filter(
            user=user, created_at__date=target_date,
        ).count()

        task_qs = PlannerTask.objects.filter(block__user=user)
        tasks_completed = task_qs.filter(completed=True, updated_at__date=target_date).count()
        tasks_created = task_qs.filter(created_at__date=target_date).count()

        journal = JournalEntry.objects.filter(user=user, date=target_date).first()
        has_journal = journal is not None

        mood = Mood.objects.filter(user=user, date=target_date).first()
        mood_value = mood.mood if mood is not None else ''

        water = Water.objects.filter(user=user, date=target_date).first()
        water_glasses = water.glasses if water is not None else 0
        water_target = water.target if water is not None else 0

        expense_qs = Expense.objects.filter(user=user, date=target_date)
        expense_count = expense_qs.count()
        expense_total = sum((e.total for e in expense_qs), 0)

        achievements = Achievement.objects.filter(user=user, date=target_date).count()

        return {
            'habits_completed': habits_completed,
            'habits_total': habits_total,
            'goals_completed': goals_completed,
            'goals_created': goals_created,
            'planner_tasks_completed': tasks_completed,
            'planner_tasks_created': tasks_created,
            'has_journal': has_journal,
            'mood': mood_value,
            'water_glasses': water_glasses,
            'water_target': water_target,
            'expense_count': expense_count,
            'expense_total': expense_total,
            'points': 0,
            'achievements_earned': achievements,
        }


def _coerce_date(value):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        from .. import validation
        return validation.parse_date(value, field="date")
    raise ValidationError("date must be a date or YYYY-MM-DD string")


analytics_service = AnalyticsService()