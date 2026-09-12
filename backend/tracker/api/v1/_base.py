"""Base classes for thin API controllers (v1).

Controllers here do exactly three things:
  1. Parse request data / query params (DRF serializers).
  2. Call the appropriate domain service.
  3. Translate :class:`DomainError` into HTTP responses.

All business rules live in :mod:`tracker.domain.services`.
"""
from rest_framework import status
from rest_framework.response import Response

from ...domain.exceptions import DomainError
from ...domain.logging import set_request_context, new_request_id
from ...utils import success_response, error_response


class TrackerAPIView:
    """Mixin providing request-context injection and error mapping."""

    def initial(self, request, *args, **kwargs):
        # Inject structured logging context for the whole request.
        ctx = {
            "request_id": new_request_id(),
            "user_id": getattr(request.user, "id", None),
            "username": getattr(request.user, "username", None),
            "method": request.method,
            "path": request.path,
        }
        set_request_context(ctx)
        super().initial(request, *args, **kwargs)

    def handle_domain_error(self, exc: DomainError):
        """Translate a :class:`DomainError` into a DRF ``Response``."""
        payload = {
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
            },
        }
        if exc.details is not None:
            payload["error"]["details"] = exc.details
        return Response(payload, status=exc.http_status)

    def ok(self, data=None, message=None, count=None, status_code=status.HTTP_200_OK):
        return success_response(
            data=data, message=message, count=count, status_code=status_code,
        )

    def fail(self, exc: DomainError):
        return self.handle_domain_error(exc)


def domain_exception_handler(exc, context=None):
    """DRF exception handler that maps :class:`DomainError` to HTTP."""
    if isinstance(exc, DomainError):
        payload = {
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
            },
        }
        if exc.details is not None:
            payload["error"]["details"] = exc.details
        return Response(payload, status=exc.http_status)
    return None