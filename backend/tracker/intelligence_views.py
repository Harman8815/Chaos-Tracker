from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MLDataSet, MLFeature, MLDataQualityCheck, MLTransactionCategory, MLSpendingPrediction, MLHabitConsistency
from .serializers import MLDataSetSerializer, MLFeatureSerializer, MLDataQualityCheckSerializer, MLTransactionCategorySerializer, MLSpendingPredictionSerializer, MLHabitConsistencySerializer
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


# Phase 9 — Predictions (P9-04 to P9-06)

class MLTransactionCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = MLTransactionCategorySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLTransactionCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLTransactionCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLTransactionCategorySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLTransactionCategory.objects.filter(user=self.request.user)


class MLSpendingPredictionListCreateView(generics.ListCreateAPIView):
    serializer_class = MLSpendingPredictionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLSpendingPrediction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLSpendingPredictionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLSpendingPredictionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLSpendingPrediction.objects.filter(user=self.request.user)


class MLHabitConsistencyListCreateView(generics.ListCreateAPIView):
    serializer_class = MLHabitConsistencySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLHabitConsistency.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLHabitConsistencyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLHabitConsistencySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLHabitConsistency.objects.filter(user=self.request.user)
