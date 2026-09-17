"""Productivity summary service (P3-15).

Produces a unified daily/weekly productivity score by combining the
points engine with goal/habit/planner completion signals.
"""

from datetime import date, datetime, timedelta


from ...models import DailyActivityAggregate
from ..exceptions import ValidationError
from ..logging import get_logger
from .points import points_engine

logger = get_logger("tracker.domain.productivity")


def _coerce_date(value):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        from .. import validation

        return validation.parse_date(value, field="date")
    raise ValidationError("date must be a date or YYYY-MM-DD string")


class ProductivityService:
    def daily(self, user, target_date):
        """Unified daily productivity summary."""
        target_date = _coerce_date(target_date)
        aggregate = DailyActivityAggregate.objects.filter(
            user=user,
            date=target_date,
        ).first()
        points = points_engine.score_day(user, target_date)
        if aggregate is None:
            return {
                "date": target_date.isoformat(),
                "points": points,
                "habits_completed": 0,
                "habits_total": 0,
                "planner_tasks_completed": 0,
                "goals_completed": 0,
                "has_journal": False,
                "mood": "",
                "water_glasses": 0,
            }
        return {
            "date": target_date.isoformat(),
            "points": points,
            "habits_completed": aggregate.habits_completed,
            "habits_total": aggregate.habits_total,
            "planner_tasks_completed": aggregate.planner_tasks_completed,
            "goals_completed": aggregate.goals_completed,
            "has_journal": aggregate.has_journal,
            "mood": aggregate.mood,
            "water_glasses": aggregate.water_glasses,
        }

    def weekly(self, user, *, week_start=None):
        """Unified weekly productivity summary."""
        today = date.today()
        if week_start is None:
            week_start = today - timedelta(days=today.weekday())
        week_start = _coerce_date(week_start)
        week_end = week_start + timedelta(days=6)
        days = []
        current = week_start
        while current <= week_end:
            days.append(self.daily(user, current))
            current += timedelta(days=1)
        return {
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "total_points": sum(d["points"] for d in days),
            "days": days,
        }

    def monthly(self, user, *, year=None, month=None):
        """Unified monthly productivity summary."""
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
        days = []
        current = start
        while current <= end:
            days.append(self.daily(user, current))
            current += timedelta(days=1)
        return {
            "year": y,
            "month": m - 1 if m is not None else None,
            "total_points": sum(d["points"] for d in days),
            "days": days,
        }


def _days_in_month(y, m):
    import calendar

    return calendar.monthrange(y, m)[1]


productivity_service = ProductivityService()
