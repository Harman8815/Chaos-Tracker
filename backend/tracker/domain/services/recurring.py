"""Recurring goal/task generation (P3-09, P3-10).

Automatically generates recurring goals and planner tasks based on
their recurrence configuration. Runs on demand; intended to be wired
into a scheduler later (Phase 6).
"""
from datetime import date, datetime, timedelta

from django.db import transaction
from django.db.models import F

from ...models import Goal, PlannerBlock, PlannerTask
from .. import validation
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.recurring")


def _coerce_date(value):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        from .. import validation as v
        return v.parse_date(value, field="date")
    raise ValidationError("date must be a date or YYYY-MM-DD string")


class RecurringService:
    @transaction.atomic
    def generate_goals(self, user, *, up_to_date=None):
        """Create the next occurrence for recurring goals that have no future instance."""
        up_to_date = _coerce_date(up_to_date) if up_to_date else date.today() + timedelta(days=30)
        created = []
        for goal in Goal.objects.filter(user=user, recurrence__in=Goal.RECURRENCE_KEYS[1:]):
            next_date = self._next_occurrence(goal, up_to_date)
            if next_date is None:
                continue
            exists = Goal.objects.filter(
                user=user, text=goal.text, start_date=next_date,
            ).exists()
            if exists:
                continue
            new_goal = Goal.objects.create(
                user=user,
                text=goal.text,
                category=goal.category,
                status='active',
                target=goal.target,
                description=goal.description,
                start_date=next_date,
                due_date=next_date,
                priority=goal.priority,
                recurrence=goal.recurrence,
                completion_criteria=goal.completion_criteria,
                notes=goal.notes,
            )
            created.append(new_goal)
            logger.info("recurring.generate_goals user_id=%s goal_id=%s", user.id, new_goal.id)
        return created

    @transaction.atomic
    def generate_tasks(self, user, *, up_to_date=None):
        """Create the next occurrence for recurring planner tasks."""
        up_to_date = _coerce_date(up_to_date) if up_to_date else date.today() + timedelta(days=30)
        created = []
        for task in PlannerTask.objects.filter(
            block__user=user, recurrence__in=PlannerTask.RECURRENCE_KEYS[1:],
        ):
            next_date = self._next_task_occurrence(task, up_to_date)
            if next_date is None:
                continue
            exists = PlannerTask.objects.filter(
                block__user=user, text=task.text, due_date=next_date,
            ).exists()
            if exists:
                continue
            new_task = PlannerTask.objects.create(
                block=task.block,
                text=task.text,
                completed=False,
                order=task.order,
                goal=task.goal,
                due_date=next_date,
                priority=task.priority,
                recurrence=task.recurrence,
            )
            created.append(new_task)
            logger.info("recurring.generate_tasks user_id=%s task_id=%s", user.id, new_task.id)
        return created

    def generate_all(self, user, *, up_to_date=None):
        goals = self.generate_goals(user, up_to_date=up_to_date)
        tasks = self.generate_tasks(user, up_to_date=up_to_date)
        return {"goals_created": len(goals), "tasks_created": len(tasks)}

    @staticmethod
    def _next_occurrence(goal, up_to_date):
        start = goal.start_date or date.today()
        if goal.recurrence == Goal.RECURRENCE_DAILY:
            candidate = start + timedelta(days=1)
        elif goal.recurrence == Goal.RECURRENCE_WEEKLY:
            candidate = start + timedelta(days=7)
        elif goal.recurrence == Goal.RECURRENCE_MONTHLY:
            candidate = _add_month(start, 1)
        else:
            return None
        if candidate > up_to_date:
            return None
        return candidate

    @staticmethod
    def _next_task_occurrence(task, up_to_date):
        start = task.due_date or date.today()
        if task.recurrence == PlannerTask.RECURRENCE_DAILY:
            candidate = start + timedelta(days=1)
        elif task.recurrence == PlannerTask.RECURRENCE_WEEKLY:
            candidate = start + timedelta(days=7)
        else:
            return None
        if candidate > up_to_date:
            return None
        return candidate


def _add_month(d, months):
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    import calendar
    day = min(d.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


recurring_service = RecurringService()