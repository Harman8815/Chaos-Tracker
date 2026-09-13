"""Memory storage and retrieval service (P8-02, P8-03, P8-05, P8-07, P8-08, P8-09, P8-10)."""
import json
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from ...models import AIMemory, AIMemorySummarization, UserPreference, AIConversation, AIMessage, User
from ..exceptions import ValidationError, NotFoundError
from ..logging import get_logger

logger = get_logger("tracker.domain.memory")


class MemoryService:
    """Service for managing AI memories."""

    def get_preferences(self, user: User) -> UserPreference:
        """Get or create user preferences."""
        prefs, _ = UserPreference.objects.get_or_create(user=user)
        return prefs

    def update_preferences(self, user: User, data: Dict) -> UserPreference:
        """Update user preferences."""
        prefs = self.get_preferences(user)

        allowed_fields = [
            'response_length', 'auto_execute_tools', 'include_context_summary',
            'memory_enabled', 'memory_retention_days', 'max_memory_entries',
            'notify_on_tool_execution', 'notify_on_memory_created',
        ]
        for field in allowed_fields:
            if field in data:
                setattr(prefs, field, data[field])

        prefs.save()
        logger.info("memory.preferences_updated user_id=%s", user.id)
        return prefs

    def create_memory(
        self,
        user: User,
        memory_type: str,
        title: str,
        content: str,
        conversation: AIConversation = None,
        entities: Dict = None,
        source_message: AIMessage = None,
        priority: str = 'normal',
        confidence: float = 1.0,
        expires_at: datetime = None,
    ) -> AIMemory:
        """Create a new memory entry."""
        prefs = self.get_preferences(user)

        if not prefs.memory_enabled:
            raise ValidationError("Memory system is disabled")

        # Check max entries limit
        active_count = AIMemory.objects.filter(user=user, is_active=True).count()
        if active_count >= prefs.max_memory_entries:
            # Remove oldest low-priority memory
            self._evict_oldest(user)

        memory = AIMemory.objects.create(
            user=user,
            conversation=conversation,
            memory_type=memory_type,
            title=title[:255],
            content=content,
            entities=entities or {},
            source_message=source_message,
            priority=priority,
            confidence=confidence,
            expires_at=expires_at,
        )

        # Generate embedding hash for deduplication
        memory.embedding = self._generate_embedding_hash(content)
        memory.save(update_fields=['embedding'])

        logger.info("memory.created user_id=%s type=%s title=%s", user.id, memory_type, title)
        return memory

    def _generate_embedding_hash(self, content: str) -> Dict:
        """Generate a simple hash-based embedding for semantic similarity."""
        # This is a placeholder - in production, use actual embeddings (e.g., sentence-transformers)
        words = set(content.lower().split())
        hash_val = hashlib.md5(content.encode()).hexdigest()[:16]
        return {
            'hash': hash_val,
            'word_count': len(words),
            'top_words': list(words)[:50],
        }

    def get_memories(
        self,
        user: User,
        memory_type: str = None,
        is_active: bool = True,
        limit: int = 50,
        offset: int = 0,
    ) -> List[AIMemory]:
        """Get memories for user with filters."""
        qs = AIMemory.objects.filter(user=user, is_active=is_active)

        if memory_type:
            qs = qs.filter(memory_type=memory_type)

        # Exclude expired
        qs = qs.filter(Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now()))

        return list(qs.order_by('-priority', '-created_at')[offset:offset + limit])

    def get_memory(self, user: User, memory_id: int) -> AIMemory:
        """Get a specific memory."""
        memory = AIMemory.objects.filter(id=memory_id, user=user).first()
        if not memory:
            raise NotFoundError("Memory not found")
        memory.increment_access()
        return memory

    def update_memory(
        self,
        user: User,
        memory_id: int,
        data: Dict,
    ) -> AIMemory:
        """Update a memory."""
        memory = self.get_memory(user, memory_id)

        allowed_fields = ['title', 'content', 'memory_type', 'priority', 'confidence', 'entities', 'is_active']
        for field in allowed_fields:
            if field in data:
                if field == 'content':
                    memory.content = data[field]
                    memory.embedding = self._generate_embedding_hash(data[field])
                elif field == 'entities':
                    memory.entities = data[field] or {}
                else:
                    setattr(memory, field, data[field])

        memory.save()
        logger.info("memory.updated user_id=%s memory_id=%s", user.id, memory_id)
        return memory

    def delete_memory(self, user: User, memory_id: int, hard: bool = False) -> bool:
        """Delete or deactivate a memory (P8-07)."""
        memory = AIMemory.objects.filter(id=memory_id, user=user).first()
        if not memory:
            raise NotFoundError("Memory not found")

        if hard:
            memory.delete()
        else:
            memory.is_active = False
            memory.save(update_fields=['is_active', 'updated_at'])

        logger.info("memory.deleted user_id=%s memory_id=%s hard=%s", user.id, memory_id, hard)
        return True

    def bulk_delete(self, user: User, memory_ids: List[int], hard: bool = False) -> int:
        """Bulk delete memories."""
        if hard:
            count, _ = AIMemory.objects.filter(id__in=memory_ids, user=user).delete()
        else:
            count = AIMemory.objects.filter(id__in=memory_ids, user=user).update(is_active=False)
        return count

    def search_memories(
        self,
        user: User,
        query: str,
        memory_type: str = None,
        limit: int = 20,
    ) -> List[Dict]:
        """Search memories using simple text matching and embedding similarity (P8-09)."""
        qs = AIMemory.objects.filter(user=user, is_active=True)
        qs = qs.filter(Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now()))

        if memory_type:
            qs = qs.filter(memory_type=memory_type)

        query_lower = query.lower()
        query_words = set(query_lower.split())

        memories = list(qs[:200])  # Limit for performance
        results = []

        for memory in memories:
            score = self._calculate_relevance(memory, query_lower, query_words)
            if score > 0:
                results.append({
                    'memory': memory,
                    'score': score,
                })

        # Sort by relevance score
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:limit]

    def _calculate_relevance(self, memory: AIMemory, query: str, query_words: set) -> float:
        """Calculate relevance score for memory retrieval (P8-09)."""
        score = 0.0

        # Title match
        title_words = set(memory.title.lower().split())
        title_overlap = len(query_words & title_words)
        if title_overlap > 0:
            score += title_overlap * 3.0

        # Content match
        content_words = set(memory.content.lower().split())
        content_overlap = len(query_words & content_words)
        if content_overlap > 0:
            score += content_overlap * 1.5

        # Entity match
        if memory.entities:
            for key, value in memory.entities.items():
                if isinstance(value, str) and query in value.lower():
                    score += 2.0
                elif isinstance(value, list):
                    for v in value:
                        if isinstance(v, str) and query in v.lower():
                            score += 1.5

        # Priority boost
        priority_boost = {'critical': 2.0, 'high': 1.5, 'normal': 1.0, 'low': 0.5}
        score *= priority_boost.get(memory.priority, 1.0)

        # Recency boost (recent memories are more relevant)
        days_old = (timezone.now() - memory.created_at).days
        if days_old < 7:
            score *= 1.2
        elif days_old < 30:
            score *= 1.1

        # Access frequency boost
        if memory.access_count > 5:
            score *= 1.1

        return score

    def _evict_oldest(self, user: User) -> None:
        """Evict oldest low-priority memory when at capacity."""
        oldest = AIMemory.objects.filter(
            user=user, is_active=True, priority__in=['low', 'normal']
        ).order_by('created_at').first()

        if oldest:
            oldest.is_active = False
            oldest.save(update_fields=['is_active', 'updated_at'])
            logger.info("memory.evicted user_id=%s memory_id=%s", user.id, oldest.id)

    def cleanup_expired(self) -> int:
        """Clean up expired memories (P8-10)."""
        count, _ = AIMemory.objects.filter(
            expires_at__lt=timezone.now(),
            is_active=True,
        ).update(is_active=False)
        if count:
            logger.info("memory.cleanup_expired count=%s", count)
        return count

    def get_memory_stats(self, user: User) -> Dict:
        """Get memory statistics for user."""
        total = AIMemory.objects.filter(user=user, is_active=True).count()
        by_type = {}
        for mt in AIMemory.MEMORY_TYPES:
            count = AIMemory.objects.filter(user=user, is_active=True, memory_type=mt[0]).count()
            if count > 0:
                by_type[mt[0]] = count

        prefs = self.get_preferences(user)
        return {
            'total_memories': total,
            'by_type': by_type,
            'max_entries': prefs.max_memory_entries,
            'usage_percent': round((total / prefs.max_memory_entries * 100) if prefs.max_memory_entries > 0 else 0, 1),
            'memory_enabled': prefs.memory_enabled,
        }


