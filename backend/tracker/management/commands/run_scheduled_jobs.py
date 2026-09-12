"""Management command to run scheduled background jobs.

Processes due recurring transactions, sends reminders, checks alerts,
and generates summaries. Designed to be run periodically (e.g., via cron).
"""
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from tracker.domain.services import (
    goal_deadline_alert_service,
    habit_reminder_service,
    budget_alert_service,
    streak_alert_service,
    summary_notification_service,
    recurring_expense_job_service,
    recurring_income_job_service,
    subscription_billing_job_service,
    scheduled_job_service,
)
from tracker.models import User, Goal, Habit, DailyHabitScore, Budget, Expense


class Command(BaseCommand):
    help = "Run scheduled background jobs (reminders, alerts, recurring transactions, summaries)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--user", type=str, default=None,
            help="Optional username to run jobs only for that user.",
        )
        parser.add_argument(
            "--jobs", type=str, default="all",
            help="Comma-separated list of jobs to run (default: all). "
                 "Options: recurring_expenses, recurring_income, subscriptions, "
                 "goal_deadlines, habit_reminders, budget_alerts, streak_alerts, "
                 "weekly_summary, monthly_summary, job_processor, all",
        )
        parser.add_argument(
            "--dry-run", action="store_true",
            help="Show what would be done without making changes.",
        )

    def handle(self, *args, **options):
        username = options.get("user")
        jobs_str = options.get("jobs", "all")
        dry_run = options.get("dry_run", False)

        job_list = [j.strip() for j in jobs_str.split(",")]
        run_all = "all" in job_list

        queryset = User.objects.all()
        if username:
            queryset = queryset.filter(username=username)

        total_results = {}

        for user in queryset:
            self.stdout.write(f"Processing user: {user.username}")
            user_results = {}

            if run_all or "recurring_expenses" in job_list:
                if not dry_run:
                    count = recurring_expense_job_service.process_due(user)
                else:
                    count = self._count_due_recurring_expenses(user)
                user_results["recurring_expenses"] = count
                self.stdout.write(f"  recurring_expenses: {count}")

            if run_all or "recurring_income" in job_list:
                if not dry_run:
                    count = recurring_income_job_service.process_due(user)
                else:
                    count = self._count_due_recurring_income(user)
                user_results["recurring_income"] = count
                self.stdout.write(f"  recurring_income: {count}")

            if run_all or "subscriptions" in job_list:
                if not dry_run:
                    count = subscription_billing_job_service.process_due(user)
                else:
                    count = self._count_due_subscriptions(user)
                user_results["subscriptions"] = count
                self.stdout.write(f"  subscriptions: {count}")

            if run_all or "goal_deadlines" in job_list:
                if not dry_run:
                    count = goal_deadline_alert_service.check_user(user)
                else:
                    count = self._count_due_goal_deadlines(user)
                user_results["goal_deadlines"] = count
                self.stdout.write(f"  goal_deadlines: {count}")

            if run_all or "habit_reminders" in job_list:
                if not dry_run:
                    count = habit_reminder_service.check_user(user)
                else:
                    count = self._count_due_habit_reminders(user)
                user_results["habit_reminders"] = count
                self.stdout.write(f"  habit_reminders: {count}")

            if run_all or "budget_alerts" in job_list:
                if not dry_run:
                    count = budget_alert_service.check_user(user)
                else:
                    count = self._count_budget_alerts(user)
                user_results["budget_alerts"] = count
                self.stdout.write(f"  budget_alerts: {count}")

            if run_all or "streak_alerts" in job_list:
                if not dry_run:
                    count = streak_alert_service.check_user(user)
                else:
                    count = self._count_streak_alerts(user)
                user_results["streak_alerts"] = count
                self.stdout.write(f"  streak_alerts: {count}")

            if run_all or "weekly_summary" in job_list:
                if not dry_run:
                    # Only send on Monday (weekday 0)
                    if date.today().weekday() == 0:
                        summary_notification_service.send_weekly_summary(user)
                        count = 1
                    else:
                        count = 0
                else:
                    count = 1 if date.today().weekday() == 0 else 0
                user_results["weekly_summary"] = count
                self.stdout.write(f"  weekly_summary: {count}")

            if run_all or "monthly_summary" in job_list:
                if not dry_run:
                    # Only send on 1st of month
                    if date.today().day == 1:
                        summary_notification_service.send_monthly_summary(user)
                        count = 1
                    else:
                        count = 0
                else:
                    count = 1 if date.today().day == 1 else 0
                user_results["monthly_summary"] = count
                self.stdout.write(f"  monthly_summary: {count}")

            if run_all or "job_processor" in job_list:
                if not dry_run:
                    count = self._process_scheduled_jobs()
                else:
                    count = self._count_pending_jobs()
                user_results["job_processor"] = count
                self.stdout.write(f"  job_processor: {count}")

            total_results[user.username] = user_results

        self.stdout.write(self.style.SUCCESS(f"Completed for {len(total_results)} user(s)"))
        for username, results in total_results.items():
            self.stdout.write(f"  {username}: {results}")

    def _process_scheduled_jobs(self) -> int:
        """Process due scheduled jobs with retry logic."""
        due_jobs = scheduled_job_service.get_due_jobs(limit=50)
        processed = 0

        for job in due_jobs:
            try:
                scheduled_job_service.start_job(job)

                # Dispatch based on job type
                self._execute_job(job)

                scheduled_job_service.complete_job(job, {"status": "success"})
                processed += 1
            except Exception as e:
                scheduled_job_service.fail_job(job, str(e))

        return processed

    def _execute_job(self, job) -> None:
        """Execute a specific job based on its type."""
        user = job.user
        job_type = job.job_type
        payload = job.payload

        if job_type == 'goal_deadline_check':
            goal_deadline_alert_service.check_user(user)
        elif job_type == 'habit_reminder':
            habit_reminder_service.check_user(user)
        elif job_type == 'budget_alert_check':
            budget_alert_service.check_user(user)
        elif job_type == 'streak_alert_check':
            streak_alert_service.check_user(user)
        elif job_type == 'weekly_summary':
            summary_notification_service.send_weekly_summary(user)
        elif job_type == 'monthly_summary':
            summary_notification_service.send_monthly_summary(user)
        elif job_type == 'recurring_expense_process':
            recurring_expense_job_service.process_due(user)
        elif job_type == 'recurring_income_process':
            recurring_income_job_service.process_due(user)
        elif job_type == 'subscription_billing':
            subscription_billing_job_service.process_due(user)
        else:
            raise ValueError(f"Unknown job type: {job_type}")

    def _count_due_recurring_expenses(self, user) -> int:
        from tracker.models import RecurringExpense
        today = date.today()
        return RecurringExpense.objects.filter(
            user=user, is_active=True, next_occurrence__lte=today
        ).count()

    def _count_due_recurring_income(self, user) -> int:
        from tracker.models import RecurringIncome
        today = date.today()
        return RecurringIncome.objects.filter(
            user=user, is_active=True, next_occurrence__lte=today
        ).count()

    def _count_due_subscriptions(self, user) -> int:
        from tracker.models import Subscription
        today = date.today()
        return Subscription.objects.filter(
            user=user, status='active', next_billing_date__lte=today
        ).count()

    def _count_due_goal_deadlines(self, user) -> int:
        today = date.today()
        target = today + timedelta(days=3)
        return Goal.objects.filter(
            user=user, status='active', due_date__gte=today, due_date__lte=target
        ).count()

    def _count_due_habit_reminders(self, user) -> int:
        from tracker.models import Habit, DailyHabitScore
        today = date.today()
        habits = Habit.objects.filter(user=user)
        count = 0
        for habit in habits:
            if self._is_due_today(habit, today):
                # Check if already completed
                if not DailyHabitScore.objects.filter(user=user, habit=habit, date=today, score__gt=0).exists():
                    count += 1
        return count

    def _count_budget_alerts(self, user) -> int:
        from tracker.models import Budget, Expense
        from django.db.models import Sum, F
        today = date.today()
        count = 0
        for budget in Budget.objects.filter(user=user, year=today.year, month=today.month):
            spent = Expense.objects.filter(
                user=user, category=budget.category, date__year=today.year, date__month=today.month
            ).aggregate(total=Sum(F('quantity') * F('price')))['total'] or 0
            if budget.amount > 0:
                percent = float(spent) / float(budget.amount) * 100
                if percent >= 80:
                    count += 1
        return count

    def _count_streak_alerts(self, user) -> int:
        from tracker.models import Habit, DailyHabitScore
        today = date.today()
        count = 0
        for habit in Habit.objects.filter(user=user):
            if habit.streak > 0 and habit.streak % 7 == 0:
                count += 1
            if habit.streak > 0 and habit.grace_period == 0:
                if not DailyHabitScore.objects.filter(user=user, habit=habit, date=today, score__gt=0).exists():
                    count += 1
        return count

    def _count_pending_jobs(self) -> int:
        from tracker.models import ScheduledJob
        return ScheduledJob.objects.filter(
            status='pending', scheduled_at__lte=timezone.now()
        ).count()

    def _is_due_today(self, habit, check_date):
        if habit.schedule == Habit.SCHEDULE_DAILY:
            return True
        if habit.schedule in [Habit.SCHEDULE_WEEKLY, Habit.SCHEDULE_CUSTOM]:
            return bool(habit.schedule_days) and check_date.weekday() in habit.schedule_days
        return False