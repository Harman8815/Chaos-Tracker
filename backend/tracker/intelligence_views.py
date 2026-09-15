from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticated

from .models import MLDataSet, MLFeature, MLDataQualityCheck, MLTransactionCategory, MLSpendingPrediction, MLHabitConsistency, MLGoalCompletion, MLAnomaly, MLRecommendationScore, MLEvaluation, MLModelVersion, MLModelMonitoring, UnifiedPersonalState, CrossDomainReasoning, RankedRecommendation, Opportunity, Risk, Intervention, DailyPlan, WeeklyStrategy, Explanation, UserFeedback
from .serializers import MLDataSetSerializer, MLFeatureSerializer, MLDataQualityCheckSerializer, MLTransactionCategorySerializer, MLSpendingPredictionSerializer, MLHabitConsistencySerializer, MLGoalCompletionSerializer, MLAnomalySerializer, MLRecommendationScoreSerializer, MLEvaluationSerializer, MLModelVersionSerializer, MLModelMonitoringSerializer, UnifiedPersonalStateSerializer, CrossDomainReasoningSerializer, RankedRecommendationSerializer, OpportunitySerializer, RiskSerializer, InterventionSerializer, DailyPlanSerializer, WeeklyStrategySerializer, ExplanationSerializer, UserFeedbackSerializer
from .utils import success_response

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


# Phase 10 — Personal Intelligence Engine (P10-01 to P10-03)

class UnifiedPersonalStateView(generics.RetrieveUpdateAPIView):
    serializer_class = UnifiedPersonalStateSerializer
    permission_classes = PERMISSION_CLASSES

    def get_object(self):
        obj, _ = UnifiedPersonalState.objects.get_or_create(user=self.request.user)
        return obj


class CrossDomainReasoningListCreateView(generics.ListCreateAPIView):
    serializer_class = CrossDomainReasoningSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return CrossDomainReasoning.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CrossDomainReasoningDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CrossDomainReasoningSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return CrossDomainReasoning.objects.filter(user=self.request.user)


class RankedRecommendationListCreateView(generics.ListCreateAPIView):
    serializer_class = RankedRecommendationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return RankedRecommendation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RankedRecommendationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RankedRecommendationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return RankedRecommendation.objects.filter(user=self.request.user)


# Phase 10 — Opportunities, Risks, Interventions (P10-04 to P10-06)

class OpportunityListCreateView(generics.ListCreateAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Opportunity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OpportunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Opportunity.objects.filter(user=self.request.user)


class RiskListCreateView(generics.ListCreateAPIView):
    serializer_class = RiskSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Risk.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RiskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RiskSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Risk.objects.filter(user=self.request.user)


class InterventionListCreateView(generics.ListCreateAPIView):
    serializer_class = InterventionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Intervention.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InterventionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InterventionSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Intervention.objects.filter(user=self.request.user)


# Phase 10 — Planning & Strategy (P10-09 to P10-10)

class DailyPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = DailyPlanSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return DailyPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DailyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DailyPlanSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return DailyPlan.objects.filter(user=self.request.user)


class WeeklyStrategyListCreateView(generics.ListCreateAPIView):
    serializer_class = WeeklyStrategySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return WeeklyStrategy.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WeeklyStrategyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WeeklyStrategySerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return WeeklyStrategy.objects.filter(user=self.request.user)


# Phase 10 — Explanation & Feedback (P10-11 to P10-12)

class ExplanationListCreateView(generics.ListCreateAPIView):
    serializer_class = ExplanationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Explanation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExplanationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExplanationSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return Explanation.objects.filter(user=self.request.user)


class UserFeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = UserFeedbackSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return UserFeedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserFeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserFeedbackSerializer
    permission_classes = PERMISSION_CLASSES

    def get_queryset(self):
        return UserFeedback.objects.filter(user=self.request.user)


class MLPipelineRunView(views.APIView):
    permission_classes = PERMISSION_CLASSES

    def post(self, request):
        from .services import run_ml_pipeline
        result = run_ml_pipeline(request.user)
        return success_response(data=result, message='ML pipeline run completed')


class IntelligenceRunView(views.APIView):
    permission_classes = PERMISSION_CLASSES

    def post(self, request):
        from .services import run_intelligence_engine
        result = run_intelligence_engine(request.user)
        return success_response(data=result, message='Intelligence engine run completed')
