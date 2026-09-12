"""Thin v1 controller for water entries."""
from rest_framework import status

from ._base import TrackerAPIView
from ...domain.services.health import _water_service
from ...serializers import WaterSerializer


class WaterListCreateView(TrackerAPIView):
    serializer_class = WaterSerializer

    def list(self, request, *args, **kwargs):
        items = _water_service.list(request.user)
        serializer = self.serializer_class(items, many=True)
        return self.ok(data=serializer.data, count=len(items))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = _water_service.upsert(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class WaterDetailView(TrackerAPIView):
    serializer_class = WaterSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = _water_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = _water_service.update(request.user, kwargs["id"], serializer.validated_data, partial=True)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, message="Water intake updated successfully")

    def destroy(self, request, *args, **kwargs):
        _water_service.delete(request.user, kwargs["id"])
        return self.ok(message="Water intake deleted successfully", status_code=status.HTTP_204_NO_CONTENT)