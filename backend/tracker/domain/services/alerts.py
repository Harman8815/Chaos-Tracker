"""Alert services for specific notification types (P6-05, P6-06, P6-07, P6-08, P6-09, P6-10, P6-11).

Each alert type has its own checker that creates notifications when conditions are met.
"""

from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Sum, F
from django.utils import timezone

from ...models import (
    Goal,
    Habit,
    DailyHabitScore,
    Budget,
    Expense,
    Achievement,
    DailyActivityAggregate,
    NotificationDeduplication,
)
from .notifications import notification_service
from ..logging import get_logger

logger = get_logger("tracker.domain.alerts")


class GoalDeadlineAlertService:
    """Check for upcoming goal deadlines and notify (P6-05)."""

    def check_user(self, user, *, days_ahead: int = 3) -> int:
        """Check goals with deadlines within days_ahead and create notifications."""
        today = date.today()
        target_date = today + timedelta(days=days_ahead)

        goals = Goal.objects.filter(
            user=user,
            status="active",
            due_date__gte=today,
            due_date__lte=target_date,
        )

        count = 0
        for goal in goals:
            days_left = (goal.due_date - today).days
            self._notify_goal_deadline(user, goal, days_left)
            count += 1

        return count

    def _notify_goal_deadline(self, user, goal: Goal, days_left: int) -> None:
        if days_left == 0:
            title = f"Goal due today: {goal.text[:50]}"
            message = f"Your goal '{goal.text}' is due today!"
            priority = "high"
        elif days_left == 1:
            title = f"Goal due tomorrow: {goal.text[:50]}"
            message = f"Your goal '{
                goal.text}' is due tomorrow. {
                goal.completed_tasks}/{
                goal.target} completed."
            priority = "normal"
        else:
            title = f"Goal due in {days_left} days: {goal.text[:50]}"
            message = f"Your goal '{goal.text}' is due in {days_left} days."
            priority = "low"

        notification_service.create_notification(
            user=user,
            notification_type="goal_deadline",
            title=title,
            message=message,
            priority=priority,
            data={"goal_id": goal.id, "days_left": days_left},
            dedupe_key=f"goal_{goal.id}_{days_left}",
            dedupe_window_hours=12,
        )


class HabitReminderService:
    """Send habit reminders based on schedule (P6-06)."""

    def check_user(self, user, *, check_date: date = None) -> int:
        """Check habits due today and create reminders."""
        check_date = check_date or date.today()
        habits = Habit.objects.filter(user=user)

        count = 0
        for habit in habits:
            if self._is_due_today(habit, check_date):
                self._notify_habit_reminder(user, habit)
                count += 1

        return count

    def _is_due_today(self, habit: Habit, check_date: date) -> bool:
        if habit.schedule == Habit.SCHEDULE_DAILY:
            return True
        if habit.schedule == Habit.SCHEDULE_WEEKLY:
            return bool(habit.schedule_days) and check_date.weekday() in habit.schedule_days
        if habit.schedule == Habit.SCHEDULE_CUSTOM:
            return bool(habit.schedule_days) and check_date.weekday() in habit.schedule_days
        return False

    def _notify_habit_reminder(self, user, habit: Habit) -> None:
        # Check if already completed today
        today_score = DailyHabitScore.objects.filter(
            user=user, habit=habit, date=date.today()
        ).first()

        if today_score and today_score.score > 0:
            return  # Already completed

        title = f"Habit reminder: {habit.name}"
        message = f"Don't forget to complete '{habit.name}' today! Target: {habit.target}"

        notification_service.create_notification(
            user=user,
            notification_type="habit_reminder",
            title=title,
            message=message,
            priority="normal",
            data={"habit_id": habit.id},
            dedupe_key=f"habit_{habit.id}_{date.today()}",
            dedupe_window_hours=24,
        )


