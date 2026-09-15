"""Habits domain service.

Owns Habit CRUD plus DailyHabitScore tracking. Habits may optionally
support a specific Goal (P2-03), and a habit's daily score can
contribute to goal progress when configured.

Phase 3 additions: schedules, reminders, streak protection, and
history queries (P3-01 .. P3-05).
"""
from datetime import date, timedelta

from django.db.models import F

from ...models import DailyHabitScore, Goal, Habit
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.habits")


def _normalize_weekday(value):
    try:
        n = int(value)
    except (TypeError, ValueError):
        raise ValidationError("schedule_days must be integers 0-6")
    if n < 0 or n > 6:
        raise ValidationError("schedule_days must be between 0 and 6")
    return n


class HabitService:
    def list(self, user, *, goal_id=None, schedule=None):
        qs = Habit.objects.filter(user=user)
        if goal_id:
            qs = qs.filter(goal_id=goal_id)
        if schedule:
            qs = qs.filter(schedule=schedule)
        return list(qs)

    def get_by_id(self, user, habit_id):
        habit = Habit.objects.filter(id=habit_id, user=user).first()
        if habit is None:
            raise NotFoundError("Habit not found")
        return habit

    def create(self, user, data):
        name = validation.bounded_text(data.get("name"), max_length=255, field="name")
        target = validation.positive_int(data.get("target", 1), field="target", minimum=1)
        range_max = validation.in_range(data.get("range_max", 10), 1, 1000, field="range_max")
        schedule = validation.choice(
            data.get("schedule", Habit.SCHEDULE_DAILY),
            Habit.SCHEDULE_KEYS, field="schedule",
        )
        schedule_days = validation.bounded_list(
            data.get(
                "schedule_days",
                []),
            max_length=7,
            field="schedule_days")
        schedule_days = sorted({_normalize_weekday(d) for d in schedule_days})
        reminders = validation.bounded_list(
            data.get(
                "reminders",
                []),
            max_length=20,
            field="reminders")
        grace_period = validation.in_range(
            data.get("grace_period", 0), 0, 365, field="grace_period")
        goal = self._resolve_goal(user, data.get("goal"))
        habit = Habit.objects.create(
            user=user,
            name=name,
            target=target,
            range_max=range_max,
            schedule=schedule,
            schedule_days=schedule_days,
            reminders=reminders,
            grace_period=grace_period,
            goal=goal,
        )
        logger.info("habits.create user_id=%s id=%s", user.id, habit.id)
        return habit

    def update(self, user, habit_id, data, *, partial=True):
        habit = Habit.objects.filter(id=habit_id, user=user).first()
        if habit is None:
            raise NotFoundError("Habit not found")
        if "name" in data:
            habit.name = validation.bounded_text(data["name"], max_length=255, field="name")
        if "target" in data:
            habit.target = validation.positive_int(data["target"], field="target", minimum=1)
        if "range_max" in data:
            habit.range_max = validation.in_range(data["range_max"], 1, 1000, field="range_max")
        if "schedule" in data:
            habit.schedule = validation.choice(
                data["schedule"], Habit.SCHEDULE_KEYS, field="schedule")
        if "schedule_days" in data:
            days = validation.bounded_list(
                data["schedule_days"], max_length=7, field="schedule_days")
            habit.schedule_days = sorted({_normalize_weekday(d) for d in days})
        if "reminders" in data:
            habit.reminders = validation.bounded_list(
                data["reminders"], max_length=20, field="reminders")
        if "grace_period" in data:
            habit.grace_period = validation.in_range(
                data["grace_period"], 0, 365, field="grace_period")
        if "goal" in data:
            habit.goal = self._resolve_goal(user, data["goal"])
        habit.save()
        logger.info("habits.update user_id=%s id=%s", user.id, habit_id)
        return habit

    def delete(self, user, habit_id):
        habit = Habit.objects.filter(id=habit_id, user=user).first()
        if habit is None:
            raise NotFoundError("Habit not found")
        habit.delete()
        logger.info("habits.delete user_id=%s id=%s", user.id, habit_id)
        return True

    def log_score(self, user, habit_id, *, date, score, target=None):
        """Record a daily score for a habit (P2-03 contribution)."""
        habit = self.get_by_id(user, habit_id)
        score = validation.in_range(score, 0, 1000, field="score")
        target_value = target if target is not None else habit.target
        target_value = validation.in_range(target_value, 1, 1000, field="target")
        entry_date = validation.parse_date(date, field="date")

        instance, _created = DailyHabitScore.objects.update_or_create(
            user=user, habit=habit, date=entry_date,
            defaults={"score": score},
        )
        self._update_completion_record(habit, entry_date, score > 0)
        self._update_streak(habit)
        if habit.goal is not None and score >= target_value:
            Goal.objects.filter(id=habit.goal.id, user=user).update(
                completed_tasks=F("completed_tasks") + 1,
            )
        logger.info(
            "habits.log_score user_id=%s habit_id=%s date=%s score=%s",
            user.id,
            habit_id,
            entry_date,
            score)
        return instance

    def history(self, user, habit_id, *, start_date=None, end_date=None):
        """Calendar/history view for a habit (P3-01)."""
        habit = self.get_by_id(user, habit_id)
        start = validation.parse_date(start_date, field="start_date") if start_date else None
        end = validation.parse_date(end_date, field="end_date") if end_date else None
        if start and end and start > end:
            raise ValidationError("start_date must be on or before end_date")
        qs = DailyHabitScore.objects.filter(user=user, habit=habit).order_by("date")
        if start:
            qs = qs.filter(date__gte=start)
        if end:
            qs = qs.filter(date__lte=end)
        return list(qs)

    def scores_for_range(self, user, habit_id, start_date, end_date):
        return self.history(user, habit_id, start_date=start_date, end_date=end_date)

    def is_due_today(self, habit, *, today=None):
        """Return True if the habit is scheduled for the given day (P3-03)."""
        today = today or date.today()
        if habit.schedule == Habit.SCHEDULE_DAILY:
            return True
        if habit.schedule == Habit.SCHEDULE_WEEKLY:
            return bool(habit.schedule_days) and today.weekday() in habit.schedule_days
        if habit.schedule == Habit.SCHEDULE_CUSTOM:
            return bool(habit.schedule_days) and today.weekday() in habit.schedule_days
        return False

    def _update_completion_record(self, habit, entry_date, completed):
        completed_dates = list(habit.completed_dates or [])
        iso = entry_date.isoformat()
        if completed:
            if iso not in completed_dates:
                completed_dates.append(iso)
        else:
            if iso in completed_dates:
                completed_dates.remove(iso)
        habit.completed_dates = completed_dates

    def _update_streak(self, habit):
        completed_dates = set(habit.completed_dates or [])
        if not completed_dates:
            habit.streak = 0
            habit.save()
            return
        today = date.today()
        streak = 0
        current = today
        while current.isoformat() in completed_dates:
            streak += 1
            current -= timedelta(days=1)
        habit.streak = streak
        habit.save()

    @staticmethod
    def _resolve_goal(user, goal_id):
        if goal_id is None or goal_id == "":
            return None
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise ValidationError("Habit references a goal you do not own")
        return goal


habit_service = HabitService()
