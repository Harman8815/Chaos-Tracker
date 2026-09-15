"""Domain-level tests for tracker.

Covers: validation, ownership, idempotency, analytics, transactions,
and domain errors. These tests exercise the domain layer directly
(without HTTP) to isolate business logic.
"""
import decimal
import datetime
from datetime import date
import calendar
import enum

from django.contrib.auth import get_user_model
from django.test import TestCase

from tracker.models import (
    Expense, Goal, Achievement, JournalEntry, Mood, Water,
    PlannerBlock, PlannerTask, PlannerLink, QuoteSource,
    DailyActivityAggregate, Habit,
)
from tracker.domain import validation
from tracker.domain.permissions import owner_of, require_owner, require_owns
from tracker.domain.transactions import atomic
from tracker.domain.exceptions import (
    DomainError, NotFoundError, PermissionError, ValidationError,
    ConflictError, RateLimitError, to_http_response,
)
from tracker.domain.services.journal import journal_service
from tracker.domain.services.finance import expense_service
from tracker.domain.services.health import _mood_service as mood_service, _water_service as water_service
from tracker.domain.services.goals import goal_service
from tracker.domain.services.planner import planner_service
from tracker.domain.services.achievements import achievement_service
from tracker.domain.services.events import event_service
from tracker.domain.services.habits import habit_service
from tracker.domain.services.budgets import budget_service
from tracker.domain.services.analytics import analytics_service
from tracker.domain.services.milestones import milestone_service
from tracker.domain.services.points import points_engine
from tracker.domain.services.productivity import productivity_service
from tracker.domain.services.recurring import recurring_service
from tracker.domain.services.planner_templates import (
    planner_template_service, planner_search_service,
)
from tracker.domain.services.achievement_engine import achievement_engine
from tracker.domain.services.quotes import (
    quote_source_service,
)

User = get_user_model()


# ============================================================================
# Helpers
# ============================================================================

def _make_user(username="testuser", email="test@example.com"):
    return User.objects.create_user(username, email, "pass123")


TODAY = datetime.date.today()
PAST = TODAY - datetime.timedelta(days=10)
FUTURE = TODAY + datetime.timedelta(days=10)


# ============================================================================
# VALIDATION TESTS
# ============================================================================