class BudgetAlertService:
    """Check budget thresholds and notify (P6-07)."""

    def check_user(self, user, *, year: int = None, month: int = None) -> int:
        """Check all budgets for user and create alerts if thresholds exceeded."""
        today = date.today()
        year = year or today.year
        month = month or today.month

        budgets = Budget.objects.filter(user=user, year=year, month=month)
        count = 0

        for budget in budgets:
            spent = self._get_spent(user, budget.category, year, month)
            percent = (float(spent) / float(budget.amount) * 100) if budget.amount > 0 else 0

            if percent >= 100:
                self._notify_budget_exceeded(user, budget, spent, percent)
                count += 1
            elif percent >= 80:
                self._notify_budget_warning(user, budget, spent, percent)
                count += 1

        return count

    def _get_spent(self, user, category: str, year: int, month: int) -> Decimal:
        result = Expense.objects.filter(
            user=user,
            category=category,
            date__year=year,
            date__month=month,
        ).aggregate(total=Sum(F("quantity") * F("price")))
        return result["total"] or Decimal("0")

    def _notify_budget_warning(self, user, budget: Budget, spent: Decimal, percent: float) -> None:
        dedupe_key = f"budget_{budget.id}_warning_{int(percent)}"
        if self._already_notified(user, "budget_alert", dedupe_key, hours=24):
            return

        title = f"Budget warning: {budget.category}"
        message = f"You've spent {
            percent:.0f}% of your ${
            budget.amount} budget for {
            budget.category} (${
                spent:.2f} used)."

        notification_service.create_notification(
            user=user,
            notification_type="budget_alert",
            title=title,
            message=message,
            priority="normal",
            data={
                "budget_id": budget.id,
                "category": budget.category,
                "percent": percent,
                "spent": float(spent),
            },
            dedupe_key=dedupe_key,
            dedupe_window_hours=24,
        )

    def _notify_budget_exceeded(self, user, budget: Budget, spent: Decimal, percent: float) -> None:
        dedupe_key = f"budget_{budget.id}_exceeded"
        if self._already_notified(user, "budget_alert", dedupe_key, hours=12):
            return

        title = f"Budget exceeded: {budget.category}"
        message = f"You've exceeded your ${
            budget.amount} budget for {
            budget.category} by ${
            float(spent) -
            float(
                budget.amount):.2f}!"

        notification_service.create_notification(
            user=user,
            notification_type="budget_alert",
            title=title,
            message=message,
            priority="high",
            data={
                "budget_id": budget.id,
                "category": budget.category,
                "percent": percent,
                "spent": float(spent),
            },
            dedupe_key=dedupe_key,
            dedupe_window_hours=12,
        )

    def _already_notified(self, user, notification_type: str, dedupe_key: str, hours: int) -> bool:
        window_start = timezone.now() - timedelta(hours=hours)
        return NotificationDeduplication.objects.filter(
            user=user,
            notification_type=notification_type,
            dedupe_key=dedupe_key,
            sent_at__gte=window_start,
        ).exists()


class StreakAlertService:
    """Protect and celebrate streaks (P6-08)."""

    def check_user(self, user) -> int:
        """Check all habits for streak milestones and risks."""
        habits = Habit.objects.filter(user=user)
        count = 0

        for habit in habits:
            # Celebrate milestones
            if habit.streak > 0 and habit.streak % 7 == 0:
                self._notify_streak_milestone(user, habit)
                count += 1

            # Warn about streak at risk
            if self._is_streak_at_risk(habit):
                self._notify_streak_at_risk(user, habit)
                count += 1

        return count

    def _is_streak_at_risk(self, habit: Habit) -> bool:
        """Check if streak will break today if not completed."""
        if habit.streak == 0:
            return False

        today_score = DailyHabitScore.objects.filter(
            user=habit.user, habit=habit, date=date.today()
        ).first()

        if today_score and today_score.score > 0:
            return False

        # Check grace period
        if habit.grace_period > 0:
            return False

        return True

    def _notify_streak_milestone(self, user, habit: Habit) -> None:
        title = f"🔥 {habit.streak}-day streak!"
        message = f"Amazing! You've maintained a {habit.streak}-day streak for '{habit.name}'."

        notification_service.create_notification(
            user=user,
            notification_type="streak_alert",
            title=title,
            message=message,
            priority="normal",
            data={"habit_id": habit.id, "streak": habit.streak, "type": "milestone"},
            dedupe_key=f"streak_milestone_{habit.id}_{habit.streak}",
            dedupe_window_hours=24,
        )

    def _notify_streak_at_risk(self, user, habit: Habit) -> None:
        title = f"⚠️ Streak at risk: {habit.name}"
        message = f"Your {
            habit.streak}-day streak for '{
            habit.name}' will break if you don't complete it today!"

        notification_service.create_notification(
            user=user,
            notification_type="streak_alert",
            title=title,
            message=message,
            priority="high",
            data={"habit_id": habit.id, "streak": habit.streak, "type": "at_risk"},
            dedupe_key=f"streak_risk_{habit.id}_{date.today()}",
            dedupe_window_hours=12,
        )


