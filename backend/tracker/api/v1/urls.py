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
    IncomeListCreateView,
    IncomeDetailView,
    IncomeSummaryView,
    IncomeMonthlyStatsView,
    AccountListCreateView,
    AccountDetailView,
    AccountSummaryView,
    RecurringExpenseListCreateView,
    RecurringExpenseDetailView,
    RecurringExpenseProcessView,
    TransferListCreateView,
    TransferDetailView,
    TransferSummaryView,
    SubscriptionListCreateView,
    SubscriptionDetailView,
    SubscriptionSummaryView,
    SubscriptionUpcomingView,
    BudgetAlertListView,
    BudgetAlertDetailView,
    BudgetAlertMarkReadView,
    BudgetAlertMarkDismissedView,
    BudgetAlertMarkAllReadView,
    BudgetAlertCheckView,
    BudgetAlertUnreadCountView,
    BudgetListCreateView,
    BudgetDetailView,
    BudgetActualVsBudgetView,
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
from .analytics import (
    ProductivityScoreView,
    ConsistencyScoreView,
    GoalVelocityView,
    FinancialHealthView,
    TrendsView,
    CorrelationsView,
    InsightsView,
    AnalyticsDashboardView,
)
from .notifications import (
    NotificationListView,
    NotificationUnreadCountView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    NotificationDeleteView,
    NotificationDeleteAllReadView,
    NotificationPreferenceView,
    ScheduledJobListView,
    ScheduledJobDetailView,
    ScheduledJobRetryView,
    ScheduledJobCancelView,
    RunJobNowView,
    RecurringIncomeListCreateView,
    RecurringIncomeDetailView,
)

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

    # Income
    path('income/summary/', IncomeSummaryView.as_view(), name='income-summary'),
    path('income/monthly-stats/', IncomeMonthlyStatsView.as_view(), name='income-monthly-stats'),
    path('income/', IncomeListCreateView.as_view(), name='income-list-create'),
    path('income/<int:id>/', IncomeDetailView.as_view(), name='income-detail'),

    # Accounts
    path('accounts/summary/', AccountSummaryView.as_view(), name='account-summary'),
    path('accounts/', AccountListCreateView.as_view(), name='account-list-create'),
    path('accounts/<int:id>/', AccountDetailView.as_view(), name='account-detail'),

    # Recurring Expenses
    path('recurring-expenses/process/', RecurringExpenseProcessView.as_view(), name='recurring-expense-process'),
    path('recurring-expenses/', RecurringExpenseListCreateView.as_view(), name='recurring-expense-list-create'),
    path('recurring-expenses/<int:id>/', RecurringExpenseDetailView.as_view(), name='recurring-expense-detail'),

    # Transfers
    path('transfers/summary/', TransferSummaryView.as_view(), name='transfer-summary'),
    path('transfers/', TransferListCreateView.as_view(), name='transfer-list-create'),
    path('transfers/<int:id>/', TransferDetailView.as_view(), name='transfer-detail'),

    # Subscriptions
    path('subscriptions/summary/', SubscriptionSummaryView.as_view(), name='subscription-summary'),
    path('subscriptions/upcoming/', SubscriptionUpcomingView.as_view(), name='subscription-upcoming'),
    path('subscriptions/', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('subscriptions/<int:id>/', SubscriptionDetailView.as_view(), name='subscription-detail'),

    # Budget Alerts
    path('budget-alerts/unread-count/', BudgetAlertUnreadCountView.as_view(), name='budget-alert-unread-count'),
    path('budget-alerts/check/', BudgetAlertCheckView.as_view(), name='budget-alert-check'),
    path('budget-alerts/mark-all-read/', BudgetAlertMarkAllReadView.as_view(), name='budget-alert-mark-all-read'),
    path('budget-alerts/<int:id>/read/', BudgetAlertMarkReadView.as_view(), name='budget-alert-mark-read'),
    path('budget-alerts/<int:id>/dismiss/', BudgetAlertMarkDismissedView.as_view(), name='budget-alert-mark-dismissed'),
    path('budget-alerts/<int:id>/', BudgetAlertDetailView.as_view(), name='budget-alert-detail'),
    path('budget-alerts/', BudgetAlertListView.as_view(), name='budget-alert-list'),

    # Budgets
    path('budgets/actual-vs-budget/', BudgetActualVsBudgetView.as_view(), name='budget-actual-vs-budget'),
    path('budgets/', BudgetListCreateView.as_view(), name='budget-list-create'),
    path('budgets/<int:id>/', BudgetDetailView.as_view(), name='budget-detail'),

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

    # Analytics
    path('analytics/productivity/', ProductivityScoreView.as_view(), name='analytics-productivity'),
    path('analytics/consistency/', ConsistencyScoreView.as_view(), name='analytics-consistency'),
    path('analytics/goal-velocity/', GoalVelocityView.as_view(), name='analytics-goal-velocity'),
    path('analytics/financial-health/', FinancialHealthView.as_view(), name='analytics-financial-health'),
    path('analytics/trends/', TrendsView.as_view(), name='analytics-trends'),
    path('analytics/correlations/', CorrelationsView.as_view(), name='analytics-correlations'),
    path('analytics/insights/', InsightsView.as_view(), name='analytics-insights'),
    path('analytics/dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/unread-count/', NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    path('notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('notifications/delete-read/', NotificationDeleteAllReadView.as_view(), name='notification-delete-read'),
    path('notifications/<int:id>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('notifications/<int:id>/', NotificationDeleteView.as_view(), name='notification-delete'),
    path('notifications/preferences/', NotificationPreferenceView.as_view(), name='notification-preferences'),

    # Scheduled Jobs
    path('jobs/', ScheduledJobListView.as_view(), name='job-list'),
    path('jobs/run-now/', RunJobNowView.as_view(), name='job-run-now'),
    path('jobs/<int:id>/', ScheduledJobDetailView.as_view(), name='job-detail'),
    path('jobs/<int:id>/retry/', ScheduledJobRetryView.as_view(), name='job-retry'),
    path('jobs/<int:id>/cancel/', ScheduledJobCancelView.as_view(), name='job-cancel'),

    # Recurring Income
    path('recurring-income/', RecurringIncomeListCreateView.as_view(), name='recurring-income-list-create'),
    path('recurring-income/<int:id>/', RecurringIncomeDetailView.as_view(), name='recurring-income-detail'),
]