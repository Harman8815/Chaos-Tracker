"""Thin v1 controller for quotes (sources, quotes, tags, search)."""
from rest_framework import status

from ._base import TrackerAPIView
from .serializers import (
    QuoteListQuerySerializer,
    QuoteSearchQuerySerializer,
    QuoteSourceQuerySerializer,
)
from ...domain.services import (
    quote_source_service,
    quote_service,
    quote_tag_service,
)
from ...serializers import (
    QuoteSourceSerializer,
    QuoteSourceListSerializer,
    QuoteSerializer,
    QuoteCreateUpdateSerializer,
    QuoteSourceCreateUpdateSerializer,
    SearchResultSerializer,
)


class QuoteSourceListCreateView(TrackerAPIView):
    serializer_class = QuoteSourceListSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(QuoteSourceQuerySerializer)
        sources = quote_source_service.list(
            request.user,
            source_type=query.get("source_type"),
            include_quotes=query.get("include_quotes"),
        )
        serializer = self.serializer_class(sources, many=True)
        return self.ok(data=serializer.data, count=len(sources))

    def create(self, request, *args, **kwargs):
        serializer = QuoteSourceCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        source = quote_source_service.create(request.user, serializer.validated_data)
        serializer = QuoteSourceSerializer(source)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class QuoteSourceDetailView(TrackerAPIView):
    serializer_class = QuoteSourceSerializer

    def retrieve(self, request, *args, **kwargs):
        source = quote_source_service.get_by_id(request.user, kwargs["source_id"])
        serializer = self.serializer_class(source)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = QuoteSourceCreateUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        source = quote_source_service.update(
            request.user,
            kwargs["source_id"],
            serializer.validated_data,
            partial=True)
        serializer = QuoteSourceSerializer(source)
        return self.ok(data=serializer.data, message="Quote source updated")

    def destroy(self, request, *args, **kwargs):
        quote_source_service.delete(request.user, kwargs["source_id"])
        return self.ok(message="Quote source deleted", status_code=status.HTTP_204_NO_CONTENT)


class QuoteListCreateView(TrackerAPIView):
    serializer_class = QuoteCreateUpdateSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(QuoteListQuerySerializer)
        quotes = quote_service.list(
            request.user,
            kwargs["source_id"],
            tag=query.get("tag"),
        )
        serializer = QuoteSerializer(quotes, many=True)
        return self.ok(data=serializer.data, count=len(quotes))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote = quote_service.create(request.user, kwargs["source_id"], serializer.validated_data)
        serializer = QuoteSerializer(quote)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class QuoteDetailView(TrackerAPIView):
    serializer_class = QuoteCreateUpdateSerializer

    def retrieve(self, request, *args, **kwargs):
        quote = quote_service.get(request.user, kwargs["quote_id"])
        serializer = QuoteSerializer(quote)
        return self.ok(data=serializer.data)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        quote = quote_service.update(
            request.user,
            kwargs["quote_id"],
            serializer.validated_data,
            partial=True)
        serializer = QuoteSerializer(quote)
        return self.ok(data=serializer.data, message="Quote updated")

    def destroy(self, request, *args, **kwargs):
        quote_service.delete(request.user, kwargs["quote_id"])
        return self.ok(message="Quote deleted", status_code=status.HTTP_204_NO_CONTENT)


class QuoteTagsView(TrackerAPIView):
    def get(self, request):
        tags = quote_tag_service.list(request.user)
        return self.ok(data={"tags": tags}, count=len(tags))


class QuoteFuzzySearchView(TrackerAPIView):
    serializer_class = SearchResultSerializer

    def get(self, request):
        query_data = self.validated_query(QuoteSearchQuerySerializer)
        query = query_data.get("q", "").strip()
        results = quote_service.fuzzy_search(
            request.user,
            query,
            limit=query_data.get("limit", 20),
        )
        serializer = self.serializer_class(results, many=True)
        return self.ok(
            data={"results": serializer.data, "query": query},
            count=len(results),
        )
