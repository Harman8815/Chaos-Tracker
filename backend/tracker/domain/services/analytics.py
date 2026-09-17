"""Analytics domain service.

Computes :class:`DailyActivityAggregate` rows from the canonical domain
models. Aggregates are derived caches: the individual models remain the
source of truth, and this service recomputes them on demand.

Enhanced with: consistency score, goal velocity, financial health metrics,
trend detection, correlation engine, and insight generation.
"""

from datetime import date, datetime, timedelta
from statistics import mean
from collections import defaultdict


from ...models import (
    DailyActivityAggregate,
    DailyHabitScore,
    Expense,
    Goal,
    Achievement,
    JournalEntry,
    Mood,
    PlannerTask,
    Water,
    Income,
)
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.analytics")


class AnalyticsService:
    """Computes and stores daily activity aggregates."""

    def compute_day(self, user, target_date):
        """Recompute the aggregate for a single ``(user, date)``."""
        target_date = _coerce_date(target_date)
        data = self._gather(user, target_date)
        aggregate, _created = DailyActivityAggregate.objects.update_or_create(
            user=user,
            date=target_date,
            defaults=data,
        )
        return aggregate

    def compute_range(self, user, start_date, end_date):
        """Recompute aggregates for every day in ``[start_date, end_date]``."""
        start_date = _coerce_date(start_date)
        end_date = _coerce_date(end_date)
        if start_date > end_date:
            raise ValidationError("start_date must be on or before end_date")
        results = []
        current = start_date
        while current <= end_date:
            results.append(self.compute_day(user, current))
            current += timedelta(days=1)
        return results

    def get_day(self, user, target_date):
        """Return the aggregate for a date, computing it if missing."""
        target_date = _coerce_date(target_date)
        aggregate = DailyActivityAggregate.objects.filter(
            user=user,
            date=target_date,
        ).first()
        if aggregate is None:
            aggregate = self.compute_day(user, target_date)
        return aggregate

    def list_days(self, user, *, start_date=None, end_date=None, limit=None):
        qs = DailyActivityAggregate.objects.filter(user=user)
        if start_date:
            qs = qs.filter(date__gte=_coerce_date(start_date))
        if end_date:
            qs = qs.filter(date__lte=_coerce_date(end_date))
        qs = qs.order_by("-date")
        if limit:
            qs = qs[:limit]
        return list(qs)

    # --- Enhanced Analytics Methods ---

    def get_consistency_score(self, user, *, days=30):
        """Calculate habit/activity consistency score over the given period.

        Returns a score 0-100 representing how consistently the user
        completes their habits and activities.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        aggregates = DailyActivityAggregate.objects.filter(
            user=user, date__range=[start_date, end_date]
        ).order_by("date")

        if not aggregates:
            return {"score": 0, "days_analyzed": 0, "message": "No data available"}

        total_possible = 0
        total_completed = 0

        for agg in aggregates:
            total_possible += agg.habits_total + (
                1 if agg.habits_total > 0 else 0
            )  # habits + journal
            total_completed += agg.habits_completed + (1 if agg.has_journal else 0)

        # Also consider planner tasks
        for agg in aggregates:
            total_possible += agg.planner_tasks_created
            total_completed += agg.planner_tasks_completed

        consistency = (total_completed / total_possible * 100) if total_possible > 0 else 0

        return {
            "score": round(consistency, 1),
            "days_analyzed": len(aggregates),
            "total_possible": total_possible,
            "total_completed": total_completed,
        }

    def get_goal_velocity(self, user, *, days=30):
        """Measure goal completion speed over the given period.

        Returns velocity metrics showing how quickly goals are being completed.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        goals_completed = Goal.objects.filter(
            user=user, status="completed", completed_at__date__range=[start_date, end_date]
        )

        completed_count = goals_completed.count()

        if completed_count == 0:
            return {
                "goals_completed": 0,
                "avg_completion_days": 0,
                "velocity_per_week": 0,
                "message": "No goals completed in period",
            }

        completion_times = []
        for goal in goals_completed:
            if goal.created_at and goal.completed_at:
                days_to_complete = (goal.completed_at.date() - goal.created_at.date()).days
                completion_times.append(max(1, days_to_complete))

        avg_days = mean(completion_times) if completion_times else 0
        velocity = (completed_count / days) * 7  # goals per week

        return {
            "goals_completed": completed_count,
            "avg_completion_days": round(avg_days, 1),
            "velocity_per_week": round(velocity, 2),
            "completion_times": completion_times,
        }

    def get_financial_health_metrics(self, user, *, days=30):
        """Calculate spending/cash-flow metrics for financial health.

        Returns metrics including spending rate, savings rate, and category breakdown.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date])

        incomes = Income.objects.filter(user=user, date__range=[start_date, end_date])

        total_expenses = sum(float(e.total) for e in expenses)
        total_income = sum(float(i.amount) for i in incomes)
        net_flow = total_income - total_expenses
        savings_rate = (net_flow / total_income * 100) if total_income > 0 else 0

        # Category breakdown
        category_totals = defaultdict(float)
        for e in expenses:
            category_totals[e.category] += float(e.total)

        # Daily spending rate
        daily_spending = total_expenses / days if days > 0 else 0

        return {
            "period_days": days,
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_flow": round(net_flow, 2),
            "savings_rate": round(savings_rate, 1),
            "daily_spending_rate": round(daily_spending, 2),
            "category_breakdown": dict(sorted(category_totals.items(), key=lambda x: -x[1])),
        }

    def detect_trends(self, user, *, days=30):
        """Detect rising/falling behavior trends across domains.

        Analyzes daily aggregates to identify upward or downward trends.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        aggregates = DailyActivityAggregate.objects.filter(
            user=user, date__range=[start_date, end_date]
        ).order_by("date")

        if len(aggregates) < 7:
            return {"trends": {}, "message": "Insufficient data for trend analysis"}

        # Split into two halves for comparison
        mid = len(aggregates) // 2
        first_half = aggregates[:mid]
        second_half = aggregates[mid:]

        def avg(objs, field):
            values = [getattr(o, field) for o in objs]
            return mean(values) if values else 0

        trends = {}
        fields = [
            "habits_completed",
            "goals_completed",
            "planner_tasks_completed",
            "water_glasses",
            "expense_total",
            "points",
        ]

        for field in fields:
            first_avg = avg(first_half, field)
            second_avg = avg(second_half, field)
            change = second_avg - first_avg
            pct_change = (change / first_avg * 100) if first_avg > 0 else 0

            if abs(pct_change) < 5:
                direction = "stable"
            elif change > 0:
                direction = "rising"
            else:
                direction = "falling"

            trends[field] = {
                "direction": direction,
                "change": round(change, 2),
                "pct_change": round(pct_change, 1),
                "first_half_avg": round(first_avg, 2),
                "second_half_avg": round(second_avg, 2),
            }

        return {"trends": trends, "days_analyzed": len(aggregates)}

    def correlation_engine(self, user, *, days=30):
        """Compare domains to find correlations.

        Returns correlation coefficients between different activity domains.
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        aggregates = list(
            DailyActivityAggregate.objects.filter(
                user=user, date__range=[start_date, end_date]
            ).order_by("date")
        )

        if len(aggregates) < 7:
            return {"correlations": {}, "message": "Insufficient data for correlation analysis"}

        # Extract numeric series for each domain
        series = {
            "habits_completed": [a.habits_completed for a in aggregates],
            "goals_completed": [a.goals_completed for a in aggregates],
            "planner_tasks_completed": [a.planner_tasks_completed for a in aggregates],
            "water_glasses": [a.water_glasses for a in aggregates],
            "expense_total": [float(a.expense_total) for a in aggregates],
            "points": [a.points for a in aggregates],
            "has_journal": [1 if a.has_journal else 0 for a in aggregates],
        }

        def correlation(x, y):
            if len(x) != len(y) or len(x) < 2:
                return 0
            mx, my = mean(x), mean(y)
            dx = [xi - mx for xi in x]
            dy = [yi - my for yi in y]
            numerator = sum(dx[i] * dy[i] for i in range(len(x)))
            denom_x = sum(d * d for d in dx)
            denom_y = sum(d * d for d in dy)
            if denom_x == 0 or denom_y == 0:
                return 0
            return numerator / (denom_x**0.5 * denom_y**0.5)

        domains = list(series.keys())
        correlations = {}

        for i, d1 in enumerate(domains):
            for d2 in domains[i + 1 :]:
                corr = correlation(series[d1], series[d2])
                if abs(corr) > 0.3:  # Only report meaningful correlations
                    strength = "strong" if abs(corr) > 0.7 else "moderate"
                    direction = "positive" if corr > 0 else "negative"
                    correlations[f"{d1}_vs_{d2}"] = {
                        "coefficient": round(corr, 3),
                        "strength": strength,
                        "direction": direction,
                    }

        return {"correlations": correlations, "days_analyzed": len(aggregates)}

    def generate_insights(self, user, *, days=30):
        """Convert metrics into human-readable explanations.

        Generates actionable insights based on the analytics data.
        """
        insights = []

        # Get consistency
        consistency = self.get_consistency_score(user, days=days)
        if consistency["score"] >= 80:
            insights.append(
                {
                    "type": "positive",
                    "title": "Excellent Consistency",
                    "message": f"You're completing {consistency['score']}% of your tracked activities. Keep up the great work!",  # noqa: E501
                    "domain": "consistency",
                }
            )
        elif consistency["score"] >= 50:
            insights.append(
                {
                    "type": "neutral",
                    "title": "Moderate Consistency",
                    "message": f"You're completing {consistency['score']}% of activities. Try to build a daily routine to improve.",  # noqa: E501
                    "domain": "consistency",
                }
            )
        else:
            insights.append(
                {
                    "type": "negative",
                    "title": "Low Consistency",
                    "message": f"Only {
                        consistency['score']}% completion rate. Consider reducing habit targets or focusing on 1-2 key habits.",  # noqa: E501
                    "domain": "consistency",
                }
            )

        # Goal velocity
        velocity = self.get_goal_velocity(user, days=days)
        if velocity["goals_completed"] > 0:
            if velocity["velocity_per_week"] >= 1:
                insights.append(
                    {
                        "type": "positive",
                        "title": "Strong Goal Progress",
                        "message": f"Completing {
                            velocity['velocity_per_week']} goals/week. Average completion time: {
                            velocity['avg_completion_days']} days.",
                        "domain": "goals",
                    }
                )
            else:
                insights.append(
                    {
                        "type": "neutral",
                        "title": "Slow Goal Progress",
                        "message": f"Only {
                            velocity['goals_completed']} goals completed in {days} days. Consider breaking goals into smaller milestones.",  # noqa: E501
                        "domain": "goals",
                    }
                )
        else:
            insights.append(
                {
                    "type": "neutral",
                    "title": "No Goals Completed",
                    "message": "No goals completed in this period. Set smaller, achievable goals to build momentum.",  # noqa: E501
                    "domain": "goals",
                }
            )

        # Financial health
        financial = self.get_financial_health_metrics(user, days=days)
        if financial["savings_rate"] >= 20:
            insights.append(
                {
                    "type": "positive",
                    "title": "Healthy Savings Rate",
                    "message": f"Saving {financial['savings_rate']}% of income. Great financial discipline!",  # noqa: E501
                    "domain": "finance",
                }
            )
        elif financial["savings_rate"] >= 0:
            insights.append(
                {
                    "type": "neutral",
                    "title": "Positive Cash Flow",
                    "message": f"Saving {financial['savings_rate']}% of income. Consider increasing savings rate.",  # noqa: E501
                    "domain": "finance",
                }
            )
        else:
            insights.append(
                {
                    "type": "negative",
                    "title": "Negative Cash Flow",
                    "message": f"Spending ${
                        abs(
                            financial['net_flow']):.2f} more than income. Review top expense categories: {  # noqa: E501
                        ', '.join(
                            list(
                                financial['category_breakdown'].keys())[
                                :3])}.",
                    "domain": "finance",
                }
            )

        # Trends
        trends = self.detect_trends(user, days=days)
        for domain, data in trends.get("trends", {}).items():
            if data["direction"] == "rising" and data["pct_change"] > 20:
                insights.append(
                    {
                        "type": "positive",
                        "title": f"{domain.replace('_', ' ').title()} Improving",
                        "message": f"{domain.replace('_', ' ').title()} increased by {data['pct_change']}% recently.",  # noqa: E501
                        "domain": "trends",
                    }
                )
            elif data["direction"] == "falling" and data["pct_change"] < -20:
                insights.append(
                    {
                        "type": "negative",
                        "title": f"{domain.replace('_', ' ').title()} Declining",
                        "message": f"{domain.replace('_', ' ').title()} decreased by {abs(data['pct_change'])}% recently. Consider addressing this.",  # noqa: E501
                        "domain": "trends",
                    }
                )

        # Correlations
        correlations = self.correlation_engine(user, days=days)
        for key, data in correlations.get("correlations", {}).items():
            if data["strength"] == "strong" and data["direction"] == "positive":
                d1, d2 = key.split("_vs_")
                insights.append(
                    {
                        "type": "insight",
                        "title": f"{
                            d1.replace(
                                '_', ' ').title()} Correlates with {
                            d2.replace(
                                '_', ' ').title()}",
                        "message": f"When {
                            d1.replace(
                                '_', ' ')} increases, {
                                    d2.replace(
                                        '_', ' ')} tends to increase too (r={
                                            data['coefficient']}).",
                        "domain": "correlation",
                    }
                )

        return {"insights": insights, "generated_at": datetime.now().isoformat()}

    def get_productivity_score(self, user, *, days=30):
        """Unified productivity score combining all domains."""
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)

        aggregates = DailyActivityAggregate.objects.filter(
            user=user, date__range=[start_date, end_date]
        )

        if not aggregates:
            return {"score": 0, "components": {}, "message": "No data available"}

        # Component scores (0-100 each)
        total_habits = sum(a.habits_total for a in aggregates)
        completed_habits = sum(a.habits_completed for a in aggregates)
        habit_score = (completed_habits / total_habits * 100) if total_habits > 0 else 50

        total_tasks = sum(a.planner_tasks_created for a in aggregates)
        completed_tasks = sum(a.planner_tasks_completed for a in aggregates)
        task_score = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 50

        journal_days = sum(1 for a in aggregates if a.has_journal)
        journal_score = journal_days / len(aggregates) * 100

        water_days = sum(
            1 for a in aggregates if a.water_glasses >= a.water_target and a.water_target > 0
        )
        water_score = water_days / len(aggregates) * 100

        # Weighted average
        weights = {
            "habits": 0.35,
            "tasks": 0.25,
            "journal": 0.15,
            "water": 0.10,
            "goals": 0.15,
        }

        goals_completed = sum(a.goals_completed for a in aggregates)
        goals_created = Goal.objects.filter(
            user=user, created_at__date__range=[start_date, end_date]
        ).count()
        goal_score = (goals_completed / goals_created * 100) if goals_created > 0 else 50

        productivity = (
            habit_score * weights["habits"]
            + task_score * weights["tasks"]
            + journal_score * weights["journal"]
            + water_score * weights["water"]
            + goal_score * weights["goals"]
        )

        return {
            "score": round(productivity, 1),
            "components": {
                "habits": round(habit_score, 1),
                "tasks": round(task_score, 1),
                "journal": round(journal_score, 1),
                "water": round(water_score, 1),
                "goals": round(goal_score, 1),
            },
            "weights": weights,
            "days_analyzed": len(aggregates),
        }

    # --- internal helpers ---

    def _gather(self, user, target_date):
        habit_scores = DailyHabitScore.objects.filter(user=user, date=target_date)
        habits_completed = sum(1 for s in habit_scores if s.score > 0)
        habits_total = habit_scores.count()

        goals_completed = Goal.objects.filter(
            user=user,
            status="completed",
            completed_at__date=target_date,
        ).count()
        goals_created = Goal.objects.filter(
            user=user,
            created_at__date=target_date,
        ).count()

        task_qs = PlannerTask.objects.filter(block__user=user)
        tasks_completed = task_qs.filter(completed=True, updated_at__date=target_date).count()
        tasks_created = task_qs.filter(created_at__date=target_date).count()

        journal = JournalEntry.objects.filter(user=user, date=target_date).first()
        has_journal = journal is not None

        mood = Mood.objects.filter(user=user, date=target_date).first()
        mood_value = mood.mood if mood is not None else ""

        water = Water.objects.filter(user=user, date=target_date).first()
        water_glasses = water.glasses if water is not None else 0
        water_target = water.target if water is not None else 0

        expense_qs = Expense.objects.filter(user=user, date=target_date)
        expense_count = expense_qs.count()
        expense_total = sum((e.total for e in expense_qs), 0)

        achievements = Achievement.objects.filter(user=user, date=target_date).count()

        return {
            "habits_completed": habits_completed,
            "habits_total": habits_total,
            "goals_completed": goals_completed,
            "goals_created": goals_created,
            "planner_tasks_completed": tasks_completed,
            "planner_tasks_created": tasks_created,
            "has_journal": has_journal,
            "mood": mood_value,
            "water_glasses": water_glasses,
            "water_target": water_target,
            "expense_count": expense_count,
            "expense_total": expense_total,
            "points": 0,
            "achievements_earned": achievements,
        }


def _coerce_date(value):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, str):
        from .. import validation

        return validation.parse_date(value, field="date")
    raise ValidationError("date must be a date or YYYY-MM-DD string")


analytics_service = AnalyticsService()
