from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Prefetch
from .models import JournalEntry, QuoteSource, Quote, QuoteTag
from .serializers import (
    JournalEntrySerializer,
    QuoteSourceSerializer,
    QuoteSourceListSerializer,
    QuoteSourceCreateUpdateSerializer,
    QuoteSerializer,
    QuoteCreateUpdateSerializer,
    SearchResultSerializer
)
import datetime
from difflib import SequenceMatcher


class SyncView(views.APIView):
    """
    Sync endpoint for application data
    GET /api/sync/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Return all application data for the authenticated user
        """
        # Fetch all journal entries for the user
        journal_entries = JournalEntry.objects.filter(user=request.user)
        
        # Build the data dictionary with journal entries
        data = {}
        for entry in journal_entries:
            date_str = entry.date.strftime('%Y-%m-%d')
            data[date_str] = {
                'journal': entry.content,
                'points': 0  # You can calculate points based on your logic
            }
        
        # Fetch quote sources with quotes
        quote_sources = QuoteSource.objects.filter(user=request.user).prefetch_related(
            Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
        )
        quotes_serializer = QuoteSourceSerializer(quote_sources, many=True)
        
        return Response({
            'success': True,
            'data': data,
            'habits': [],
            'rules': [],
            'planner': {},
            'goals': {},
            'expenses': [],
            'quotes': quotes_serializer.data,
            'achievements': [],
            'userProfile': {
                'name': request.user.username,
                'email': request.user.email,
                'joinDate': request.user.date_joined.isoformat() if request.user.date_joined else None
            }
        }, status=status.HTTP_200_OK)


# ==================== JOURNAL VIEWS ====================

class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if entry already exists for this date
        date = serializer.validated_data.get('date')
        existing = JournalEntry.objects.filter(user=self.request.user, date=date).first()
        if existing:
            # If exists, update it instead of creating new (idempotency)
            serializer.instance = existing
            serializer.save(user=self.request.user)
        else:
            serializer.save(user=self.request.user)


class JournalEntryDetailView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, date_str):
        try:
            date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            return JournalEntry.objects.get(user=self.request.user, date=date)
        except (ValueError, JournalEntry.DoesNotExist):
            return None

    def get(self, request, date):
        entry = self.get_object(date)
        if entry:
            serializer = JournalEntrySerializer(entry)
            return Response(serializer.data)
        return Response({'date': date, 'content': ''}, status=status.HTTP_200_OK)

    def put(self, request, date):
        try:
            date_obj = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)

        entry = self.get_object(date)
        
        data = request.data.copy()
        data['date'] = date
        
        if entry:
            serializer = JournalEntrySerializer(entry, data=data)
        else:
            serializer = JournalEntrySerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, date):
        entry = self.get_object(date)
        if entry:
            entry.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)


# ==================== QUOTE SOURCE VIEWS ====================