class ValidationTests(TestCase):
    """Tests for :mod:`tracker.domain.validation` rules."""

    # --- parse_date ---

    def test_parse_date_valid_string(self):
        d = validation.parse_date("2025-03-15")
        self.assertEqual(d, datetime.date(2025, 3, 15))

    def test_parse_date_none_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.parse_date(None)
        self.assertIn("required", str(ctx.exception))

    def test_parse_date_invalid_format_raises(self):
        with self.assertRaises(ValidationError):
            validation.parse_date("15/03/2025")

    def test_parse_date_non_string_raises(self):
        with self.assertRaises(ValidationError):
            validation.parse_date(12345)

    def test_parse_date_date_object(self):
        d = validation.parse_date(TODAY)
        self.assertEqual(d, TODAY)

    def test_parse_date_datetime_object(self):
        dt = datetime.datetime(2025, 3, 15, 12, 0, 0)
        d = validation.parse_date(dt)
        self.assertEqual(d, datetime.date(2025, 3, 15))

    def test_parse_date_custom_field_name(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.parse_date(None, field="birth_date")
        self.assertIn("birth_date", str(ctx.exception))

    # --- ensure_future_or_today ---

    def test_ensure_future_or_today_past_ok(self):
        d = validation.ensure_future_or_today("2025-01-01")
        self.assertEqual(d, datetime.date(2025, 1, 1))

    def test_ensure_future_or_today_today_ok(self):
        d = validation.ensure_future_or_today(TODAY.isoformat())
        self.assertEqual(d, TODAY)

    def test_ensure_future_or_today_future_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.ensure_future_or_today(FUTURE.isoformat())
        self.assertIn("future", str(ctx.exception))

    # --- in_range ---

    def test_in_range_valid(self):
        self.assertEqual(validation.in_range(5, 1, 10), 5)

    def test_in_range_below_min_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.in_range(0, 1, 10)
        self.assertIn("between", str(ctx.exception))

    def test_in_range_above_max_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.in_range(11, 1, 10)
        self.assertIn("between", str(ctx.exception))

    def test_in_range_non_int_raises(self):
        with self.assertRaises(ValidationError):
            validation.in_range("abc", 1, 10)

    def test_in_range_boundary_inclusive(self):
        self.assertEqual(validation.in_range(1, 1, 10), 1)
        self.assertEqual(validation.in_range(10, 1, 10), 10)

    # --- non_negative_int ---

    def test_non_negative_int_valid(self):
        self.assertEqual(validation.non_negative_int(5), 5)

    def test_non_negative_int_zero_ok(self):
        self.assertEqual(validation.non_negative_int(0), 0)

    def test_non_negative_int_negative_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.non_negative_int(-1)
        self.assertIn("non-negative", str(ctx.exception))

    def test_non_negative_int_string_valid(self):
        self.assertEqual(validation.non_negative_int("42"), 42)

    def test_non_negative_int_non_int_raises(self):
        with self.assertRaises(ValidationError):
            validation.non_negative_int("3.14")

    # --- positive_int ---

    def test_positive_int_valid(self):
        self.assertEqual(validation.positive_int(5), 5)

    def test_positive_int_zero_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.positive_int(0)
        self.assertIn("at least 1", str(ctx.exception))

    def test_positive_int_negative_raises(self):
        with self.assertRaises(ValidationError):
            validation.positive_int(-3)

    def test_positive_int_custom_minimum(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.positive_int(2, minimum=5)
        self.assertIn("at least 5", str(ctx.exception))
        self.assertEqual(validation.positive_int(5, minimum=5), 5)

    # --- bounded_decimal ---

    def test_bounded_decimal_valid(self):
        d = validation.bounded_decimal("3.50")
        self.assertEqual(d, decimal.Decimal("3.50"))

    def test_bounded_decimal_too_many_decimal_places(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.bounded_decimal("3.456")
        self.assertIn("decimal places", str(ctx.exception))

    def test_bounded_decimal_too_many_digits(self):
        with self.assertRaises(ValidationError):
            validation.bounded_decimal("12345678901")

    def test_bounded_decimal_non_number_raises(self):
        with self.assertRaises(ValidationError):
            validation.bounded_decimal("not-a-number")

    # --- bounded_text ---

    def test_bounded_text_valid(self):
        self.assertEqual(validation.bounded_text("hello", max_length=100), "hello")

    def test_bounded_text_none_required_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.bounded_text(None, max_length=100)
        self.assertIn("required", str(ctx.exception))

    def test_bounded_text_none_allow_blank(self):
        self.assertEqual(validation.bounded_text(None, max_length=100, allow_blank=True), "")

    def test_bounded_text_blank_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.bounded_text("   ", max_length=100)
        self.assertIn("blank", str(ctx.exception))

    def test_bounded_text_blank_allow_blank(self):
        self.assertEqual(
            validation.bounded_text(
                "  ",
                max_length=100,
                allow_blank=True),
            "  ".strip())

    def test_bounded_text_too_long_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.bounded_text("x" * 256, max_length=255)
        self.assertIn("at most 255", str(ctx.exception))

    def test_bounded_text_non_string_raises(self):
        with self.assertRaises(ValidationError):
            validation.bounded_text(123, max_length=100)

    def test_bounded_text_strips_whitespace(self):
        self.assertEqual(
            validation.bounded_text(
                "  hello  ",
                max_length=100,
                allow_blank=True),
            "hello")

    # --- choice ---

    def test_choice_valid(self):
        self.assertEqual(validation.choice("daily", ["daily", "monthly"]), "daily")

    def test_choice_invalid_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.choice("weekly", ["daily", "monthly"])
        self.assertIn("one of", str(ctx.exception))

    # --- enum_choice ---

    class FakeEnum(enum.Enum):
        HAPPY = "happy"
        SAD = "sad"

    def test_enum_choice_valid(self):
        result = validation.enum_choice("happy", self.FakeEnum)
        self.assertEqual(result.value, "happy")

    def test_enum_choice_invalid_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.enum_choice("angry", self.FakeEnum)
        self.assertIn("one of", str(ctx.exception))

    # --- bounded_list ---

    def test_bounded_list_valid(self):
        self.assertEqual(validation.bounded_list([1, 2, 3], max_length=5), [1, 2, 3])

    def test_bounded_list_none_returns_empty(self):
        self.assertEqual(validation.bounded_list(None, max_length=5), [])

    def test_bounded_list_too_long_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.bounded_list([1, 2, 3], max_length=2)
        self.assertIn("at most 2", str(ctx.exception))

    def test_bounded_list_non_list_raises(self):
        with self.assertRaises(ValidationError):
            validation.bounded_list("not a list", max_length=5)

    # --- unique_items ---

    def test_unique_items_valid(self):
        self.assertEqual(validation.unique_items([1, 2, 3]), [1, 2, 3])

    def test_unique_items_duplicate_raises(self):
        with self.assertRaises(ValidationError) as ctx:
            validation.unique_items([1, 2, 2])
        self.assertIn("duplicate", str(ctx.exception))


# ============================================================================
# OWNERSHIP TESTS
# ============================================================================

class OwnershipTests(TestCase):
    """Tests for :mod:`tracker.domain.permissions`."""

    def setUp(self):
        self.user = _make_user("owner", "owner@test.com")
        self.other_user = _make_user("other", "other@test.com")

    # --- owner_of ---

    def test_owner_of_instance_with_user_fk(self):
        goal = Goal.objects.create(user=self.user, text="test")
        self.assertEqual(owner_of(goal), self.user)

    def test_owner_of_instance_with_other_user(self):
        goal = Goal.objects.create(user=self.other_user, text="test")
        self.assertEqual(owner_of(goal), self.other_user)

    def test_owner_of_none_returns_none(self):
        self.assertIsNone(owner_of(None))

    def test_owner_of_transitive_through_block(self):
        block = PlannerBlock.objects.create(id="b1", user=self.user, title="B")
        task = PlannerTask.objects.create(id="t1", block=block, text="T")
        self.assertEqual(owner_of(task), self.user)

    def test_owner_of_object_without_user_or_block(self):
        obj = object()
        self.assertIsNone(owner_of(obj))

    # --- require_owner ---

    def test_require_owner_none_raises_not_found(self):
        with self.assertRaises(NotFoundError):
            require_owner(None, self.user, label="Goal")

    def test_require_owner_owned_passes(self):
        goal = Goal.objects.create(user=self.user, text="test")
        result = require_owner(goal, self.user, label="Goal")
        self.assertEqual(result, goal)

    def test_require_owner_wrong_user_raises_permission(self):
        goal = Goal.objects.create(user=self.other_user, text="test")
        with self.assertRaises(PermissionError) as ctx:
            require_owner(goal, self.user, label="Goal")
        self.assertIn("permission", str(ctx.exception).lower())

    def test_require_owner_custom_label_not_found(self):
        with self.assertRaises(NotFoundError) as ctx:
            require_owner(None, self.user, label="Planner block")
        self.assertIn("Planner block", str(ctx.exception))

    def test_require_owner_custom_label_permission(self):
        goal = Goal.objects.create(user=self.other_user, text="test")
        with self.assertRaises(PermissionError):
            require_owner(goal, self.user, label="Goal")

    # --- require_owns ---

    def test_require_owns_with_owned_instance(self):
        goal = Goal.objects.create(user=self.user, text="test")
        result = require_owns(goal, self.user, label="Goal")
        self.assertTrue(result)

    def test_require_owns_with_wrong_user(self):
        goal = Goal.objects.create(user=self.other_user, text="test")
        with self.assertRaises(PermissionError):
            require_owns(goal, self.user, label="Goal")

    def test_require_owns_with_none_raises_type_error(self):
        with self.assertRaises(TypeError):
            require_owns(None, self.user, label="Goal")

    def test_require_owns_with_invalid_type_raises_type_error(self):
        with self.assertRaises(TypeError):
            require_owns("not an instance", self.user)


# ============================================================================
# IDEMPOTENCY TESTS
# ============================================================================

class IdempotencyTests(TestCase):
    """Tests that upsert/replace operations are idempotent."""

    def setUp(self):
        self.user = _make_user("idem", "idem@test.com")

    # --- Journal upsert ---

    def test_journal_upsert_creates_new_entry(self):
        created, entry = journal_service.upsert(self.user, date_value="2025-06-01", content="Hello")
        self.assertTrue(created)
        self.assertEqual(entry.content, "Hello")
        self.assertEqual(JournalEntry.objects.filter(user=self.user).count(), 1)

    def test_journal_upsert_same_date_is_idempotent(self):
        journal_service.upsert(self.user, date_value="2025-06-01", content="Hello")
        created, entry = journal_service.upsert(
            self.user, date_value="2025-06-01", content="Updated")
        self.assertFalse(created)
        self.assertEqual(entry.content, "Updated")
        self.assertEqual(JournalEntry.objects.filter(user=self.user).count(), 1)

    def test_journal_upsert_updates_existing(self):
        journal_service.upsert(self.user, date_value="2025-06-01", content="First")
        created, entry = journal_service.upsert(
            self.user, date_value="2025-06-01", content="Second")
        self.assertFalse(created)
        self.assertEqual(entry.content, "Second")

    # --- Mood upsert ---

    def test_mood_upsert_idempotent(self):
        mood_service.upsert(self.user, {"mood": "happy", "date": "2025-06-01"})
        mood1 = Mood.objects.filter(user=self.user, date=TODAY).first()
        if mood1 is None:
            mood1 = Mood.objects.filter(user=self.user, date=datetime.date(2025, 6, 1)).first()
        mood_service.upsert(self.user, {"mood": "sad", "date": "2025-06-01"})
        mood1.refresh_from_db()
        self.assertEqual(mood1.mood, "sad")
        self.assertEqual(
            Mood.objects.filter(
                user=self.user,
                date=datetime.date(
                    2025,
                    6,
                    1)).count(),
            1)

    def test_mood_upsert_creates_different_dates(self):
        mood_service.upsert(self.user, {"mood": "happy", "date": "2025-06-01"})
        mood_service.upsert(self.user, {"mood": "sad", "date": "2025-06-02"})
        self.assertEqual(Mood.objects.filter(user=self.user).count(), 2)

    # --- Water upsert ---

    def test_water_upsert_idempotent(self):
        water_service.upsert(self.user, {"glasses": 5, "target": 8, "date": "2025-06-01"})
        water_service.upsert(self.user, {"glasses": 10, "target": 8, "date": "2025-06-01"})
        entry = Water.objects.filter(user=self.user, date=datetime.date(2025, 6, 1)).first()
        self.assertIsNotNone(entry)
        self.assertEqual(entry.glasses, 10)
        self.assertEqual(
            Water.objects.filter(
                user=self.user,
                date=datetime.date(
                    2025,
                    6,
                    1)).count(),
            1)

    # --- Journal delete no-op ---

    def test_journal_delete_no_op_for_missing(self):
        result = journal_service.delete(self.user, "2025-12-31")
        self.assertFalse(result)
        self.assertEqual(JournalEntry.objects.filter(user=self.user).count(), 0)


# ============================================================================
# ANALYTICS TESTS
# ============================================================================

class AnalyticsTests(TestCase):
    """Tests for analytics/summary methods in :mod:`tracker.domain.services.finance`."""

    def setUp(self):
        self.user = _make_user("analyst", "analyst@test.com")
        Expense.objects.create(
            user=self.user, date=datetime.date(2025, 1, 5),
            item="Coffee", category="Food", quantity=2, price="3.50",
        )
        Expense.objects.create(
            user=self.user, date=datetime.date(2025, 1, 5),
            item="Book", category="Education", quantity=1, price="15.00",
        )
        Expense.objects.create(
            user=self.user, date=datetime.date(2025, 1, 15),
            item="Lunch", category="Food", quantity=1, price="10.00",
        )
        Expense.objects.create(
            user=self.user, date=datetime.date(2025, 2, 10),
            item="Transport", category="Travel", quantity=1, price="5.00",
        )

    # --- summary ---

    def test_summary_empty(self):
        result = expense_service.summary(self.user, year=2025, month=2)
        self.assertEqual(result["total_expenses"], 0)
        self.assertEqual(result["total_amount"], 0.0)
        self.assertEqual(result["average_per_expense"], 0.0)
        self.assertEqual(result["categories_count"], 0)
        self.assertEqual(result["unique_categories"], [])

    def test_summary_with_expenses(self):
        result = expense_service.summary(self.user, year=2025, month=0)
        self.assertEqual(result["total_expenses"], 3)
        self.assertEqual(result["total_amount"], 32.0)
        self.assertAlmostEqual(result["average_per_expense"], 32.0 / 3, places=2)
        self.assertEqual(result["categories_count"], 2)
        self.assertIn("Food", result["unique_categories"])
        self.assertIn("Education", result["unique_categories"])
        self.assertNotIn("Travel", result["unique_categories"])

    def test_summary_with_start_end_date(self):
        result = expense_service.summary(
            self.user,
            start_date="2025-01-10",
            end_date="2025-01-20",
        )
        self.assertEqual(result["total_expenses"], 1)
        self.assertEqual(result["total_amount"], 10.0)

    def test_summary_filters_by_category(self):
        result = expense_service.summary(self.user, year=2025, month=0, category="food")
        self.assertEqual(result["total_expenses"], 2)
        self.assertEqual(result["total_amount"], 17.0)
        self.assertEqual(result["unique_categories"], ["Food"])

    # --- categories ---

    def test_categories_empty(self):
        result = expense_service.categories(self.user, year=2025, month=2)
        self.assertEqual(result, [])

    def test_categories_with_expenses(self):
        result = expense_service.categories(self.user, year=2025, month=0)
        categories = {c["name"]: c for c in result}
        self.assertIn("Food", categories)
        self.assertEqual(categories["Food"]["count"], 2)
        self.assertAlmostEqual(categories["Food"]["total"], 17.0, places=2)

    def test_categories_sorted_by_total_desc(self):
        result = expense_service.categories(self.user, year=2025, month=0)
        totals = [c["total"] for c in result]
        self.assertEqual(totals, sorted(totals, reverse=True))

    # --- analytics ---

    def test_analytics_empty_month(self):
        result = expense_service.analytics(self.user, year=2025, month=2)
        self.assertEqual(result["total_amount"], 0.0)
        self.assertEqual(result["daily_breakdown"], [])
        self.assertEqual(result["category_breakdown"], [])
        days_in_month = calendar.monthrange(2025, 3)[1]
        self.assertEqual(result["average_per_day"], 0.0)
        self.assertEqual(result["days_in_month"], days_in_month)

    def test_analytics_with_expenses(self):
        result = expense_service.analytics(self.user, year=2025, month=0)
        self.assertEqual(result["total_amount"], 32.0)
        self.assertEqual(result["days_in_month"], calendar.monthrange(2025, 1)[1])
        day_map = {d["day"]: d["total"] for d in result["daily_breakdown"]}
        self.assertEqual(day_map[5], 22.0)
        self.assertEqual(day_map[15], 10.0)
        cat_map = {c["name"]: c["value"] for c in result["category_breakdown"]}
        self.assertAlmostEqual(cat_map["Food"], 17.0, places=2)
        self.assertAlmostEqual(cat_map["Education"], 15.0, places=2)

    def test_analytics_average_per_day(self):
        result = expense_service.analytics(self.user, year=2025, month=0)
        expected_avg = round(32.0 / calendar.monthrange(2025, 1)[1], 2)
        self.assertEqual(result["average_per_day"], expected_avg)

    # --- monthly_stats ---

    def test_monthly_stats_empty_year(self):
        result = expense_service.monthly_stats(self.user, year=2025)
        self.assertEqual(result["year"], 2025)
        jan = result["monthly_stats"][0]
        self.assertEqual(jan["month"], 0)
        self.assertEqual(jan["count"], 3)
        self.assertAlmostEqual(jan["total"], 32.0, places=2)
        feb = result["monthly_stats"][1]
        self.assertEqual(feb["month"], 1)
        self.assertEqual(feb["count"], 1)
        self.assertAlmostEqual(feb["total"], 5.0, places=2)

    def test_monthly_stats_with_expenses(self):
        result = expense_service.monthly_stats(self.user, year=2025)
        jan = result["monthly_stats"][0]
        self.assertEqual(jan["month"], 0)
        self.assertEqual(jan["month_name"], "January")
        self.assertEqual(jan["count"], 3)
        self.assertAlmostEqual(jan["total"], 32.0, places=2)
        feb = result["monthly_stats"][1]
        self.assertEqual(feb["month"], 1)
        self.assertEqual(feb["count"], 1)
        self.assertAlmostEqual(feb["total"], 5.0, places=2)

    def test_monthly_stats_total_amount(self):
        result = expense_service.monthly_stats(self.user, year=2025)
        self.assertAlmostEqual(result["total_amount"], 37.0, places=2)

    # --- top_items ---

    def test_top_items_empty(self):
        result = expense_service.top_items(self.user, limit=5)
        self.assertEqual(len(result), 4)
        for item in result:
            self.assertIn("total", item)

    def test_top_items_sorted_by_total_desc(self):
        result = expense_service.top_items(self.user, limit=10)
        totals = [item["total"] for item in result]
        self.assertEqual(totals, sorted(totals, reverse=True))

    def test_top_items_respects_limit(self):
        result = expense_service.top_items(self.user, limit=2)
        self.assertEqual(len(result), 2)

    def test_top_items_default_limit(self):
        result = expense_service.top_items(self.user)
        self.assertLessEqual(len(result), 10)

    # --- list_with_summary ---

    def test_list_with_summary_empty(self):
        result = expense_service.list_with_summary(self.user, year=2025, month=2)
        self.assertEqual(result["count"], 0)
        self.assertEqual(result["total_amount"], 0.0)
        self.assertEqual(result["category_breakdown"], {})

    def test_list_with_summary_with_data(self):
        result = expense_service.list_with_summary(self.user, year=2025, month=0)
        self.assertEqual(result["count"], 3)
        self.assertAlmostEqual(result["total_amount"], 32.0, places=2)
        self.assertIn("Food", result["category_breakdown"])
        self.assertIn("Education", result["category_breakdown"])

    # --- list with filters ---

    def test_list_filters_by_category(self):
        expenses = expense_service.list(self.user, year=2025, month=0, category="food")
        self.assertEqual(len(expenses), 2)
        for e in expenses:
            self.assertEqual(e.category.lower(), "food")

    def test_list_filters_by_date_range(self):
        expenses = expense_service.list(
            self.user, start_date="2025-01-10", end_date="2025-01-20"
        )
        self.assertEqual(len(expenses), 1)
        self.assertEqual(expenses[0].item, "Lunch")

    def test_list_filters_by_year_month(self):
        expenses = expense_service.list(self.user, year=2025, month=1)
        self.assertEqual(len(expenses), 1)
        self.assertEqual(expenses[0].category, "Travel")


# ============================================================================
# TRANSACTIONS TESTS
# ============================================================================

class TransactionTests(TestCase):
    """Tests for transaction behavior in domain services."""

    def setUp(self):
        self.user = _make_user("txuser", "tx@test.com")

    # --- atomic context manager ---

    def test_atomic_commits_on_success(self):
        with atomic():
            Goal.objects.create(user=self.user, text="test")
        self.assertEqual(Goal.objects.filter(user=self.user).count(), 1)

    def test_atomic_rolls_back_on_exception(self):
        with self.assertRaises(ValueError):
            with atomic():
                Goal.objects.create(user=self.user, text="test")
                raise ValueError("simulated failure")
        self.assertEqual(Goal.objects.filter(user=self.user).count(), 0)

    def test_atomic_nested_rolls_back_all(self):
        with self.assertRaises(RuntimeError):
            with atomic():
                Goal.objects.create(user=self.user, text="outer")
                with atomic():
                    Achievement.objects.create(
                        user=self.user, title="inner", date="2025-01-01"
                    )
                    raise RuntimeError("nested failure")
        self.assertEqual(Goal.objects.filter(user=self.user).count(), 0)
        self.assertEqual(Achievement.objects.filter(user=self.user).count(), 0)

    # --- Planner replace_all atomicity ---

    def test_planner_replace_all_rolls_back_on_error(self):
        from tracker.domain.exceptions import ValidationError

        data = {
            "blocks": [
                {"id": "block-1", "title": "Block 1", "x": 0, "y": 0},
            ],
            "links": [
                {"id": "link-1", "from": "nonexistent", "to": "block-1"},
            ],
        }
        with self.assertRaises(ValidationError):
            planner_service.replace_all(self.user, data)
        self.assertEqual(PlannerBlock.objects.filter(user=self.user).count(), 0)
        self.assertEqual(PlannerLink.objects.filter(user=self.user).count(), 0)

    # --- Planner update_block transactional ---

    def test_planner_update_block_rolls_back_on_task_error(self):
        block = PlannerBlock.objects.create(id="blk1", user=self.user, title="B")
        with self.assertRaises(ValidationError):
            planner_service.update_block(self.user, block.id, {
                "tasks": [
                    {"id": "t1", "text": "first", "order": 0},
                    {"id": "t1", "text": "duplicate", "order": 1},
                ],
            })
        self.assertEqual(block.tasks.count(), 0)

    def test_planner_update_block_succeeds(self):
        block = PlannerBlock.objects.create(id="blk1", user=self.user, title="B")
        planner_service.update_block(self.user, block.id, {
            "title": "Updated",
            "tasks": [
                {"id": "t1", "text": "Task 1", "completed": False, "order": 0},
                {"id": "t2", "text": "Task 2", "completed": True, "order": 1},
            ],
        })
        block.refresh_from_db()
        self.assertEqual(block.title, "Updated")
        self.assertEqual(block.tasks.count(), 2)

    # --- Journal replace_all atomicity ---

    def test_journal_replace_all_rolls_back_on_error(self):
        with self.assertRaises(ValidationError):
            journal_service.replace_all(self.user, [
                {"date": "2025-01-01", "content": "First"},
                {"date": "invalid", "content": "Bad"},
            ])
        self.assertEqual(JournalEntry.objects.filter(user=self.user).count(), 0)

    def test_journal_replace_all_replaces_existing(self):
        JournalEntry.objects.create(user=self.user, date=datetime.date(2025, 1, 1), content="Old")
        count = journal_service.replace_all(self.user, [
            {"date": "2025-01-01", "content": "New"},
            {"date": "2025-01-02", "content": "Second"},
        ])
        self.assertEqual(count, 2)
        self.assertEqual(JournalEntry.objects.filter(user=self.user).count(), 2)
        entry = JournalEntry.objects.get(user=self.user, date=datetime.date(2025, 1, 1))
        self.assertEqual(entry.content, "New")


# ============================================================================
# DOMAIN ERROR TESTS
# ============================================================================

class DomainErrorTests(TestCase):
    """Tests for :mod:`tracker.domain.exceptions`."""

    # --- Exception hierarchy ---

    def test_domain_error_is_exception(self):
        self.assertTrue(issubclass(DomainError, Exception))

    def test_not_found_error_is_domain_error(self):
        self.assertTrue(issubclass(NotFoundError, DomainError))

    def test_permission_error_is_domain_error(self):
        self.assertTrue(issubclass(PermissionError, DomainError))

    def test_validation_error_is_domain_error(self):
        self.assertTrue(issubclass(ValidationError, DomainError))

    def test_conflict_error_is_domain_error(self):
        self.assertTrue(issubclass(ConflictError, DomainError))

    def test_rate_limit_error_is_domain_error(self):
        self.assertTrue(issubclass(RateLimitError, DomainError))

    # --- DomainError defaults ---

    def test_domain_error_defaults(self):
        err = DomainError("test message")
        self.assertEqual(err.code, "DOMAIN_ERROR")
        self.assertEqual(err.http_status, 500)
        self.assertEqual(err.message, "test message")
        self.assertIsNone(err.details)

    def test_domain_error_with_details(self):
        err = DomainError("msg", details={"key": "val"})
        self.assertEqual(err.details, {"key": "val"})

    def test_domain_error_str_returns_message(self):
        err = DomainError("hello")
        self.assertEqual(str(err), "hello")

    # --- NotFoundError ---

    def test_not_found_error_defaults(self):
        err = NotFoundError("Object not found")
        self.assertEqual(err.code, "NOT_FOUND")
        self.assertEqual(err.http_status, 404)
        self.assertEqual(err.message, "Object not found")

    def test_not_found_error_custom_message(self):
        err = NotFoundError("Goal not found")
        self.assertEqual(err.message, "Goal not found")

    # --- PermissionError ---

    def test_permission_error_defaults(self):
        err = PermissionError("Access denied")
        self.assertEqual(err.code, "PERMISSION_DENIED")
        self.assertEqual(err.http_status, 403)
        self.assertEqual(err.message, "Access denied")

    # --- ValidationError ---

    def test_validation_error_defaults(self):
        err = ValidationError("Bad input")
        self.assertEqual(err.code, "VALIDATION_ERROR")
        self.assertEqual(err.http_status, 400)
        self.assertEqual(err.message, "Bad input")

    # --- ConflictError ---

    def test_conflict_error_defaults(self):
        err = ConflictError("Duplicate")
        self.assertEqual(err.code, "CONFLICT")
        self.assertEqual(err.http_status, 409)

    # --- RateLimitError ---

    def test_rate_limit_error_defaults(self):
        err = RateLimitError("Too many")
        self.assertEqual(err.code, "RATE_LIMITED")
        self.assertEqual(err.http_status, 429)

    # --- to_http_response ---

    def test_to_http_response_basic(self):
        from rest_framework.response import Response
        err = ValidationError("Invalid data")
        response = to_http_response(err)
        self.assertIsInstance(response, Response)
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["error"]["code"], "VALIDATION_ERROR")
        self.assertEqual(response.data["error"]["message"], "Invalid data")

    def test_to_http_response_with_details(self):
        err = ValidationError("Bad", details={"field": "name"})
        response = to_http_response(err)
        self.assertIn("details", response.data["error"])
        self.assertEqual(response.data["error"]["details"], {"field": "name"})

    def test_to_http_response_not_found(self):
        err = NotFoundError("Not found")
        response = to_http_response(err)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["error"]["code"], "NOT_FOUND")

    def test_to_http_response_permission_denied(self):
        err = PermissionError("No access")
        response = to_http_response(err)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"]["code"], "PERMISSION_DENIED")

    def test_to_http_response_conflict(self):
        err = ConflictError("Duplicate entry")
        response = to_http_response(err)
        self.assertEqual(response.status_code, 409)

    def test_to_http_response_rate_limited(self):
        err = RateLimitError("Slow down")
        response = to_http_response(err)
        self.assertEqual(response.status_code, 429)

    # --- Error type uniqueness ---

    def test_different_error_types_have_different_codes(self):
        codes = [
            DomainError("x").code,
            NotFoundError("x").code,
            PermissionError("x").code,
            ValidationError("x").code,
            ConflictError("x").code,
            RateLimitError("x").code,
        ]
        self.assertEqual(len(codes), len(set(codes)))

    def test_different_error_types_have_different_statuses(self):
        statuses = [
            DomainError("x").http_status,
            NotFoundError("x").http_status,
            PermissionError("x").http_status,
            ValidationError("x").http_status,
            ConflictError("x").http_status,
            RateLimitError("x").http_status,
        ]
        self.assertEqual(len(statuses), len(set(statuses)))


# ============================================================================
# INTEGRATION: DOMAIN SERVICE OWNERSHIP TESTS
# ============================================================================

class ServiceOwnershipTests(TestCase):
    """Integration tests verifying domain services enforce ownership."""

    def setUp(self):
        self.user = _make_user("svcowner", "svc@test.com")
        self.other = _make_user("other", "other@test.com")

    def test_goal_service_get_by_id_other_user_raises(self):
        goal = Goal.objects.create(user=self.other, text="secret")
        with self.assertRaises(NotFoundError):
            goal_service.get_by_id(self.user, goal.id)

    def test_goal_service_create(self):
        goal = goal_service.create(self.user, {"text": "My goal", "category": "daily"})
        self.assertEqual(goal.user, self.user)
        self.assertIsInstance(goal.id, int)

    def test_goal_service_update_other_user_raises(self):
        goal = Goal.objects.create(user=self.other, text="secret")
        with self.assertRaises(NotFoundError):
            goal_service.update(self.user, goal.id, {"status": "completed"})

    def test_goal_service_delete_other_user_raises(self):
        goal = Goal.objects.create(user=self.other, text="secret")
        with self.assertRaises(NotFoundError):
            goal_service.delete(self.user, goal.id)

    def test_goal_service_list_scoped_to_user(self):
        Goal.objects.create(user=self.user, text="Mine", category="daily")
        Goal.objects.create(user=self.other, text="Theirs", category="daily")
        goals = goal_service.list(self.user)
        self.assertEqual(len(goals), 1)
        self.assertEqual(goals[0].text, "Mine")

    def test_expense_service_get_by_id_other_user_raises(self):
        expense = Expense.objects.create(
            user=self.other, date="2025-01-01",
            item="secret", category="Food", quantity=1, price="1.00",
        )
        with self.assertRaises(NotFoundError):
            expense_service.get_by_id(self.user, expense.id)

    def test_expense_service_create(self):
        expense = expense_service.create(self.user, {
            "item": "Coffee", "category": "Food",
            "quantity": 2, "price": "3.50", "date": "2025-01-15",
        })
        self.assertEqual(expense.user, self.user)

    def test_journal_service_get_by_date(self):
        JournalEntry.objects.create(user=self.other, date="2025-01-01", content="secret")
        entry = journal_service.get(self.user, "2025-01-01")
        self.assertIsNone(entry)

    def test_mood_service_get_by_id_other_user_raises(self):
        Mood.objects.create(user=self.other, date="2025-01-01", mood="happy")
        with self.assertRaises(NotFoundError):
            mood_service.get_by_id(self.user, 1)

    def test_water_service_get_by_id_other_user_raises(self):
        Water.objects.create(user=self.other, date="2025-01-01", glasses=5, target=8)
        with self.assertRaises(NotFoundError):
            water_service.get_by_id(self.user, 1)

    def test_achievement_service_create(self):
        achievement = achievement_service.create(self.user, {
            "title": "Test Ach", "description": "Desc", "date": "2025-01-01",
        })
        self.assertEqual(achievement.user, self.user)

    def test_quote_source_service_create(self):
        source = quote_source_service.create(self.user, {
            "title": "My Source", "type": "Movie",
        })
        self.assertEqual(source.user, self.user)

    def test_quote_source_service_get_by_id_other_user_raises(self):
        source = QuoteSource.objects.create(
            id="src1", user=self.other, title="Secret", type="Movie",
        )
        with self.assertRaises(NotFoundError):
            quote_source_service.get_by_id(self.user, source.id)


# ============================================================================
# CROSS-DOMAIN INTEGRATION TESTS (Phase 2)
# ============================================================================


class CrossDomainTests(TestCase):
    """Integration tests for cross-domain relationships (P2-02 .. P2-09)."""

    def setUp(self):
        self.user = _make_user("cross", "cross@test.com")
        self.other = _make_user("other2", "other2@test.com")

    # --- P2-09: UserEvent ---

    def test_event_record_creates_event(self):
        event = event_service.record(
            self.user, "goal_created",
            subject_type="Goal", subject_id="1",
            payload={"text": "Run"},
        )
        self.assertEqual(event.user, self.user)
        self.assertEqual(event.event_type, "goal_created")
        self.assertEqual(event.subject_type, "Goal")
        self.assertEqual(event.payload, {"text": "Run"})

    def test_event_record_invalid_type_raises(self):
        with self.assertRaises(ValidationError):
            event_service.record(self.user, "bogus_type")

    def test_event_count_by_type(self):
        event_service.record(self.user, "goal_created")
        event_service.record(self.user, "goal_created")
        event_service.record(self.user, "expense_created")
        counts = event_service.count_by_type(self.user)
        self.assertEqual(counts["goal_created"], 2)
        self.assertEqual(counts["expense_created"], 1)

    def test_event_ownership_isolated(self):
        event_service.record(self.user, "goal_created")
        event_service.record(self.other, "goal_created")
        self.assertEqual(len(event_service.list(self.user)), 1)
        self.assertEqual(len(event_service.list(self.other)), 1)

    # --- P2-02: Goal -> PlannerTask ---

    def test_planner_task_can_link_to_goal(self):
        goal = Goal.objects.create(user=self.user, text="Health", category="daily")
        block = PlannerBlock.objects.create(id="b-cross", user=self.user, title="B")
        task = PlannerTask.objects.create(id="t-cross", block=block, text="Run", goal=goal)
        self.assertEqual(task.goal, goal)
        self.assertEqual(goal.planner_tasks.count(), 1)

    def test_set_task_goal_links_task_to_goal(self):
        goal = Goal.objects.create(user=self.user, text="Health", category="daily")
        block = PlannerBlock.objects.create(id="b-cross2", user=self.user, title="B")
        task = PlannerTask.objects.create(id="t-cross2", block=block, text="Run")
        planner_service.set_task_goal(self.user, task.id, goal.id)
        task.refresh_from_db()
        self.assertEqual(task.goal, goal)

    def test_set_task_goal_other_user_goal_raises(self):
        goal = Goal.objects.create(user=self.other, text="Secret", category="daily")
        block = PlannerBlock.objects.create(id="b-cross3", user=self.user, title="B")
        task = PlannerTask.objects.create(id="t-cross3", block=block, text="Run")
        with self.assertRaises(ValidationError):
            planner_service.set_task_goal(self.user, task.id, goal.id)

    def test_complete_task_increments_goal_progress(self):
        goal = Goal.objects.create(user=self.user, text="Health", category="daily", target=5)
        block = PlannerBlock.objects.create(id="b-cross4", user=self.user, title="B")
        task = PlannerTask.objects.create(
            id="t-cross4",
            block=block,
            text="Run",
            goal=goal,
            completed=False)
        planner_service.complete_task(self.user, task.id, completed=True)
        goal.refresh_from_db()
        self.assertEqual(goal.completed_tasks, 1)

    # --- P2-03: Goal -> Habit ---

    def test_habit_can_link_to_goal(self):
        goal = Goal.objects.create(user=self.user, text="Health", category="daily")
        habit = Habit.objects.create(id="h-cross", user=self.user, name="Pushups", goal=goal)
        self.assertEqual(habit.goal, goal)
        self.assertEqual(goal.habits.count(), 1)

    def test_habit_log_increments_goal_progress(self):
        goal = Goal.objects.create(user=self.user, text="Health", category="daily", target=10)
        habit = Habit.objects.create(
            id="h-cross2",
            user=self.user,
            name="Pushups",
            target=5,
            goal=goal)
        habit_service.log_score(self.user, habit.id, date="2025-06-01", score=5, target=5)
        goal.refresh_from_db()
        self.assertEqual(goal.completed_tasks, 1)

    def test_habit_goal_must_be_owned(self):
        goal = Goal.objects.create(user=self.other, text="Secret", category="daily")
        with self.assertRaises(ValidationError):
            habit_service.create(self.user, {"name": "Bad", "goal": goal.id})

    # --- P2-04: Achievement trigger_rule ---

    def test_achievement_trigger_rule_stored(self):
        achievement = achievement_service.create(self.user, {
            "title": "Streak", "description": "7 days", "date": "2025-01-01",
            "trigger_rule": {"event_type": "planner_task_completed", "count": 7},
        })
        self.assertEqual(
            achievement.trigger_rule, {
                "event_type": "planner_task_completed", "count": 7})

    # --- P2-07: Expense -> Budget ---

    def test_budget_create_and_actual_vs_budget(self):
        budget = budget_service.create(
            self.user, {
                "category": "Food", "year": 2025, "month": 1, "amount": "100.00"})
        Expense.objects.create(
            user=self.user,
            date="2025-01-05",
            item="Coffee",
            category="Food",
            quantity=1,
            price="30.00")
        Expense.objects.create(
            user=self.user,
            date="2025-01-06",
            item="Lunch",
            category="Food",
            quantity=1,
            price="90.00")
        result = budget_service.actual_vs_budget(self.user, year=2025, month=1)
        self.assertEqual(result["total_budget"], 100.0)
        self.assertEqual(result["total_actual"], 120.0)
        self.assertTrue(result["budgets"][0]["is_over_budget"])

    def test_budget_unique_per_category_month(self):
        budget_service.create(
            self.user, {
                "category": "Food", "year": 2025, "month": 1, "amount": "100.00"})
        with self.assertRaises(Exception):
            budget_service.create(
                self.user, {
                    "category": "Food", "year": 2025, "month": 1, "amount": "50.00"})

    # --- P2-08: DailyActivityAggregate ---

    def test_compute_day_gathers_all_domains(self):
        Habit.objects.create(id="h-ag", user=self.user, name="Run")
        habit_service.log_score(self.user, "h-ag", date="2025-06-01", score=5, target=5)
        Goal.objects.create(
            user=self.user,
            text="Health",
            category="daily",
            status="completed",
            completed_at="2025-06-01T00:00:00Z")
        block = PlannerBlock.objects.create(id="b-ag", user=self.user, title="B")
        PlannerTask.objects.create(id="t-ag", block=block, text="Run", completed=True)
        JournalEntry.objects.create(user=self.user, date="2025-06-01", content="Hello")
        Mood.objects.create(user=self.user, date="2025-06-01", mood="happy")
        Water.objects.create(user=self.user, date="2025-06-01", glasses=8, target=8)
        Expense.objects.create(
            user=self.user,
            date="2025-06-01",
            item="Coffee",
            category="Food",
            quantity=1,
            price="3.50")
        Achievement.objects.create(user=self.user, title="Win", date="2025-06-01")

        aggregate = analytics_service.compute_day(self.user, "2025-06-01")
        self.assertEqual(aggregate.habits_completed, 1)
        self.assertEqual(aggregate.habits_total, 1)
        self.assertEqual(aggregate.goals_completed, 1)
        self.assertTrue(aggregate.has_journal)
        self.assertEqual(aggregate.mood, "happy")
        self.assertEqual(aggregate.water_glasses, 8)
        self.assertEqual(aggregate.expense_count, 1)
        self.assertEqual(aggregate.achievements_earned, 1)
        self.assertEqual(DailyActivityAggregate.objects.filter(user=self.user).count(), 1)

    def test_compute_day_idempotent(self):
        analytics_service.compute_day(self.user, "2025-06-02")
        analytics_service.compute_day(self.user, "2025-06-02")
        self.assertEqual(DailyActivityAggregate.objects.filter(user=self.user).count(), 1)

    def test_get_day_computes_if_missing(self):
        aggregate = analytics_service.get_day(self.user, "2025-06-03")
        self.assertEqual(aggregate.date.isoformat(), "2025-06-03")


# ============================================================================
# PHASE 3 PRODUCTIVITY CORE TESTS (P3-01 .. P3-15)
# ============================================================================


class HabitEnhancementsTests(TestCase):
    def setUp(self):
        self.user = _make_user("habits3", "habits3@test.com")

    def test_create_with_schedule_and_reminders(self):
        habit = habit_service.create(self.user, {
            "name": "Run", "schedule": "weekly",
            "schedule_days": [0, 2, 4], "reminders": [{"at": "07:00"}],
            "grace_period": 1,
        })
        self.assertEqual(habit.schedule, "weekly")
        self.assertEqual(habit.schedule_days, [0, 2, 4])
        self.assertEqual(habit.grace_period, 1)

    def test_history_returns_scores(self):
        habit = habit_service.create(self.user, {"name": "Read"})
        habit_service.log_score(self.user, habit.id, date="2025-06-01", score=5)
        habit_service.log_score(self.user, habit.id, date="2025-06-02", score=0)
        history = habit_service.history(self.user, habit.id)
        self.assertEqual(len(history), 2)

    def test_is_due_today_daily(self):
        habit = habit_service.create(self.user, {"name": "Daily"})
        self.assertTrue(habit_service.is_due_today(habit))

    def test_is_due_today_weekly_matching(self):
        habit = habit_service.create(self.user, {
            "name": "Weekly", "schedule": "weekly", "schedule_days": [date.today().weekday()],
        })
        self.assertTrue(habit_service.is_due_today(habit))

    def test_is_due_today_weekly_non_matching(self):
        habit = habit_service.create(self.user, {
            "name": "Weekly", "schedule": "weekly", "schedule_days": [],
        })
        self.assertFalse(habit_service.is_due_today(habit))

    def test_log_score_updates_streak(self):
        habit = habit_service.create(self.user, {"name": "Run"})
        habit_service.log_score(self.user, habit.id, date=date.today().isoformat(), score=5)
        habit.refresh_from_db()
        self.assertGreaterEqual(habit.streak, 1)


class GoalMilestoneTests(TestCase):
    def setUp(self):
        self.user = _make_user("milestones", "milestones@test.com")

    def test_create_milestone_and_complete(self):
        goal = goal_service.create(self.user, {"text": "Big", "category": "future", "target": 5})
        milestone = milestone_service.create(self.user, goal.id, {"title": "Step 1"})
        self.assertEqual(milestone.goal, goal)
        milestone_service.complete(self.user, milestone.id, completed=True)
        goal.refresh_from_db()
        self.assertEqual(goal.completed_tasks, 1)

    def test_milestone_other_user_not_found(self):
        other = _make_user("other3", "other3@test.com")
        goal = goal_service.create(self.user, {"text": "Mine", "category": "daily"})
        milestone = milestone_service.create(self.user, goal.id, {"title": "Step"})
        with self.assertRaises(NotFoundError):
            milestone_service.get_by_id(other, milestone.id)


class PointsEngineTests(TestCase):
    def setUp(self):
        self.user = _make_user("points", "points@test.com")

    def test_score_day_empty(self):
        self.assertEqual(points_engine.score_day(self.user, "2025-06-01"), 0)

    def test_score_day_with_data(self):
        Habit.objects.create(id="h-pt", user=self.user, name="Run")
        habit_service.log_score(self.user, "h-pt", date="2025-06-01", score=5)
        analytics_service.compute_day(self.user, "2025-06-01")
        score = points_engine.score_day(self.user, "2025-06-01")
        self.assertGreater(score, 0)


class ProductivityTests(TestCase):
    def setUp(self):
        self.user = _make_user("prod", "prod@test.com")

    def test_daily_summary_empty(self):
        summary = productivity_service.daily(self.user, "2025-06-01")
        self.assertEqual(summary["date"], "2025-06-01")
        self.assertEqual(summary["points"], 0)

    def test_weekly_summary(self):
        summary = productivity_service.weekly(self.user, week_start="2025-06-02")
        self.assertEqual(len(summary["days"]), 7)


class RecurringTests(TestCase):
    def setUp(self):
        self.user = _make_user("recur", "recur@test.com")

    def test_generate_daily_goal(self):
        goal_service.create(self.user, {
            "text": "Daily goal", "category": "daily", "recurrence": "daily",
            "start_date": "2025-06-01",
        })
        created = recurring_service.generate_goals(self.user, up_to_date="2025-06-05")
        self.assertGreaterEqual(len(created), 1)
        self.assertEqual(created[0].recurrence, "daily")

    def test_generate_weekly_task(self):
        block = PlannerBlock.objects.create(id="b-rec", user=self.user, title="B")
        PlannerTask.objects.create(
            id="t-rec", block=block, text="Weekly", recurrence="weekly",
            due_date="2025-06-01",
        )
        created = recurring_service.generate_tasks(self.user, up_to_date="2025-06-30")
        self.assertGreaterEqual(len(created), 1)


class PlannerTemplateAndSearchTests(TestCase):
    def setUp(self):
        self.user = _make_user("templates", "templates@test.com")

    def test_create_and_apply_template(self):
        template = planner_template_service.create(self.user, {
            "name": "Morning",
            "data": {"blocks": [{"id": "b1", "title": "B", "x": 0, "y": 0, "tasks": []}], "links": []},
        })
        blocks, links = planner_template_service.apply(self.user, template.id)
        self.assertEqual(blocks, 1)
        self.assertEqual(links, 0)

    def test_search_blocks_and_tasks(self):
        block = PlannerBlock.objects.create(id="b-search", user=self.user, title="Health Block")
        PlannerTask.objects.create(id="t-search", block=block, text="Run daily")
        result = planner_search_service.search(self.user, "Run")
        self.assertEqual(len(result["tasks"]), 1)
        result2 = planner_search_service.search(self.user, "Health")
        self.assertEqual(len(result2["blocks"]), 1)


class AchievementEngineTests(TestCase):
    def setUp(self):
        self.user = _make_user("achengine", "achengine@test.com")

    def test_awards_after_threshold(self):
        for _ in range(7):
            event_service.record(self.user, "planner_task_completed")
        awarded = achievement_engine.evaluate(self.user)
        self.assertGreaterEqual(len(awarded), 1)
        self.assertEqual(awarded[0].trigger_rule["event_type"], "planner_task_completed")

    def test_no_award_below_threshold(self):
        for _ in range(2):
            event_service.record(self.user, "planner_task_completed")
        awarded = achievement_engine.evaluate(self.user)
        self.assertEqual(len(awarded), 0)
