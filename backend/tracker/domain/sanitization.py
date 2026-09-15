"""Centralized input sanitization and validation utilities.

Provides reusable validation functions for API inputs, including:
- HTML/XSS sanitization
- SQL injection prevention
- Path traversal prevention
- Length and format validation
- Type coercion with safety
"""
import re
import html
from typing import Any, Optional, List, Dict, Union
from urllib.parse import urlparse

from .exceptions import ValidationError


XSS_PATTERNS = [
    re.compile(r'<script[^>]*>.*?</script>', re.IGNORECASE | re.DOTALL),
    re.compile(r'javascript:', re.IGNORECASE),
    re.compile(r'on\w+\s*=', re.IGNORECASE),
    re.compile(r'<iframe[^>]*>', re.IGNORECASE),
    re.compile(r'<object[^>]*>', re.IGNORECASE),
    re.compile(r'<embed[^>]*>', re.IGNORECASE),
    re.compile(r'<form[^>]*>', re.IGNORECASE),
    re.compile(r'expression\s*\(', re.IGNORECASE),
    re.compile(r'vbscript:', re.IGNORECASE),
    re.compile(r'data:', re.IGNORECASE),
]

SQL_INJECTION_PATTERNS = [
    re.compile(r"(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)", re.IGNORECASE),
    re.compile(r"\bdrop\s+table\b", re.IGNORECASE),
    re.compile(r"\binsert\s+into\b", re.IGNORECASE),
    re.compile(r"\bdelete\s+from\b", re.IGNORECASE),
    re.compile(r"\bupdate\s+.*\bset\b", re.IGNORECASE),
    re.compile(r"';\s*--", re.IGNORECASE),
    re.compile(r"\bor\s+1\s*=\s*1\b", re.IGNORECASE),
    re.compile(r"\band\s+1\s*=\s*1\b", re.IGNORECASE),
    re.compile(r";\s*(drop|delete|insert|update|create|alter|exec)\b", re.IGNORECASE),
]

PATH_TRAVERSAL_PATTERNS = [
    re.compile(r'\.\./'),
    re.compile(r'\.\.\\'),
    re.compile(r'%2e%2e%2f', re.IGNORECASE),
    re.compile(r'%2e%2e%5c', re.IGNORECASE),
    re.compile(r'\.\.%2f', re.IGNORECASE),
    re.compile(r'\.\.%5c', re.IGNORECASE),
]


def sanitize_html(value: str, *, allow_basic_formatting: bool = False) -> str:
    """Sanitize HTML to prevent XSS attacks.

    Args:
        value: Input string to sanitize
        allow_basic_formatting: If True, allow <b>, <i>, <u>, <em>, <strong>

    Returns:
        Sanitized string safe for HTML rendering
    """
    if not isinstance(value, str):
        return str(value)

    escaped = html.escape(value)

    if allow_basic_formatting:
        escaped = escaped.replace('<b>', '<b>').replace('</b>', '</b>')
        escaped = escaped.replace('<i>', '<i>').replace('</i>', '</i>')
        escaped = escaped.replace('<u>', '<u>').replace('</u>', '</u>')
        escaped = escaped.replace('<em>', '<em>').replace('</em>', '</em>')
        escaped = escaped.replace('<strong>', '<strong>').replace('</strong>', '</strong>')

    return escaped


def strip_xss(value: str) -> str:
    """Aggressively strip XSS patterns from input.

    Use this for inputs that will be rendered in HTML contexts.
    """
    if not isinstance(value, str):
        return str(value)

    result = value
    for pattern in XSS_PATTERNS:
        result = pattern.sub('', result)
    return result


def check_sql_injection(value: str) -> bool:
    """Check if input contains potential SQL injection patterns.

    Returns True if suspicious patterns detected.
    """
    if not isinstance(value, str):
        return False
    for pattern in SQL_INJECTION_PATTERNS:
        if pattern.search(value):
            return True
    return False


