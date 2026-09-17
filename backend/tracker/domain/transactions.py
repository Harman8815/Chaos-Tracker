"""Transaction management for atomic multi-model operations.

Domain services that touch more than one model should wrap the whole
operation in :func:`atomic`. This keeps behavior consistent and makes
rollback semantics explicit.
"""

from contextlib import contextmanager
from django.db import transaction


@contextmanager
def atomic(using=None):
    """Context manager wrapping ``django.db.transaction.atomic``.

    Usage::

        with atomic():
            habit = create_habit(user, ...)
            score = record_score(user, habit, date, value)
    """
    with transaction.atomic(using=using) as atomic_block:
        yield atomic_block


def atomic_decorator(view_func):
    """Decorator variant for use on service methods."""
    return transaction.atomic(view_func)
