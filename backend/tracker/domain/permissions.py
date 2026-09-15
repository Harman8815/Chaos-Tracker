"""Centralized ownership/permission enforcement.

Every domain operation that touches a user-scoped model must verify the
requesting user owns the object. Ownership is checked through the
``user`` foreign-key field that every domain model exposes.

Use :func:`require_owner` (or :class:`OwnerRequired`) inside services.
"""
from .exceptions import PermissionError, NotFoundError


def owner_of(instance):
    """Return the owning ``User`` for ``instance`` or ``None``.

    Models expose ownership through a ``user`` FK. This helper is tolerant
    of objects that do not carry a ``user`` attribute (e.g. ``PlannerTask``
    which is owned transitively through its block).
    """
    user = getattr(instance, "user", None)
    if user is not None:
        return user
    # PlannerTask is owned through its block
    block = getattr(instance, "block", None)
    if block is not None:
        return getattr(block, "user", None)
    return None


def require_owner(instance, requesting_user, *, label="Object"):
    """Raise :class:`NotFoundError` if ``instance`` is missing and
    :class:`PermissionError` if the requesting user does not own it.

    Using ``NotFoundError`` (not ``PermissionError``) for missing objects
    prevents user-enumeration attacks.
    """
    if instance is None:
        raise NotFoundError(f"{label} not found")
    if owner_of(instance) != requesting_user:
        raise PermissionError(f"You do not have permission to access this {label.lower()}")
    return instance


def require_owns(queryset_or_owner, requesting_user, *, label="Object"):
    """Convenience wrapper that accepts either a queryset owner check or
    a single object. Returns ``True`` when ownership is satisfied.
    """
    # If given a model instance, check directly
    if hasattr(queryset_or_owner, "user") or hasattr(queryset_or_owner, "block"):
        return require_owner(queryset_or_owner, requesting_user, label=label)
    raise TypeError("require_owns expects a model instance with a user/block owner")
