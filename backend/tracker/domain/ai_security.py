"""AI Security utilities for prompt injection prevention and tool safety."""

import re
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

from .exceptions import ValidationError


PROMPT_INJECTION_PATTERNS = [
    # Direct instruction overrides
    r'(?i)ignore\s+(?:previous|above|all)\s+(?:instructions?|prompts?|rules?)',
    r'(?i)forget\s+(?:everything|all|previous|above)',
    r'(?i)disregard\s+(?:previous|above|all)\s+(?:instructions?|prompts?|rules?)',
    r'(?i)new\s+(?:instructions?|prompt|rules?)\s*:',
    r'(?i)system\s*:?\s*(?:you are|act as|pretend)',
    r'(?i)role\s*:\s*(?:system|admin|developer)',
    r'(?i)prompt\s*(?:injection|hack|bypass)',
    r'(?i)override\s+(?:safety|security|guardrails?)',
    r'(?i)jailbreak',
    r'(?i)developer\s+mode',
    r'(?i)sudo\s+mode',

    # Data extraction attempts
    r'(?i)show\s+(?:me\s+)?(?:your\s+)?(?:system\s+)?(?:prompt|instructions?)',
    r'(?i)what\s+(?:is|are)\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions?)',
    r'(?i)print\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions?)',
    r'(?i)output\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions?)',
    r'(?i)reveal\s+(?:your\s+)?(?:system\s+)?(?:prompt|instructions?)',

    # Tool manipulation
    r'(?i)execute\s+(?:code|command|shell|script)',
    r'(?i)run\s+(?:code|command|shell|script)',
    r'(?i)eval\s*\(',
    r'(?i)exec\s*\(',
    r'(?i)system\s*\(',
    r'(?i)subprocess',
    r'(?i)os\.system',
    r'(?i)__import__',

    # Information gathering
    r'(?i)what\s+(?:tools|functions|apis?)\s+(?:do\s+you\s+)?(?:have|can\s+you\s+use)',
    r'(?i)list\s+(?:all\s+)?(?:tools|functions|apis?)',
    r'(?i)show\s+(?:me\s+)?(?:all\s+)?(?:tools|functions)',

    # Encoding/obfuscation attempts
    r'(?i)base64\s*(?:encode|decode)',
    r'(?i)rot13',
    r'(?i)hex\s*(?:encode|decode)',
    r'(?i)url\s*(?:encode|decode)',
]


TOOL_ARGUMENT_DANGEROUS_PATTERNS = [
    # Path traversal
    r'\.\./',
    r'\.\.\\',
    r'%2e%2e%2f',
    r'%2e%2e%5c',

    # Command injection
    r'[;&|`$]',
    r'\$\(',
    r'`.*`',
    r'\|\s*\w+',

    # SQL injection
    r'(?i)(union|select|insert|update|delete|drop|create|alter|exec)\s+',
    r"';\s*--",

    # Script injection
    r'<script',
    r'javascript:',
    r'on\w+\s*=',
    r'eval\s*\(',
]


def check_prompt_injection(text: str) -> List[str]:
    """Check text for prompt injection patterns.

    Returns list of matched pattern descriptions.
    """
    if not isinstance(text, str):
        return []

    matches = []
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text):
            matches.append(pattern)
    return matches


def check_tool_arguments(args: Dict[str, Any]) -> List[str]:
    """Check tool arguments for dangerous patterns.

    Returns list of matched pattern descriptions.
    """
    if not isinstance(args, dict):
        return []

    matches = []
    for key, value in args.items():
        if isinstance(value, str):
            for pattern in TOOL_ARGUMENT_DANGEROUS_PATTERNS:
                if re.search(pattern, value):
                    matches.append(f"{key}: {pattern}")
        elif isinstance(value, dict):
            nested = check_tool_arguments(value)
            matches.extend([f"{key}.{m}" for m in nested])
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, str):
                    for pattern in TOOL_ARGUMENT_DANGEROUS_PATTERNS:
                        if re.search(pattern, item):
                            matches.append(f"{key}[{i}]: {pattern}")
                elif isinstance(item, dict):
                    nested = check_tool_arguments(item)
                    matches.extend([f"{key}[{i}].{m}" for m in nested])
    return matches


def sanitize_prompt(text: str) -> str:
    """Basic prompt sanitization - removes obvious injection attempts."""
    if not isinstance(text, str):
        return str(text)

    result = text
    for pattern in PROMPT_INJECTION_PATTERNS:
        result = re.sub(pattern, '[FILTERED]', result, flags=re.IGNORECASE)
    return result


def validate_tool_schema(schema: Dict[str, Any]) -> List[str]:
    """Validate tool schema for security issues.

    Returns list of issues found.
    """
    issues = []

    # Check for dangerous parameter types
    def check_params(params: Dict, path: str = ""):
        if not isinstance(params, dict):
            return

        param_type = params.get('type')
        if param_type == 'string' and 'format' not in params:
            # String parameters without format validation are risky
            issues.append(f"{path}: string parameter without format validation")

        # Check for file path parameters
        if 'path' in params.get('description', '').lower() or 'file' in params.get('description', '').lower():
            issues.append(f"{path}: potential file path parameter")

        # Recursively check properties
        properties = params.get('properties', {})
        for prop_name, prop_schema in properties.items():
            check_params(prop_schema, f"{path}.{prop_name}" if path else prop_name)

    check_params(schema)
    return issues


@dataclass
class AISecurityConfig:
    """Configuration for AI security features."""
    max_context_tokens: int = 8000
    max_response_tokens: int = 2000
    max_tool_calls_per_message: int = 5
    max_conversation_history: int = 50
    enable_prompt_injection_check: bool = True
    enable_tool_argument_validation: bool = True
    tool_execution_timeout: int = 30
    rate_limit_chat_per_minute: int = 30
    rate_limit_tools_per_minute: int = 20


class AISecurityMiddleware:
    """Middleware for AI security checks."""

    def __init__(self, config: Optional[AISecurityConfig] = None):
        self.config = config or AISecurityConfig()

    def check_user_message(self, content: str) -> List[str]:
        """Check user message for security issues.

        Returns list of warnings/violations.
        """
        violations = []

        if self.config.enable_prompt_injection_check:
            injections = check_prompt_injection(content)
            if injections:
                violations.append(f"Prompt injection detected: {len(injections)} patterns matched")

        return violations

    def check_tool_call(self, tool_name: str, arguments: Dict[str, Any]) -> List[str]:
        """Check tool call for security issues."""
        violations = []

        if self.config.enable_tool_argument_validation:
            dangerous = check_tool_arguments(arguments)
            if dangerous:
                violations.append(f"Dangerous patterns in tool arguments: {dangerous}")

        return violations

    def check_conversation_length(self, message_count: int) -> List[str]:
        """Check conversation history length."""
        violations = []
        if message_count > self.config.max_conversation_history:
            violations.append(f"Conversation history too long: {message_count} messages")
        return violations


# Default security middleware instance
ai_security = AISecurityMiddleware()