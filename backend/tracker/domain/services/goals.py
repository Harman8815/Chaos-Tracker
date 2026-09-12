"""Goals domain service."""
import uuid
from datetime import datetime

from ..models import Goal
from . import validation
from .exceptions import NotFoundError
from .logging import get_logger

logger = get_logger("tracker.domain.goals")


def _goal_queryset(user):
    return Goal.objects.filter(user=user)


class GoalService:
    def list(self, user, *, category=None, status=None):
        qs = _goal_queryset(user)
        if category:
            qs = qs.filter(category=category)
        if status:
            qs = qs.filter(status=status)
        return list(qs)

    def create(self, user, data):
        text = validation.bounded_text(data.get("text"), max_length=500, field="text")
        category = validation.choice(
            data.get("category", "daily"), Goal.GOAL_CATEGORIES_KEYS, field="category",
        )
        status_value = validation.choice(
            data.get("status", "active"), Goal.GOAL_STATUS_KEYS, field="status",
        )
        tags = validation.bounded_list(data.get("tags", []), max_length=50, field="tags")
        target = validation.positive_int(data.get("target", 1), field="target", minimum=1)
        completed_tasks = validation.non_negative_int(
            data.get("completed_tasks", 0), field="completed_tasks",
        )
        description = validation.bounded_text(
            data.get("description", ""), max_length=2000, field="description", allow_blank=True,
        )
        start_date = validation.parse_date(data["start_date"], field="start_date") if data.get("start_date") else None
        due_date = validation.parse_date(data["due_date"], field="due_date") if data.get("due_date") else None
        priority = validation.choice(
            data.get("priority", "medium"), Goal.PRIORITY_LEVELS_KEYS, field="priority",
        )
        frequency = validation.bounded_text(
            data.get("frequency", ""), max_length=50, field="frequency", allow_blank=True,
        )
        reminders = validation.bounded_list(data.get("reminders", []), max_length=50, field="reminders")
        completion_criteria = validation.bounded_text(
            data.get("completion_criteria", ""), max_length=2000, field="completion_criteria", allow_blank=True,
        )
        notes = validation.bounded_text(
            data.get("notes", ""), max_length=2000, field="notes", allow_blank=True,
        )

        completed_at = datetime.now() if status_value == "completed" else None
        goal = Goal.objects.create(
            id=uuid.uuid4().hex,
            user=user,
            text=text,
            category=category,
            status=status_value,
            tags=tags,
            target=target,
            completed_tasks=completed_tasks,
            description=description,
            start_date=start_date,
            due_date=due_date,
            priority=priority,
            frequency=frequency,
            reminders=reminders,
            completion_criteria=completion_criteria,
            notes=notes,
            completed_at=completed_at,
        )
        logger.info("goals.create user_id=%s id=%s", user.id, goal.id)
        return goal

    def update(self, user, goal_id, data, *, partial=True):
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise NotFoundError("Goal not found")

        field_map = {
            "text": lambda v: validation.bounded_text(v, max_length=500, field="text"),
            "category": lambda v: validation.choice(v, Goal.GOAL_CATEGORIES_KEYS, field="category"),
            "status": lambda v: validation.choice(v, Goal.GOAL_STATUS_KEYS, field="status"),
            "tags": lambda v: validation.bounded_list(v, max_length=50, field="tags"),
            "target": lambda v: validation.positive_int(v, field="target", minimum=1),
            "completed_tasks": lambda v: validation.non_negative_int(v, field="completed_tasks"),
            "description": lambda v: validation.bounded_text(v, max_length=2000, field="description", allow_blank=True),
            "start_date": lambda v: validation.parse_date(v, field="start_date"),
            "due_date": lambda v: validation.parse_date(v, field="due_date"),
            "priority": lambda v: validation.choice(v, Goal.PRIORITY_LEVELS_KEYS, field="priority"),
            "frequency": lambda v: validation.bounded_text(v, max_length=50, field="frequency", allow_blank=True),
            "reminders": lambda v: validation.bounded_list(v, max_length=50, field="reminders"),
            "completion_criteria": lambda v: validation.bounded_text(v, max_length=2000, field="completion_criteria", allow_blank=True),
            "notes": lambda v: validation.bounded_text(v, max_length=2000, field="notes", allow_blank=True),
        }
        for field, coerce in field_map.items():
            if field in data:
                setattr(goal, field, coerce(data[field]))

        if "status" in data:
            if data["status"] == "completed" and goal.completed_at is None:
                goal.completed_at = datetime.now()
            elif data["status"] != "completed":
                goal.completed_at = None
        goal.save()
        logger.info("goals.update user_id=%s id=%s", user.id, goal.id)
        return goal

    def delete(self, user, goal_id):
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise NotFoundError("Goal not found")
        goal.delete()
        logger.info("goals.delete user_id=%s id=%s", user.id, goal_id)
        return True


goal_service = GoalService()