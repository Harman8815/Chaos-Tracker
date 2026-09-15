"""Centralized, reusable validation rules for domain services.

Validation here is *domain* validation (business rules), separate from
input-shape validation done by DRF serializers in the API layer.

Each rule is a small callable that raises :class:`DomainError` (specifically
``ValidationError``) on failure, so services can call them and let the API
layer translate the error into an HTTP response.
"""
from datetime import date, datetime

from .exceptions import ValidationError


# ---------------------------------------------------------------------------
# Date helpers
# ---------------------------------------------------------------------------

def parse_date(value, *, field="date"):
    """Parse a ``YYYY-MM-DD`` string into a :class:`datetime.date`.

    Raises ``ValidationError`` on bad input.
    """
    if value is None:
        raise ValidationError(f"{field} is required")
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a date string")
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        raise ValidationError(f"{field} must be in YYYY-MM-DD format")


def ensure_future_or_today(value, *, field="date"):
    """Ensure ``value`` is not in the future. Returns the normalized date."""
    d = parse_date(value, field=field)
    if d > date.today():
        raise ValidationError(f"{field} cannot be in the future")
    return d


# ---------------------------------------------------------------------------
# Numeric / range rules
# ---------------------------------------------------------------------------

def in_range(value, low, high, *, field="value"):
    """Ensure ``low <= value <= high``."""
    try:
        n = int(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{field} must be an integer")
    if n < low or n > high:
        raise ValidationError(f"{field} must be between {low} and {high}")
    return n


def non_negative_int(value, *, field="value"):
    """Ensure ``value`` is a non-negative integer."""
    try:
        n = int(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{field} must be an integer")
    if n < 0:
        raise ValidationError(f"{field} must be non-negative")
    return n


def positive_int(value, *, field="value", minimum=1):
    """Ensure ``value`` is a positive integer >= ``minimum``."""
    n = non_negative_int(value, field=field)
    if n < minimum:
        raise ValidationError(f"{field} must be at least {minimum}")
    return n


def bounded_decimal(value, *, maximum_digits=10, maximum_decimal_places=2, field="value"):
    """Ensure a decimal string/number fits within the model's schema."""
    try:
        from decimal import Decimal
        d = Decimal(str(value))
    except Exception:
        raise ValidationError(f"{field} must be a number")
    sign, digits, exponent = d.as_tuple()
    if exponent < -maximum_decimal_places:
        raise ValidationError(f"{field} has too many decimal places")
    if len(digits) > maximum_digits:
        raise ValidationError(f"{field} has too many digits")
    return d


# ---------------------------------------------------------------------------
# Text rules
# ---------------------------------------------------------------------------

def bounded_text(value, *, max_length, field="value", allow_blank=False):
    """Ensure ``value`` is a string within ``max_length``."""
    if value is None:
        if allow_blank:
            return ""
        raise ValidationError(f"{field} is required")
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string")
    if not allow_blank and not value.strip():
        raise ValidationError(f"{field} must not be blank")
    if len(value) > max_length:
        raise ValidationError(f"{field} must be at most {max_length} characters")
    return value.strip() if allow_blank else value


def choice(value, allowed, *, field="value"):
    """Ensure ``value`` is one of ``allowed``."""
    if value not in allowed:
        raise ValidationError(f"{field} must be one of: {', '.join(map(str, allowed))}")
    return value


def enum_choice(value, enum_cls, *, field="value"):
    """Ensure ``value`` is a valid member of an ``enum.Enum`` subclass."""
    try:
        return enum_cls(value)
    except ValueError:
        allowed = [e.value for e in enum_cls]
        raise ValidationError(f"{field} must be one of: {', '.join(allowed)}")


# ---------------------------------------------------------------------------
# Collection rules
# ---------------------------------------------------------------------------

def bounded_list(value, *, max_length, field="value"):
    """Ensure ``value`` is a list with at most ``max_length`` items."""
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValidationError(f"{field} must be a list")
    if len(value) > max_length:
        raise ValidationError(f"{field} must have at most {max_length} items")
    return value


def unique_items(items, *, field="value"):
    """Ensure a list has no duplicates."""
    seen = set()
    for item in items:
        key = item
        if key in seen:
            raise ValidationError(f"{field} contains duplicate items")
        seen.add(key)
    return items


def bounded_dict(value, *, max_length, field="value"):
    """Ensure ``value`` is a dict with at most ``max_length`` keys."""
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValidationError(f"{field} must be an object")
    if len(value) > max_length:
        raise ValidationError(f"{field} must have at most {max_length} keys")
    return value
