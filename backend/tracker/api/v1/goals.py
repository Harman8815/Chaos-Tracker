"""Thin v1 controller for goals."""
from rest_framework import status

from ._base import TrackerAPIView
from .serializers import GoalQuerySerializer
from ...domain.services import goal_service
from ...serializers import GoalSerializer


class GoalListCreateView(TrackerAPIView):
    serializer_class = GoalSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(GoalQuerySerializer)
        items = goal_service.list(
            request.user,
            category=query.get("category"),
            status=query.get("status"),
        )
        serializer = self.serializer_class(items, many=True)
        return self.ok(data=serializer.data, count=len(items))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = goal_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class GoalDetailView(TrackerAPIView):
    serializer_class = GoalSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = goal_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = goal_service.update(request.user, kwargs["id"], serializer.validated_data, partial=True)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, message="Goal updated")

    def destroy(self, request, *args, **kwargs):
        goal_service.delete(request.user, kwargs["id"])
        return self.ok(message="Goal deleted", status_code=status.HTTP_204_NO_CONTENT)