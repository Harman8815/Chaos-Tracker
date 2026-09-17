"""Central points/scoring engine (P3-13).

Derives a user's daily, weekly and monthly point totals from
:class:`DailyActivityAggregate` rows. Scoring rules are explicit and
centralized so scores cannot be manipulated unexpectedly by individual
domain services.
"""

from datetime import date


from ...models import DailyActivityAggregate
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.points")


# Explicit scoring weights per domain activity.
SCORING_RULES = {
    "habit_completed": 10,
    "goal_completed": 25,
    "planner_task_completed": 5,
    "journal_written": 3,
    "mood_logged": 2,
    "water_glass": 1,
    "achievement_earned": 50,
}


class PointsEngine:
    """Stateless engine that computes points from daily aggregates."""

    def score_day(self, user, target_date):
        """Return the point total for a single day."""
        target_date = _coerce_date(target_date)
        aggregate = DailyActivityAggregate.objects.filter(
            user=user,
            date=target_date,
        ).first()
        if aggregate is None:
            return 0
        return self._score_aggregate(aggregate)

    def score_range(self, user, start_date, end_date):
        """Return daily point totals across a range."""
        start = _coerce_date(start_date)
        end = _coerce_date(end_date)
        if start > end:
            raise ValidationError("start_date must be on or before end_date")
        rows = DailyActivityAggregate.objects.filter(
            user=user,
            date__range=[start, end],
        ).order_by("date")
        return [
            {
                "date": r.date.isoformat(),
                "points": self._score_aggregate(r),
            }
            for r in rows
        ]

    def score_summary(self, user, *, year=None, month=None):
        """Return daily/weekly/monthly summaries for a period."""
        today = date.today()
        y = int(year) if year is not None else today.year
        m = int(month) + 1 if month is not None else None
        if m is None:
            start, end = date(y, 1, 1), date(y, 12, 31)
        else:
            if m < 1 or m > 12:
                raise ValidationError("Month must be between 0 and 11")
            start = date(y, m, 1)
            end = date(y, m, _days_in_month(y, m))
        rows = DailyActivityAggregate.objects.filter(
            user=user,
            date__range=[start, end],
        )
        daily = [
            {"date": r.date.isoformat(), "points": self._score_aggregate(r)}
            for r in rows.order_by("date")
        ]
        total = sum(item["points"] for item in daily)
        return {
            "year": y,
            "month": m - 1 if m is not None else None,
            "total_points": total,
            "days_tracked": len(daily),
            "daily": daily,
        }

    @staticmethod
    def _score_aggregate(aggregate):
        total = 0
        total += SCORING_RULES["habit_completed"] * (aggregate.habits_completed or 0)
        total += SCORING_RULES["goal_completed"] * (aggregate.goals_completed or 0)
        total += SCORING_RULES["planner_task_completed"] * (aggregate.planner_tasks_completed or 0)
        total += SCORING_RULES["journal_written"] * (1 if aggregate.has_journal else 0)
        total += SCORING_RULES["mood_logged"] * (1 if aggregate.mood else 0)
        total += SCORING_RULES["water_glass"] * (aggregate.water_glasses or 0)
        total += SCORING_RULES["achievement_earned"] * (aggregate.achievements_earned or 0)
        return total


def _coerce_date(value):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        from .. import validation

        return validation.parse_date(value, field="date")
    raise ValidationError("date must be a date or YYYY-MM-DD string")


def _days_in_month(y, m):
    import calendar

    return calendar.monthrange(y, m)[1]


# Late import to avoid circular dependency.
from datetime import datetime  # noqa: E402

points_engine = PointsEngine()
