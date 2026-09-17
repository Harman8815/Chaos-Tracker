"""AI Tool system and permission layer (P7-05, P7-06)."""

from typing import Callable, Dict, List, Optional
from django.utils import timezone
from django.db import transaction

from ...models import AITool, AIToolCall, AIActionConfirmation, User
from ..exceptions import PermissionError as DomainPermissionError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.ai_tools")


class ToolPermissionError(DomainPermissionError):
    pass


class ToolExecutor:
    """Executes AI tools with permission checking."""

    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._schemas: Dict[str, dict] = {}

    def register(
        self,
        name: str,
        func: Callable,
        schema: dict,
        required_permissions: List[str] = None,
        is_destructive: bool = False,
    ):
        """Register a tool function with its schema and permissions."""
        self._tools[name] = func
        self._schemas[name] = schema

        # Sync with database. This may run before migrations are applied
        # (e.g. during ``manage.py check`` on a fresh database), so failure
        # here must not break import or system checks.
        try:
            AITool.objects.update_or_create(
                name=name,
                defaults={
                    "description": schema.get("description", ""),
                    "parameters_schema": schema.get("parameters", {}),
                    "required_permissions": required_permissions or [],
                    "is_destructive": is_destructive,
                    "is_enabled": True,
                },
            )
        except Exception:
            # Database not ready (table missing) or unavailable; registration
            # in memory still succeeded, so the tool remains callable later.
            logger.debug("ai_tool.registered db_sync_skipped name=%s", name)
        else:
            logger.info("ai_tool.registered name=%s destructive=%s", name, is_destructive)

    def get_tool(self, name: str) -> Optional[AITool]:
        """Get tool definition from database."""
        return AITool.objects.filter(name=name, is_enabled=True).first()

    def list_tools(self, user: User) -> List[dict]:
        """List available tools for user based on permissions."""
        tools = []
        for tool in AITool.objects.filter(is_enabled=True):
            if self._user_has_permissions(user, tool.required_permissions):
                tools.append(
                    {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.parameters_schema,
                        "is_destructive": tool.is_destructive,
                    }
                )
        return tools

    def _user_has_permissions(self, user: User, required: List[str]) -> bool:
        """Check if user has required permissions."""
        if not required:
            return True
        # For now, all authenticated users have all permissions
        # Extend with actual permission system later
        return True

    def execute(
        self,
        user: User,
        conversation_id: int,
        tool_name: str,
        arguments: dict,
        message_id: int = None,
        requires_confirmation: bool = False,
    ) -> AIToolCall:
        """Execute a tool call with permission checking."""
        tool_def = self.get_tool(tool_name)
        if not tool_def:
            raise ValidationError(f"Tool not found or disabled: {tool_name}")

        # Check permissions
        if not self._user_has_permissions(user, tool_def.required_permissions):
            raise ToolPermissionError(f"Insufficient permissions for tool: {tool_name}")

        # Create tool call record
        with transaction.atomic():
            tool_call = AIToolCall.objects.create(
                conversation_id=conversation_id,
                message_id=message_id,
                tool=tool_def,
                arguments=arguments,
                status="pending",
                requires_confirmation=requires_confirmation or tool_def.is_destructive,
            )

            # If destructive, create confirmation record
            if tool_call.requires_confirmation:
                expires_at = timezone.now() + timezone.timedelta(minutes=5)
                AIActionConfirmation.objects.create(
                    tool_call=tool_call,
                    user=user,
                    expires_at=expires_at,
                )
                tool_call.status = "pending"
                tool_call.save(update_fields=["status"])
                return tool_call

        # Execute immediately if no confirmation needed
        return self._execute_tool_call(tool_call, user)

    def _execute_tool_call(self, tool_call: AIToolCall, user: User) -> AIToolCall:
        """Internal method to execute the tool function."""
        tool_name = tool_call.tool.name
        func = self._tools.get(tool_name)

        if not func:
            tool_call.status = "failed"
            tool_call.error = f"Tool function not registered: {tool_name}"
            tool_call.save(update_fields=["status", "error"])
            return tool_call

        tool_call.status = "executing"
        tool_call.save(update_fields=["status"])

        try:
            result = func(user, **tool_call.arguments)
            tool_call.status = "completed"
            tool_call.result = result
            tool_call.executed_at = timezone.now()
            tool_call.save(update_fields=["status", "result", "executed_at"])
            logger.info(
                "ai_tool.executed name=%s conversation_id=%s", tool_name, tool_call.conversation_id
            )
        except Exception as e:
            tool_call.status = "failed"
            tool_call.error = str(e)
            tool_call.save(update_fields=["status", "error"])
            logger.error("ai_tool.failed name=%s error=%s", tool_name, e)

        return tool_call

    def confirm_and_execute(self, user: User, tool_call_id: int, confirmed: bool) -> AIToolCall:
        """Confirm a pending destructive tool call and execute if confirmed."""
        try:
            confirmation = AIActionConfirmation.objects.select_related("tool_call").get(
                tool_call_id=tool_call_id, user=user
            )
        except AIActionConfirmation.DoesNotExist:
            raise ValidationError("Confirmation not found")

        if confirmation.confirmed:
            raise ValidationError("Already confirmed")

        if timezone.now() > confirmation.expires_at:
            confirmation.tool_call.status = "cancelled"
            confirmation.tool_call.save(update_fields=["status"])
            raise ValidationError("Confirmation expired")

        if not confirmed:
            confirmation.tool_call.status = "cancelled"
            confirmation.tool_call.save(update_fields=["status"])
            confirmation.confirmed = False
            confirmation.confirmed_at = timezone.now()
            confirmation.save(update_fields=["confirmed", "confirmed_at"])
            return confirmation.tool_call

        # Execute the tool call
        confirmation.confirmed = True
        confirmation.confirmed_at = timezone.now()
        confirmation.save(update_fields=["confirmed", "confirmed_at"])

        return self._execute_tool_call(confirmation.tool_call, user)


# Global tool executor instance
tool_executor = ToolExecutor()