def check_path_traversal(value: str) -> bool:
    """Check if input contains path traversal patterns.

    Returns True if suspicious patterns detected.
    """
    if not isinstance(value, str):
        return False
    for pattern in PATH_TRAVERSAL_PATTERNS:
        if pattern.search(value):
            return True
    return False


def validate_safe_string(
    value: Any,
    *,
    field: str = "value",
    max_length: Optional[int] = None,
    min_length: int = 0,
    allow_empty: bool = False,
    allow_html: bool = False,
    check_xss: bool = True,
    check_sql: bool = True,
    check_path: bool = True,
    pattern: Optional[str] = None,
) -> str:
    """Comprehensive string validation with security checks.

    Raises ValidationError on any failure.
    """
    if value is None:
        if allow_empty:
            return ""
        raise ValidationError(f"{field} is required")

    if not isinstance(value, str):
        value = str(value)

    if not allow_empty and not value.strip():
        raise ValidationError(f"{field} must not be blank")

    if max_length is not None and len(value) > max_length:
        raise ValidationError(f"{field} must be at most {max_length} characters")

    if len(value) < min_length:
        raise ValidationError(f"{field} must be at least {min_length} characters")

    if check_xss and any(p.search(value) for p in XSS_PATTERNS):
        raise ValidationError(f"{field} contains potentially unsafe content")

    if check_sql and check_sql_injection(value):
        raise ValidationError(f"{field} contains potentially unsafe SQL patterns")

    if check_path and check_path_traversal(value):
        raise ValidationError(f"{field} contains potentially unsafe path patterns")

    if pattern and not re.match(pattern, value):
        raise ValidationError(f"{field} format is invalid")

    if not allow_html:
        value = sanitize_html(value)

    return value.strip()


