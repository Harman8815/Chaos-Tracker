"""Mood and water domain services."""
from datetime import date, datetime

from ...models import Mood, Water
from .. import validation
from ..exceptions import NotFoundError
from ..logging import get_logger

logger = get_logger("tracker.domain.health")


class MoodService:
    def list(self, user):
        return list(Mood.objects.filter(user=user))

    def get_by_id(self, user, mood_id):
        from ..exceptions import NotFoundError
        instance = Mood.objects.filter(id=mood_id, user=user).first()
        if instance is None:
            raise NotFoundError("Mood not found")
        return instance

    def upsert(self, user, data):
        mood_value = validation.choice(data.get("mood"), Mood.MOOD_CHOICES_KEYS, field="mood")
        entry_date = validation.parse_date(data.get("date"), field="date")
        instance, created = Mood.objects.update_or_create(
            user=user, date=entry_date, defaults={"mood": mood_value},
        )
        logger.info("mood.upsert user_id=%s date=%s created=%s", user.id, entry_date.isoformat(), created)
        return instance

    def update(self, user, mood_id, data, *, partial=True):
        instance = self.get_by_id(user, mood_id)
        if "mood" in data:
            instance.mood = validation.choice(data["mood"], Mood.MOOD_CHOICES_KEYS, field="mood")
        if "date" in data:
            instance.date = validation.parse_date(data["date"], field="date")
        instance.save()
        logger.info("mood.update user_id=%s id=%s", user.id, mood_id)
        return instance

    def delete(self, user, mood_id):
        instance = self.get_by_id(user, mood_id)
        instance.delete()
        logger.info("mood.delete user_id=%s id=%s", user.id, mood_id)
        return True


class WaterService:
    def list(self, user):
        return list(Water.objects.filter(user=user))

    def get_by_id(self, user, water_id):
        from ..exceptions import NotFoundError
        instance = Water.objects.filter(id=water_id, user=user).first()
        if instance is None:
            raise NotFoundError("Water entry not found")
        return instance

    def upsert(self, user, data):
        glasses = validation.non_negative_int(data.get("glasses", 0), field="glasses")
        target = validation.positive_int(data.get("target", 8), field="target", minimum=1)
        entry_date = validation.parse_date(data.get("date"), field="date")
        instance, created = Water.objects.update_or_create(
            user=user, date=entry_date, defaults={"glasses": glasses, "target": target},
        )
        logger.info("water.upsert user_id=%s date=%s created=%s", user.id, entry_date.isoformat(), created)
        return instance

    def update(self, user, water_id, data, *, partial=True):
        instance = self.get_by_id(user, water_id)
        if "glasses" in data:
            instance.glasses = validation.non_negative_int(data["glasses"], field="glasses")
        if "target" in data:
            instance.target = validation.positive_int(data["target"], field="target", minimum=1)
        if "date" in data:
            instance.date = validation.parse_date(data["date"], field="date")
        instance.save()
        logger.info("water.update user_id=%s id=%s", user.id, water_id)
        return instance

    def delete(self, user, water_id):
        instance = self.get_by_id(user, water_id)
        instance.delete()
        logger.info("water.delete user_id=%s id=%s", user.id, water_id)
        return True


_mood_service = MoodService()
_water_service = WaterService()