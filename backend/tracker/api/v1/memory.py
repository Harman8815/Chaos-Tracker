"""Thin v1 controller for memory endpoints."""
from rest_framework import status
from rest_framework import serializers

from ._base import TrackerAPIView
from ...domain.services import (
    memory_service,
    summarization_service,
)
from ...serializers import (
    UserPreferenceSerializer,
    AIMemorySerializer,
    AIMemorySearchResultSerializer,
    AIMemorySummarizationSerializer,
)


class MemoryQuerySerializer(serializers.Serializer):
    memory_type = serializers.CharField(required=False, max_length=20, allow_blank=True)
    is_active = serializers.BooleanField(required=False, default=True)
    limit = serializers.IntegerField(required=False, min_value=1, max_value=200, default=50)
    offset = serializers.IntegerField(required=False, min_value=0, default=0)


class MemoryListCreateView(TrackerAPIView):
    """GET/POST /api/v1/memory/ - List or create memories"""

    def get(self, request):
        query = self.validated_query(MemoryQuerySerializer)
        memories = memory_service.get_memories(
            request.user,
            memory_type=query.get("memory_type"),
            is_active=query.get("is_active", True),
            limit=query.get("limit", 50),
            offset=query.get("offset", 0),
        )
        serializer = AIMemorySerializer(memories, many=True)
        return self.ok(data=serializer.data, count=len(memories))

    def post(self, request):
        # Required fields
        required = ['memory_type', 'title', 'content']
        for field in required:
            if field not in request.data:
                return self.error(f"{field} is required", status_code=status.HTTP_400_BAD_REQUEST)

        conversation = None
        if request.data.get("conversation_id"):
            from ...models import AIConversation
            conversation = AIConversation.objects.filter(
                id=request.data["conversation_id"], user=request.user).first()
            if not conversation:
                return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)

        source_message = None
        if request.data.get("source_message_id"):
            from ...models import AIMessage
            source_message = AIMessage.objects.filter(id=request.data["source_message_id"]).first()

        memory = memory_service.create_memory(
            user=request.user,
            memory_type=request.data["memory_type"],
            title=request.data["title"],
            content=request.data["content"],
            conversation=conversation,
            entities=request.data.get("entities", {}),
            source_message=source_message,
            priority=request.data.get("priority", "normal"),
            confidence=request.data.get("confidence", 1.0),
            expires_at=request.data.get("expires_at"),
        )
        serializer = AIMemorySerializer(memory)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class MemoryDetailView(TrackerAPIView):
    """GET/PUT/DELETE /api/v1/memory/<id>/ - Memory detail"""

    def get(self, request, id):
        memory = memory_service.get_memory(request.user, int(id))
        serializer = AIMemorySerializer(memory)
        return self.ok(data=serializer.data)

    def put(self, request, id):
        memory = memory_service.update_memory(request.user, int(id), request.data)
        serializer = AIMemorySerializer(memory)
        return self.ok(data=serializer.data, message="Memory updated")

    def delete(self, request, id):
        hard = request.query_params.get("hard", "false").lower() == "true"
        memory_service.delete_memory(request.user, int(id), hard=hard)
        return self.ok(message="Memory deleted", status_code=status.HTTP_204_NO_CONTENT)


class MemoryBulkDeleteView(TrackerAPIView):
    """DELETE /api/v1/memory/bulk/ - Bulk delete memories"""

    class BulkDeleteSerializer(serializers.Serializer):
        memory_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
        hard = serializers.BooleanField(default=False)

    def delete(self, request):
        serializer = self.BulkDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        count = memory_service.bulk_delete(
            request.user,
            serializer.validated_data["memory_ids"],
            hard=serializer.validated_data.get("hard", False),
        )
        return self.ok(data={"deleted_count": count}, message=f"Deleted {count} memories")


class MemorySearchView(TrackerAPIView):
    """GET /api/v1/memory/search/ - Search memories"""

    class SearchSerializer(serializers.Serializer):
        q = serializers.CharField(min_length=1, max_length=200)
        memory_type = serializers.CharField(required=False, max_length=20, allow_blank=True)
        limit = serializers.IntegerField(required=False, min_value=1, max_value=100, default=20)

    def get(self, request):
        serializer = self.SearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        results = memory_service.search_memories(
            request.user,
            query=serializer.validated_data["q"],
            memory_type=serializer.validated_data.get("memory_type"),
            limit=serializer.validated_data.get("limit", 20),
        )

        serializer = AIMemorySearchResultSerializer(
            [{'memory': r['memory'], 'score': r['score']} for r in results], many=True)
        return self.ok(data=serializer.data, count=len(results))


class MemoryStatsView(TrackerAPIView):
    """GET /api/v1/memory/stats/ - Get memory statistics"""

    def get(self, request):
        stats = memory_service.get_memory_stats(request.user)
        return self.ok(data=stats)


class UserPreferenceView(TrackerAPIView):
    """GET/PUT /api/v1/memory/preferences/ - Get/update user preferences"""

    def get(self, request):
        prefs = memory_service.get_preferences(request.user)
        serializer = UserPreferenceSerializer(prefs)
        return self.ok(data=serializer.data)

    def put(self, request):
        prefs = memory_service.update_preferences(request.user, request.data)
        serializer = UserPreferenceSerializer(prefs)
        return self.ok(data=serializer.data, message="Preferences updated")


class SummarizationJobView(TrackerAPIView):
    """POST /api/v1/memory/conversations/<id>/summarize/ - Create summarization job"""

    def post(self, request, id):
        from ...models import AIConversation
        conversation = AIConversation.objects.filter(id=id, user=request.user).first()
        if not conversation:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)

        job = summarization_service.create_summarization_job(conversation)
        serializer = AIMemorySummarizationSerializer(job)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class SummarizationStatusView(TrackerAPIView):
    """GET /api/v1/memory/conversations/<id>/summarize/ - Get summarization status"""

    def get(self, request, id):
        from ...models import AIConversation
        conversation = AIConversation.objects.filter(id=id, user=request.user).first()
        if not conversation:
            return self.error("Conversation not found", status_code=status.HTTP_404_NOT_FOUND)

        status = summarization_service.get_summarization_status(conversation)
        if not status:
            return self.error("No summarization job found", status_code=status.HTTP_404_NOT_FOUND)
        return self.ok(data=status)


class SummarizationProcessView(TrackerAPIView):
    """POST /api/v1/memory/summarization/<id>/process/ - Process summarization job"""

    def post(self, request, id):
        from ...models import AIMemorySummarization
        job = AIMemorySummarization.objects.filter(id=id, conversation__user=request.user).first()
        if not job:
            return self.error("Summarization job not found", status_code=status.HTTP_404_NOT_FOUND)

        job = summarization_service.process_summarization(job)
        serializer = AIMemorySummarizationSerializer(job)
        return self.ok(data=serializer.data, message="Summarization processed")
