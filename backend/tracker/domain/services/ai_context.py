"""AI Context builder and intent detection (P7-07, P7-08)."""
from datetime import date, datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

from django.db.models import Count, Sum

from ...models import (
    AIConversation, AIMessage, Goal, Habit, DailyHabitScore,
    Expense, JournalEntry, Mood, Water, Achievement,
    DailyActivityAggregate, Budget,
    AIMemory,
)
from ..services.memory import memory_service
from ..logging import get_logger

logger = get_logger("tracker.domain.ai_context")


@dataclass
class IntentResult:
    intent: str
    confidence: float
    entities: Dict[str, Any]


class ContextBuilder:
    """Builds relevant context for AI requests based on user data."""

    def __init__(self, user, conversation: AIConversation = None):
        self.user = user
        self.conversation = conversation
        self._cache = {}

    def build(self, include_recent_messages: int = 10) -> Dict[str, Any]:
        """Build complete context for AI."""
        context = {
            'user_profile': self._get_user_profile(),
            'today_summary': self._get_today_summary(),
            'active_goals': self._get_active_goals(),
            'habits': self._get_habits_summary(),
            'recent_expenses': self._get_recent_expenses(),
            'recent_journal': self._get_recent_journal(),
            'current_mood': self._get_current_mood(),
            'water_intake': self._get_water_intake(),
            'achievements': self._get_recent_achievements(),
            'budgets': self._get_budget_status(),
            'memories': self._get_relevant_memories(),
        }

        if self.conversation:
            context['conversation_history'] = self._get_conversation_history(include_recent_messages)

        return context

    def _get_user_profile(self) -> Dict:
        try:
            profile = self.user.profile
            return {
                'username': self.user.username,
                'timezone': profile.timezone,
                'date_joined': self.user.date_joined.isoformat() if self.user.date_joined else None,
            }
        except Exception:
            return {'username': self.user.username}

    def _get_today_summary(self) -> Dict:
        today = date.today()
        try:
            agg = DailyActivityAggregate.objects.filter(user=self.user, date=today).first()
            if agg:
                return {
                    'date': today.isoformat(),
                    'habits_completed': agg.habits_completed,
                    'habits_total': agg.habits_total,
                    'goals_completed': agg.goals_completed,
                    'tasks_completed': agg.planner_tasks_completed,
                    'has_journal': agg.has_journal,
                    'mood': agg.mood,
                    'water_glasses': agg.water_glasses,
                    'water_target': agg.water_target,
                    'expense_total': float(agg.expense_total),
                    'points': agg.points,
                }
        except Exception:
            pass
        return {'date': today.isoformat(), 'data_available': False}

    def _get_active_goals(self) -> List[Dict]:
        goals = Goal.objects.filter(user=self.user, status='active').select_related()[:10]
        return [{
            'id': g.id,
            'text': g.text,
            'category': g.category,
            'target': g.target,
            'completed_tasks': g.completed_tasks,
            'due_date': g.due_date.isoformat() if g.due_date else None,
            'priority': g.priority,
        } for g in goals]

    def _get_habits_summary(self) -> List[Dict]:
        habits = Habit.objects.filter(user=self.user)[:20]
        result = []
        for h in habits:
            today_score = DailyHabitScore.objects.filter(user=self.user, habit=h, date=date.today()).first()
            result.append({
                'id': h.id,
                'name': h.name,
                'target': h.target,
                'range_max': h.range_max,
                'schedule': h.schedule,
                'streak': h.streak,
                'today_score': today_score.score if today_score else 0,
                'completed_today': today_score.score > 0 if today_score else False,
            })
        return result

    def _get_recent_expenses(self, days: int = 7) -> List[Dict]:
        since = date.today() - timedelta(days=days)
        expenses = Expense.objects.filter(user=self.user, date__gte=since).order_by('-date')[:20]
        return [{
            'id': e.id,
            'date': e.date.isoformat(),
            'item': e.item,
            'category': e.category,
            'total': float(e.total),
        } for e in expenses]

    def _get_recent_journal(self, days: int = 7) -> List[Dict]:
        since = date.today() - timedelta(days=days)
        entries = JournalEntry.objects.filter(user=self.user, date__gte=since).order_by('-date')[:10]
        return [{
            'date': e.date.isoformat(),
            'content': e.content[:200],
        } for e in entries]

    def _get_current_mood(self) -> Optional[str]:
        mood = Mood.objects.filter(user=self.user, date=date.today()).first()
        return mood.mood if mood else None

    def _get_water_intake(self) -> Dict:
        water = Water.objects.filter(user=self.user, date=date.today()).first()
        if water:
            return {'glasses': water.glasses, 'target': water.target}
        return {'glasses': 0, 'target': 8}

    def _get_recent_achievements(self, limit: int = 5) -> List[Dict]:
        achievements = Achievement.objects.filter(user=self.user).order_by('-date')[:limit]
        return [{
            'id': a.id,
            'title': a.title,
            'date': a.date.isoformat(),
        } for a in achievements]

    def _get_relevant_memories(self) -> List[Dict]:
        """Get relevant memories for the current context."""
        try:
            # Search for recent/important memories
            memories = memory_service.search_memories(
                user=self.user,
                query="",
                limit=10,
                memory_types=['fact', 'preference', 'insight', 'summary'],
                min_importance=3,
            )
            return [{
                'id': m.id,
                'content': m.content,
                'memory_type': m.memory_type,
                'importance': m.importance,
                'tags': m.tags,
                'source': m.source,
            } for m in memories]
        except Exception:
            return []

    def _get_budget_status(self) -> List[Dict]:
        today = date.today()
        budgets = Budget.objects.filter(user=self.user, year=today.year, month=today.month)
        result = []
        for b in budgets:
            spent = Expense.objects.filter(
                user=self.user, category=b.category,
                date__year=today.year, date__month=today.month
            ).aggregate(total=Sum('quantity', output_field=None) * Sum('price', output_field=None))['total'] or 0
            percent = (float(spent) / float(b.amount) * 100) if b.amount > 0 else 0
            result.append({
                'category': b.category,
                'budget': float(b.amount),
                'spent': float(spent),
                'percent': round(percent, 1),
            })
        return result

    def _get_conversation_history(self, limit: int) -> List[Dict]:
        if not self.conversation:
            return []
        messages = AIMessage.objects.filter(conversation=self.conversation).order_by('-created_at')[:limit]
        return list(reversed([{
            'role': m.role,
            'content': m.content,
            'tool_calls': m.tool_calls,
            'created_at': m.created_at.isoformat(),
        } for m in messages]))


