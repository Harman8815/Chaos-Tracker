"""Planner domain service.

Owns PlannerBlock / PlannerTask / PlannerLink / PlannerSettings logic.
Blocks are owned directly by a user; tasks are owned transitively
through their block. Links must reference blocks owned by the user.
"""
import uuid

from django.db import transaction
from django.db.models import Q

from ..models import PlannerBlock, PlannerLink, PlannerSettings, PlannerTask
from . import validation
from .exceptions import NotFoundError, ValidationError
from .logging import get_logger

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

    @transaction.atomic
    def replace_all(self, user, data):
        PlannerBlock.objects.filter(user=user).delete()
        PlannerLink.objects.filter(user=user).delete()
        created_blocks = 0
        created_links = 0
        for raw in data.get("blocks", []):
            self._create_block(user, raw)
            created_blocks += 1
        for raw in data.get("links", []):
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
        updated_blocks = 0
        updated_links = 0
        if "blocks" in data:
            for raw in data["blocks"]:
                self._upsert_block(user, raw)
                updated_blocks += 1
        if "links" in data:
            PlannerLink.objects.filter(user=user).delete()
            for raw in data["links"]:
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
        block = _get_block(user, block_id)
        if "title" in data:
            block.title = validation.bounded_text(data["title"], max_length=255, field="title")
        if "x" in data:
            block.x = float(data["x"])
        if "y" in data:
            block.y = float(data["y"])
        block.save()
        if "tasks" in data:
            PlannerTask.objects.filter(block=block).delete()
            for idx, raw in enumerate(data["tasks"]):
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
        block = PlannerBlock.objects.create(
            id=raw["id"],
            user=user,
            title=raw.get("title", "New Block"),
            x=float(raw.get("x", 0)),
            y=float(raw.get("y", 0)),
        )
        for idx, task_raw in enumerate(raw.get("tasks", [])):
            self._create_task(block, task_raw, idx)
        return block

    def _upsert_block(self, user, raw):
        block, created = PlannerBlock.objects.update_or_create(
            id=raw["id"],
            user=user,
            defaults={
                "title": raw.get("title", "New Block"),
                "x": float(raw.get("x", 0)),
                "y": float(raw.get("y", 0)),
            },
        )
        if "tasks" in raw:
            PlannerTask.objects.filter(block=block).delete()
            for idx, task_raw in enumerate(raw["tasks"]):
                self._create_task(block, task_raw, idx)
        return block, created

    def _create_task(self, block, raw, idx):
        return PlannerTask.objects.create(
            id=raw["id"],
            block=block,
            text=validation.bounded_text(raw.get("text"), max_length=500, field="text"),
            completed=bool(raw.get("completed", False)),
            order=int(raw.get("order", idx)),
        )

    def _create_link(self, user, raw):
        from_block_id = raw["from"]
        to_block_id = raw["to"]
        # Verify both blocks belong to the user
        owned = set(
            PlannerBlock.objects.filter(
                user=user, id__in=[from_block_id, to_block_id],
            ).values_list("id", flat=True)
        )
        if from_block_id not in owned or to_block_id not in owned:
            raise ValidationError("Link references a block you do not own")
        return PlannerLink.objects.create(
            id=raw["id"],
            user=user,
            from_block_id=from_block_id,
            to_block_id=to_block_id,
        )


planner_service = PlannerService()