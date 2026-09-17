"""Achievement engine (P3-14).

Automatically awards achievements when their trigger rule is satisfied
by recent :class:`UserEvent` activity. Rules are declarative:

    {"event_type": "planner_task_completed", "count": 7, "window_days": 30}

The engine is stateless and only creates Achievement rows; it does
not mutate other domains.
"""

from datetime import timedelta

from django.utils import timezone

from ...models import Achievement, UserEvent
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.achievement_engine")


class AchievementEngine:
    def evaluate(self, user):
        """Evaluate all achievement rules for a user and award new ones."""
        awarded = []
        for rule in self._default_rules():
            result = self._evaluate_rule(user, rule)
            if result is None:
                continue
            title, description, event_type, count, window_days = result
            already = Achievement.objects.filter(
                user=user,
                trigger_rule=event_type,
            ).exists()
            if already:
                continue
            achievement = Achievement.objects.create(
                user=user,
                title=title,
                description=description,
                date=timezone.now().date(),
                trigger_rule={"event_type": event_type, "count": count, "window_days": window_days},
            )
            awarded.append(achievement)
            logger.info("achievement_engine.award user_id=%s id=%s", user.id, achievement.id)
        return awarded

    def evaluate_event(self, user, event_type):
        """Re-evaluate rules after a single event type is recorded."""
        awarded = []
        for rule in self._default_rules():
            if rule["event_type"] != event_type:
                continue
            result = self._evaluate_rule(user, rule)
            if result is None:
                continue
            title, description, et, count, window_days = result
            already = Achievement.objects.filter(
                user=user,
                trigger_rule=event_type,
            ).exists()
            if already:
                continue
            achievement = Achievement.objects.create(
                user=user,
                title=title,
                description=description,
                date=timezone.now().date(),
                trigger_rule={"event_type": event_type, "count": count, "window_days": window_days},
            )
            awarded.append(achievement)
        return awarded

    @staticmethod
    def _default_rules():
        return [
            {
                "event_type": "planner_task_completed",
                "count": 7,
                "window_days": 30,
                "title": "Week Warrior",
                "description": "Completed 7 planner tasks in 30 days.",
            },
            {
                "event_type": "goal_completed",
                "count": 3,
                "window_days": 90,
                "title": "Goal Crusher",
                "description": "Completed 3 goals in 90 days.",
            },
            {
                "event_type": "habit_log",
                "count": 10,
                "window_days": 30,
                "title": "Habit Hero",
                "description": "Logged a habit 10 times in 30 days.",
            },
        ]

    def _evaluate_rule(self, user, rule):
        event_type = rule["event_type"]
        count = int(rule.get("count", 1))
        window_days = int(rule.get("window_days", 30))
        if count <= 0 or window_days <= 0:
            raise ValidationError("Achievement rule count and window_days must be positive")
        cutoff = timezone.now() - timedelta(days=window_days)
        actual = UserEvent.objects.filter(
            user=user,
            event_type=event_type,
            occurred_at__gte=cutoff,
        ).count()
        if actual >= count:
            return rule["title"], rule["description"], event_type, count, window_days
        return None


achievement_engine = AchievementEngine()
