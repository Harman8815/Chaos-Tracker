from django.urls import path
from .views import (
    SyncView,
    JournalEntryListCreateView,
    JournalEntryDetailView,
    QuoteSourceListCreateView,
    QuoteSourceDetailView,
    QuoteListCreateView,
    QuoteDetailView,
    QuoteFuzzySearchView,
    QuoteTagsView,
    PopulateDataView,
    AchievementListCreateView,
    AchievementDetailView,
    ExpenseListCreateView,
    ExpenseDetailView,
    ExpenseSummaryView,
    ExpenseCategoriesView,
    ExpenseAnalyticsView,
    ExpenseMonthlyStatsView,
    ExpenseTopItemsView,
    GoalListCreateView,
    GoalDetailView,
    PlannerDataView,
    PlannerBlockDetailView,
    HabitListCreateView,
    HabitDetailView,
    ScoringRuleListCreateView,
    ScoringRuleDetailView,
    DailyHabitScoreView,
    PointsDataView,
    PointsAnalyticsStreaksView,
    PointsAnalyticsTodayDistributionView,
    PointsAnalyticsHabitPerformance7View,
    PointsAnalyticsHabitTrend30View,
    UserProfileView,
    ExportDataView,
    ImportDataView,
    AnalyticsView,
    TempDataView,
    MoodListCreateView,
    MoodDetailView,
    WaterListCreateView,
    WaterDetailView,
)

