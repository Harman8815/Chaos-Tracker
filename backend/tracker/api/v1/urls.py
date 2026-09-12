"""URL configuration for the v1 API.

All routes are namespaced under ``api/v1/`` (see :mod:`tracker_backend.urls`).
"""
from django.urls import path

from .journal import (
    JournalEntryListCreateView,
    JournalEntryDetailView,
)
from .achievements import (
    AchievementListCreateView,
    AchievementDetailView,
)
from .finance import (
    ExpenseListCreateView,
    ExpenseDetailView,
    ExpenseSummaryView,
    ExpenseCategoriesView,
    ExpenseAnalyticsView,
    ExpenseMonthlyStatsView,
    ExpenseTopItemsView,
)
from .goals import GoalListCreateView, GoalDetailView
from .planner import PlannerDataView, PlannerBlockDetailView
from .quotes import (
    QuoteSourceListCreateView,
    QuoteSourceDetailView,
    QuoteListCreateView,
    QuoteDetailView,
    QuoteFuzzySearchView,
    QuoteTagsView,
)
from .mood import MoodListCreateView, MoodDetailView
from .water import WaterListCreateView, WaterDetailView

urlpatterns = [
    # Journal
    path('journal/', JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('journal/<str:date>/', JournalEntryDetailView.as_view(), name='journal-detail'),

    # Quote sources
    path('quotes/sources/', QuoteSourceListCreateView.as_view(), name='quote-source-list-create'),
    path('quotes/sources/<str:source_id>/', QuoteSourceDetailView.as_view(), name='quote-source-detail'),
    path('quotes/search/', QuoteFuzzySearchView.as_view(), name='quote-fuzzy-search'),
    path('quotes/tags/', QuoteTagsView.as_view(), name='quote-tags'),
    path('quotes/sources/<str:source_id>/quotes/', QuoteListCreateView.as_view(), name='quote-list-create'),
    path('quotes/<str:quote_id>/', QuoteDetailView.as_view(), name='quote-detail'),

    # Achievements
    path('achievements/', AchievementListCreateView.as_view(), name='achievement-list-create'),
    path('achievements/<int:id>/', AchievementDetailView.as_view(), name='achievement-detail'),

    # Expenses
    path('expenses/summary/', ExpenseSummaryView.as_view(), name='expense-summary'),
    path('expenses/categories/', ExpenseCategoriesView.as_view(), name='expense-categories'),
    path('expenses/analytics/', ExpenseAnalyticsView.as_view(), name='expense-analytics'),
    path('expenses/monthly-stats/', ExpenseMonthlyStatsView.as_view(), name='expense-monthly-stats'),
    path('expenses/top-items/', ExpenseTopItemsView.as_view(), name='expense-top-items'),
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:id>/', ExpenseDetailView.as_view(), name='expense-detail'),

    # Goals
    path('goals/', GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:id>/', GoalDetailView.as_view(), name='goal-detail'),

    # Planner
    path('planner/', PlannerDataView.as_view(), name='planner-data'),
    path('planner/blocks/<str:block_id>/', PlannerBlockDetailView.as_view(), name='planner-block-detail'),

    # Mood
    path('mood/', MoodListCreateView.as_view(), name='mood-list-create'),
    path('mood/<int:id>/', MoodDetailView.as_view(), name='mood-detail'),

    # Water
    path('water/', WaterListCreateView.as_view(), name='water-list-create'),
    path('water/<int:id>/', WaterDetailView.as_view(), name='water-detail'),
]