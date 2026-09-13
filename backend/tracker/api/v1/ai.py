"""Thin v1 controller for AI assistant endpoints."""
from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response

from ._base import TrackerAPIView
from ...domain.services import (
    ai_assistant_service,
    tool_executor,
    register_builtin_tools,
)
from ...serializers import (
    AIConversationSerializer,
    AIConversationDetailSerializer,
    AIMessageSerializer,
    AIToolSerializer,
    AIToolCallSerializer,
    AIActionConfirmationSerializer,
)


class AIConversationQuerySerializer(serializers.Serializer):
    status = serializers.CharField(required=False, max_length=20, allow_blank=True, default='active')
    limit = serializers.IntegerField(required=False, min_value=1, max_value=100, default=50)
    offset = serializers.IntegerField(required=False, min_value=0, default=0)


class AIConversationListCreateView(TrackerAPIView):
    """GET/POST /api/v1/ai/conversations/ - List or create conversations"""
    
    def get(self, request):
        query = self.validated_query(AIConversationQuerySerializer)
        conversations = ai_assistant_service.list_conversations(
            request.user,
            status=query.get("status", "active"),
            limit=query.get("limit", 50),
        )
        # Apply offset manually
        offset = query.get("offset", 0)
        conversations = conversations[offset:offset + query.get("limit", 50)]
        serializer = AIConversationSerializer(conversations, many=True)
        return self.ok(data=serializer.data, count=len(conversations))

    def post(self, request):
        title = request.data.get("title", "")
        model = request.data.get("model", "gemini-2.5-flash")
        conversation = ai_assistant_service.create_conversation(request.user, title, model)
        serializer = AIConversationDetailSerializer(conversation)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class AIConversationDetailView(TrackerAPIView):
    """GET/PUT/DELETE /api/v1/ai/conversations/<id>/ - Conversation detail"""
    
    def get(self, request, id):
        conversation = ai_assistant_service.get_conversation(request.user, int(id))
        if not conversation:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)
        serializer = AIConversationDetailSerializer(conversation)
        return self.ok(data=serializer.data)

    def put(self, request, id):
        title = request.data.get("title")
        if title is None:
            return self.error("title is required", status_code=status.HTTP_400_BAD_REQUEST)
        conversation = ai_assistant_service.update_conversation_title(request.user, int(id), title)
        if not conversation:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)
        serializer = AIConversationDetailSerializer(conversation)
        return self.ok(data=serializer.data, message="Conversation updated")

    def delete(self, request, id):
        hard = request.query_params.get("hard", "false").lower() == "true"
        success = ai_assistant_service.delete_conversation(request.user, int(id), hard=hard)
        if not success:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)
        return self.ok(message="Conversation deleted", status_code=status.HTTP_204_NO_CONTENT)


class AIConversationArchiveView(TrackerAPIView):
    """POST /api/v1/ai/conversations/<id>/archive/ - Archive conversation"""
    
    def post(self, request, id):
        success = ai_assistant_service.archive_conversation(request.user, int(id))
        if not success:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)
        return self.ok(message="Conversation archived")


class AIMessageSerializer_view(serializers.Serializer):
    content = serializers.CharField()
    role = serializers.ChoiceField(choices=['user', 'assistant', 'system'], default='user')


class AIChatView(TrackerAPIView):
    """POST /api/v1/ai/conversations/<id>/chat/ - Send message and get AI response"""
    
    def post(self, request, id):
        serializer = AIMessageSerializer_view(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = serializer.validated_data["content"]
        
        result = ai_assistant_service.process_user_message(request.user, int(id), content)
        return self.ok(data=result)


class AIMessageListView(TrackerAPIView):
    """GET /api/v1/ai/conversations/<id>/messages/ - List messages"""
    
    class MessageQuerySerializer(serializers.Serializer):
        limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=100)
        offset = serializers.IntegerField(required=False, min_value=0, default=0)

    def get(self, request, id):
        query = self.validated_query(self.MessageQuerySerializer)
        conversation = ai_assistant_service.get_conversation(request.user, int(id))
        if not conversation:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)
        
        messages = ai_assistant_service.get_messages(request.user, int(id), query.get("limit", 100))
        serializer = AIMessageSerializer(messages, many=True)
        return self.ok(data=serializer.data, count=len(messages))


class AIToolListView(TrackerAPIView):
    """GET /api/v1/ai/tools/ - List available tools"""
    
    def get(self, request):
        tools = ai_assistant_service.get_available_tools(request.user)
        return self.ok(data=tools, count=len(tools))


class AIToolCallExecuteView(TrackerAPIView):
    """POST /api/v1/ai/conversations/<id>/tool-calls/ - Execute a tool call"""
    
    class ToolCallSerializer(serializers.Serializer):
        tool_name = serializers.CharField(max_length=100)
        arguments = serializers.JSONField()
        message_id = serializers.IntegerField(required=False)

    def post(self, request, id):
        serializer = self.ToolCallSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tool_call = ai_assistant_service.execute_tool_call(
            user=request.user,
            conversation_id=int(id),
            tool_name=serializer.validated_data["tool_name"],
            arguments=serializer.validated_data["arguments"],
            message_id=serializer.validated_data.get("message_id"),
        )
        ser = AIToolCallSerializer(tool_call)
        return self.ok(data=ser.data)


class AIToolCallConfirmView(TrackerAPIView):
    """POST /api/v1/ai/tool-calls/<id>/confirm/ - Confirm a pending tool call"""
    
    class ConfirmSerializer(serializers.Serializer):
        confirmed = serializers.BooleanField()

    def post(self, request, id):
        serializer = self.ConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tool_call = ai_assistant_service.confirm_tool_call(
            user=request.user,
            tool_call_id=int(id),
            confirmed=serializer.validated_data["confirmed"],
        )
        ser = AIToolCallSerializer(tool_call)
        return self.ok(data=ser.data, message="Tool call confirmed" if serializer.validated_data["confirmed"] else "Tool call cancelled")


class AIToolCallRetryView(TrackerAPIView):
    """POST /api/v1/ai/tool-calls/<id>/retry/ - Retry a failed tool call"""
    
    def post(self, request, id):
        tool_call = ai_assistant_service.recover_failed_tool_call(request.user, int(id))
        ser = AIToolCallSerializer(tool_call)
        return self.ok(data=ser.data, message="Tool call retried")


class AIPendingConfirmationsView(TrackerAPIView):
    """GET /api/v1/ai/confirmations/ - List pending confirmations"""
    
    def get(self, request):
        confirmations = ai_assistant_service.get_pending_confirmations(request.user)
        return self.ok(data=confirmations, count=len(confirmations))