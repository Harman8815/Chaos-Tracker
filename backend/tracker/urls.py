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
]