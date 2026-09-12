"""Domain service package.

Each sub-module owns the business operations for one aggregate area.
Services receive a requesting ``User`` (or ``user_id``) and enforce
ownership via :mod:`tracker.domain.permissions`.
"""
from .achievement_engine import AchievementEngine, achievement_engine
from .analytics import AnalyticsService, analytics_service
from .budgets import BudgetService, budget_service
from .events import EventService, event_service
from .habits import HabitService, habit_service
from .journal import JournalService, journal_service
from .achievements import AchievementService, achievement_service
from .finance import ExpenseService, expense_service
from .goals import GoalService, goal_service
from .milestones import GoalMilestoneService, milestone_service
from .planner import PlannerService, planner_service
from .planner_templates import (
    PlannerSearchService,
    PlannerTemplateService,
    planner_search_service,
    planner_template_service,
)
from .points import PointsEngine, points_engine
from .productivity import ProductivityService, productivity_service
from .quotes import (
    QuoteSourceService,
    QuoteService,
    QuoteTagService,
    quote_source_service,
    quote_service,
    quote_tag_service,
)
from .recurring import RecurringService, recurring_service

__all__ = [
    "AchievementEngine",
    "achievement_engine",
    "AnalyticsService",
    "analytics_service",
    "BudgetService",
    "budget_service",
    "EventService",
    "event_service",
    "HabitService",
    "habit_service",
    "JournalService",
    "journal_service",
    "AchievementService",
    "achievement_service",
    "ExpenseService",
    "expense_service",
    "GoalService",
    "goal_service",
    "GoalMilestoneService",
    "milestone_service",
    "PlannerService",
    "planner_service",
    "PlannerTemplateService",
    "planner_template_service",
    "PlannerSearchService",
    "planner_search_service",
    "PointsEngine",
    "points_engine",
    "ProductivityService",
    "productivity_service",
    "QuoteSourceService",
    "QuoteService",
    "QuoteTagService",
    "quote_source_service",
    "quote_service",
    "quote_tag_service",
    "RecurringService",
    "recurring_service",
]