class AchievementNotificationService:
    """Notify when achievements are earned (P6-09)."""

    def notify_achievement_earned(self, user, achievement: Achievement) -> None:
        """Create notification for newly earned achievement."""
        title = f"🏆 Achievement unlocked: {achievement.title}"
        message = f"Congratulations! You've earned '{achievement.title}'."

        if achievement.description:
            message += f" {achievement.description}"

        notification_service.create_notification(
            user=user,
            notification_type="achievement_earned",
            title=title,
            message=message,
            priority="normal",
            data={"achievement_id": achievement.id, "image": achievement.image},
            dedupe_key=f"achievement_{achievement.id}",
            dedupe_window_hours=24 * 365,  # Essentially permanent dedupe
        )


class SummaryNotificationService:
    """Generate weekly and monthly summary notifications (P6-10, P6-11)."""

    def send_weekly_summary(self, user) -> None:
        """Send weekly summary notification."""
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        # Get stats for the week
        aggregates = DailyActivityAggregate.objects.filter(
            user=user, date__range=[week_start, week_end]
        )

        if not aggregates:
            return

        habits_completed = sum(a.habits_completed for a in aggregates)
        habits_total = sum(a.habits_total for a in aggregates)
        tasks_completed = sum(a.planner_tasks_completed for a in aggregates)
        goals_completed = sum(a.goals_completed for a in aggregates)
        journal_days = sum(1 for a in aggregates if a.has_journal)
        total_points = sum(a.points for a in aggregates)

        title = f"📊 Weekly Summary ({week_start.strftime('%b %d')} - {week_end.strftime('%b %d')})"
        message = (
            f"This week you completed {habits_completed}/{habits_total} habits, "
            f"{tasks_completed} tasks, {goals_completed} goals, "
            f"and journaled {journal_days}/7 days. Total points: {total_points}."
        )

        notification_service.create_notification(
            user=user,
            notification_type="weekly_summary",
            title=title,
            message=message,
            priority="low",
            data={
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat(),
                "habits_completed": habits_completed,
                "habits_total": habits_total,
                "tasks_completed": tasks_completed,
                "goals_completed": goals_completed,
                "journal_days": journal_days,
                "total_points": total_points,
            },
            dedupe_key=f"weekly_summary_{week_start.isoformat()}",
            dedupe_window_hours=24 * 8,  # Once per week
        )

    def send_monthly_summary(self, user) -> None:
        """Send monthly summary notification."""
        today = date.today()
        month_start = today.replace(day=1)
        if today.month == 12:
            month_end = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = today.replace(month=today.month + 1, day=1) - timedelta(days=1)

        aggregates = DailyActivityAggregate.objects.filter(
            user=user, date__range=[month_start, month_end]
        )

        if not aggregates:
            return

        habits_completed = sum(a.habits_completed for a in aggregates)
        habits_total = sum(a.habits_total for a in aggregates)
        tasks_completed = sum(a.planner_tasks_completed for a in aggregates)
        goals_completed = sum(a.goals_completed for a in aggregates)
        journal_days = sum(1 for a in aggregates if a.has_journal)
        total_points = sum(a.points for a in aggregates)

        # Top categories for expenses
        expenses = Expense.objects.filter(user=user, date__range=[month_start, month_end])
        expense_total = sum(float(e.total) for e in expenses)

        title = f"📈 Monthly Summary ({month_start.strftime('%B %Y')})"
        message = (
            f"This month you completed {habits_completed}/{habits_total} habits, "
            f"{tasks_completed} tasks, {goals_completed} goals, "
            f"and journaled {journal_days} days. "
            f"Total points: {total_points}. Expenses: ${expense_total:.2f}."
        )

        notification_service.create_notification(
            user=user,
            notification_type="monthly_summary",
            title=title,
            message=message,
            priority="low",
            data={
                "month": month_start.strftime("%Y-%m"),
                "habits_completed": habits_completed,
                "habits_total": habits_total,
                "tasks_completed": tasks_completed,
                "goals_completed": goals_completed,
                "journal_days": journal_days,
                "total_points": total_points,
                "expense_total": expense_total,
            },
            dedupe_key=f"monthly_summary_{month_start.strftime('%Y-%m')}",
            dedupe_window_hours=24 * 32,  # Once per month
        )


# Singleton instances
goal_deadline_alert_service = GoalDeadlineAlertService()
habit_reminder_service = HabitReminderService()
budget_alert_service = BudgetAlertService()
streak_alert_service = StreakAlertService()
achievement_notification_service = AchievementNotificationService()
summary_notification_service = SummaryNotificationService()