urlpatterns = [
    # Sync endpoint
    path('sync/', SyncView.as_view(), name='sync'),
    
    # Journal endpoints
    path('journal/', JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('journal/<str:date>/', JournalEntryDetailView.as_view(), name='journal-detail'),
    
    # Quote Source endpoints
    path('quotes/sources/', QuoteSourceListCreateView.as_view(), name='quote-source-list-create'),
    path('quotes/sources/<str:source_id>/', QuoteSourceDetailView.as_view(), name='quote-source-detail'),
    
    # Search endpoint
    path('quotes/search/', QuoteFuzzySearchView.as_view(), name='quote-fuzzy-search'),
    
    # Tags endpoint
    path('quotes/tags/', QuoteTagsView.as_view(), name='quote-tags'),

    # Quote endpoints (nested under source)
    path('quotes/sources/<str:source_id>/quotes/', QuoteListCreateView.as_view(), name='quote-list-create'),
    
    # Quote endpoints (direct access)
    path('quotes/<str:quote_id>/', QuoteDetailView.as_view(), name='quote-detail'),
    
    # Populate Data endpoint
    path('populate-data/', PopulateDataView.as_view(), name='populate-data'),

    # Temporary Data endpoint
    path('temp-data/', TempDataView.as_view(), name='temp-data'),

    # Achievement endpoints
    path('achievements/', AchievementListCreateView.as_view(), name='achievement-list-create'),
    path('achievements/<int:id>/', AchievementDetailView.as_view(), name='achievement-detail'),

    # Expense endpoints - Analytics & Statistics (MUST come BEFORE <int:id> route)
    path('expenses/summary/', ExpenseSummaryView.as_view(), name='expense-summary'),
    path('expenses/categories/', ExpenseCategoriesView.as_view(), name='expense-categories'),
    path('expenses/analytics/', ExpenseAnalyticsView.as_view(), name='expense-analytics'),
    path('expenses/monthly-stats/', ExpenseMonthlyStatsView.as_view(), name='expense-monthly-stats'),
    path('expenses/top-items/', ExpenseTopItemsView.as_view(), name='expense-top-items'),
    
    # Expense endpoints - CRUD (MUST come AFTER specific routes)
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:id>/', ExpenseDetailView.as_view(), name='expense-detail'),

    # Goal endpoints
    path('goals/', GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:id>/', GoalDetailView.as_view(), name='goal-detail'),

    # Planner endpoints
    path('planner/', PlannerDataView.as_view(), name='planner-data'),
    path('planner/blocks/<str:block_id>/', PlannerBlockDetailView.as_view(), name='planner-block-detail'),

    # Points endpoints
    path('points/habits/', HabitListCreateView.as_view(), name='habit-list-create'),
    path('points/habits/<str:id>/', HabitDetailView.as_view(), name='habit-detail'),
    path('points/rules/', ScoringRuleListCreateView.as_view(), name='scoring-rule-list-create'),
    path('points/rules/<str:id>/', ScoringRuleDetailView.as_view(), name='scoring-rule-detail'),
    path('points/scores/', DailyHabitScoreView.as_view(), name='daily-habit-score'),
    path('points/data/', PointsDataView.as_view(), name='points-data'),
    # Points analytics
    path('points/analytics/streaks/', PointsAnalyticsStreaksView.as_view(), name='points-analytics-streaks'),
    path('points/analytics/today-distribution/', PointsAnalyticsTodayDistributionView.as_view(), name='points-analytics-today-distribution'),
    path('points/analytics/habit-performance/7/', PointsAnalyticsHabitPerformance7View.as_view(), name='points-analytics-habit-performance-7'),
    path('points/analytics/habit-trend/30/', PointsAnalyticsHabitTrend30View.as_view(), name='points-analytics-habit-trend-30'),

    # User Profile endpoints
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),

    # Mood endpoints
    path('mood/', MoodListCreateView.as_view(), name='mood-list-create'),
    path('mood/<int:id>/', MoodDetailView.as_view(), name='mood-detail'),

    # Water endpoints
    path('water/', WaterListCreateView.as_view(), name='water-list-create'),
    path('water/<int:id>/', WaterDetailView.as_view(), name='water-detail'),

    # Export endpoints
    path('export/<str:format_type>/', ExportDataView.as_view(), name='export-data'),

    # Import endpoints
    path('import/<str:format_type>/', ImportDataView.as_view(), name='import-data'),

    # Analytics endpoints
    path('analytics/<str:period>/', AnalyticsView.as_view(), name='analytics'),
]

# =============================================================================
# Phase 9 — ML & Prediction endpoints (P9-01 to P9-03)
# =============================================================================

from .intelligence_views import (
    MLDataSetListCreateView, MLDataSetDetailView,
    MLFeatureListCreateView, MLFeatureDetailView,
    MLDataQualityCheckListCreateView, MLDataQualityCheckDetailView,
    MLTransactionCategoryListCreateView, MLTransactionCategoryDetailView,
    MLSpendingPredictionListCreateView, MLSpendingPredictionDetailView,
    MLHabitConsistencyListCreateView, MLHabitConsistencyDetailView,
    MLGoalCompletionListCreateView, MLGoalCompletionDetailView,
    MLAnomalyListCreateView, MLAnomalyDetailView,
    MLRecommendationScoreListCreateView, MLRecommendationScoreDetailView,
    MLEvaluationListCreateView, MLEvaluationDetailView,
    MLModelVersionListCreateView, MLModelVersionDetailView,
    MLModelMonitoringListCreateView, MLModelMonitoringDetailView,
    UnifiedPersonalStateView,
    CrossDomainReasoningListCreateView, CrossDomainReasoningDetailView,
    RankedRecommendationListCreateView, RankedRecommendationDetailView,
    OpportunityListCreateView, OpportunityDetailView,
    RiskListCreateView, RiskDetailView,
    InterventionListCreateView, InterventionDetailView,
    DailyPlanListCreateView, DailyPlanDetailView,
    WeeklyStrategyListCreateView, WeeklyStrategyDetailView,
)

urlpatterns += [
    # ML Data Pipeline (P9-01)
    path('ml/datasets/', MLDataSetListCreateView.as_view(), name='ml-dataset-list-create'),
    path('ml/datasets/<int:id>/', MLDataSetDetailView.as_view(), name='ml-dataset-detail'),

    # Feature Engineering (P9-02)
    path('ml/features/', MLFeatureListCreateView.as_view(), name='ml-feature-list-create'),
    path('ml/features/<int:id>/', MLFeatureDetailView.as_view(), name='ml-feature-detail'),

    # Data Quality Checks (P9-03)
    path('ml/quality/', MLDataQualityCheckListCreateView.as_view(), name='ml-quality-list-create'),
    path('ml/quality/<int:id>/', MLDataQualityCheckDetailView.as_view(), name='ml-quality-detail'),

    # Transaction Categorization (P9-04)
    path('ml/transaction-category/', MLTransactionCategoryListCreateView.as_view(), name='ml-transaction-category-list-create'),
    path('ml/transaction-category/<int:id>/', MLTransactionCategoryDetailView.as_view(), name='ml-transaction-category-detail'),

    # Spending Prediction (P9-05)
    path('ml/spending-prediction/', MLSpendingPredictionListCreateView.as_view(), name='ml-spending-prediction-list-create'),
    path('ml/spending-prediction/<int:id>/', MLSpendingPredictionDetailView.as_view(), name='ml-spending-prediction-detail'),

    # Habit Consistency Prediction (P9-06)
    path('ml/habit-consistency/', MLHabitConsistencyListCreateView.as_view(), name='ml-habit-consistency-list-create'),
    path('ml/habit-consistency/<int:id>/', MLHabitConsistencyDetailView.as_view(), name='ml-habit-consistency-detail'),

    # Goal Completion Prediction (P9-07)
    path('ml/goal-completion/', MLGoalCompletionListCreateView.as_view(), name='ml-goal-completion-list-create'),
    path('ml/goal-completion/<int:id>/', MLGoalCompletionDetailView.as_view(), name='ml-goal-completion-detail'),

    # Anomaly Detection (P9-08)
    path('ml/anomaly/', MLAnomalyListCreateView.as_view(), name='ml-anomaly-list-create'),
    path('ml/anomaly/<int:id>/', MLAnomalyDetailView.as_view(), name='ml-anomaly-detail'),

    # Recommendation Model (P9-09)
    path('ml/recommendation-score/', MLRecommendationScoreListCreateView.as_view(), name='ml-recommendation-score-list-create'),
    path('ml/recommendation-score/<int:id>/', MLRecommendationScoreDetailView.as_view(), name='ml-recommendation-score-detail'),

    # Model Evaluation (P9-10)
    path('ml/evaluation/', MLEvaluationListCreateView.as_view(), name='ml-evaluation-list-create'),
    path('ml/evaluation/<int:id>/', MLEvaluationDetailView.as_view(), name='ml-evaluation-detail'),

    # Model Versioning (P9-11)
    path('ml/model-version/', MLModelVersionListCreateView.as_view(), name='ml-model-version-list-create'),
    path('ml/model-version/<int:id>/', MLModelVersionDetailView.as_view(), name='ml-model-version-detail'),

    # Model Monitoring (P9-12)
    path('ml/monitoring/', MLModelMonitoringListCreateView.as_view(), name='ml-monitoring-list-create'),
    path('ml/monitoring/<int:id>/', MLModelMonitoringDetailView.as_view(), name='ml-monitoring-detail'),

    # Phase 10 — Personal Intelligence Engine (P10-01 to P10-03)

    # Unified Personal State (P10-01)
    path('intelligence/state/', UnifiedPersonalStateView.as_view(), name='unified-state'),

    # Cross-domain Reasoning (P10-02)
    path('intelligence/reasoning/', CrossDomainReasoningListCreateView.as_view(), name='cross-domain-reasoning-list-create'),
    path('intelligence/reasoning/<int:id>/', CrossDomainReasoningDetailView.as_view(), name='cross-domain-reasoning-detail'),

    # Recommendation Engine (P10-03)
    path('intelligence/recommendation/', RankedRecommendationListCreateView.as_view(), name='ranked-recommendation-list-create'),
    path('intelligence/recommendation/<int:id>/', RankedRecommendationDetailView.as_view(), name='ranked-recommendation-detail'),

    # Opportunity Detection (P10-04)
    path('intelligence/opportunity/', OpportunityListCreateView.as_view(), name='opportunity-list-create'),
    path('intelligence/opportunity/<int:id>/', OpportunityDetailView.as_view(), name='opportunity-detail'),

    # Risk Detection (P10-05)
    path('intelligence/risk/', RiskListCreateView.as_view(), name='risk-list-create'),
    path('intelligence/risk/<int:id>/', RiskDetailView.as_view(), name='risk-detail'),

    # Interventions (P10-06/07/08)
    path('intelligence/intervention/', InterventionListCreateView.as_view(), name='intervention-list-create'),
    path('intelligence/intervention/<int:id>/', InterventionDetailView.as_view(), name='intervention-detail'),

    # Personalized Daily Plan (P10-09)
    path('intelligence/daily-plan/', DailyPlanListCreateView.as_view(), name='daily-plan-list-create'),
    path('intelligence/daily-plan/<int:id>/', DailyPlanDetailView.as_view(), name='daily-plan-detail'),

    # Weekly Strategy Generation (P10-10)
    path('intelligence/weekly-strategy/', WeeklyStrategyListCreateView.as_view(), name='weekly-strategy-list-create'),
    path('intelligence/weekly-strategy/<int:id>/', WeeklyStrategyDetailView.as_view(), name='weekly-strategy-detail'),
]