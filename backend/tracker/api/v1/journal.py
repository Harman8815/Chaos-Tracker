"""Thin v1 controller for journal entries.

Delegates all business logic to :class:`tracker.domain.services.JournalService`.
"""

from rest_framework import status

from ._base import TrackerAPIView
from ...domain.services import journal_service
from ...serializers import JournalEntrySerializer


class JournalEntryListCreateView(TrackerAPIView):
    serializer_class = JournalEntrySerializer

    def list(self, request, *args, **kwargs):
        entries = journal_service.list(request.user)
        serializer = self.serializer_class(entries, many=True)
        return self.ok(data=serializer.data, count=len(entries))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        created, instance = journal_service.upsert(
            request.user,
            date_value=serializer.validated_data["date"],
            content=serializer.validated_data.get("content", ""),
        )
        serializer = self.serializer_class(instance)
        return self.ok(
            data=serializer.data,
            message="Journal entry saved",
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class JournalEntryDetailView(TrackerAPIView):
    serializer_class = JournalEntrySerializer

    def retrieve(self, request, *args, **kwargs):
        instance = journal_service.get(request.user, kwargs["date"])
        if instance is None:
            from ...domain.exceptions import NotFoundError

            return self.fail(NotFoundError("Journal entry not found"))
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        created, instance = journal_service.upsert(
            request.user,
            date_value=kwargs["date"],
            content=serializer.validated_data.get("content", ""),
        )
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, message="Journal entry updated")

    def destroy(self, request, *args, **kwargs):
        journal_service.delete(request.user, kwargs["date"])
        return self.ok(message="Journal entry deleted", status_code=status.HTTP_204_NO_CONTENT)