class IntentDetector:
    """Detects user intent from message content (P7-08)."""

    INTENTS = {
        'create_goal': ['create goal', 'new goal', 'add goal', 'set goal'],
        'update_goal': ['update goal', 'change goal', 'modify goal', 'edit goal'],
        'complete_goal': ['complete goal', 'finish goal', 'done goal', 'mark goal done'],
        'create_habit': ['create habit', 'new habit', 'add habit', 'start habit'],
        'log_habit': ['log habit', 'track habit', 'complete habit', 'did habit'],
        'create_expense': ['add expense', 'log expense', 'record expense', 'spent money'],
        'view_expenses': ['show expenses', 'view expenses', 'expense summary', 'spending'],
        'create_budget': ['create budget', 'set budget', 'add budget'],
        'check_budget': ['check budget', 'budget status', 'budget progress'],
        'view_analytics': ['analytics', 'insights', 'trends', 'statistics', 'summary'],
        'create_journal': ['journal', 'write journal', 'diary entry'],
        'log_mood': ['mood', 'feeling', 'log mood'],
        'log_water': ['water', 'drank water', 'log water', 'glasses of water'],
        'get_help': ['help', 'how to', 'what can you do', 'commands'],
        'greeting': ['hello', 'hi', 'hey', 'good morning', 'good evening'],
        'general_chat': [],
    }

    def detect(self, message: str, context: Dict = None) -> IntentResult:
        message_lower = message.lower()
        best_intent = 'general_chat'
        best_confidence = 0.1
        entities = {}

        for intent, keywords in self.INTENTS.items():
            if not keywords:
                continue
            for keyword in keywords:
                if keyword in message_lower:
                    confidence = len(keyword) / len(message_lower) * 0.8 + 0.2
                    if confidence > best_confidence:
                        best_confidence = confidence
                        best_intent = intent

        # Extract entities
        entities = self._extract_entities(message, best_intent)

        return IntentResult(
            intent=best_intent,
            confidence=min(best_confidence, 1.0),
            entities=entities,
        )

    def _extract_entities(self, message: str, intent: str) -> Dict[str, Any]:
        import re
        entities = {}

        # Extract numbers
        numbers = re.findall(r'\b\d+(?:\.\d+)?\b', message)
        if numbers:
            entities['numbers'] = [float(n) if '.' in n else int(n) for n in numbers]

        # Extract dates (simple patterns)
        date_patterns = [
            r'\b(today|tomorrow|yesterday)\b',
            r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
            r'\b(\d{1,2}/\d{1,2}(?:/\d{2,4})?)\b',
        ]
        for pattern in date_patterns:
            matches = re.findall(pattern, message, re.IGNORECASE)
            if matches:
                entities['dates'] = matches
                break

        # Extract money amounts
        money = re.findall(r'\$?(\d+(?:\.\d{2})?)', message)
        if money:
            entities['amounts'] = [float(m) for m in money]

        return entities


# Convenience functions
def build_context(user, conversation=None) -> Dict:
    return ContextBuilder(user, conversation).build()


def detect_intent(message: str, context: Dict = None) -> IntentResult:
    return IntentDetector().detect(message, context)