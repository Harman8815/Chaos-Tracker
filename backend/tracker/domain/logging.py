"""Structured logging helpers.

Every log record carries a consistent context so operators can filter
by request id, user, and operation. The API middleware injects the
``request`` context; services receive an explicit ``context`` dict.
"""
import logging
import uuid
from contextvars import ContextVar

# Per-request context, populated by API middleware.
_request_context: ContextVar[dict] = ContextVar("request_context", default={})


def get_request_context() -> dict:
    return dict(_request_context.get())


def set_request_context(ctx: dict) -> None:
    _request_context.set(dict(ctx))


def clear_request_context() -> None:
    _request_context.set({})


class StructuredLogger:
    """Logger wrapper that merges static context into every record."""

    def __init__(self, name: str, *, static_context: dict | None = None):
        self._logger = logging.getLogger(name)
        self._static = static_context or {}

    def _extra(self, **kwargs) -> dict:
        ctx = {**self._static, **get_request_context()}
        ctx.update(kwargs)
        return {"extra": ctx}

    def _log(self, level, msg, *args, **kwargs):
        extra = self._extra(**{k: v for k, v in kwargs.items() if k != "exc_info"})
        exc_info = kwargs.pop("exc_info", None)
        return self._logger.log(level, msg, *args, extra=extra, exc_info=exc_info)

    def debug(self, msg, *args, **kwargs):
        return self._log(logging.DEBUG, msg, *args, **kwargs)

    def info(self, msg, *args, **kwargs):
        return self._log(logging.INFO, msg, *args, **kwargs)

    def warning(self, msg, *args, **kwargs):
        return self._log(logging.WARNING, msg, *args, **kwargs)

    def error(self, msg, *args, **kwargs):
        return self._log(logging.ERROR, msg, *args, **kwargs)

    def exception(self, msg, *args, **kwargs):
        kwargs.setdefault("exc_info", True)
        return self._log(logging.ERROR, msg, *args, **kwargs)


def get_logger(name: str, **static_context) -> StructuredLogger:
    return StructuredLogger(name, static_context=static_context)


def new_request_id() -> str:
    return uuid.uuid4().hex
