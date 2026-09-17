"""Error monitoring and structured logging utilities."""

import logging
import traceback
import json
from datetime import datetime
from typing import Dict, Any, Callable
from functools import wraps
from contextvars import ContextVar

from django.conf import settings
from django.db import connection
from django.http import HttpRequest
from django.utils.deprecation import MiddlewareMixin

# Context variable for request tracking
_request_context: ContextVar[Dict] = ContextVar("request_context", default={})


class StructuredFormatter(logging.Formatter):
    """JSON formatter for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add request context if available
        ctx = _request_context.get()
        if ctx:
            log_data["request_id"] = ctx.get("request_id")
            log_data["user_id"] = ctx.get("user_id")
            log_data["username"] = ctx.get("username")
            log_data["method"] = ctx.get("method")
            log_data["path"] = ctx.get("path")

        # Add extra fields
        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)

        # Add exception info
        if record.exc_info:
            log_data["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
                "traceback": traceback.format_exception(*record.exc_info),
            }

        return json.dumps(log_data)


class SecurityEventFilter(logging.Filter):
    """Filter to route security events to security log."""

    def filter(self, record: logging.LogRecord) -> bool:
        security_keywords = [
            "login",
            "logout",
            "auth",
            "permission",
            "csrf",
            "xss",
            "injection",
            "unauthorized",
            "forbidden",
            "suspicious",
            "brute",
            "attack",
            "breach",
            "vulnerability",
        ]
        message = record.getMessage().lower()
        return any(keyword in message for keyword in security_keywords)


def setup_error_monitoring():
    """Configure error monitoring and alerting."""
    # This would integrate with Sentry, Datadog, etc.
    # For now, we use structured logging

    # Ensure logs directory exists
    log_dir = getattr(settings, "BASE_DIR", None)
    if log_dir:
        log_dir = log_dir / "logs"
        log_dir.mkdir(exist_ok=True)


class ErrorTrackingMiddleware(MiddlewareMixin):
    """Middleware to track and log errors with context."""

    def process_request(self, request: HttpRequest):
        # Set request context
        ctx = {
            "request_id": getattr(request, "request_id", None),
            "user_id": (
                getattr(request.user, "id", None)
                if hasattr(request, "user") and request.user.is_authenticated
                else None
            ),
            "username": (
                getattr(request.user, "username", None)
                if hasattr(request, "user") and request.user.is_authenticated
                else None
            ),
            "method": request.method,
            "path": request.path,
            "ip": self._get_client_ip(request),
        }
        _request_context.set(ctx)

    def process_exception(self, request: HttpRequest, exception: Exception):
        logger = logging.getLogger("tracker.errors")
        logger.error(
            f"Unhandled exception: {exception}",
            extra={
                "extra_data": {
                    "exception_type": type(exception).__name__,
                    "request_method": request.method,
                    "request_path": request.path,
                    "request_ip": self._get_client_ip(request),
                    "user_id": (
                        getattr(request.user, "id", None)
                        if hasattr(request, "user") and request.user.is_authenticated
                        else None
                    ),
                }
            },
            exc_info=True,
        )
        return None

    def _get_client_ip(self, request: HttpRequest) -> str:
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "")


def log_error(
    logger: logging.Logger,
    message: str,
    exception: Exception = None,
    context: Dict = None,
    level: int = logging.ERROR,
):
    """Log error with structured context."""
    extra = {"extra_data": context or {}}
    if exception:
        extra["extra_data"]["exception_type"] = type(exception).__name__
        extra["extra_data"]["exception_message"] = str(exception)
    logger.log(level, message, extra=extra, exc_info=exception is not None)


def log_security_event(
    event_type: str,
    message: str,
    request: HttpRequest = None,
    user_id: int = None,
    severity: str = "warning",
    details: Dict = None,
):
    """Log security-relevant event."""
    logger = logging.getLogger("django.security")

    extra = {
        "extra_data": {
            "security_event": True,
            "event_type": event_type,
            "severity": severity,
            "details": details or {},
        }
    }

    if request:
        extra["extra_data"]["request_method"] = request.method
        extra["extra_data"]["request_path"] = request.path
        extra["extra_data"]["request_ip"] = request.META.get("REMOTE_ADDR", "")
        extra["extra_data"]["user_agent"] = request.META.get("HTTP_USER_AGENT", "")

    if user_id:
        extra["extra_data"]["user_id"] = user_id

    level_map = {
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }

    logger.log(level_map.get(severity, logging.WARNING), message, extra=extra)


def log_audit_event(
    action: str,
    resource_type: str,
    resource_id: str,
    user_id: int,
    request: HttpRequest = None,
    success: bool = True,
    details: Dict = None,
):
    """Log audit trail event."""
    logger = logging.getLogger("tracker.audit")

    extra = {
        "extra_data": {
            "audit_event": True,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "user_id": user_id,
            "success": success,
            "details": details or {},
        }
    }

    if request:
        extra["extra_data"]["request_ip"] = request.META.get("REMOTE_ADDR", "")
        extra["extra_data"]["user_agent"] = request.META.get("HTTP_USER_AGENT", "")

    level = logging.INFO if success else logging.WARNING
    logger.log(
        level, f"Audit: {action} {resource_type}#{resource_id} by user#{user_id}", extra=extra
    )


def monitor_performance(threshold_seconds: float = 1.0):
    """Decorator to monitor function performance."""

    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            import time

            start = time.perf_counter()
            try:
                return func(*args, **kwargs)
            finally:
                elapsed = time.perf_counter() - start
                if elapsed > threshold_seconds:
                    logger = logging.getLogger("tracker.performance")
                    logger.warning(
                        f"Slow operation: {func.__module__}.{func.__name__} took {elapsed:.3f}s",
                        extra={
                            "extra_data": {
                                "function": f"{func.__module__}.{func.__name__}",
                                "duration_seconds": elapsed,
                                "threshold_seconds": threshold_seconds,
                                "args_count": len(args),
                                "kwargs_keys": list(kwargs.keys()),
                            }
                        },
                    )

        return wrapper

    return decorator


class HealthCheck:
    """Application health check utilities."""

    @staticmethod
    def check_database() -> Dict[str, Any]:
        """Check database connectivity."""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "database": str(e)}

    @staticmethod
    def check_cache() -> Dict[str, Any]:
        """Check cache connectivity."""
        try:
            from django.core.cache import cache

            cache.set("health_check", "ok", 10)
            result = cache.get("health_check")
            if result == "ok":
                return {"status": "healthy", "cache": "connected"}
            return {"status": "degraded", "cache": "not responding"}
        except Exception as e:
            return {"status": "unhealthy", "cache": str(e)}

    @staticmethod
    def check_disk_space(path: str = "/", threshold_percent: float = 90) -> Dict[str, Any]:
        """Check disk space."""
        try:
            import shutil

            total, used, free = shutil.disk_usage(path)
            used_percent = (used / total) * 100
            status = "healthy" if used_percent < threshold_percent else "warning"
            return {
                "status": status,
                "disk": {
                    "total_gb": round(total / (1024**3), 2),
                    "used_gb": round(used / (1024**3), 2),
                    "free_gb": round(free / (1024**3), 2),
                    "used_percent": round(used_percent, 1),
                },
            }
        except Exception as e:
            return {"status": "unknown", "disk": str(e)}

    @staticmethod
    def run_all() -> Dict[str, Any]:
        """Run all health checks."""
        return {
            "database": HealthCheck.check_database(),
            "cache": HealthCheck.check_cache(),
            "disk": HealthCheck.check_disk_space(),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }


# Error tracking decorators
def track_errors(operation_name: str = None):
    """Decorator to track and log errors automatically."""

    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            op_name = operation_name or f"{func.__module__}.{func.__name__}"
            logger = logging.getLogger("tracker.operations")
            try:
                result = func(*args, **kwargs)
                logger.info(f"Operation succeeded: {op_name}")
                return result
            except Exception as e:
                logger.error(
                    f"Operation failed: {op_name}",
                    extra={
                        "extra_data": {
                            "operation": op_name,
                            "exception_type": type(e).__name__,
                            "exception_message": str(e),
                        }
                    },
                    exc_info=True,
                )
                raise

        return wrapper

    return decorator


def track_async_errors(operation_name: str = None):
    """Decorator for async functions."""

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            op_name = operation_name or f"{func.__module__}.{func.__name__}"
            logger = logging.getLogger("tracker.operations")
            try:
                result = await func(*args, **kwargs)
                logger.info(f"Async operation succeeded: {op_name}")
                return result
            except Exception as e:
                logger.error(
                    f"Async operation failed: {op_name}",
                    extra={
                        "extra_data": {
                            "operation": op_name,
                            "exception_type": type(e).__name__,
                            "exception_message": str(e),
                        }
                    },
                    exc_info=True,
                )
                raise

        return wrapper

    return decorator
