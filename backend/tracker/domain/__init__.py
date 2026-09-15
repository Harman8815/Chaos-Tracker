"""Domain layer for Chaos Tracker.

Business operations live here, not in the API layer. Each domain module
exposes service classes that take a requesting ``User`` (or user id),
enforce ownership, raise standardized :class:`DomainError` exceptions,
and return plain data / model instances.

The API layer (``tracker.api``) is responsible only for:
  * parsing HTTP request data (request.data, query_params)
  * validating input shapes (via DRF serializers)
  * calling the appropriate domain service
  * translating :class:`DomainError` into HTTP responses
"""
