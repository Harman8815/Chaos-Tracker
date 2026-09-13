"""AI Assistant orchestration service (P7-01, P7-02, P7-09, P7-15).

Main service that coordinates AI conversations, tool calls, and error recovery.
"""
import uuid
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Generator

from django.db import transaction
from django.utils import timezone

from ...models import AIConversation, AIMessage, AIToolCall, User
from .ai_tools import tool_executor
from .ai_context import ContextBuilder, IntentDetector, build_context, detect_intent
from ..exceptions import ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.ai_assistant")


class AIAssistantService:
    """Main AI assistant service for handling chat interactions."""

    def __init__(self):
        self.context_builder = ContextBuilder
        self.intent_detector = IntentDetector()

    def create_conversation(self, user: User, title: str = '', model: str = 'gemini-2.5-flash') -> AIConversation:
        """Create a new AI conversation."""
        if not title:
            title = f"Chat {timezone.now().strftime('%b %d, %I:%M %p')}"

        conv = AIConversation.objects.create(
            user=user,
            title=title,
            model=model,
            status='active',
        )
        logger.info("ai_conversation.created user_id=%s id=%s", user.id, conv.id)
        return conv

    def list_conversations(self, user: User, status: str = 'active', limit: int = 50) -> List[AIConversation]:
        """List user's conversations."""
        qs = AIConversation.objects.filter(user=user, status=status).order_by('-last_message_at')
        return list(qs[:limit])

    def get_conversation(self, user: User, conversation_id: int) -> Optional[AIConversation]:
        """Get conversation with messages."""
        return AIConversation.objects.filter(id=conversation_id, user=user).first()

    def delete_conversation(self, user: User, conversation_id: int, hard: bool = False) -> bool:
        """Delete or archive conversation."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            return False
        if hard:
            conv.delete()
        else:
            conv.status = 'deleted'
            conv.save(update_fields=['status', 'updated_at'])
        return True

    def archive_conversation(self, user: User, conversation_id: int) -> bool:
        """Archive conversation."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            return False
        conv.status = 'archived'
        conv.save(update_fields=['status', 'updated_at'])
        return True

    def update_conversation_title(self, user: User, conversation_id: int, title: str) -> Optional[AIConversation]:
        """Update conversation title."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            return None
        conv.title = title[:255]
        conv.save(update_fields=['title', 'updated_at'])
        return conv

    def send_message(
        self,
        user: User,
        conversation_id: int,
        content: str,
        role: str = 'user',
    ) -> AIMessage:
        """Add a message to conversation."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            raise ValidationError("Conversation not found")

        if conv.status != 'active':
            raise ValidationError("Conversation is not active")

        message = AIMessage.objects.create(
            conversation=conv,
            role=role,
            content=content,
        )

        conv.last_message_at = timezone.now()
        conv.save(update_fields=['last_message_at', 'updated_at'])

        return message

    def get_messages(self, user: User, conversation_id: int, limit: int = 100) -> List[AIMessage]:
        """Get messages for a conversation."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            return []
        return list(AIMessage.objects.filter(conversation=conv).order_by('created_at')[:limit])

    def process_user_message(
        self,
        user: User,
        conversation_id: int,
        content: str,
    ) -> Dict[str, Any]:
        """Process user message and generate AI response with tool calls."""
        conv = self.get_conversation(user, conversation_id)
        if not conv:
            raise ValidationError("Conversation not found")

        # Build context
        context = build_context(user, conv)

        # Detect intent
        intent_result = detect_intent(content, context)

        # Add user message
        user_message = self.send_message(user, conversation_id, content, role='user')

        # Generate AI response (this would call the actual LLM)
        # For now, return structured response indicating what should happen
        response = self._generate_response(conv, user_message, content, context, intent_result)

        return {
            'user_message': self._serialize_message(user_message),
            'assistant_response': response,
            'intent': intent_result.intent,
            'confidence': intent_result.confidence,
            'entities': intent_result.entities,
        }

    def _generate_response(
        self,
        conv: AIConversation,
        user_message: AIMessage,
        content: str,
        context: Dict,
        intent_result,
    ) -> Dict[str, Any]:
        """Generate AI response. In production, this calls the LLM."""
        # This is a placeholder - actual implementation would call Gemini API
        # with context, tools, and streaming support

        return {
            'content': self._get_fallback_response(content, intent_result, context),
            'tool_calls': [],
            'model': conv.model,
        }

    def _get_fallback_response(self, content: str, intent_result, context: Dict) -> str:
        """Generate a fallback response when LLM is not available."""
        intent = intent_result.intent

        if intent == 'greeting':
            return "Hello! I'm your Chaos Tracker assistant. I can help you with goals, habits, expenses, journaling, and more. What would you like to do today?"

        if intent == 'get_help':
            return (
                "I can help you with:\n"
                "• **Goals**: Create, update, complete goals\n"
                "• **Habits**: Track habits, view streaks\n"
                "• **Expenses**: Log spending, view summaries\n"
                "• **Budget**: Set and check budgets\n"
                "• **Journal**: Write entries, view history\n"
                "• **Analytics**: Get insights and trends\n\n"
                "Just tell me what you'd like to do!"
            )

        if intent == 'create_goal':
            return "I'd be happy to help you create a goal! What would you like to achieve? (e.g., 'Read 2 books this month', 'Exercise 3x per week')"

        if intent == 'create_expense':
            return "Sure! What did you spend money on? Tell me the item, category, and amount (e.g., 'Coffee, Food, $5.50')."

        if intent == 'view_analytics':
            return "Here are your current stats..." + self._format_context_summary(context)

        return f"I understand you want to {intent.replace('_', ' ')}. Let me help you with that! (Full AI integration coming soon)"

    def _format_context_summary(self, context: Dict) -> str:
        lines = []
        today = context.get('today_summary', {})
        if today.get('data_available') != False:
            lines.append(f"\nToday: {today.get('habits_completed', 0)}/{today.get('habits_total', 0)} habits, "
                         f"{today.get('tasks_completed', 0)} tasks, "
                         f"${today.get('expense_total', 0):.2f} spent")

        goals = context.get('active_goals', [])
        if goals:
            lines.append(f"\nActive goals: {len(goals)}")

        return ''.join(lines)

    def execute_tool_call(
        self,
        user: User,
        conversation_id: int,
        tool_name: str,
        arguments: Dict,
        message_id: int = None,
    ) -> AIToolCall:
        """Execute a tool call."""
        return tool_executor.execute(
            user=user,
            conversation_id=conversation_id,
            tool_name=tool_name,
            arguments=arguments,
            message_id=message_id,
        )

    def confirm_tool_call(
        self,
        user: User,
        tool_call_id: int,
        confirmed: bool,
    ) -> AIToolCall:
        """Confirm and execute a pending tool call."""
        return tool_executor.confirm_and_execute(user, tool_call_id, confirmed)

    def get_pending_confirmations(self, user: User) -> List[Dict]:
        """Get pending tool call confirmations for user."""
        from ...models import AIActionConfirmation
        confirmations = AIActionConfirmation.objects.filter(
            user=user, confirmed=False, expires_at__gt=timezone.now()
        ).select_related('tool_call', 'tool_call__tool')
        return [{
            'id': c.id,
            'tool_call_id': c.tool_call_id,
            'tool_name': c.tool_call.tool.name,
            'arguments': c.tool_call.arguments,
            'expires_at': c.expires_at.isoformat(),
        } for c in confirmations]

    def get_available_tools(self, user: User) -> List[Dict]:
        """Get list of available tools for user."""
        return tool_executor.list_tools(user)

    def _serialize_message(self, message: AIMessage) -> Dict:
        return {
            'id': message.id,
            'role': message.role,
            'content': message.content,
            'tool_calls': message.tool_calls,
            'created_at': message.created_at.isoformat(),
        }

    # Error recovery (P7-15)
    def recover_failed_tool_call(self, user: User, tool_call_id: int) -> AIToolCall:
        """Retry a failed tool call."""
        tool_call = AIToolCall.objects.filter(id=tool_call_id, conversation__user=user).first()
        if not tool_call:
            raise ValidationError("Tool call not found")

        if tool_call.status != 'failed':
            raise ValidationError("Tool call is not in failed state")

        return self.execute_tool_call(
            user=user,
            conversation_id=tool_call.conversation_id,
            tool_name=tool_call.tool.name,
            arguments=tool_call.arguments,
            message_id=tool_call.message_id,
        )


# Register built-in tools
def register_builtin_tools():
    """Register all built-in application tools."""

    # Goal tools
    tool_executor.register(
        name='create_goal',
        func=_create_goal,
        schema={
            'description': 'Create a new goal',
            'parameters': {
                'type': 'object',
                'properties': {
                    'text': {'type': 'string', 'description': 'Goal description'},
                    'category': {'type': 'string', 'enum': ['daily', 'monthly', 'future'], 'default': 'daily'},
                    'target': {'type': 'integer', 'minimum': 1, 'default': 1},
                    'due_date': {'type': 'string', 'format': 'date'},
                    'priority': {'type': 'string', 'enum': ['low', 'medium', 'high'], 'default': 'medium'},
                },
                'required': ['text'],
            },
        },
        is_destructive=False,
    )

    tool_executor.register(
        name='complete_goal',
        func=_complete_goal,
        schema={
            'description': 'Mark a goal as completed',
            'parameters': {
                'type': 'object',
                'properties': {
                    'goal_id': {'type': 'integer', 'description': 'ID of goal to complete'},
                },
                'required': ['goal_id'],
            },
        },
        is_destructive=False,
    )

    # Habit tools
    tool_executor.register(
        name='create_habit',
        func=_create_habit,
        schema={
            'description': 'Create a new habit',
            'parameters': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string', 'description': 'Habit name'},
                    'target': {'type': 'integer', 'minimum': 1, 'default': 1},
                    'schedule': {'type': 'string', 'enum': ['daily', 'weekly', 'custom'], 'default': 'daily'},
                },
                'required': ['name'],
            },
        },
        is_destructive=False,
    )

    tool_executor.register(
        name='log_habit',
        func=_log_habit,
        schema={
            'description': 'Log completion of a habit for today',
            'parameters': {
                'type': 'object',
                'properties': {
                    'habit_id': {'type': 'string', 'description': 'Habit ID'},
                    'score': {'type': 'integer', 'minimum': 0, 'default': 1},
                },
                'required': ['habit_id'],
            },
        },
        is_destructive=False,
    )

    # Expense tools
    tool_executor.register(
        name='create_expense',
        func=_create_expense,
        schema={
            'description': 'Log a new expense',
            'parameters': {
                'type': 'object',
                'properties': {
                    'item': {'type': 'string'},
                    'category': {'type': 'string'},
                    'quantity': {'type': 'integer', 'minimum': 1, 'default': 1},
                    'price': {'type': 'number', 'minimum': 0},
                    'date': {'type': 'string', 'format': 'date'},
                },
                'required': ['item', 'category', 'price'],
            },
        },
        is_destructive=False,
    )

    # Journal tools
    tool_executor.register(
        name='create_journal_entry',
        func=_create_journal_entry,
        schema={
            'description': 'Create or update a journal entry',
            'parameters': {
                'type': 'object',
                'properties': {
                    'date': {'type': 'string', 'format': 'date'},
                    'content': {'type': 'string'},
                },
                'required': ['date', 'content'],
            },
        },
        is_destructive=False,
    )

    # Mood tools
    tool_executor.register(
        name='log_mood',
        func=_log_mood,
        schema={
            'description': 'Log mood for today',
            'parameters': {
                'type': 'object',
                'properties': {
                    'mood': {'type': 'string', 'enum': ['happy', 'sad', 'neutral', 'excited', 'tired', 'grateful', 'anxious', 'energetic']},
                },
                'required': ['mood'],
            },
        },
        is_destructive=False,
    )

    # Water tools
    tool_executor.register(
        name='log_water',
        func=_log_water,
        schema={
            'description': 'Log water intake for today',
            'parameters': {
                'type': 'object',
                'properties': {
                    'glasses': {'type': 'integer', 'minimum': 0, 'default': 1},
                },
                'required': ['glasses'],
            },
        },
        is_destructive=False,
    )

    # Analytics tools
    tool_executor.register(
        name='get_analytics',
        func=_get_analytics,
        schema={
            'description': 'Get analytics summary for a period',
            'parameters': {
                'type': 'object',
                'properties': {
                    'period': {'type': 'string', 'enum': ['day', 'week', 'month'], 'default': 'week'},
                },
            },
        },
        is_destructive=False,
    )

    logger.info("ai_tools.builtin_registered count=%s", len(tool_executor._tools))


# Tool implementations
def _create_goal(user: User, text: str, category: str = 'daily', target: int = 1,
                 due_date: str = None, priority: str = 'medium') -> Dict:
    from ...models import Goal
    from .. import validation
    goal = Goal.objects.create(
        user=user,
        text=text,
        category=validation.choice(category, Goal.GOAL_CATEGORIES_KEYS, field='category'),
        target=validation.positive_int(target, field='target', minimum=1),
        priority=validation.choice(priority, Goal.PRIORITY_LEVELS_KEYS, field='priority'),
        due_date=validation.parse_date(due_date, field='due_date') if due_date else None,
    )
    return {'goal_id': goal.id, 'message': f'Created goal: {goal.text}'}


def _complete_goal(user: User, goal_id: int) -> Dict:
    from ...models import Goal
    goal = Goal.objects.filter(id=goal_id, user=user).first()
    if not goal:
        raise ValidationError("Goal not found")
    goal.status = 'completed'
    goal.completed_at = timezone.now()
    goal.save(update_fields=['status', 'completed_at', 'updated_at'])
    return {'goal_id': goal.id, 'message': f'Completed goal: {goal.text}'}


def _create_habit(user: User, name: str, target: int = 1, schedule: str = 'daily') -> Dict:
    from ...models import Habit
    from .. import validation
    habit = Habit.objects.create(
        user=user,
        name=name,
        target=validation.positive_int(target, field='target', minimum=1),
        schedule=validation.choice(schedule, Habit.SCHEDULE_KEYS, field='schedule'),
    )
    return {'habit_id': habit.id, 'message': f'Created habit: {habit.name}'}


def _log_habit(user: User, habit_id: str, score: int = 1) -> Dict:
    from ...models import Habit, DailyHabitScore
    from .. import validation
    habit = Habit.objects.filter(id=habit_id, user=user).first()
    if not habit:
        raise ValidationError("Habit not found")
    today = date.today()
    DailyHabitScore.objects.update_or_create(
        user=user, habit=habit, date=today,
        defaults={'score': validation.in_range(score, 0, 1000, field='score')},
    )
    return {'habit_id': habit_id, 'score': score, 'message': f'Logged {habit.name}: {score}/{habit.target}'}


def _create_expense(user: User, item: str, category: str, price: float,
                    quantity: int = 1, date: str = None) -> Dict:
    from ...models import Expense
    from .. import validation
    expense = Expense.objects.create(
        user=user,
        date=validation.parse_date(date, field='date') if date else date.today(),
        item=item,
        category=category,
        quantity=validation.positive_int(quantity, field='quantity', minimum=1),
        price=validation.bounded_decimal(price, field='price'),
    )
    return {'expense_id': expense.id, 'message': f'Logged expense: {item} ${expense.total:.2f}'}


def _create_journal_entry(user: User, date: str, content: str) -> Dict:
    from ...models import JournalEntry
    from .. import validation
    entry_date = validation.parse_date(date, field='date')
    entry, _ = JournalEntry.objects.update_or_create(
        user=user, date=entry_date,
        defaults={'content': content},
    )
    return {'date': date, 'message': 'Journal entry saved'}


def _log_mood(user: User, mood: str) -> Dict:
    from ...models import Mood
    today = date.today()
    Mood.objects.update_or_create(
        user=user, date=today,
        defaults={'mood': mood},
    )
    return {'mood': mood, 'date': today.isoformat(), 'message': f'Mood logged: {mood}'}


def _log_water(user: User, glasses: int) -> Dict:
    from ...models import Water
    from .. import validation
    today = date.today()
    glasses = validation.in_range(glasses, 0, 100, field='glasses')
    water, _ = Water.objects.update_or_create(
        user=user, date=today,
        defaults={'glasses': glasses},
    )
    return {'glasses': glasses, 'target': water.target, 'message': f'Water: {glasses}/{water.target} glasses'}


def _get_analytics(user: User, period: str = 'week') -> Dict:
    from ..services.analytics import analytics_service
    today = date.today()
    if period == 'day':
        start = today
    elif period == 'week':
        start = today - timedelta(days=6)
    else:
        start = today.replace(day=1)

    aggregates = DailyActivityAggregate.objects.filter(user=user, date__range=[start, today])
    total_habits = sum(a.habits_completed for a in aggregates)
    total_tasks = sum(a.planner_tasks_completed for a in aggregates)
    total_goals = sum(a.goals_completed for a in aggregates)
    total_expenses = sum(float(a.expense_total) for a in aggregates)

    return {
        'period': period,
        'habits_completed': total_habits,
        'tasks_completed': total_tasks,
        'goals_completed': total_goals,
        'total_expenses': round(total_expenses, 2),
    }


# Import at end to avoid circular
from datetime import date, timedelta  # noqa: E402