"""Achievements domain service."""

from ...models import Achievement
from .. import validation
from ..exceptions import NotFoundError
from ..logging import get_logger

logger = get_logger("tracker.domain.achievements")


class AchievementService:
    def list(self, user):
        return list(Achievement.objects.filter(user=user))

    def get_by_id(self, user, achievement_id):
        from ..exceptions import NotFoundError
        achievement = Achievement.objects.filter(id=achievement_id, user=user).first()
        if achievement is None:
            raise NotFoundError("Achievement not found")
        return achievement

    def create(self, user, data):
        title = validation.bounded_text(data.get("title"), max_length=255, field="title")
        description = validation.bounded_text(
            data.get("description", ""), max_length=2000, field="description", allow_blank=True,
        )
        image = validation.bounded_text(
            data.get("image", ""), max_length=500, field="image", allow_blank=True,
        )
        achievement_date = validation.parse_date(data.get("date"), field="date")
        trigger_rule = validation.bounded_dict(
            data.get("trigger_rule", {}) or {}, max_length=50, field="trigger_rule",
        )
        achievement = Achievement.objects.create(
            user=user,
            title=title,
            description=description,
            date=achievement_date,
            image=image,
            trigger_rule=trigger_rule,
        )
        logger.info("achievements.create user_id=%s id=%s", user.id, achievement.id)
        return achievement

    def update(self, user, achievement_id, data, *, partial=True):
        achievement = Achievement.objects.filter(id=achievement_id, user=user).first()
        if achievement is None:
            raise NotFoundError("Achievement not found")
        if "title" in data:
            achievement.title = validation.bounded_text(data["title"], max_length=255, field="title")
        if "description" in data:
            achievement.description = validation.bounded_text(
                data["description"], max_length=2000, field="description", allow_blank=True,
            )
        if "image" in data:
            achievement.image = validation.bounded_text(
                data["image"], max_length=500, field="image", allow_blank=True,
            )
        if "date" in data:
            achievement.date = validation.parse_date(data["date"], field="date")
        if "trigger_rule" in data:
            achievement.trigger_rule = validation.bounded_dict(
                data.get("trigger_rule") or {}, max_length=50, field="trigger_rule",
            )
        achievement.save()
        logger.info("achievements.update user_id=%s id=%s", user.id, achievement_id)
        return achievement

    def delete(self, user, achievement_id):
        achievement = Achievement.objects.filter(id=achievement_id, user=user).first()
        if achievement is None:
            raise NotFoundError("Achievement not found")
        achievement.delete()
        logger.info("achievements.delete user_id=%s id=%s", user.id, achievement_id)
        return True


achievement_service = AchievementService()