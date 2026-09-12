"""Standardized domain exceptions.

Every domain service raises :class:`DomainError` subclasses instead of
``PermissionError`` / ``Http404`` / ``ValueError``. The API layer maps
these to predictable HTTP responses via :class:`domain_exception_handler`.
"""
from rest_framework import status


class DomainError(Exception):
    """Base class for all recoverable domain errors.

    Attributes
    ----------
    code : str
        Stable machine-readable code (e.g. ``"NOT_FOUND"``).
    http_status : int
        HTTP status code to map the error to.
    details : object | None
        Optional structured detail payload.
    """

    code = "DOMAIN_ERROR"
    http_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    details = None

    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details

    def __str__(self):
        return self.message


class NotFoundError(DomainError):
    """Raised when a referenced object does not exist or is not owned."""

    code = "NOT_FOUND"
    http_status = status.HTTP_404_NOT_FOUND

    def __init__(self, message="Object not found", details=None):
        super().__init__(message, details)


class PermissionError(DomainError):
    """Raised when the requesting user may not perform the operation."""

    code = "PERMISSION_DENIED"
    http_status = status.HTTP_403_FORBIDDEN

    def __init__(self, message="Permission denied", details=None):
        super().__init__(message, details)


class ValidationError(DomainError):
    """Raised when domain rules reject the input data."""

    code = "VALIDATION_ERROR"
    http_status = status.HTTP_400_BAD_REQUEST

    def __init__(self, message="Validation failed", details=None):
        super().__init__(message, details)


class ConflictError(DomainError):
    """Raised when an operation conflicts with current state (e.g. duplicate)."""

    code = "CONFLICT"
    http_status = status.HTTP_409_CONFLICT

    def __init__(self, message="Conflict", details=None):
        super().__init__(message, details)


class RateLimitError(DomainError):
    """Raised when an operation is throttled."""

    code = "RATE_LIMITED"
    http_status = status.HTTP_429_TOO_MANY_REQUESTS

    def __init__(self, message="Too many requests", details=None):
        super().__init__(message, details)


def to_http_response(error: DomainError):
    """Convert a :class:`DomainError` into a DRF ``Response``.

    Used by the API layer so HTTP mapping stays in one place.
    """
    from rest_framework.response import Response

    payload = {
        "success": False,
        "error": {
            "code": error.code,
            "message": error.message,
        },
    }
    if error.details is not None:
        payload["error"]["details"] = error.details
    return Response(payload, status=error.http_status)