class QuoteSourceListCreateView(views.APIView):
    """
    GET /api/quotes/sources/ - List all quote sources for user
    POST /api/quotes/sources/ - Create a new quote source
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """List all quote sources with optional filtering"""
        sources = QuoteSource.objects.filter(user=request.user).annotate(
            quote_count=Count('quotes')
        ).prefetch_related(
            Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
        )
        
        # Optional filtering by type
        source_type = request.query_params.get('type')
        if source_type:
            sources = sources.filter(type=source_type)
        
        # Determine serializer based on query param
        include_quotes = request.query_params.get('include_quotes', 'true').lower() == 'true'
        
        if include_quotes:
            serializer = QuoteSourceSerializer(sources, many=True)
        else:
            serializer = QuoteSourceListSerializer(sources, many=True)
        
        return Response({
            'success': True,
            'count': sources.count(),
            'sources': serializer.data
        })

    def post(self, request):
        """Create a new quote source"""
        serializer = QuoteSourceCreateUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            
            # Return full source with quotes
            source = QuoteSource.objects.filter(
                id=serializer.data['id']
            ).prefetch_related(
                Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
            ).first()
            
            response_serializer = QuoteSourceSerializer(source)
            return Response({
                'success': True,
                'source': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class QuoteSourceDetailView(views.APIView):
    """
    GET /api/quotes/sources/<id>/ - Get a specific quote source
    PUT /api/quotes/sources/<id>/ - Update a quote source
    DELETE /api/quotes/sources/<id>/ - Delete a quote source
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, source_id):
        return get_object_or_404(
            QuoteSource.objects.prefetch_related(
                Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
            ),
            id=source_id,
            user=self.request.user
        )

    def get(self, request, source_id):
        """Get a specific quote source with all its quotes"""
        source = self.get_object(source_id)
        serializer = QuoteSourceSerializer(source)
        return Response({
            'success': True,
            'source': serializer.data
        })

    def put(self, request, source_id):
        """Update a quote source"""
        source = self.get_object(source_id)
        serializer = QuoteSourceCreateUpdateSerializer(source, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated source
            updated_source = self.get_object(source_id)
            response_serializer = QuoteSourceSerializer(updated_source)
            return Response({
                'success': True,
                'source': response_serializer.data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, source_id):
        """Delete a quote source and all its quotes"""
        source = self.get_object(source_id)
        source.delete()
        return Response({
            'success': True,
            'message': 'Quote source deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


# ==================== QUOTE VIEWS ====================

class QuoteListCreateView(views.APIView):
    """
    GET /api/quotes/sources/<source_id>/quotes/ - List all quotes for a source
    POST /api/quotes/sources/<source_id>/quotes/ - Create a new quote
    """
    permission_classes = [IsAuthenticated]

    def get_source(self, source_id):
        return get_object_or_404(QuoteSource, id=source_id, user=self.request.user)

    def get(self, request, source_id):
        """List all quotes for a source"""
        source = self.get_source(source_id)
        quotes = Quote.objects.filter(source=source).prefetch_related('tags')
        
        # Optional filtering by tag
        tag = request.query_params.get('tag')
        if tag:
            quotes = quotes.filter(tags__tag__icontains=tag).distinct()
        
        serializer = QuoteSerializer(quotes, many=True)
        return Response({
            'success': True,
            'count': quotes.count(),
            'quotes': serializer.data
        })

    def post(self, request, source_id):
        """Create a new quote for a source"""
        source = self.get_source(source_id)
        serializer = QuoteCreateUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(source=source)
            
            # Return full quote with tags
            quote = Quote.objects.filter(
                id=serializer.data['id']
            ).prefetch_related('tags').first()
            
            response_serializer = QuoteSerializer(quote)
            return Response({
                'success': True,
                'quote': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class QuoteDetailView(views.APIView):
    """
    GET /api/quotes/<quote_id>/ - Get a specific quote
    PUT /api/quotes/<quote_id>/ - Update a quote
    DELETE /api/quotes/<quote_id>/ - Delete a quote
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, quote_id):
        quote = get_object_or_404(
            Quote.objects.select_related('source').prefetch_related('tags'),
            id=quote_id
        )
        # Verify user owns the source
        if quote.source.user != self.request.user:
            return None
        return quote

    def get(self, request, quote_id):
        """Get a specific quote"""
        quote = self.get_object(quote_id)
        if not quote:
            return Response({
                'success': False,
                'error': 'Quote not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = QuoteSerializer(quote)
        return Response({
            'success': True,
            'quote': serializer.data
        })

    def put(self, request, quote_id):
        """Update a quote"""
        quote = self.get_object(quote_id)
        if not quote:
            return Response({
                'success': False,
                'error': 'Quote not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = QuoteCreateUpdateSerializer(quote, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated quote
            updated_quote = self.get_object(quote_id)
            response_serializer = QuoteSerializer(updated_quote)
            return Response({
                'success': True,
                'quote': response_serializer.data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_id):
        """Delete a quote"""
        quote = self.get_object(quote_id)
        if not quote:
            return Response({
                'success': False,
                'error': 'Quote not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        quote.delete()
        return Response({
            'success': True,
            'message': 'Quote deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


# ==================== FUZZY SEARCH VIEW ====================

def calculate_similarity(str1, str2):
    """Calculate similarity ratio between two strings (0-1)"""
    return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()


class QuoteFuzzySearchView(views.APIView):
    """
    GET /api/quotes/search/?q=<query> - Fuzzy search across all quote sources and quotes
    
    Search algorithm:
    - Searches in source titles, quote text, authors, and tags
    - Uses fuzzy matching with similarity scoring
    - Returns results sorted by relevance
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return Response({
                'success': False,
                'error': 'Search query is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(query) < 2:
            return Response({
                'success': False,
                'error': 'Search query must be at least 2 characters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all sources for the user
        sources = QuoteSource.objects.filter(user=request.user).prefetch_related(
            Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
        )
        
        results = []
        query_lower = query.lower()
        
        for source in sources:
            matched_quotes = []
            relevance_score = 0
            match_types = []
            
            # Check title match (highest priority)
            title_similarity = calculate_similarity(query, source.title)
            if title_similarity > 0.3 or query_lower in source.title.lower():
                relevance_score += title_similarity * 10
                match_types.append('title')
            
            # Check quotes
            for quote in source.quotes.all():
                quote_matched = False
                quote_score = 0
                
                # Check quote text
                text_similarity = calculate_similarity(query, quote.text)
                if text_similarity > 0.3 or query_lower in quote.text.lower():
                    quote_score += text_similarity * 5
                    quote_matched = True
                    if 'text' not in match_types:
                        match_types.append('text')
                
                # Check author
                author_similarity = calculate_similarity(query, quote.author)
                if author_similarity > 0.4 or query_lower in quote.author.lower():
                    quote_score += author_similarity * 7
                    quote_matched = True
                    if 'author' not in match_types:
                        match_types.append('author')
                
                # Check tags
                for tag_obj in quote.tags.all():
                    tag_similarity = calculate_similarity(query, tag_obj.tag)
                    if tag_similarity > 0.4 or query_lower in tag_obj.tag.lower():
                        quote_score += tag_similarity * 8
                        quote_matched = True
                        if 'tag' not in match_types:
                            match_types.append('tag')
                
                if quote_matched:
                    matched_quotes.append(quote)
                    relevance_score += quote_score
            
            # Add to results if there's any match
            if relevance_score > 0:
                results.append({
                    'source': source,
                    'matched_quotes': matched_quotes,
                    'relevance_score': relevance_score,
                    'match_type': ', '.join(match_types) if match_types else 'general'
                })
        
        # Sort by relevance score (descending)
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        # Limit results
        max_results = int(request.query_params.get('limit', 20))
        results = results[:max_results]
        
        # Serialize results
        serialized_results = []
        for result in results:
            source_serializer = QuoteSourceListSerializer(result['source'])
            quotes_serializer = QuoteSerializer(result['matched_quotes'], many=True)
            
            serialized_results.append({
                'source': source_serializer.data,
                'matched_quotes': quotes_serializer.data,
                'relevance_score': round(result['relevance_score'], 2),
                'match_type': result['match_type']
            })
        
        return Response({
            'success': True,
            'query': query,
            'count': len(serialized_results),
            'results': serialized_results
        })


# ==================== TAGS VIEW ====================

class QuoteTagsView(views.APIView):
    """
    GET /api/quotes/tags/ - Get all unique tags used by the user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all unique tags for user's quotes"""
        tags = QuoteTag.objects.filter(
            quote__source__user=request.user
        ).values_list('tag', flat=True).distinct().order_by('tag')
        
        return Response({
            'success': True,
            'count': len(tags),
            'tags': list(tags)
        })
