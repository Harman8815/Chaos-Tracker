"""Query optimization utilities and patterns."""

from django.db import models, connection
from django.db.models import Prefetch, Q, Count, Sum, Avg, Max, Min, F, Exists, OuterRef, Subquery
from django.db.models.query import QuerySet
from typing import List, Dict, Any, Optional, Callable
from functools import wraps


class QueryOptimizer:
    """Utilities for optimizing Django ORM queries."""

    @staticmethod
    def select_related_chain(queryset: QuerySet, *fields: str) -> QuerySet:
        """Chain select_related for foreign keys."""
        for field in fields:
            queryset = queryset.select_related(field)
        return queryset

    @staticmethod
    def prefetch_related_chain(queryset: QuerySet, *fields: str) -> QuerySet:
        """Chain prefetch_related for many-to-many and reverse FK."""
        for field in fields:
            queryset = queryset.prefetch_related(field)
        return queryset

    @staticmethod
    def only_fields(queryset: QuerySet, *fields: str) -> QuerySet:
        """Limit fields fetched from database."""
        return queryset.only(*fields)

    @staticmethod
    def defer_fields(queryset: QuerySet, *fields: str) -> QuerySet:
        """Defer loading of specified fields."""
        return queryset.defer(*fields)

    @staticmethod
    def annotate_counts(queryset: QuerySet, *relations: str) -> QuerySet:
        """Add count annotations for relations."""
        for relation in relations:
            queryset = queryset.annotate(**{f"{relation}_count": Count(relation)})
        return queryset

    @staticmethod
    def annotate_sums(queryset: QuerySet, **sums: str) -> QuerySet:
        """Add sum annotations."""
        annotations = {name: Sum(field) for name, field in sums.items()}
        return queryset.annotate(**annotations)

    @staticmethod
    def annotate_subquery(queryset: QuerySet, name: str, subquery: Subquery, output_field=None) -> QuerySet:
        """Add subquery annotation efficiently."""
        kwargs = {name: subquery}
        if output_field:
            # Django handles this automatically in most cases
            pass
        return queryset.annotate(**kwargs)


class EfficientQuerySet(QuerySet):
    """QuerySet with built-in optimization methods."""

    def with_user_data(self, user_field: str = 'user') -> QuerySet:
        """Optimize for user-scoped queries."""
        return self.select_related(user_field)

    def with_counts(self, *relations: str) -> QuerySet:
        """Add count annotations."""
        return QueryOptimizer.annotate_counts(self, *relations)

    def with_aggregates(self, **aggregates) -> QuerySet:
        """Add aggregate annotations."""
        annotations = {}
        for name, (func, field) in aggregates.items():
            annotations[name] = func(field)
        return self.annotate(**annotations)

    def paginate(self, page: int, page_size: int = 50) -> QuerySet:
        """Efficient pagination using cursor-based approach for large datasets."""
        offset = (page - 1) * page_size
        return self[offset:offset + page_size]

    def cursor_paginate(self, cursor_field: str, cursor_value: Any, page_size: int, direction: str = 'next') -> QuerySet:
        """Cursor-based pagination for better performance on large datasets."""
        if direction == 'next':
            return self.filter(**{f"{cursor_field}__gt": cursor_value}).order_by(cursor_field)[:page_size]
        else:
            return self.filter(**{f"{cursor_field}__lt": cursor_value}).order_by(f"-{cursor_field}")[:page_size]


