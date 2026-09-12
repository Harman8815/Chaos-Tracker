"""Planner domain service.

Owns PlannerBlock / PlannerTask / PlannerLink / PlannerSettings logic.
Blocks are owned directly by a user; tasks are owned transitively
through their block. Links must reference blocks owned by the user.
"""
import uuid

from django.db import transaction
from django.db.models import Q

from ...models import Goal, PlannerBlock, PlannerLink, PlannerSettings, PlannerTask
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.planner")


def _get_block(user, block_id):
    block = (
        PlannerBlock.objects.prefetch_related("tasks")
        .filter(id=block_id, user=user)
        .first()
    )
    if block is None:
        raise NotFoundError("Planner block not found")
    return block


def _get_block_or_404(user, block_id):
    return _get_block(user, block_id)


def _require_object(raw, label):
    if not isinstance(raw, dict):
        raise ValidationError(f"{label} must be an object")
    return raw


def _require_list(value, label):
    if not isinstance(value, list):
        raise ValidationError(f"{label} must be a list")
    return value


class PlannerService:
    def get(self, user):
        blocks = list(PlannerBlock.objects.filter(user=user).prefetch_related("tasks"))
        links = list(PlannerLink.objects.filter(user=user))
        settings, _ = PlannerSettings.objects.get_or_create(
            user=user, defaults={"transform": {"scale": 1, "panX": 0, "panY": 0}},
        )
        return {
            "blocks": blocks,
            "links": links,
            "transform": settings.transform,
        }

    def get_block_by_id(self, user, block_id):
        return _get_block(user, block_id)

    @transaction.atomic
    def replace_all(self, user, data):
        if data is None:
            data = {}
        if not isinstance(data, dict):
            raise ValidationError("Planner data must be an object")
        blocks = _require_list(data.get("blocks", []), "blocks")
        links = _require_list(data.get("links", []), "links")
        PlannerBlock.objects.filter(user=user).delete()
        PlannerLink.objects.filter(user=user).delete()
        created_blocks = 0
        created_links = 0
        for raw in blocks:
            self._create_block(user, raw)
            created_blocks += 1
        for raw in links:
            self._create_link(user, raw)
            created_links += 1
        transform = data.get("transform") or {"scale": 1, "panX": 0, "panY": 0}
        PlannerSettings.objects.update_or_create(
            user=user, defaults={"transform": transform},
        )
        logger.info(
            "planner.replace_all user_id=%s blocks=%s links=%s",
            user.id, created_blocks, created_links,
        )
        return created_blocks, created_links

    @transaction.atomic
    def patch(self, user, data):
        if data is None:
            data = {}
        if not isinstance(data, dict):
            raise ValidationError("Planner data must be an object")
        updated_blocks = 0
        updated_links = 0
        if "blocks" in data:
            blocks = _require_list(data["blocks"], "blocks")
            for raw in blocks:
                self._upsert_block(user, raw)
                updated_blocks += 1
        if "links" in data:
            links = _require_list(data["links"], "links")
            PlannerLink.objects.filter(user=user).delete()
            for raw in links:
                self._create_link(user, raw)
                updated_links += 1
        if "transform" in data:
            PlannerSettings.objects.update_or_create(
                user=user, defaults={"transform": data["transform"]},
            )
        logger.info(
            "planner.patch user_id=%s blocks=%s links=%s",
            user.id, updated_blocks, updated_links,
        )
        return updated_blocks, updated_links

    def get_block(self, user, block_id):
        return _get_block(user, block_id)

    @transaction.atomic
    def update_block(self, user, block_id, data):
        data = _require_object(data, "block update data")
        block = _get_block(user, block_id)
        if "title" in data:
            block.title = validation.bounded_text(data["title"], max_length=255, field="title")
        if "x" in data:
            block.x = float(data["x"])
        if "y" in data:
            block.y = float(data["y"])
        block.save()
        if "tasks" in data:
            tasks = _require_list(data["tasks"], "tasks")
            task_ids = [raw.get("id") for raw in tasks if isinstance(raw, dict)]
            if len(task_ids) != len(set(task_ids)):
                raise ValidationError("Task ids must be unique")
            PlannerTask.objects.filter(block=block).delete()
            for idx, raw in enumerate(tasks):
                self._create_task(block, raw, idx)
        logger.info("planner.update_block user_id=%s block_id=%s", user.id, block.id)
        return block

    @transaction.atomic
    def delete_block(self, user, block_id):
        block = _get_block(user, block_id)
        PlannerLink.objects.filter(
            Q(from_block=block) | Q(to_block=block), user=user,
        ).delete()
        block.delete()
        logger.info("planner.delete_block user_id=%s block_id=%s", user.id, block_id)
        return True

    # --- internal helpers ---

    def _create_block(self, user, raw):
        raw = _require_object(raw, "block")
        block_id = validation.bounded_text(raw.get("id"), max_length=100, field="id")
        if not block_id:
            raise ValidationError("id is required")
        block = PlannerBlock.objects.create(
            id=block_id,
            user=user,
            title=validation.bounded_text(raw.get("title", "New Block"), max_length=255, field="title"),
            x=float(raw.get("x", 0)),
            y=float(raw.get("y", 0)),
        )
        tasks = _require_list(raw.get("tasks", []), "tasks")
        for idx, task_raw in enumerate(tasks):
            self._create_task(block, task_raw, idx)
        return block

    def _upsert_block(self, user, raw):
        raw = _require_object(raw, "block")
        block_id = validation.bounded_text(raw.get("id"), max_length=100, field="id")
        if not block_id:
            raise ValidationError("id is required")
        block, created = PlannerBlock.objects.update_or_create(
            id=block_id,
            user=user,
            defaults={
                "title": validation.bounded_text(raw.get("title", "New Block"), max_length=255, field="title"),
                "x": float(raw.get("x", 0)),
                "y": float(raw.get("y", 0)),
            },
        )
        if "tasks" in raw:
            tasks = _require_list(raw["tasks"], "tasks")
            PlannerTask.objects.filter(block=block).delete()
            for idx, task_raw in enumerate(tasks):
                self._create_task(block, task_raw, idx)
        return block, created

    def _create_task(self, block, raw, idx):
        raw = _require_object(raw, "task")
        task_id = validation.bounded_text(raw.get("id"), max_length=100, field="id")
        if not task_id:
            raise ValidationError("id is required")
        goal = self._resolve_goal(block.user, raw.get("goal"))
        task = PlannerTask.objects.create(
            id=task_id,
            block=block,
            text=validation.bounded_text(raw.get("text"), max_length=500, field="text"),
            completed=bool(raw.get("completed", False)),
            order=validation.non_negative_int(raw.get("order", idx), field="order"),
            goal=goal,
        )
        if task.completed and goal is not None:
            self._increment_goal_progress(block.user, goal)
        return task

    def _resolve_goal(self, user, goal_id):
        if goal_id is None or goal_id == "":
            return None
        goal = Goal.objects.filter(id=goal_id, user=user).first()
        if goal is None:
            raise ValidationError("Task references a goal you do not own")
        return goal

    @staticmethod
    def _increment_goal_progress(user, goal):
        from django.db.models import F
        Goal.objects.filter(id=goal.id, user=user).update(
            completed_tasks=F("completed_tasks") + 1,
        )

    def set_task_goal(self, user, task_id, goal_id):
        """Attach a planner task to a goal (P2-02)."""
        task = PlannerTask.objects.filter(id=task_id, block__user=user).first()
        if task is None:
            raise NotFoundError("Planner task not found")
        goal = self._resolve_goal(user, goal_id)
        task.goal = goal
        task.save()
        logger.info("planner.set_task_goal user_id=%s task_id=%s goal_id=%s", user.id, task_id, goal.id if goal else None)
        return task

    def complete_task(self, user, task_id, *, completed=True):
        """Mark a task complete/incomplete and update goal progress (P3-07)."""
        task = PlannerTask.objects.filter(id=task_id, block__user=user).first()
        if task is None:
            raise NotFoundError("Planner task not found")
        previous = task.completed
        task.completed = completed
        task.save()
        if task.goal is not None and previous != completed:
            if completed:
                self._increment_goal_progress(user, task.goal)
            else:
                from django.db.models import F
                Goal.objects.filter(id=task.goal.id, user=user).update(
                    completed_tasks=F("completed_tasks") - 1,
                )
        logger.info("planner.complete_task user_id=%s task_id=%s completed=%s", user.id, task_id, completed)
        return task

    def _create_link(self, user, raw):
        raw = _require_object(raw, "link")
        link_id = validation.bounded_text(raw.get("id"), max_length=100, field="id")
        from_block_id = validation.bounded_text(raw.get("from"), max_length=100, field="from")
        to_block_id = validation.bounded_text(raw.get("to"), max_length=100, field="to")
        if not link_id:
            raise ValidationError("id is required")
        if not from_block_id or not to_block_id:
            raise ValidationError("from and to are required")
        if from_block_id == to_block_id:
            raise ValidationError("A block cannot link to itself")
        # Verify both blocks belong to the user
        owned = set(
            PlannerBlock.objects.filter(
                user=user, id__in=[from_block_id, to_block_id],
            ).values_list("id", flat=True)
        )
        if from_block_id not in owned or to_block_id not in owned:
            raise ValidationError("Link references a block you do not own")
        return PlannerLink.objects.create(
            id=link_id,
            user=user,
            from_block_id=from_block_id,
            to_block_id=to_block_id,
        )


planner_service = PlannerService()