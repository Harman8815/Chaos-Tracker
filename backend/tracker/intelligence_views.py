from rest_framework import generics, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import MLDataSet, MLFeature, MLDataQualityCheck, MLTransactionCategory, MLSpendingPrediction, MLHabitConsistency, MLGoalCompletion, MLAnomaly, MLRecommendationScore, MLEvaluation, MLModelVersion, MLModelMonitoring
from .serializers import MLDataSetSerializer, MLFeatureSerializer, MLDataQualityCheckSerializer, MLTransactionCategorySerializer, MLSpendingPredictionSerializer, MLHabitConsistencySerializer, MLGoalCompletionSerializer, MLAnomalySerializer, MLRecommendationScoreSerializer, MLEvaluationSerializer, MLModelVersionSerializer, MLModelMonitoringSerializer
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


# Phase 9 — Predictions & Detection (P9-07 to P9-09)

class MLGoalCompletionListCreateView(generics.ListCreateAPIView):
    serializer_class = MLGoalCompletionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLGoalCompletion.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLGoalCompletionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLGoalCompletionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLGoalCompletion.objects.filter(user=self.request.user)


class MLAnomalyListCreateView(generics.ListCreateAPIView):
    serializer_class = MLAnomalySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLAnomaly.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLAnomalyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLAnomalySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLAnomaly.objects.filter(user=self.request.user)


class MLRecommendationScoreListCreateView(generics.ListCreateAPIView):
    serializer_class = MLRecommendationScoreSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLRecommendationScore.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLRecommendationScoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLRecommendationScoreSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLRecommendationScore.objects.filter(user=self.request.user)


# Phase 9 — Model Management (P9-10 to P9-12)

class MLEvaluationListCreateView(generics.ListCreateAPIView):
    serializer_class = MLEvaluationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLEvaluation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLEvaluationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLEvaluationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLEvaluation.objects.filter(user=self.request.user)


class MLModelVersionListCreateView(generics.ListCreateAPIView):
    serializer_class = MLModelVersionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLModelVersion.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLModelVersionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLModelVersionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLModelVersion.objects.filter(user=self.request.user)


class MLModelMonitoringListCreateView(generics.ListCreateAPIView):
    serializer_class = MLModelMonitoringSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLModelMonitoring.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MLModelMonitoringDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MLModelMonitoringSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return MLModelMonitoring.objects.filter(user=self.request.user)
