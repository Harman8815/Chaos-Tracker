from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MLDataSet, MLFeature, MLDataQualityCheck
from .serializers import MLDataSetSerializer, MLFeatureSerializer, MLDataQualityCheckSerializer
from .utils import success_response, error_response

logger = None

PERMISSION_CLASSES = [IsAuthenticated]


class MLDataSetListCreateView(generics.ListCreateAPIView):
    serializer_class = MLDataSetSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLDataSet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLDataSetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLDataSetSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLDataSet.objects.filter(user=self.request.user)


class MLFeatureListCreateView(generics.ListCreateAPIView):
    serializer_class = MLFeatureSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLFeature.objects.filter(user=self.request.user, is_active=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLFeatureDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLFeatureSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLFeature.objects.filter(user=self.request.user)


class MLDataQualityCheckListCreateView(generics.ListCreateAPIView):
    serializer_class = MLDataQualityCheckSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLDataQualityCheck.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLDataQualityCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLDataQualityCheckSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLDataQualityCheck.objects.filter(user=self.request.user)