def explain_query(queryset: QuerySet) -> List[Dict]:
    """Get query execution plan."""
    if connection.vendor == 'postgresql':
        sql, params = queryset.query.sql_with_params()
        with connection.cursor() as cursor:
            cursor.execute(f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {sql}", params)
            return cursor.fetchall()[0][0]
    elif connection.vendor == 'sqlite':
        sql, params = queryset.query.sql_with_params()
        with connection.cursor() as cursor:
            cursor.execute(f"EXPLAIN QUERY PLAN {sql}", params)
            return [{'detail': row[3]} for row in cursor.fetchall()]
    return []


def get_query_stats(queryset: QuerySet) -> Dict[str, Any]:
    """Get query statistics."""
    sql, params = queryset.query.sql_with_params()
    return {
        'sql': sql,
        'params': params,
        'query_count': len(connection.queries),
    }


class QueryProfiler:
    """Profile and analyze query performance."""

    def __init__(self):
        self.queries = []

    def __enter__(self):
        self.start_count = len(connection.queries)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_count = len(connection.queries)
        self.queries = connection.queries[self.start_count:self.end_count]

    def get_stats(self) -> Dict[str, Any]:
        total_time = sum(float(q['time']) for q in self.queries)
        return {
            'query_count': len(self.queries),
            'total_time': total_time,
            'avg_time': total_time / len(self.queries) if self.queries else 0,
            'slowest': max(self.queries, key=lambda q: float(q['time'])) if self.queries else None,
            'queries': self.queries,
        }

    def print_summary(self):
        stats = self.get_stats()
        print(f"Queries: {stats['query_count']}")
        print(f"Total time: {stats['total_time']:.3f}s")
        print(f"Avg time: {stats['avg_time']:.3f}s")
        if stats['slowest']:
            print(f"Slowest: {stats['slowest']['time']}s - {stats['slowest']['sql'][:100]}")


def optimize_bulk_create(model_class, objects: List, batch_size: int = 1000, ignore_conflicts: bool = False):
    """Optimized bulk create with chunking."""
    created = []
    for i in range(0, len(objects), batch_size):
        batch = objects[i:i + batch_size]
        created.extend(model_class.objects.bulk_create(batch, ignore_conflicts=ignore_conflicts))
    return created


def optimize_bulk_update(model_class, objects: List, fields: List[str], batch_size: int = 1000):
    """Optimized bulk update with chunking."""
    updated = 0
    for i in range(0, len(objects), batch_size):
        batch = objects[i:i + batch_size]
        updated += model_class.objects.bulk_update(batch, fields)
    return updated


def optimize_update_or_create(model_class, lookup_field: str, objects_data: List[Dict], batch_size: int = 100):
    """Efficient upsert pattern for multiple objects."""
    from django.db import transaction

    results = []
    with transaction.atomic():
        for i in range(0, len(objects_data), batch_size):
            batch = objects_data[i:i + batch_size]
            for data in batch:
                lookup = {lookup_field: data.pop(lookup_field)}
                obj, created = model_class.objects.update_or_create(defaults=data, **lookup)
                results.append((obj, created))
    return results


class QueryCache:
    """Simple in-memory query cache with TTL."""

    def __init__(self, ttl_seconds: int = 300):
        self.ttl = ttl_seconds
        self._cache = {}
        self._timestamps = {}

    def get(self, key: str):
        import time
        if key in self._cache:
            if time.time() - self._timestamps[key] < self.ttl:
                return self._cache[key]
            else:
                del self._cache[key]
                del self._timestamps[key]
        return None

    def set(self, key: str, value):
        import time
        self._cache[key] = value
        self._timestamps[key] = time.time()

    def invalidate(self, key: str):
        self._cache.pop(key, None)
        self._timestamps.pop(key, None)

    def clear(self):
        self._cache.clear()
        self._timestamps.clear()


# Global query cache instance
query_cache = QueryCache()


def cached_query(ttl: int = 300):
    """Decorator to cache queryset results."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"
            result = query_cache.get(cache_key)
            if result is None:
                result = func(*args, **kwargs)
                query_cache.set(cache_key, result)
            return result
        return wrapper
    return decorator


# Database index recommendations
INDEX_RECOMMENDATIONS = {
    'Expense': [
        ['user', 'date'],
        ['user', 'category'],
        ['user', 'date', 'category'],
    ],
    'Goal': [
        ['user', 'category'],
        ['user', 'status'],
        ['user', 'recurrence'],
    ],
    'Habit': [
        ['user'],
        ['goal'],
    ],
    'JournalEntry': [
        ['user', 'date'],
    ],
    'Mood': [
        ['user', 'date'],
    ],
    'Water': [
        ['user', 'date'],
    ],
    'Budget': [
        ['user', 'year', 'month'],
    ],
    'Income': [
        ['user', 'date'],
        ['user', 'source'],
    ],
    'Account': [
        ['user', 'is_active'],
    ],
    'RecurringExpense': [
        ['user', 'is_active'],
        ['next_occurrence'],
    ],
    'Subscription': [
        ['user', 'status'],
        ['next_billing_date'],
    ],
    'Notification': [
        ['user', 'is_read'],
        ['user', 'type'],
        ['user', 'created_at'],
    ],
    'AIConversation': [
        ['user', 'status'],
        ['user', 'last_message_at'],
    ],
    'AIMessage': [
        ['conversation', 'created_at'],
    ],
    'UserEvent': [
        ['user', 'event_type'],
        ['user', 'occurred_at'],
        ['user', 'subject_type', 'subject_id'],
    ],
    'DailyActivityAggregate': [
        ['user', 'date'],
    ],
    'ScheduledJob': [
        ['status', 'scheduled_at'],
        ['job_type', 'status'],
        ['user', 'status'],
    ],
    'AIMemory': [
        ['user', 'is_active', 'memory_type'],
        ['user', 'is_active', 'priority'],
        ['user', 'expires_at'],
        ['conversation'],
    ],
}


def generate_index_migrations():
    """Generate migration operations for recommended indexes."""
    operations = []
    for model_name, indexes in INDEX_RECOMMENDATIONS.items():
        for fields in indexes:
            operations.append(
                migrations.AddIndex(
                    model_name=model_name.lower(),
                    index=models.Index(fields=fields, name=f"{model_name.lower()}_{'_'.join(fields)}_idx"),
                )
            )
    return operations


# Add migrations import at the end to avoid circular imports
from django.db import migrations