class SummarizationService:
    """Conversation summarization service (P8-04)."""

    def create_summarization_job(self, conversation: AIConversation) -> AIMemorySummarization:
        """Create a summarization job for a conversation."""
        message_count = conversation.messages.count()
        if message_count < 5:
            raise ValidationError("Not enough messages to summarize")

        job = AIMemorySummarization.objects.create(
            conversation=conversation,
            source_message_count=message_count,
            status='pending',
        )
        logger.info("summarization.job_created conversation_id=%s", conversation.id)
        return job

    def process_summarization(self, job: AIMemorySummarization) -> AIMemorySummarization:
        """Process a summarization job."""
        job.status = 'processing'
        job.save(update_fields=['status'])

        try:
            # Get all messages
            messages = job.conversation.messages.order_by('created_at')
            message_texts = [f"{m.role}: {m.content}" for m in messages]
            full_text = "\n".join(message_texts)

            # Generate summary (placeholder - would use LLM in production)
            summary = self._generate_summary(full_text, messages)

            # Create summary memory
            summary_memory = AIMemory.objects.create(
                user=job.conversation.user,
                conversation=job.conversation,
                memory_type='summary',
                title=f"Summary: {job.conversation.title or 'Conversation'}",
                content=summary,
                priority='normal',
                confidence=0.9,
                entities={'message_count': job.source_message_count},
            )

            job.summary_text = summary
            job.summary_memory = summary_memory
            job.status = 'completed'
            job.completed_at = timezone.now()
            job.save(update_fields=['summary_text', 'summary_memory', 'status', 'completed_at'])

            logger.info("summarization.completed conversation_id=%s job_id=%s", job.conversation.id, job.id)

        except Exception as e:
            job.status = 'failed'
            job.error = str(e)
            job.save(update_fields=['status', 'error'])
            logger.error("summarization.failed job_id=%s error=%s", job.id, e)

        return job

    def _generate_summary(self, text: str, messages) -> str:
        """Generate a summary of the conversation."""
        # Placeholder - in production would call LLM
        user_msgs = [m for m in messages if m.role == 'user']
        assistant_msgs = [m for m in messages if m.role == 'assistant']

        summary_parts = [
            f"Conversation with {len(messages)} messages ({len(user_msgs)} user, {len(assistant_msgs)} assistant).",
        ]

        # Extract key topics from user messages
        topics = set()
        for m in user_msgs[:10]:
            words = m.content.lower().split()
            for w in words:
                if len(w) > 5:
                    topics.add(w)
        if topics:
            summary_parts.append(f"Key topics discussed: {', '.join(list(topics)[:10])}.")

        return " ".join(summary_parts)

    def get_summarization_status(self, conversation: AIConversation) -> Optional[Dict]:
        """Get latest summarization status for conversation."""
        job = AIMemorySummarization.objects.filter(conversation=conversation).order_by('-created_at').first()
        if not job:
            return None
        return {
            'id': job.id,
            'status': job.status,
            'source_message_count': job.source_message_count,
            'created_at': job.created_at.isoformat(),
            'completed_at': job.completed_at.isoformat() if job.completed_at else None,
            'error': job.error,
        }


# Import at end
from django.utils import timezone  # noqa: E402

memory_service = MemoryService()
summarization_service = SummarizationService()