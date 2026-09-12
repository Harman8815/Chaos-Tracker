"""Habits domain service.

Owns Habit CRUD plus DailyHabitScore tracking. Habits may optionally
support a specific Goal (P2-03), and a habit's daily score can
contribute to goal progress when configured.
"""
from django.db import transaction
from django.db.models import F

from ...models import DailyHabitScore, Goal, Habit
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.habits")


class HabitService:
    def list(self, user, *, goal_id=None):
        qs = Habit.objects.filter(user=user)
        if goal_id:
            qs = qs.filter(goal_id=goal_id)
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
        goal = self._resolve_goal(user, data.get("goal"))
        habit = Habit.objects.create(
            user=user,
            name=name,
            target=target,
            range_max=range_max,
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
        if habit.goal is not None and score >= target_value:
            Goal.objects.filter(id=habit.goal.id, user=user).update(
                completed_tasks=F("completed_tasks") + 1,
            )
        logger.info("habits.log_score user_id=%s habit_id=%s date=%s score=%s", user.id, habit_id, entry_date, score)
        return instance

    def scores_for_range(self, user, habit_id, start_date, end_date):
        habit = self.get_by_id(user, habit_id)
        start = validation.parse_date(start_date, field="start_date")
        end = validation.parse_date(end_date, field="end_date")
        if start > end:
            raise ValidationError("start_date must be on or before end_date")
        return list(DailyHabitScore.objects.filter(
            user=user, habit=habit, date__range=[start, end],
        ).order_by("date"))

    @staticmethod
    def _resolve_goal(user, goal_id):
        if goal_id is None or goal_id == "":
            return None
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise ValidationError("Habit references a goal you do not own")
        return goal


habit_service = HabitService()