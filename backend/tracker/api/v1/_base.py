"""Base classes for thin API controllers (v1).

Controllers here do exactly three things:
  1. Parse request data / query params (DRF serializers).
  2. Call the appropriate domain service.
  3. Translate :class:`DomainError` into HTTP responses.

All business rules live in :mod:`tracker.domain.services`.
"""

from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ...domain.exceptions import DomainError, ValidationError as DomainValidationError
from ...domain.logging import set_request_context, new_request_id
from ...utils import success_response
from ..versions import API_VERSION_HEADER, SUPPORTED_API_VERSIONS


class TrackerAPIView(APIView):
    """Thin authenticated controller base with domain error mapping."""

    permission_classes = [IsAuthenticated]

    def initial(self, request, *args, **kwargs):
        ctx = {
            "request_id": new_request_id(),
            "user_id": getattr(request.user, "id", None),
            "username": getattr(request.user, "username", None),
            "method": request.method,
            "path": request.path,
        }
        set_request_context(ctx)
        super().initial(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        version = getattr(request, "version", None)
        if version in SUPPORTED_API_VERSIONS:
            response[API_VERSION_HEADER] = version
        return response

    def validated_query(self, serializer_class):
        serializer = serializer_class(data=self.request.query_params)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def handle_exception(self, exc):
        if isinstance(exc, DomainError):
            return self.handle_domain_error(exc)
        if isinstance(exc, DRFValidationError):
            domain_error = DomainValidationError(
                "Invalid request parameters",
                details=exc.detail,
            )
            return self.handle_domain_error(domain_error)
        return super().handle_exception(exc)

    def get(self, request, *args, **kwargs):
        handler = getattr(self, "retrieve", None)
        if handler is None:
            handler = getattr(self, "list", None)
        if handler is None:
            return super().get(request, *args, **kwargs)
        return handler(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def handle_domain_error(self, exc: DomainError):
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
            data=data,
            message=message,
            count=count,
            status_code=status_code,
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
