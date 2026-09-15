"""Thin v1 controller for achievements."""
from rest_framework import status

from ._base import TrackerAPIView
from ...domain.services import achievement_service
from ...serializers import AchievementSerializer


class AchievementListCreateView(TrackerAPIView):
    serializer_class = AchievementSerializer

    def list(self, request, *args, **kwargs):
        items = achievement_service.list(request.user)
        serializer = self.serializer_class(items, many=True)
        return self.ok(data=serializer.data, count=len(items))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = achievement_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class AchievementDetailView(TrackerAPIView):
    serializer_class = AchievementSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = achievement_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = achievement_service.update(
            request.user,
            kwargs["id"],
            serializer.validated_data,
            partial=True)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, message="Achievement updated")

    def destroy(self, request, *args, **kwargs):
        achievement_service.delete(request.user, kwargs["id"])
        return self.ok(message="Achievement deleted", status_code=status.HTTP_204_NO_CONTENT)
