"""LLM Integration Service (P7-01, P7-02, P7-10).

Provides integration with Gemini API for AI assistant responses.
"""
import logging
from typing import Dict, List, Generator
from dataclasses import dataclass

from django.conf import settings

logger = logging.getLogger("tracker.domain.llm")


@dataclass
class LLMResponse:
    content: str
    tool_calls: List[Dict] = None
    model: str = ""
    usage: Dict = None


class LLMService:
    """Service for calling LLM APIs."""

    def __init__(self):
        self.api_key = getattr(settings, 'GEMINI_API_KEY', '')
        self.default_model = getattr(settings, 'GEMINI_MODEL', 'gemini-2.5-flash')
        self._client = None

    def _get_client(self):
        """Lazy initialization of Gemini client."""
        if self._client is None:
            if not self.api_key:
                raise ValueError("GEMINI_API_KEY not configured")
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai
            except ImportError:
                raise ValueError(
                    "google-generativeai package not installed. Run: pip install google-generativeai")
        return self._client

    def _build_system_prompt(self, context: Dict, available_tools: List[Dict]) -> str:
        """Build system prompt with context and tool definitions."""
        context_summary = self._format_context(context)

        return f"""You are the Chaos Tracker AI assistant. You help users manage their goals, habits, expenses, journal, and productivity.

Current context:
{context_summary}

Guidelines:
- Be concise and helpful
- Use tools when appropriate to take actions
- Ask for clarification if needed
- Explain what you're doing when using tools
- Don't make up data - use tools to get real information"""

    def _format_context(self, context: Dict) -> str:
        """Format context for LLM prompt."""
        lines = []

        # User profile
        profile = context.get('user_profile', {})
        if profile:
            lines.append(f"User: {profile.get('username', 'Unknown')}")

        # Today summary
        today = context.get('today_summary', {})
        if today and today.get('data_available') is not False:
            lines.append(f"Today ({today.get('date', 'N/A')}): "
                         f"{today.get('habits_completed', 0)}/{today.get('habits_total', 0)} habits, "
                         f"{today.get('tasks_completed', 0)} tasks, "
                         f"${today.get('expense_total', 0):.2f} spent, "
                         f"Mood: {today.get('mood', 'N/A')}, "
                         f"Water: {today.get('water_glasses', 0)}/{today.get('water_target', 8)}")

        # Active goals
        goals = context.get('active_goals', [])
        if goals:
            lines.append(f"Active goals ({len(goals)}):")
            for g in goals[:5]:
                lines.append(f"  - {g.get('text', 'N/A')} [{g.get('category', 'N/A')}] "
                             f"({g.get('completed_tasks', 0)}/{g.get('target', 1)})")

        # Habits
        habits = context.get('habits', [])
        if habits:
            lines.append("Habits:")
            for h in habits[:5]:
                today_done = "✓" if h.get('completed_today') else "○"
                lines.append(
                    f"  {today_done} {
                        h.get(
                            'name',
                            'N/A')} (target: {
                        h.get(
                            'target',
                            1)}, streak: {
                        h.get(
                            'streak',
                            0)})")

        # Recent expenses
        expenses = context.get('recent_expenses', [])
        if expenses:
            lines.append(f"Recent expenses ({len(expenses)}):")
            for e in expenses[:3]:
                lines.append(
                    f"  - {e.get('item', 'N/A')} (${e.get('total', 0):.2f}) [{e.get('category', 'N/A')}]")

        # Recent journal
        journal = context.get('recent_journal', [])
        if journal:
            lines.append(f"Recent journal ({len(journal)} entries)")

        # Mood
        mood = context.get('current_mood')
        if mood:
            lines.append(f"Current mood: {mood}")

        # Memories
        memories = context.get('memories', [])
        if memories:
            lines.append(f"Relevant memories ({len(memories)}):")
            for m in memories[:3]:
                lines.append(f"  - [{m.get('memory_type', 'N/A')}] {m.get('content', '')[:100]}")

        return "\n".join(lines) if lines else "No data available yet."

    def _build_messages(
            self,
            context: Dict,
            conversation_history: List[Dict],
            user_message: str) -> List[Dict]:
        """Build message list for LLM."""
        messages = []

        # System prompt with context
        available_tools = context.get('available_tools', [])
        system_prompt = self._build_system_prompt(context, available_tools)
        messages.append({"role": "system", "content": system_prompt})

        # Conversation history
        for msg in conversation_history:
            role = msg.get('role', 'user')
            if role in ('user', 'assistant'):
                messages.append({"role": role, "content": msg.get('content', '')})

        # Current user message
        messages.append({"role": "user", "content": user_message})

        return messages

    def _build_tools(self, available_tools: List[Dict]) -> List:
        """Convert tool definitions to Gemini function calling format."""
        if not available_tools:
            return []

        function_declarations = []
        for tool in available_tools:
            schema = tool.get('schema', {})
            params = schema.get('parameters', {})
            function_declarations.append({
                'name': tool['name'],
                'description': schema.get('description', ''),
                'parameters': params,
            })

        return [{'function_declarations': function_declarations}]

    def generate_response(
        self,
        context: Dict,
        conversation_history: List[Dict],
        user_message: str,
        model: str = None,
        stream: bool = False,
    ) -> LLMResponse:
        """Generate response from LLM."""
        if not self.api_key:
            return self._fallback_response(context, user_message)

        try:
            client = self._get_client()
            model_name = model or self.default_model
            messages = self._build_messages(context, conversation_history, user_message)

            # Convert to Gemini format
            gemini_messages = []
            for msg in messages:
                role = "user" if msg["role"] == "user" else "model"
                gemini_messages.append({"role": role, "parts": [msg["content"]]})

            # Add function calling tools
            available_tools = context.get('available_tools', [])
            tools = self._build_tools(available_tools)

            gemini_model = client.GenerativeModel(model_name, tools=tools if tools else None)

            if stream:
                response = gemini_model.generate_content(gemini_messages, stream=True)
                return self._handle_streaming_response(response, model_name)

            response = gemini_model.generate_content(gemini_messages)
            return self._handle_response(response, model_name)

        except Exception as e:
            logger.error("llm.generate_response error: %s", e)
            return self._fallback_response(context, user_message)

    def _handle_response(self, response, model_name: str) -> LLMResponse:
        """Handle non-streaming response."""
        content = ""
        tool_calls = []

        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and candidate.content:
                for part in candidate.content.parts:
                    if hasattr(part, 'text') and part.text:
                        content += part.text
                    if hasattr(part, 'function_call') and part.function_call:
                        fc = part.function_call
                        tool_calls.append({
                            'name': fc.name,
                            'arguments': dict(fc.args) if fc.args else {},
                        })

        usage = {}
        if hasattr(response, 'usage_metadata'):
            usage = {
                'prompt_tokens': getattr(response.usage_metadata, 'prompt_token_count', 0),
                'completion_tokens': getattr(response.usage_metadata, 'candidates_token_count', 0),
            }

        return LLMResponse(
            content=content.strip(),
            tool_calls=tool_calls,
            model=model_name,
            usage=usage,
        )

    def _handle_streaming_response(self, response, model_name: str) -> Generator[str, None, None]:
        """Handle streaming response."""
        full_content = ""
        for chunk in response:
            if hasattr(chunk, 'text') and chunk.text:
                full_content += chunk.text
                yield chunk.text

    def _fallback_response(self, context: Dict, user_message: str) -> LLMResponse:
        """Generate fallback response when LLM is not available."""
        from .ai_context import detect_intent
        intent_result = detect_intent(user_message, context)
        intent = intent_result.intent

        responses = {
            'greeting': "Hello! I'm your Chaos Tracker assistant. I can help you with goals, habits, expenses, journaling, and more. What would you like to do today?",
            'get_help': (
                "I can help you with:\n"
                "• **Goals**: Create, update, complete goals\n"
                "• **Habits**: Track habits, view streaks\n"
                "• **Expenses**: Log spending, view summaries\n"
                "• **Budget**: Set and check budgets\n"
                "• **Journal**: Write entries, view history\n"
                "• **Analytics**: Get insights and trends\n\n"
                "Just tell me what you'd like to do!"),
            'create_goal': "I'd be happy to help you create a goal! What would you like to achieve? (e.g., 'Read 2 books this month', 'Exercise 3x per week')",
            'create_expense': "Sure! What did you spend money on? Tell me the item, category, and amount (e.g., 'Coffee, Food, $5.50').",
            'view_analytics': "Here are your current stats..." + self._format_context_summary(context),
        }

        content = responses.get(
            intent,
            f"I understand you want to {
                intent.replace(
                    '_',
                    ' ')}. Let me help you with that! (Full AI integration requires GEMINI_API_KEY)")

        return LLMResponse(content=content, tool_calls=[], model="fallback")

    def _format_context_summary(self, context: Dict) -> str:
        lines = []
        today = context.get('today_summary', {})
        if today.get('data_available'):
            lines.append(
                f"\nToday: {
                    today.get(
                        'habits_completed',
                        0)}/{
                    today.get(
                        'habits_total',
                        0)} habits, " f"{
                    today.get(
                        'tasks_completed',
                        0)} tasks, " f"${
                    today.get(
                        'expense_total',
                        0):.2f} spent")

        goals = context.get('active_goals', [])
        if goals:
            lines.append(f"\nActive goals: {len(goals)}")

        return ''.join(lines)


# Singleton instance
llm_service = LLMService()
