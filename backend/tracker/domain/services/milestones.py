"""Goal milestone domain service (P3-06).

Breaks large goals into ordered milestones. Completing a milestone
advances the parent goal's progress.
"""
from django.db.models import F

from ...models import Goal, GoalMilestone
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.milestones")


class GoalMilestoneService:
    def list(self, user, goal_id):
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise NotFoundError("Goal not found")
        return list(GoalMilestone.objects.filter(goal=goal).order_by("order", "created_at"))

    def get_by_id(self, user, milestone_id):
        milestone = GoalMilestone.objects.filter(id=milestone_id, goal__user=user).first()
        if milestone is None:
            raise NotFoundError("Milestone not found")
        return milestone

    def create(self, user, goal_id, data):
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise NotFoundError("Goal not found")
        title = validation.bounded_text(data.get("title"), max_length=255, field="title")
        description = validation.bounded_text(
            data.get("description", ""), max_length=2000, field="description", allow_blank=True,
        )
        order = validation.in_range(data.get("order", 0), 0, 10000, field="order")
        milestone = GoalMilestone.objects.create(
            user=user, goal=goal, title=title, description=description, order=order,
        )
        logger.info("milestones.create user_id=%s id=%s", user.id, milestone.id)
        return milestone

    def complete(self, user, milestone_id, *, completed=True):
        milestone = self.get_by_id(user, milestone_id)
        previous = milestone.completed
        milestone.completed = completed
        milestone.completed_at = _now() if completed else None
        milestone.save()
        if milestone.goal is not None and previous != completed:
            if completed:
                Goal.objects.filter(id=milestone.goal.id, user=user).update(
                    completed_tasks=F("completed_tasks") + 1,
                )
            else:
                Goal.objects.filter(id=milestone.goal.id, user=user).update(
                    completed_tasks=F("completed_tasks") - 1,
                )
        logger.info("milestones.complete user_id=%s id=%s completed=%s", user.id, milestone_id, completed)
        return milestone

    def delete(self, user, milestone_id):
        milestone = self.get_by_id(user, milestone_id)
        milestone.delete()
        logger.info("milestones.delete user_id=%s id=%s", user.id, milestone_id)
        return True


def _now():
    from django.utils import timezone
    return timezone.now()


milestone_service = GoalMilestoneService()