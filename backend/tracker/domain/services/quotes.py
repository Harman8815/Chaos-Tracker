"""Quotes domain service.

Owns QuoteSource / Quote / QuoteTag business logic. Every operation
verifies the requesting user owns the source (quotes are owned
transitively through their source).
"""
import uuid

from django.db import transaction
from django.db.models import Count, Prefetch

from ...models import Quote, QuoteSource, QuoteTag
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.quotes")


SOURCE_TYPE_KEYS = [k for k, _ in QuoteSource.SOURCE_TYPES]


def _get_source(user, source_id):
    source = QuoteSource.objects.filter(id=source_id, user=user).first()
    if source is None:
        raise NotFoundError("Quote source not found")
    return source


def _get_quote(user, quote_id):
    quote = (
        Quote.objects.select_related("source")
        .prefetch_related("tags")
        .filter(id=quote_id)
        .first()
    )
    if quote is None or quote.source.user_id != user.id:
        raise NotFoundError("Quote not found")
    return quote


def _normalize_tags(tags):
    if tags is None:
        return []
    if not isinstance(tags, list):
        raise ValidationError("tags must be a list")
    out = []
    for t in tags:
        t = validation.bounded_text(t, max_length=50, field="tag", allow_blank=True)
        if t:
            out.append(t)
    return out


def _replace_tags(quote, tags):
    quote.tags.all().delete()
    for tag in tags:
        QuoteTag.objects.create(quote=quote, tag=tag)


class QuoteSourceService:
    def list(self, user, *, source_type=None, include_quotes=True):
        qs = QuoteSource.objects.filter(user=user).annotate(
            quote_count=Count("quotes")
        )
        if source_type:
            qs = qs.filter(type=source_type)
        if include_quotes:
            qs = qs.prefetch_related(
                Prefetch("quotes", queryset=Quote.objects.prefetch_related("tags"))
            )
        return list(qs)

    def get_by_id(self, user, source_id):
        return _get_source(user, source_id)

    def create(self, user, data):
        title = validation.bounded_text(
            data.get("title"), max_length=255, field="title",
        )
        source_type = validation.choice(
            data.get("type"), SOURCE_TYPE_KEYS, field="type",
        )
        cover_image = validation.bounded_text(
            data.get("cover_image", ""), max_length=500, field="cover_image", allow_blank=True,
        )
        source = QuoteSource.objects.create(
            id=str(uuid.uuid4()),
            user=user,
            title=title,
            type=source_type,
            cover_image=cover_image,
        )
        for raw_quote in data.get("quotes") or []:
            self._create_quote(user, source, raw_quote)
        logger.info("quotes.source.create user_id=%s source_id=%s", user.id, source.id)
        return self._load_source(user, source.id)

    def update(self, user, source_id, data, *, partial=True):
        source = _get_source(user, source_id)
        fields = {}
        if "title" in data:
            fields["title"] = validation.bounded_text(data["title"], max_length=255, field="title")
        if "type" in data:
            fields["type"] = validation.choice(data["type"], QuoteSource.SOURCE_TYPES_KEYS, field="type")
        if "cover_image" in data:
            fields["cover_image"] = validation.bounded_text(
                data["cover_image"], max_length=500, field="cover_image", allow_blank=True,
            )
        for k, v in fields.items():
            setattr(source, k, v)
        source.save()
        logger.info("quotes.source.update user_id=%s source_id=%s", user.id, source.id)
        return self._load_source(user, source.id)

    def delete(self, user, source_id):
        source = _get_source(user, source_id)
        source.delete()
        logger.info("quotes.source.delete user_id=%s source_id=%s", user.id, source_id)
        return True

    def _load_source(self, user, source_id):
        source = _get_source(user, source_id)
        return source

    def _create_quote(self, user, source, raw):
        text = validation.bounded_text(raw.get("text"), max_length=5000, field="text")
        author = validation.bounded_text(raw.get("author", "Unknown"), max_length=255, field="author", allow_blank=True)
        image = validation.bounded_text(raw.get("image", ""), max_length=500, field="image", allow_blank=True)
        quote = Quote.objects.create(
            id=str(uuid.uuid4()),
            source=source,
            text=text,
            author=author or "Unknown",
            image=image,
        )
        _replace_tags(quote, _normalize_tags(raw.get("tags")))
        return quote


class QuoteService:
    def list(self, user, source_id, *, tag=None):
        source = _get_source(user, source_id)
        qs = Quote.objects.filter(source=source).prefetch_related("tags")
        if tag:
            qs = qs.filter(tags__tag__icontains=tag).distinct()
        return list(qs)

    def get(self, user, quote_id):
        return _get_quote(user, quote_id)

    def create(self, user, source_id, data):
        source = _get_source(user, source_id)
        return QuoteSourceService()._create_quote(user, source, data)

    def get(self, user, quote_id):
        return _get_quote(user, quote_id)

    def update(self, user, quote_id, data, *, partial=True):
        quote = _get_quote(user, quote_id)
        if "text" in data:
            quote.text = validation.bounded_text(data["text"], max_length=5000, field="text")
        if "author" in data:
            quote.author = validation.bounded_text(data["author"], max_length=255, field="author", allow_blank=True) or "Unknown"
        if "image" in data:
            quote.image = validation.bounded_text(data["image"], max_length=500, field="image", allow_blank=True)
        quote.save()
        if "tags" in data:
            _replace_tags(quote, _normalize_tags(data["tags"]))
        logger.info("quotes.update user_id=%s quote_id=%s", user.id, quote.id)
        return quote

    def delete(self, user, quote_id):
        quote = _get_quote(user, quote_id)
        quote.delete()
        logger.info("quotes.delete user_id=%s quote_id=%s", user.id, quote_id)
        return True


class QuoteTagService:
    def list(self, user):
        tags = (
            QuoteTag.objects.filter(quote__source__user=user)
            .values_list("tag", flat=True)
            .distinct()
            .order_by("tag")
        )
        return list(tags)


quote_source_service = QuoteSourceService()
quote_service = QuoteService()
quote_tag_service = QuoteTagService()