def validate_integer(
    value: Any,
    *,
    field: str = "value",
    minimum: Optional[int] = None,
    maximum: Optional[int] = None,
) -> int:
    """Validate and coerce to integer."""
    try:
        result = int(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{field} must be an integer")

    if minimum is not None and result < minimum:
        raise ValidationError(f"{field} must be at least {minimum}")
    if maximum is not None and result > maximum:
        raise ValidationError(f"{field} must be at most {maximum}")
    return result


def validate_decimal(
    value: Any,
    *,
    field: str = "value",
    max_digits: int = 10,
    max_decimal_places: int = 2,
    minimum: Optional[float] = None,
    maximum: Optional[float] = None,
) -> float:
    """Validate and coerce to decimal/float."""
    try:
        result = float(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{field} must be a number")

    if minimum is not None and result < minimum:
        raise ValidationError(f"{field} must be at least {minimum}")
    if maximum is not None and result > maximum:
        raise ValidationError(f"{field} must be at most {maximum}")

    str_val = str(value)
    if '.' in str_val:
        decimal_places = len(str_val.split('.')[1])
        if decimal_places > max_decimal_places:
            raise ValidationError(f"{field} has too many decimal places (max {max_decimal_places})")

    return result


def validate_boolean(value: Any, *, field: str = "value") -> bool:
    """Validate and coerce to boolean."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        if value.lower() in ('true', '1', 'yes', 'on'):
            return True
        if value.lower() in ('false', '0', 'no', 'off'):
            return False
    if isinstance(value, int):
        return bool(value)
    raise ValidationError(f"{field} must be a boolean")


def validate_list(
    value: Any,
    *,
    field: str = "value",
    item_validator=None,
    max_length: Optional[int] = None,
    min_length: int = 0,
    unique: bool = False,
) -> List:
    """Validate list input with optional item validation."""
    if value is None:
        return []
    if not isinstance(value, list):
        raise ValidationError(f"{field} must be a list")

    if len(value) < min_length:
        raise ValidationError(f"{field} must have at least {min_length} items")
    if max_length is not None and len(value) > max_length:
        raise ValidationError(f"{field} must have at most {max_length} items")

    if unique:
        seen = set()
        for item in value:
            key = str(item)
            if key in seen:
                raise ValidationError(f"{field} contains duplicate items")
            seen.add(key)

    if item_validator:
        return [item_validator(item) for item in value]

    return value


def validate_dict(
    value: Any,
    *,
    field: str = "value",
    required_keys: Optional[List[str]] = None,
    allowed_keys: Optional[List[str]] = None,
    max_keys: Optional[int] = None,
) -> Dict:
    """Validate dict input with key constraints."""
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValidationError(f"{field} must be an object")

    if max_keys is not None and len(value) > max_keys:
        raise ValidationError(f"{field} must have at most {max_keys} keys")

    if required_keys:
        for key in required_keys:
            if key not in value:
                raise ValidationError(f"{field} missing required key: {key}")

    if allowed_keys:
        for key in value:
            if key not in allowed_keys:
                raise ValidationError(f"{field} contains disallowed key: {key}")

    return value


def validate_url(value: Any, *, field: str = "value", allowed_schemes: Optional[List[str]] = None) -> str:
    """Validate URL format and scheme."""
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string")

    try:
        parsed = urlparse(value)
        if not parsed.scheme or not parsed.netloc:
            raise ValidationError(f"{field} must be a valid URL")
        if allowed_schemes and parsed.scheme not in allowed_schemes:
            raise ValidationError(f"{field} must use one of: {', '.join(allowed_schemes)}")
    except Exception:
        raise ValidationError(f"{field} must be a valid URL")

    return value


def validate_email(value: Any, *, field: str = "value") -> str:
    """Basic email validation."""
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string")
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if not email_pattern.match(value):
        raise ValidationError(f"{field} must be a valid email address")
    return value.lower()


def validate_iso_date(value: Any, *, field: str = "value") -> str:
    """Validate ISO 8601 date string (YYYY-MM-DD)."""
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string")
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', value):
        raise ValidationError(f"{field} must be in YYYY-MM-DD format")
    try:
        from datetime import datetime
        datetime.strptime(value, '%Y-%m-%d')
    except ValueError:
        raise ValidationError(f"{field} is not a valid date")
    return value


def validate_uuid(value: Any, *, field: str = "value") -> str:
    """Validate UUID format."""
    if not isinstance(value, str):
        raise ValidationError(f"{field} must be a string")
    uuid_pattern = re.compile(
        r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        re.IGNORECASE
    )
    if not uuid_pattern.match(value):
        raise ValidationError(f"{field} must be a valid UUID")
    return value.lower()


class InputValidator:
    """Convenience class for validating request data in bulk."""

    def __init__(self, data: Dict[str, Any]):
        self.data = data or {}
        self.errors: Dict[str, str] = {}

    def get_string(self, key: str, **kwargs) -> Optional[str]:
        value = self.data.get(key)
        try:
            return validate_safe_string(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_int(self, key: str, **kwargs) -> Optional[int]:
        value = self.data.get(key)
        try:
            return validate_integer(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_float(self, key: str, **kwargs) -> Optional[float]:
        value = self.data.get(key)
        try:
            return validate_decimal(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_bool(self, key: str, **kwargs) -> Optional[bool]:
        value = self.data.get(key)
        try:
            return validate_boolean(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_list(self, key: str, **kwargs) -> Optional[List]:
        value = self.data.get(key)
        try:
            return validate_list(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_dict(self, key: str, **kwargs) -> Optional[Dict]:
        value = self.data.get(key)
        try:
            return validate_dict(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_date(self, key: str, **kwargs) -> Optional[str]:
        value = self.data.get(key)
        try:
            return validate_iso_date(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_email(self, key: str, **kwargs) -> Optional[str]:
        value = self.data.get(key)
        try:
            return validate_email(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_url(self, key: str, **kwargs) -> Optional[str]:
        value = self.data.get(key)
        try:
            return validate_url(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def get_uuid(self, key: str, **kwargs) -> Optional[str]:
        value = self.data.get(key)
        try:
            return validate_uuid(value, field=key, **kwargs)
        except ValidationError as e:
            self.errors[key] = str(e)
            return None

    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def get_errors(self) -> Dict[str, str]:
        return self.errors

    def raise_if_invalid(self) -> None:
        if self.errors:
            raise ValidationError("Validation failed", details=self.errors)