"""Planner template domain service (P3-11, P3-12).

Provides reusable planning structures and search across blocks/tasks.
"""

from ...models import PlannerBlock, PlannerTask, PlannerTemplate
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger
from .planner import planner_service

logger = get_logger("tracker.domain.planner_templates")


class PlannerTemplateService:
    def list(self, user):
        return list(PlannerTemplate.objects.filter(user=user))

    def get_by_id(self, user, template_id):
        template = PlannerTemplate.objects.filter(id=template_id, user=user).first()
        if template is None:
            raise NotFoundError("Template not found")
        return template

    def create(self, user, data):
        name = validation.bounded_text(data.get("name"), max_length=255, field="name")
        description = validation.bounded_text(
            data.get("description", ""), max_length=2000, field="description", allow_blank=True,
        )
        template_data = data.get("data") or {}
        if not isinstance(template_data, dict):
            raise ValidationError("data must be an object")
        template = PlannerTemplate.objects.create(
            user=user, name=name, description=description, data=template_data,
        )
        logger.info("templates.create user_id=%s id=%s", user.id, template.id)
        return template

    def apply(self, user, template_id):
        """Instantiate a template's blocks/tasks/links into the user's planner."""
        template = self.get_by_id(user, template_id)
        created_blocks, created_links = planner_service.replace_all(user, template.data)
        logger.info(
            "templates.apply user_id=%s template_id=%s blocks=%s links=%s",
            user.id, template.id, created_blocks, created_links,
        )
        return created_blocks, created_links

    def delete(self, user, template_id):
        template = self.get_by_id(user, template_id)
        template.delete()
        logger.info("templates.delete user_id=%s id=%s", user.id, template_id)
        return True


def _search_blocks(user, query):
    if not query:
        return []
    return list(PlannerBlock.objects.filter(user=user, title__icontains=query))


def _search_tasks(user, query):
    if not query:
        return []
    return list(PlannerTask.objects.filter(block__user=user, text__icontains=query))


class PlannerSearchService:
    """Search planner blocks and tasks (P3-12)."""

    def search(self, user, query, *, limit=20):
        q = validation.bounded_text(query or "", max_length=200, field="query", allow_blank=True)
        if not q:
            return {"blocks": [], "tasks": []}
        blocks = _search_blocks(user, q)[:limit]
        tasks = _search_tasks(user, q)[:limit]
        return {
            "query": q,
            "blocks": [
                {"id": b.id, "title": b.title, "x": b.x, "y": b.y} for b in blocks
            ],
            "tasks": [
                {"id": t.id, "block": t.block_id, "text": t.text, "completed": t.completed}
                for t in tasks
            ],
        }


planner_template_service = PlannerTemplateService()
planner_search_service = PlannerSearchService()
