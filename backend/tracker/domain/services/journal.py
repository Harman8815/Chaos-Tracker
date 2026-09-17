"""Journal domain service.

Owns all business logic for journal entries: creation, upsert, retrieval,
and deletion. Ownership is enforced on every operation.
"""

from django.db import transaction

from ...models import JournalEntry
from .. import validation
from ..logging import get_logger

logger = get_logger("tracker.domain.journal")


class JournalService:
    """Stateless service; state is persisted on the JournalEntry model."""

    def list(self, user):
        """Return all journal entries owned by ``user`` (newest first)."""
        return list(JournalEntry.objects.filter(user=user))

    def get(self, user, date_value):
        """Return the entry for ``date_value`` or ``None`` if absent.

        Ownership is implicit: the query is scoped to ``user``.
        """
        d = validation.parse_date(date_value, field="date")
        return JournalEntry.objects.filter(user=user, date=d).first()

    def get_by_id(self, user, entry_id):
        """Return the entry with ``entry_id`` or raise :class:`NotFoundError`."""
        from ..exceptions import NotFoundError

        instance = JournalEntry.objects.filter(id=entry_id, user=user).first()
        if instance is None:
            raise NotFoundError("Journal entry not found")
        return instance

    def upsert(self, user, *, date_value, content):
        """Create or update the journal entry for ``date_value``.

        Returns the (created, instance) tuple. Idempotent by design.
        """
        d = validation.parse_date(date_value, field="date")
        content = validation.bounded_text(
            content,
            max_length=JournalEntry._meta.get_field("content").max_length or 10000,
            field="content",
            allow_blank=True,
        )
        instance, created = JournalEntry.objects.update_or_create(
            user=user,
            date=d,
            defaults={"content": content},
        )
        logger.info(
            "journal.upsert user_id=%s date=%s created=%s",
            user.id,
            d.isoformat(),
            created,
        )
        return created, instance

    def delete(self, user, date_value):
        """Delete the entry for ``date_value``. No-op if absent.

        Raises :class:`NotFoundError` only if the caller expects an entry
        to exist (callers may check the return value instead).
        """
        instance = self.get(user, date_value)
        if instance is None:
            return False
        instance.delete()
        logger.info("journal.delete user_id=%s date=%s", user.id, instance.date.isoformat())
        return True

    @transaction.atomic
    def replace_all(self, user, entries):
        """Atomically replace every journal entry for ``user``.

        ``entries`` is an iterable of ``{date, content}`` dicts.
        """
        JournalEntry.objects.filter(user=user).delete()
        created = 0
        for raw in entries:
            d = validation.parse_date(raw.get("date"), field="date")
            content = validation.bounded_text(
                raw.get("content", ""),
                max_length=10000,
                field="content",
                allow_blank=True,
            )
            JournalEntry.objects.create(user=user, date=d, content=content)
            created += 1
        logger.info("journal.replace_all user_id=%s count=%s", user.id, created)
        return created


journal_service = JournalService()
