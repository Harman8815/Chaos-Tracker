from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Prefetch
from django.db.models import Q, Count, Prefetch
from .models import JournalEntry, QuoteSource, Quote, QuoteTag, Achievement, Expense, Goal, PlannerBlock, PlannerTask, PlannerLink, PlannerSettings, Habit, ScoringRule, DailyHabitScore, UserProfile
from .serializers import (
    JournalEntrySerializer,
    QuoteSourceSerializer,
    QuoteSourceListSerializer,
    QuoteSourceCreateUpdateSerializer,
    QuoteSerializer,
    QuoteCreateUpdateSerializer,
    SearchResultSerializer,
    AchievementSerializer,
    ExpenseSerializer,
    GoalSerializer,
    HabitSerializer,
    ScoringRuleSerializer,
    DailyHabitScoreSerializer,
    UserProfileSerializer
)
import datetime
from datetime import timedelta
import random
import uuid
from difflib import SequenceMatcher
import urllib.request
import csv
import json
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch


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
        
        # Fetch all habits
        habits = Habit.objects.filter(user=request.user)
        habits_serializer = HabitSerializer(habits, many=True)
        
        # Fetch all scoring rules
        rules = ScoringRule.objects.filter(user=request.user)
        rules_serializer = ScoringRuleSerializer(rules, many=True)
        
        # Fetch all daily scores
        daily_scores = DailyHabitScore.objects.filter(user=request.user)
        
        # Build the data dictionary
        data = {}
        
        # Helper to ensure date entry exists
        def get_date_entry(date_str):
            if date_str not in data:
                data[date_str] = {
                    'journal': '',
                    'points': 0,
                    'habitScores': {}
                }
            return data[date_str]
            
        # Process journal entries
        for entry in journal_entries:
            date_str = entry.date.strftime('%Y-%m-%d')
            entry_data = get_date_entry(date_str)
            entry_data['journal'] = entry.content
            
        # Process daily scores
        for score in daily_scores:
            date_str = score.date.strftime('%Y-%m-%d')
            entry_data = get_date_entry(date_str)
            entry_data['habitScores'][score.habit.id] = score.score
            
        # Calculate daily points
        habit_count = habits.count()
        if habit_count > 0:
            for date_str, entry_data in data.items():
                total_score = sum(entry_data['habitScores'].values())
                entry_data['points'] = round(total_score / habit_count)
        
        # Fetch quote sources with quotes
        quote_sources = QuoteSource.objects.filter(user=request.user).prefetch_related(
            Prefetch('quotes', queryset=Quote.objects.prefetch_related('tags'))
        )
        quotes_serializer = QuoteSourceSerializer(quote_sources, many=True)
        
        # Fetch planner data
        planner_blocks = PlannerBlock.objects.filter(user=request.user).prefetch_related('tasks')
        blocks_data = []
        
        for block in planner_blocks:
            tasks_data = [
                {
                    'id': task.id,
                    'text': task.text,
                    'completed': task.completed
                }
                for task in block.tasks.all()
            ]
            
            blocks_data.append({
                'id': block.id,
                'title': block.title,
                'x': block.x,
                'y': block.y,
                'tasks': tasks_data
            })
        
        # Get planner links
        planner_links = PlannerLink.objects.filter(user=request.user)
        links_data = [
            {
                'id': link.id,
                'from': link.from_block_id,
                'to': link.to_block_id
            }
            for link in planner_links
        ]
        
        # Get planner transform settings
        planner_settings, _ = PlannerSettings.objects.get_or_create(
            user=request.user,
            defaults={'transform': {'scale': 1, 'panX': 0, 'panY': 0}}
        )
        
        return Response({
            'success': True,
            'data': data,
            'habits': habits_serializer.data,
            'rules': rules_serializer.data,
            'planner': {
                'blocks': blocks_data,
                'links': links_data,
                'transform': planner_settings.transform
            },
            'goals': {},
            'quotes': quotes_serializer.data,
            'achievements': AchievementSerializer(Achievement.objects.filter(user=request.user), many=True).data,
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
    pagination_class = None

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


# ==================== POINTS VIEWS ====================

class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, id=str(uuid.uuid4()))


class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)


class ScoringRuleListCreateView(generics.ListCreateAPIView):
    serializer_class = ScoringRuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScoringRule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, id=str(uuid.uuid4()))


class ScoringRuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScoringRuleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return ScoringRule.objects.filter(user=self.request.user)


class DailyHabitScoreView(views.APIView):
    """
    GET /api/points/scores/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
    POST /api/points/scores/ - Update score for a habit on a date
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = DailyHabitScore.objects.filter(user=request.user)
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
            
        serializer = DailyHabitScoreSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        date = request.data.get('date')
        habit_id = request.data.get('habit_id')
        score = request.data.get('score')
        
        if not all([date, habit_id, score is not None]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
            
        habit = get_object_or_404(Habit, id=habit_id, user=request.user)
        
        score_obj, created = DailyHabitScore.objects.update_or_create(
            user=request.user,
            date=date,
            habit=habit,
            defaults={'score': score}
        )
        
        serializer = DailyHabitScoreSerializer(score_obj)
        return Response(serializer.data)


class PointsDataView(views.APIView):
    """
    GET /api/points/data/
    Returns all data required for the Points Tracker:
    - Habits
    - Scoring Rules
    - Daily Scores (formatted as a date-keyed dictionary)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch habits and rules
        habits = Habit.objects.filter(user=request.user)
        rules = ScoringRule.objects.filter(user=request.user)
        
        # Fetch daily scores
        daily_scores = DailyHabitScore.objects.filter(user=request.user)
        
        # Build the daily data dictionary
        daily_data = {}
        
        for score in daily_scores:
            date_str = score.date.strftime('%Y-%m-%d')
            if date_str not in daily_data:
                daily_data[date_str] = {
                    'habitScores': {},
                    'points': 0,
                    'journal': ''
                }
            daily_data[date_str]['habitScores'][score.habit.id] = score.score

        # Calculate daily points average
        habit_count = habits.count()
        if habit_count > 0:
            for date_str, data in daily_data.items():
                total_score = sum(data['habitScores'].values())
                data['points'] = round(total_score / habit_count)

        return Response({
            'habits': HabitSerializer(habits, many=True).data,
            'rules': ScoringRuleSerializer(rules, many=True).data,
            'dailyData': daily_data
        })


class PointsAnalyticsStreaksView(views.APIView):
    """
    GET /api/points/analytics/streaks/ - Returns current and best streaks per habit
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        habits = Habit.objects.filter(user=request.user)
        results = []

        for habit in habits:
            # Get all scores for this habit ordered by date
            scores = DailyHabitScore.objects.filter(user=request.user, habit=habit).order_by('date')

            # Compute best streak and current streak
            best = 0
            current = 0
            prev_date = None
            running = 0

            for s in scores:
                done = (s.score or 0) > 0
                if done:
                    if prev_date is None or (s.date - prev_date).days == 1:
                        running += 1
                    else:
                        running = 1
                else:
                    running = 0

                if running > best:
                    best = running

                prev_date = s.date

            # current streak: look backwards from today
            current = 0
            today = datetime.date.today()
            day_cursor = today
            while True:
                score_obj = DailyHabitScore.objects.filter(user=request.user, habit=habit, date=day_cursor).first()
                if score_obj and (score_obj.score or 0) > 0:
                    current += 1
                    day_cursor = day_cursor - timedelta(days=1)
                else:
                    break

            results.append({
                'habit_id': habit.id,
                'name': habit.name,
                'current_streak': current,
                'best_streak': best
            })

        return Response({'success': True, 'streaks': results})


class PointsAnalyticsTodayDistributionView(views.APIView):
    """
    GET /api/points/analytics/today-distribution/ - Returns distribution of scores for today
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = datetime.date.today()

        habits = list(Habit.objects.filter(user=request.user))
        # Build per-habit score list
        habit_list = []
        total_score = 0

        for habit in habits:
            score_obj = DailyHabitScore.objects.filter(user=request.user, habit=habit, date=today).first()
            score_val = int(score_obj.score) if score_obj and score_obj.score is not None else 0
            habit_list.append({
                'habit_id': habit.id,
                'name': habit.name,
                'score': score_val
            })
            total_score += score_val

        # Compute percentages
        for h in habit_list:
            h['percentage'] = round((h['score'] / total_score) * 100, 1) if total_score > 0 else 0

        return Response({'success': True, 'date': today.isoformat(), 'total': total_score, 'habits': habit_list})


class PointsAnalyticsHabitPerformance7View(views.APIView):
    """
    GET /api/points/analytics/habit-performance/7/ - Returns last 7 days performance per habit
    Optional query params: habit_id (to filter a single habit)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        habit_id = request.query_params.get('habit_id')
        end_date = datetime.date.today()
        start_date = end_date - timedelta(days=6)  # last 7 days inclusive

        habits_qs = Habit.objects.filter(user=request.user)
        if habit_id:
            habits_qs = habits_qs.filter(id=habit_id)

        results = []
        date_list = [(start_date + timedelta(days=i)).isoformat() for i in range(7)]

        for habit in habits_qs:
            scores = DailyHabitScore.objects.filter(user=request.user, habit=habit, date__range=(start_date, end_date))
            score_map = {s.date.isoformat(): s.score for s in scores}
            series = []
            for d in date_list:
                series.append({'date': d, 'score': score_map.get(d, 0)})

            total = sum(item['score'] for item in series)
            avg = total / 7

            results.append({
                'habit_id': habit.id,
                'name': habit.name,
                'series': series,
                'total': total,
                'average': avg
            })

        return Response({'success': True, 'start_date': start_date.isoformat(), 'end_date': end_date.isoformat(), 'data': results})


class PointsAnalyticsHabitTrend30View(views.APIView):
    """
    GET /api/points/analytics/habit-trend/30/ - Returns 30-day trend for a habit or all habits
    Query params:
      - habit_id (optional) : filter for a single habit
      - start_date (optional) and end_date (optional) : override date range
      - min_score (optional) : filter out scores below this value
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        habit_id = request.query_params.get('habit_id')
        min_score = request.query_params.get('min_score')
        start_date_param = request.query_params.get('start_date')
        end_date_param = request.query_params.get('end_date')

        end_date = datetime.date.today() if not end_date_param else datetime.datetime.strptime(end_date_param, '%Y-%m-%d').date()
        start_date = end_date - timedelta(days=29) if not start_date_param else datetime.datetime.strptime(start_date_param, '%Y-%m-%d').date()

        try:
            min_score_val = int(min_score) if min_score is not None else None
        except ValueError:
            min_score_val = None

        habits_qs = Habit.objects.filter(user=request.user)
        if habit_id:
            habits_qs = habits_qs.filter(id=habit_id)

        date_list = []
        delta = (end_date - start_date).days
        for i in range(delta + 1):
            date_list.append((start_date + timedelta(days=i)).isoformat())

        results = []

        for habit in habits_qs:
            scores = DailyHabitScore.objects.filter(user=request.user, habit=habit, date__range=(start_date, end_date))
            if min_score_val is not None:
                scores = scores.filter(score__gte=min_score_val)
            score_map = {s.date.isoformat(): s.score for s in scores}

            series = [{'date': d, 'score': score_map.get(d, 0)} for d in date_list]

            results.append({
                'habit_id': habit.id,
                'name': habit.name,
                'series': series
            })

        return Response({'success': True, 'start_date': start_date.isoformat(), 'end_date': end_date.isoformat(), 'data': results})


class PopulateDataView(views.APIView):
    """
    POST /api/populate-data/
    Populate database with dummy data for journal, quotes, points, etc.
    """
    permission_classes = []  # Allow any for dev convenience

    def get(self, request):
        # Get user: request.user if authenticated, else first user
        user = request.user
        if not user.is_authenticated:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.first()
            if not user:
                return Response({'error': 'No users found to assign data to'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Populate Habits ---
        habits_data = [
            {'name': 'Exercise', 'target': 30, 'range_max': 60},
            {'name': 'Reading', 'target': 20, 'range_max': 50},
            {'name': 'Meditation', 'target': 10, 'range_max': 30},
            {'name': 'Coding', 'target': 4, 'range_max': 8},
            {'name': 'Water Intake', 'target': 8, 'range_max': 12},
        ]
        
        created_habits = []
        for h_data in habits_data:
            habit, _ = Habit.objects.get_or_create(
                user=user,
                name=h_data['name'],
                defaults={
                    'id': str(uuid.uuid4()),
                    'target': h_data['target'],
                    'range_max': h_data['range_max']
                }
            )
            created_habits.append(habit)

        # --- Populate Scoring Rules ---
        rules_data = [
            {'activity': 'Gym', 'max_points': 10, 'scoring_logic': '1 point per 10 mins'},
            {'activity': 'Reading', 'max_points': 5, 'scoring_logic': '1 point per 10 pages'},
            {'activity': 'Coding', 'max_points': 15, 'scoring_logic': '2 points per hour'},
        ]
        
        for r_data in rules_data:
            ScoringRule.objects.get_or_create(
                user=user,
                activity=r_data['activity'],
                defaults={
                    'id': str(uuid.uuid4()),
                    'max_points': r_data['max_points'],
                    'scoring_logic': r_data['scoring_logic']
                }
            )

        # --- Populate Daily Scores ---
        today = datetime.date.today()
        for i in range(30): # Last 30 days
            date = today - timedelta(days=i)
            for habit in created_habits:
                # Random score between 0 and range_max
                score = random.randint(0, habit.range_max)
                DailyHabitScore.objects.update_or_create(
                    user=user,
                    date=date,
                    habit=habit,
                    defaults={'score': score}
                )

        # --- Populate Journal ---
        journal_count = 0
        
        # Moods and dummy content
        # moods = ['Happy', 'Sad', 'Neutral', 'Excited', 'Tired', 'Grateful']
        journal_templates = [
            "Today was a {adj} day. I worked on {project} and made good progress.",
            "Feeling {adj} today. Went for a walk and saw a {noun}.",
            "Had a meeting about {topic}. It went {adv}.",
            "I am grateful for {noun} today.",
            "Struggled with {topic} but eventually solved it.",
        ]
        adjectives = ['good', 'bad', 'productive', 'slow', 'amazing', 'challenging']
        nouns = ['dog', 'cat', 'sunset', 'coffee', 'friend', 'book', 'movie']
        projects = ['the tracker app', 'my novel', 'the garden', 'learning rust']
        topics = ['API design', 'database migration', 'frontend state', 'deployment']
        adverbs = ['well', 'poorly', 'surprisingly well', 'as expected']

        for i in range(365): # Last 365 days
            date = today - timedelta(days=i)
            # 70% chance to have an entry
            if random.random() < 0.7:
                # Check if exists
                if not JournalEntry.objects.filter(user=user, date=date).exists():
                    template = random.choice(journal_templates)
                    content = template.format(
                        adj=random.choice(adjectives),
                        noun=random.choice(nouns),
                        project=random.choice(projects),
                        topic=random.choice(topics),
                        adv=random.choice(adverbs)
                    )
                    JournalEntry.objects.create(
                        user=user,
                        date=date,
                        content=content
                    )
                    journal_count += 1

        # --- Populate Quotes ---
        quote_sources_data = [
            {'title': 'The Matrix', 'type': 'Movie', 'cover_image': 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg'},
            {'title': 'Inception', 'type': 'Movie', 'cover_image': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg'},
            {'title': 'Atomic Habits', 'type': 'Book', 'cover_image': 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg'},
            {'title': 'Dune', 'type': 'Book', 'cover_image': 'https://m.media-amazon.com/images/I/81ym3QUd3KL.jpg'},
            {'title': 'Silicon Valley', 'type': 'Web Series', 'cover_image': 'https://m.media-amazon.com/images/M/MV5BMTgwODYzNTM1Ml5BMl5BanBnXkFtZTgwMTcxNTYwMDI@._V1_.jpg'},
        ]
        
        quotes_data = [
            "The only way to do great work is to love what you do.",
            "I'm going to make him an offer he can't refuse.",
            "May the Force be with you.",
            "You talkin' to me?",
            "I see dead people.",
            "Here's looking at you, kid.",
            "Houston, we have a problem.",
            "There's no place like home.",
            "I feel the need... the need for speed.",
            "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
        ]
        
        source_count = 0
        quote_count = 0

        for source_data in quote_sources_data:
            source, created = QuoteSource.objects.get_or_create(
                user=user,
                title=source_data['title'],
                defaults={
                    'id': str(uuid.uuid4()),
                    'type': source_data['type'],
                    'cover_image': source_data['cover_image']
                }
            )
            if created:
                source_count += 1
            
            # Add 3-5 quotes for this source
            for _ in range(random.randint(3, 5)):
                text = random.choice(quotes_data)
                # Avoid duplicates for this source
                if not Quote.objects.filter(source=source, text=text).exists():
                    quote = Quote.objects.create(
                        id=str(uuid.uuid4()),
                        source=source,
                        text=text,
                        author="Unknown", # Simplified
                        image=""
                    )
                    # Add tags
                    tags = random.sample(['Inspirational', 'Funny', 'Life', 'Tech', 'Wisdom'], k=random.randint(1, 3))
                    for tag in tags:
                        QuoteTag.objects.create(quote=quote, tag=tag)
                    quote_count += 1

        # --- Populate Achievements ---
        achievement_images = [
            "https://m.media-amazon.com/images/I/71H3Wsh8rrL._AC_UF1000,1000_QL80_.jpg",
            "https://cdn.wallpapersafari.com/81/82/hilSnu.jpg",
            "https://plus.unsplash.com/premium_photo-1737182592549-0c83f93e2903?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwdmVoaWNsZXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1541348263662-e068662d82af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzJTIwY2FyfGVufDB8fDB8fHww"
        ]
        achievement_titles = [
            "First 10k Revenue", "Marathon Completed", "Read 50 Books", 
            "New Car", "Dream Vacation", "Project Launch", "Weight Loss Goal"
        ]
        
        achievements_count = 0
        # Create 50 achievements spanning 2020-2025
        start_date = datetime.date(2020, 1, 1)
        end_date = datetime.date(2025, 12, 31)
        days_range = (end_date - start_date).days

        for i in range(50):
            try:
                # Random date between 2020 and 2025
                random_days = random.randint(0, days_range)
                ach_date = start_date + timedelta(days=random_days)
                
                title = random.choice(achievement_titles)
                img_url = random.choice(achievement_images)
                
                Achievement.objects.create(
                    user=user,
                    title=title,
                    description=f"Achieved {title} on {ach_date}",
                    date=ach_date,
                    image=img_url
                )
                achievements_count += 1
            except Exception as e:
                print(f"Failed to create achievement: {e}")
                continue

        # --- Populate Expenses ---
        expense_categories = {
            'Food': {
                'items': ['Groceries', 'Restaurant', 'Coffee', 'Fast Food', 'Snacks', 'Vegetables', 'Fruits', 'Bakery'],
                'price_range': (5, 150)
            },
            'Transport': {
                'items': ['Gas', 'Uber', 'Public Transit', 'Parking', 'Car Maintenance', 'Taxi', 'Metro Card'],
                'price_range': (10, 100)
            },
            'Entertainment': {
                'items': ['Movie Tickets', 'Concert', 'Games', 'Streaming Service', 'Books', 'Sports Event', 'Music'],
                'price_range': (10, 200)
            },
            'Shopping': {
                'items': ['Clothes', 'Shoes', 'Electronics', 'Home Decor', 'Gadgets', 'Accessories', 'Gift'],
                'price_range': (20, 500)
            },
            'Healthcare': {
                'items': ['Pharmacy', 'Doctor Visit', 'Medical Test', 'Vitamins', 'Medicine', 'Dental'],
                'price_range': (15, 300)
            },
            'Utilities': {
                'items': ['Electricity', 'Water', 'Internet', 'Phone Bill', 'Gas Bill', 'Cable TV'],
                'price_range': (30, 200)
            },
            'Education': {
                'items': ['Books', 'Course Fee', 'Tuition', 'Stationery', 'Online Course', 'Workshop'],
                'price_range': (20, 1000)
            },
            'Other': {
                'items': ['Miscellaneous', 'Pet Supplies', 'Donations', 'Subscriptions', 'Gifts', 'Household Items'],
                'price_range': (10, 150)
            }
        }
        
        expenses_count = 0
        # Generate expenses for last 12 months with random intervals
        expense_start_date = today - timedelta(days=365)
        
        # Generate 200-300 expenses over 12 months (random intervals)
        num_expenses = random.randint(200, 300)
        
        for _ in range(num_expenses):
            # Random date in the last 12 months
            random_days = random.randint(0, 365)
            expense_date = expense_start_date + timedelta(days=random_days)
            
            # Random category
            category = random.choice(list(expense_categories.keys()))
            category_data = expense_categories[category]
            
            # Random item from category
            item = random.choice(category_data['items'])
            
            # Random quantity (mostly 1, occasionally more)
            quantity = random.choices([1, 2, 3, 4, 5], weights=[70, 15, 8, 5, 2])[0]
            
            # Random price within category range
            min_price, max_price = category_data['price_range']
            price = round(random.uniform(min_price, max_price), 2)
            
            try:
                Expense.objects.create(
                    user=user,
                    date=expense_date,
                    item=item,
                    category=category,
                    quantity=quantity,
                    price=price
                )
                expenses_count += 1
            except Exception as e:
                print(f"Failed to create expense: {e}")
                continue

        # --- Populate Goals ---
        goal_templates = {
            'daily': [
                'Drink 8 glasses of water', 'Read 30 minutes', 'Exercise for 45 mins', 
                'Meditate for 10 mins', 'No sugar', 'Walk 10,000 steps', 
                'Write in journal', 'Learn 5 new words'
            ],
            'monthly': [
                'Read 2 books', 'Save $500', 'Lose 2kg', 'Complete online course', 
                'Visit a new place', 'Declutter house', 'Try a new recipe', 
                'Call parents every week'
            ],
            'future': [
                'Buy a house', 'Travel to Japan', 'Learn to play piano', 
                'Run a marathon', 'Start a business', 'Retire early', 
                'Learn Spanish', 'Write a book'
            ]
        }
        
        goal_tags = ['health', 'finance', 'learning', 'personal', 'career', 'travel', 'mindfulness']
        goals_count = 0
        
        for category, templates in goal_templates.items():
            # Create 5-10 goals per category
            num_goals = random.randint(5, 10)
            selected_goals = random.sample(templates, min(num_goals, len(templates)))
            
            for text in selected_goals:
                status_choice = random.choices(
                    ['active', 'completed', 'blocked', 'trashed'], 
                    weights=[50, 30, 10, 10]
                )[0]
                
                # Random tags (1-3 tags)
                num_tags = random.randint(1, 3)
                tags = random.sample(goal_tags, num_tags)
                
                created_at = today - timedelta(days=random.randint(1, 90))
                completed_at = None
                
                if status_choice == 'completed':
                    # Completed after created_at
                    days_to_complete = random.randint(1, 30)
                    completed_at = created_at + timedelta(days=days_to_complete)
                    if completed_at > datetime.date.today():
                        completed_at = datetime.date.today()

                
                try:
                    Goal.objects.create(
                        user=user,
                        text=text,
                        category=category,
                        status=status_choice,
                        tags=tags,
                        created_at=created_at,
                        completed_at=completed_at
                    )
                    goals_count += 1
                except Exception as e:
                    print(f"Failed to create goal: {e}")
                    continue

        return Response({
            'success': True,
            'message': f'Successfully populated data for user {user.username}',
            'stats': {
                'journal_entries_created': journal_count,
                'quote_sources_created': source_count,
                'quotes_created': quote_count,
                'achievements_created': achievements_count,
                'expenses_created': expenses_count,
                'goals_created': goals_count
            }
        }, status=status.HTTP_201_CREATED)



# ==================== ACHIEVEMENT VIEWS ====================

class AchievementListCreateView(generics.ListCreateAPIView):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AchievementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)


# ==================== EXPENSE VIEWS ====================

class ExpenseListCreateView(generics.ListCreateAPIView):
    """
    GET /api/expenses/ - List all expenses for user (with optional filtering)
    POST /api/expenses/ - Create a new expense
    
    Query Parameters:
    - year: Filter by year (YYYY)
    - month: Filter by month (0-11, where 0 is January)
    - category: Filter by category
    - start_date: Filter expenses from this date (YYYY-MM-DD)
    - end_date: Filter expenses until this date (YYYY-MM-DD)
    """
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user)
        
        # Filter by year and month
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        
        if year and month is not None:
            try:
                year = int(year)
                month = int(month)  # 0-11 from frontend
                # Convert to 1-12 for Python's datetime
                queryset = queryset.filter(
                    date__year=year,
                    date__month=month + 1
                )
            except (ValueError, TypeError):
                pass
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            try:
                start_date_obj = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__gte=start_date_obj)
            except ValueError:
                pass
        
        if end_date:
            try:
                end_date_obj = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = queryset.filter(date__lte=end_date_obj)
            except ValueError:
                pass
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Calculate summary statistics
        total_expenses = queryset.count()
        total_amount = sum(expense.total for expense in queryset)
        
        # Category breakdown
        categories = {}
        for expense in queryset:
            if expense.category not in categories:
                categories[expense.category] = 0
            categories[expense.category] += float(expense.total)
        
        return Response({
            'success': True,
            'count': total_expenses,
            'total_amount': total_amount,
            'category_breakdown': categories,
            'expenses': serializer.data
        })


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/expenses/<id>/ - Get a specific expense
    PUT/PATCH /api/expenses/<id>/ - Update an expense
    DELETE /api/expenses/<id>/ - Delete an expense
    """
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'expense': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Expense updated successfully',
            'expense': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Expense deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class ExpenseSummaryView(views.APIView):
    """
    GET /api/expenses/summary/ - Get expense summary with totals and statistics
    
    Query Parameters:
    - year: Filter by year (YYYY)
    - month: Filter by month (0-11)
    - start_date: Start date (YYYY-MM-DD)
    - end_date: End date (YYYY-MM-DD)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = Expense.objects.filter(user=request.user)
        
        # Apply filters
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if year and month is not None:
            try:
                queryset = queryset.filter(
                    date__year=int(year),
                    date__month=int(month) + 1
                )
            except (ValueError, TypeError):
                pass
        
        if start_date:
            try:
                queryset = queryset.filter(date__gte=datetime.datetime.strptime(start_date, '%Y-%m-%d').date())
            except ValueError:
                pass
        
        if end_date:
            try:
                queryset = queryset.filter(date__lte=datetime.datetime.strptime(end_date, '%Y-%m-%d').date())
            except ValueError:
                pass
        
        # Calculate statistics
        total_expenses = queryset.count()
        total_amount = sum(expense.total for expense in queryset)
        
        # Average per expense
        avg_per_expense = total_amount / total_expenses if total_expenses > 0 else 0
        
        # Get unique categories count
        categories = set(expense.category for expense in queryset)
        
        return Response({
            'success': True,
            'summary': {
                'total_expenses': total_expenses,
                'total_amount': float(total_amount),
                'average_per_expense': float(avg_per_expense),
                'categories_count': len(categories),
                'unique_categories': list(categories)
            }
        })


class ExpenseCategoriesView(views.APIView):
    """
    GET /api/expenses/categories/ - Get all expense categories with totals
    
    Query Parameters:
    - year: Filter by year (YYYY)
    - month: Filter by month (0-11)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = Expense.objects.filter(user=request.user)
        
        # Apply filters
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if year and month is not None:
            try:
                queryset = queryset.filter(
                    date__year=int(year),
                    date__month=int(month) + 1
                )
            except (ValueError, TypeError):
                pass
        
        # Group by category
        categories = {}
        for expense in queryset:
            if expense.category not in categories:
                categories[expense.category] = {
                    'name': expense.category,
                    'count': 0,
                    'total': 0
                }
            categories[expense.category]['count'] += 1
            categories[expense.category]['total'] += float(expense.total)
        
        # Sort by total (descending)
        sorted_categories = sorted(
            categories.values(),
            key=lambda x: x['total'],
            reverse=True
        )
        
        return Response({
            'success': True,
            'count': len(sorted_categories),
            'categories': sorted_categories
        })


class ExpenseAnalyticsView(views.APIView):
    """
    GET /api/expenses/analytics/ - Get detailed analytics for expenses
    
    Query Parameters:
    - year: Filter by year (YYYY)
    - month: Filter by month (0-11)
    
    Returns daily breakdown, category breakdown, and trends
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or month is None:
            # Default to current month
            today = datetime.date.today()
            year = today.year
            month = today.month - 1  # Convert to 0-11
        else:
            try:
                year = int(year)
                month = int(month)
            except (ValueError, TypeError):
                return Response({
                    'success': False,
                    'error': 'Invalid year or month parameter'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get expenses for the month
        queryset = Expense.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month + 1
        )
        
        # Daily breakdown
        daily_totals = {}
        category_totals = {}
        
        for expense in queryset:
            day = expense.date.day
            if day not in daily_totals:
                daily_totals[day] = 0
            daily_totals[day] += float(expense.total)
            
            if expense.category not in category_totals:
                category_totals[expense.category] = 0
            category_totals[expense.category] += float(expense.total)
        
        # Convert to list format
        daily_data = [
            {'day': day, 'total': total}
            for day, total in sorted(daily_totals.items())
        ]
        
        category_data = [
            {'name': category, 'value': total}
            for category, total in sorted(
                category_totals.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]
        
        # Total for the month
        total_month = sum(daily_totals.values())
        
        # Days in month
        import calendar
        days_in_month = calendar.monthrange(year, month + 1)[1]
        
        return Response({
            'success': True,
            'analytics': {
                'year': year,
                'month': month,
                'days_in_month': days_in_month,
                'total_amount': total_month,
                'daily_breakdown': daily_data,
                'category_breakdown': category_data,
                'average_per_day': total_month / days_in_month if days_in_month > 0 else 0
            }
        })


class ExpenseMonthlyStatsView(views.APIView):
    """
    GET /api/expenses/monthly-stats/ - Get monthly statistics for expenses
    
    Query Parameters:
    - year: Year to get stats for (YYYY), defaults to current year
    
    Returns monthly totals for the entire year
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        year = request.query_params.get('year')
        
        if not year:
            year = datetime.date.today().year
        else:
            try:
                year = int(year)
            except (ValueError, TypeError):
                return Response({
                    'success': False,
                    'error': 'Invalid year parameter'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all expenses for the year
        queryset = Expense.objects.filter(
            user=request.user,
            date__year=year
        )
        
        # Group by month
        monthly_data = {}
        for month in range(1, 13):
            monthly_data[month] = {
                'month': month - 1,  # 0-11 for frontend
                'month_name': datetime.date(year, month, 1).strftime('%B'),
                'count': 0,
                'total': 0
            }
        
        for expense in queryset:
            month = expense.date.month
            monthly_data[month]['count'] += 1
            monthly_data[month]['total'] += float(expense.total)
        
        # Convert to list
        monthly_list = list(monthly_data.values())
        
        # Calculate year total
        year_total = sum(month['total'] for month in monthly_list)
        
        return Response({
            'success': True,
            'year': year,
            'total_amount': year_total,
            'monthly_stats': monthly_list
        })


class ExpenseTopItemsView(views.APIView):
    """
    GET /api/expenses/top-items/ - Get top expenses by amount
    
    Query Parameters:
    - limit: Number of items to return (default: 10)
    - year: Filter by year (YYYY)
    - month: Filter by month (0-11)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = Expense.objects.filter(user=request.user)
        
        # Apply filters
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        limit = request.query_params.get('limit', 10)
        
        try:
            limit = int(limit)
        except (ValueError, TypeError):
            limit = 10
        
        if year and month is not None:
            try:
                queryset = queryset.filter(
                    date__year=int(year),
                    date__month=int(month) + 1
                )
            except (ValueError, TypeError):
                pass
        
        # Get expenses and sort by total
        expenses = list(queryset)
        expenses_with_total = [
            {
                'id': expense.id,
                'date': expense.date.isoformat(),
                'item': expense.item,
                'category': expense.category,
                'quantity': expense.quantity,
                'price': float(expense.price),
                'total': float(expense.total)
            }
            for expense in expenses
        ]
        
        # Sort by total (descending)
        sorted_expenses = sorted(
            expenses_with_total,
            key=lambda x: x['total'],
            reverse=True
        )[:limit]
        
        return Response({
            'success': True,
            'count': len(sorted_expenses),
            'top_expenses': sorted_expenses
        })


# ==================== GOAL VIEWS ====================

class GoalListCreateView(generics.ListCreateAPIView):
    """
    GET /api/goals/ - List all goals for user
    POST /api/goals/ - Create a new goal
    
    Query Parameters:
    - category: Filter by category (daily, monthly, future)
    - status: Filter by status (active, completed, blocked, trashed)
    """
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        queryset = Goal.objects.filter(user=self.request.user)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Group by category for easier frontend consumption if needed, 
        # but standard list is usually better for REST.
        # Let's stick to standard list response but maybe add stats?
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'goals': serializer.data
        })


class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/goals/<id>/ - Get a specific goal
    PUT/PATCH /api/goals/<id>/ - Update a goal
    DELETE /api/goals/<id>/ - Delete a goal
    """
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
        
    def perform_update(self, serializer):
        # If status is changing to 'completed', set completed_at
        if 'status' in serializer.validated_data and serializer.validated_data['status'] == 'completed':
            serializer.save(completed_at=datetime.datetime.now())
        # If status is changing from 'completed' to something else, clear completed_at
        elif 'status' in serializer.validated_data and serializer.validated_data['status'] != 'completed':
            serializer.save(completed_at=None)
        else:
            serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'Goal updated successfully',
            'goal': serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Goal deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


# ==================== PLANNER VIEWS ====================

class PlannerDataView(views.APIView):
    """
    GET /api/planner/ - Get all planner data for the user
    PUT /api/planner/ - Replace all planner data
    PATCH /api/planner/ - Partially update planner data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all planner data for the authenticated user
        """
        user = request.user
        
        # Get all blocks with their tasks
        blocks = PlannerBlock.objects.filter(user=user).prefetch_related('tasks')
        blocks_data = []
        
        for block in blocks:
            tasks_data = [
                {
                    'id': task.id,
                    'text': task.text,
                    'completed': task.completed
                }
                for task in block.tasks.all()
            ]
            
            blocks_data.append({
                'id': block.id,
                'title': block.title,
                'x': block.x,
                'y': block.y,
                'tasks': tasks_data
            })
        
        # Get all links
        links = PlannerLink.objects.filter(user=user)
        links_data = [
            {
                'id': link.id,
                'from': link.from_block_id,
                'to': link.to_block_id
            }
            for link in links
        ]
        
        # Get transform settings
        settings, _ = PlannerSettings.objects.get_or_create(
            user=user,
            defaults={'transform': {'scale': 1, 'panX': 0, 'panY': 0}}
        )
        
        return Response({
            'success': True,
            'planner': {
                'blocks': blocks_data,
                'links': links_data,
                'transform': settings.transform
            }
        })

    def put(self, request):
        """
        Replace all planner data (full update)
        """
        user = request.user
        data = request.data
        
        # Delete existing data
        PlannerBlock.objects.filter(user=user).delete()
        PlannerLink.objects.filter(user=user).delete()
        
        # Create new blocks
        blocks_data = data.get('blocks', [])
        for block_data in blocks_data:
            block = PlannerBlock.objects.create(
                id=block_data['id'],
                user=user,
                title=block_data.get('title', 'New Block'),
                x=block_data.get('x', 0),
                y=block_data.get('y', 0)
            )
            
            # Create tasks for this block
            tasks_data = block_data.get('tasks', [])
            for idx, task_data in enumerate(tasks_data):
                PlannerTask.objects.create(
                    id=task_data['id'],
                    block=block,
                    text=task_data['text'],
                    completed=task_data.get('completed', False),
                    order=idx
                )
        
        # Create new links
        links_data = data.get('links', [])
        for link_data in links_data:
            PlannerLink.objects.create(
                id=link_data['id'],
                user=user,
                from_block_id=link_data['from'],
                to_block_id=link_data['to']
            )
        
        # Update transform
        transform_data = data.get('transform', {'scale': 1, 'panX': 0, 'panY': 0})
        settings, _ = PlannerSettings.objects.update_or_create(
            user=user,
            defaults={'transform': transform_data}
        )
        
        return Response({
            'success': True,
            'message': 'Planner data updated successfully'
        })

    def patch(self, request):
        """
        Partially update planner data
        """
        user = request.user
        data = request.data
        
        # Update blocks if provided
        if 'blocks' in data:
            blocks_data = data['blocks']
            for block_data in blocks_data:
                block_id = block_data['id']
                
                # Update or create block
                block, created = PlannerBlock.objects.update_or_create(
                    id=block_id,
                    user=user,
                    defaults={
                        'title': block_data.get('title', 'New Block'),
                        'x': block_data.get('x', 0),
                        'y': block_data.get('y', 0)
                    }
                )
                
                # Update tasks if provided
                if 'tasks' in block_data:
                    # Delete existing tasks for this block
                    PlannerTask.objects.filter(block=block).delete()
                    
                    # Create new tasks
                    tasks_data = block_data['tasks']
                    for idx, task_data in enumerate(tasks_data):
                        PlannerTask.objects.create(
                            id=task_data['id'],
                            block=block,
                            text=task_data['text'],
                            completed=task_data.get('completed', False),
                            order=idx
                        )
        
        # Update links if provided
        if 'links' in data:
            # Delete existing links
            PlannerLink.objects.filter(user=user).delete()
            
            # Create new links
            links_data = data['links']
            for link_data in links_data:
                PlannerLink.objects.create(
                    id=link_data['id'],
                    user=user,
                    from_block_id=link_data['from'],
                    to_block_id=link_data['to']
                )
        
        # Update transform if provided
        if 'transform' in data:
            settings, _ = PlannerSettings.objects.update_or_create(
                user=user,
                defaults={'transform': data['transform']}
            )
        
        return Response({
            'success': True,
            'message': 'Planner data updated successfully'
        })


class PlannerBlockDetailView(views.APIView):
    """
    GET /api/planner/blocks/<block_id>/ - Get a specific block
    PUT /api/planner/blocks/<block_id>/ - Update a specific block
    DELETE /api/planner/blocks/<block_id>/ - Delete a specific block
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, block_id):
        return get_object_or_404(
            PlannerBlock.objects.prefetch_related('tasks'),
            id=block_id,
            user=self.request.user
        )

    def get(self, request, block_id):
        """Get a specific block with its tasks"""
        block = self.get_object(block_id)
        
        tasks_data = [
            {
                'id': task.id,
                'text': task.text,
                'completed': task.completed
            }
            for task in block.tasks.all()
        ]
        
        return Response({
            'success': True,
            'block': {
                'id': block.id,
                'title': block.title,
                'x': block.x,
                'y': block.y,
                'tasks': tasks_data
            }
        })

    def put(self, request, block_id):
        """Update a specific block"""
        block = self.get_object(block_id)
        data = request.data
        
        # Update block fields
        block.title = data.get('title', block.title)
        block.x = data.get('x', block.x)
        block.y = data.get('y', block.y)
        block.save()
        
        # Update tasks if provided
        if 'tasks' in data:
            # Delete existing tasks
            PlannerTask.objects.filter(block=block).delete()
            
            # Create new tasks
            tasks_data = data['tasks']
            for idx, task_data in enumerate(tasks_data):
                PlannerTask.objects.create(
                    id=task_data['id'],
                    block=block,
                    text=task_data['text'],
                    completed=task_data.get('completed', False),
                    order=idx
                )
        
        return Response({
            'success': True,
            'message': 'Block updated successfully'
        })

    def delete(self, request, block_id):
        """Delete a specific block and its associated links"""
        block = self.get_object(block_id)
        
        # Delete associated links
        PlannerLink.objects.filter(
            Q(from_block=block) | Q(to_block=block),
            user=request.user
        ).delete()
        
        # Delete the block (tasks will be cascade deleted)
        block.delete()
        
        return Response({
            'success': True,
            'message': 'Block deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update user profile
    GET /user/profile/ - Get current user's profile
    PUT /user/profile/ - Update user profile
    PATCH /user/profile/ - Partially update user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'timezone': 'UTC'
            }
        )
        return profile


class ExportDataView(views.APIView):
    """
    Export user data in different formats
    GET /export/json/ - Export as JSON
    GET /export/csv/ - Export as CSV
    GET /export/pdf/ - Export as PDF
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format_type):
        try:
            # Gather all user data
            data = self._gather_user_data(request.user)
            
            if format_type == 'json':
                return self._export_json(data)
            elif format_type == 'csv':
                return self._export_csv(data)
            elif format_type == 'pdf':
                return self._export_pdf(data)
            else:
                return Response(
                    {'error': 'Invalid format. Use json, csv, or pdf'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _gather_user_data(self, user):
        """Gather all user data for export"""
        # Journal entries
        journal_entries = JournalEntry.objects.filter(user=user)
        journal_data = [
            {
                'date': entry.date.strftime('%Y-%m-%d'),
                'content': entry.content,
                'created_at': entry.created_at.isoformat(),
                'updated_at': entry.updated_at.isoformat()
            }
            for entry in journal_entries
        ]
        
        # Habits and scores
        habits = Habit.objects.filter(user=user)
        habit_data = []
        for habit in habits:
            scores = DailyHabitScore.objects.filter(user=user, habit=habit)
            habit_data.append({
                'id': habit.id,
                'name': habit.name,
                'description': habit.description,
                'target_value': habit.target_value,
                'unit': habit.unit,
                'created_at': habit.created_at.isoformat(),
                'scores': [
                    {
                        'date': score.date.strftime('%Y-%m-%d'),
                        'score': score.score
                    }
                    for score in scores
                ]
            })
        
        # Expenses
        expenses = Expense.objects.filter(user=user)
        expense_data = [
            {
                'id': expense.id,
                'amount': float(expense.amount),
                'category': expense.category,
                'description': expense.description,
                'date': expense.date.strftime('%Y-%m-%d'),
                'created_at': expense.created_at.isoformat()
            }
            for expense in expenses
        ]
        
        # Goals
        goals = Goal.objects.filter(user=user)
        goal_data = [
            {
                'id': goal.id,
                'title': goal.title,
                'description': goal.description,
                'target_value': goal.target_value,
                'current_value': goal.current_value,
                'unit': goal.unit,
                'deadline': goal.deadline.strftime('%Y-%m-%d') if goal.deadline else None,
                'status': goal.status,
                'created_at': goal.created_at.isoformat()
            }
            for goal in goals
        ]
        
        # Quotes
        quote_sources = QuoteSource.objects.filter(user=user).prefetch_related('quotes')
        quotes_data = []
        for source in quote_sources:
            quotes = [
                {
                    'id': quote.id,
                    'text': quote.text,
                    'author': quote.author,
                    'page_number': quote.page_number,
                    'tags': list(quote.tags.values_list('tag', flat=True))
                }
                for quote in source.quotes.all()
            ]
            quotes_data.append({
                'id': source.id,
                'title': source.title,
                'type': source.type,
                'cover_image': source.cover_image,
                'quotes': quotes
            })
        
        return {
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'export_date': datetime.datetime.now().isoformat(),
            'journal_entries': journal_data,
            'habits': habit_data,
            'expenses': expense_data,
            'goals': goal_data,
            'quotes': quotes_data
        }
    
    def _export_json(self, data):
        """Export data as JSON"""
        response = HttpResponse(
            json.dumps(data, indent=2, ensure_ascii=False),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="tracker_data_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.json"'
        return response
    
    def _export_csv(self, data):
        """Export data as CSV (multiple files in a zip)"""
        import zipfile
        import io
        
        # Create a zip file in memory
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Journal entries CSV
            if data['journal_entries']:
                journal_csv = io.StringIO()
                writer = csv.writer(journal_csv)
                writer.writerow(['date', 'content', 'created_at', 'updated_at'])
                for entry in data['journal_entries']:
                    writer.writerow([entry['date'], entry['content'], entry['created_at'], entry['updated_at']])
                zip_file.writestr('journal_entries.csv', journal_csv.getvalue())
            
            # Expenses CSV
            if data['expenses']:
                expense_csv = io.StringIO()
                writer = csv.writer(expense_csv)
                writer.writerow(['id', 'amount', 'category', 'description', 'date', 'created_at'])
                for expense in data['expenses']:
                    writer.writerow([expense['id'], expense['amount'], expense['category'], expense['description'], expense['date'], expense['created_at']])
                zip_file.writestr('expenses.csv', expense_csv.getvalue())
            
            # Goals CSV
            if data['goals']:
                goals_csv = io.StringIO()
                writer = csv.writer(goals_csv)
                writer.writerow(['id', 'title', 'description', 'target_value', 'current_value', 'unit', 'deadline', 'status', 'created_at'])
                for goal in data['goals']:
                    writer.writerow([goal['id'], goal['title'], goal['description'], goal['target_value'], goal['current_value'], goal['unit'], goal['deadline'], goal['status'], goal['created_at']])
                zip_file.writestr('goals.csv', goals_csv.getvalue())
        
        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="tracker_data_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.zip"'
        return response
    
    def _export_pdf(self, data):
        """Export data as PDF report"""
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="tracker_report_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
        
        # Create PDF document
        doc = SimpleDocTemplate(response, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = styles['Heading1']
        story.append(Paragraph(f"Tracker Data Report - {data['user']['username']}", title_style))
        story.append(Spacer(1, 12))
        
        # Export date
        normal_style = styles['Normal']
        story.append(Paragraph(f"Export Date: {data['export_date']}", normal_style))
        story.append(Spacer(1, 12))
        
        # Summary section
        story.append(Paragraph("Summary", styles['Heading2']))
        story.append(Paragraph(f"Journal Entries: {len(data['journal_entries'])}", normal_style))
        story.append(Paragraph(f"Habits: {len(data['habits'])}", normal_style))
        story.append(Paragraph(f"Expenses: {len(data['expenses'])}", normal_style))
        story.append(Paragraph(f"Goals: {len(data['goals'])}", normal_style))
        story.append(Paragraph(f"Quote Sources: {len(data['quotes'])}", normal_style))
        story.append(Spacer(1, 12))
        
        # Recent journal entries
        if data['journal_entries']:
            story.append(Paragraph("Recent Journal Entries", styles['Heading2']))
            for entry in data['journal_entries'][:5]:  # Show last 5 entries
                story.append(Paragraph(f"<b>{entry['date']}</b>", normal_style))
                story.append(Paragraph(entry['content'][:200] + "..." if len(entry['content']) > 200 else entry['content'], normal_style))
                story.append(Spacer(1, 6))
        
        # Recent expenses
        if data['expenses']:
            story.append(Paragraph("Recent Expenses", styles['Heading2']))
            for expense in data['expenses'][:5]:  # Show last 5 expenses
                story.append(Paragraph(f"<b>{expense['date']}</b> - {expense['category']} - ${expense['amount']:.2f}", normal_style))
                if expense['description']:
                    story.append(Paragraph(expense['description'], normal_style))
                story.append(Spacer(1, 6))
        
        # Goals
        if data['goals']:
            story.append(Paragraph("Goals", styles['Heading2']))
            for goal in data['goals']:
                status_color = "green" if goal['status'] == 'completed' else "orange" if goal['status'] == 'in_progress' else "red"
                story.append(Paragraph(f"<b>{goal['title']}</b> - <font color='{status_color}'>{goal['status']}</font>", normal_style))
                story.append(Paragraph(f"Progress: {goal['current_value']}/{goal['target_value']} {goal['unit']}", normal_style))
                if goal['deadline']:
                    story.append(Paragraph(f"Deadline: {goal['deadline']}", normal_style))
                story.append(Spacer(1, 6))
        
        doc.build(story)
        return response


class ImportDataView(views.APIView):
    """
    Import user data from JSON or CSV files
    POST /import/json/ - Import from JSON
    POST /import/csv/ - Import from CSV (zip file)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format_type):
        try:
            if format_type == 'json':
                return self._import_json(request)
            elif format_type == 'csv':
                return self._import_csv(request)
            else:
                return Response(
                    {'error': 'Invalid format. Use json or csv'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _import_json(self, request):
        """Import data from JSON file"""
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        if not file.name.endswith('.json'):
            return Response(
                {'error': 'Invalid file format. Please upload a JSON file'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            content = json.loads(file.read().decode('utf-8'))
            results = self._process_import_data(request.user, content)
            
            return Response({
                'success': True,
                'message': 'Data imported successfully',
                'results': results
            })
        except json.JSONDecodeError:
            return Response(
                {'error': 'Invalid JSON format'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _import_csv(self, request):
        """Import data from CSV zip file"""
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        if not file.name.endswith('.zip'):
            return Response(
                {'error': 'Invalid file format. Please upload a ZIP file containing CSV files'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        import zipfile
        import io
        
        try:
            zip_file = zipfile.ZipFile(file)
            results = {}
            
            # Process journal entries
            if 'journal_entries.csv' in zip_file.namelist():
                with zip_file.open('journal_entries.csv') as csv_file:
                    content = csv_file.read().decode('utf-8')
                    reader = csv.DictReader(io.StringIO(content))
                    results['journal_entries'] = self._import_journal_entries(request.user, list(reader))
            
            # Process expenses
            if 'expenses.csv' in zip_file.namelist():
                with zip_file.open('expenses.csv') as csv_file:
                    content = csv_file.read().decode('utf-8')
                    reader = csv.DictReader(io.StringIO(content))
                    results['expenses'] = self._import_expenses(request.user, list(reader))
            
            # Process goals
            if 'goals.csv' in zip_file.namelist():
                with zip_file.open('goals.csv') as csv_file:
                    content = csv_file.read().decode('utf-8')
                    reader = csv.DictReader(io.StringIO(content))
                    results['goals'] = self._import_goals(request.user, list(reader))
            
            return Response({
                'success': True,
                'message': 'Data imported successfully',
                'results': results
            })
        except Exception as e:
            return Response(
                {'error': f'Error processing ZIP file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _process_import_data(self, user, data):
        """Process imported JSON data"""
        results = {}
        
        # Import journal entries
        if 'journal_entries' in data:
            results['journal_entries'] = self._import_journal_entries(user, data['journal_entries'])
        
        # Import expenses
        if 'expenses' in data:
            results['expenses'] = self._import_expenses(user, data['expenses'])
        
        # Import goals
        if 'goals' in data:
            results['goals'] = self._import_goals(user, data['goals'])
        
        # Import habits
        if 'habits' in data:
            results['habits'] = self._import_habits(user, data['habits'])
        
        return results
    
    def _import_journal_entries(self, user, entries):
        """Import journal entries"""
        imported = 0
        errors = []
        
        for entry_data in entries:
            try:
                date_str = entry_data.get('date')
                if not date_str:
                    errors.append('Missing date for journal entry')
                    continue
                
                date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                
                JournalEntry.objects.update_or_create(
                    user=user,
                    date=date,
                    defaults={
                        'content': entry_data.get('content', '')
                    }
                )
                imported += 1
            except Exception as e:
                errors.append(f'Error importing journal entry: {str(e)}')
        
        return {'imported': imported, 'errors': errors}
    
    def _import_expenses(self, user, expenses):
        """Import expenses"""
        imported = 0
        errors = []
        
        for expense_data in expenses:
            try:
                date_str = expense_data.get('date')
                if not date_str:
                    errors.append('Missing date for expense')
                    continue
                
                date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                
                Expense.objects.create(
                    user=user,
                    amount=expense_data.get('amount', 0),
                    category=expense_data.get('category', 'Other'),
                    description=expense_data.get('description', ''),
                    date=date
                )
                imported += 1
            except Exception as e:
                errors.append(f'Error importing expense: {str(e)}')
        
        return {'imported': imported, 'errors': errors}
    
    def _import_goals(self, user, goals):
        """Import goals"""
        imported = 0
        errors = []
        
        for goal_data in goals:
            try:
                deadline = None
                if goal_data.get('deadline'):
                    deadline = datetime.datetime.strptime(goal_data['deadline'], '%Y-%m-%d').date()
                
                Goal.objects.create(
                    user=user,
                    title=goal_data.get('title', ''),
                    description=goal_data.get('description', ''),
                    target_value=goal_data.get('target_value', 0),
                    current_value=goal_data.get('current_value', 0),
                    unit=goal_data.get('unit', ''),
                    deadline=deadline,
                    status=goal_data.get('status', 'active')
                )
                imported += 1
            except Exception as e:
                errors.append(f'Error importing goal: {str(e)}')
        
        return {'imported': imported, 'errors': errors}
    
    def _import_habits(self, user, habits):
        """Import habits"""
        imported = 0
        errors = []
        
        for habit_data in habits:
            try:
                habit = Habit.objects.create(
                    user=user,
                    name=habit_data.get('name', ''),
                    description=habit_data.get('description', ''),
                    target_value=habit_data.get('target_value', 1),
                    unit=habit_data.get('unit', ''),
                )
                imported += 1
                
                # Import scores if available
                if 'scores' in habit_data:
                    for score_data in habit_data['scores']:
                        try:
                            date_str = score_data.get('date')
                            if date_str:
                                date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
                                DailyHabitScore.objects.update_or_create(
                                    user=user,
                                    habit=habit,
                                    date=date,
                                    defaults={
                                        'score': score_data.get('score', 0)
                                    }
                                )
                        except Exception as e:
                            errors.append(f'Error importing habit score: {str(e)}')
            except Exception as e:
                errors.append(f'Error importing habit: {str(e)}')
        
        return {'imported': imported, 'errors': errors}


class AnalyticsView(views.APIView):
    """
    Analytics endpoints for monthly and yearly summaries
    GET /analytics/monthly/ - Get monthly summary
    GET /analytics/yearly/ - Get yearly summary
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, period):
        try:
            if period == 'monthly':
                return self._get_monthly_analytics(request.user)
            elif period == 'yearly':
                return self._get_yearly_analytics(request.user)
            else:
                return Response(
                    {'error': 'Invalid period. Use monthly or yearly'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_monthly_analytics(self, user):
        """Get monthly analytics for current month"""
        now = datetime.datetime.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Journal entries this month
        journal_entries = JournalEntry.objects.filter(
            user=user,
            date__gte=current_month_start.date(),
            date__lte=now.date()
        )
        
        # Expenses this month
        expenses = Expense.objects.filter(
            user=user,
            date__gte=current_month_start.date(),
            date__lte=now.date()
        )
        
        # Goals progress
        goals = Goal.objects.filter(user=user)
        active_goals = goals.filter(status='active')
        completed_goals = goals.filter(status='completed')
        
        # Habit scores this month
        habit_scores = DailyHabitScore.objects.filter(
            user=user,
            date__gte=current_month_start.date(),
            date__lte=now.date()
        )
        
        # Calculate metrics
        total_expenses = sum(expense.amount for expense in expenses)
        expense_by_category = {}
        for expense in expenses:
            expense_by_category[expense.category] = expense_by_category.get(expense.category, 0) + float(expense.amount)
        
        habit_performance = {}
        for score in habit_scores:
            habit_name = score.habit.name
            if habit_name not in habit_performance:
                habit_performance[habit_name] = {
                    'total_score': 0,
                    'days_tracked': 0,
                    'average_score': 0
                }
            habit_performance[habit_name]['total_score'] += score.score
            habit_performance[habit_name]['days_tracked'] += 1
        
        for habit in habit_performance:
            if habit_performance[habit]['days_tracked'] > 0:
                habit_performance[habit]['average_score'] = habit_performance[habit]['total_score'] / habit_performance[habit]['days_tracked']
        
        return Response({
            'period': 'monthly',
            'month': now.strftime('%B %Y'),
            'journal': {
                'entries_count': journal_entries.count(),
                'recent_entries': [
                    {
                        'date': entry.date.strftime('%Y-%m-%d'),
                        'content_preview': entry.content[:100] + '...' if len(entry.content) > 100 else entry.content
                    }
                    for entry in journal_entries.order_by('-date')[:5]
                ]
            },
            'expenses': {
                'total_amount': float(total_expenses),
                'transaction_count': expenses.count(),
                'by_category': expense_by_category,
                'recent_expenses': [
                    {
                        'date': expense.date.strftime('%Y-%m-%d'),
                        'amount': float(expense.amount),
                        'category': expense.category,
                        'description': expense.description
                    }
                    for expense in expenses.order_by('-date')[:5]
                ]
            },
            'goals': {
                'total_goals': goals.count(),
                'active_goals': active_goals.count(),
                'completed_goals': completed_goals.count(),
                'completion_rate': (completed_goals.count() / goals.count() * 100) if goals.count() > 0 else 0
            },
            'habits': {
                'performance': habit_performance,
                'total_days_tracked': habit_scores.values('date').distinct().count()
            }
        })
    
    def _get_yearly_analytics(self, user):
        """Get yearly analytics for current year"""
        now = datetime.datetime.now()
        current_year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Monthly data aggregation
        monthly_data = []
        for month in range(1, now.month + 1):
            month_start = now.replace(month=month, day=1, hour=0, minute=0, second=0, microsecond=0)
            if month == 12:
                month_end = now.replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)
            else:
                month_end = now.replace(month=month + 1, day=1, hour=0, minute=0, second=0, microsecond=0) - datetime.timedelta(days=1)
            
            # Journal entries for this month
            journal_count = JournalEntry.objects.filter(
                user=user,
                date__gte=month_start.date(),
                date__lte=month_end.date()
            ).count()
            
            # Expenses for this month
            month_expenses = Expense.objects.filter(
                user=user,
                date__gte=month_start.date(),
                date__lte=month_end.date()
            )
            month_total = sum(expense.amount for expense in month_expenses)
            
            monthly_data.append({
                'month': month_start.strftime('%B'),
                'journal_entries': journal_count,
                'expenses_total': float(month_total),
                'expenses_count': month_expenses.count()
            })
        
        # Yearly totals
        yearly_expenses = Expense.objects.filter(
            user=user,
            date__gte=current_year_start.date(),
            date__lte=now.date()
        )
        total_expenses = sum(expense.amount for expense in yearly_expenses)
        
        yearly_journal = JournalEntry.objects.filter(
            user=user,
            date__gte=current_year_start.date(),
            date__lte=now.date()
        )
        
        # Goals completed this year
        yearly_goals = Goal.objects.filter(
            user=user,
            created_at__gte=current_year_start
        )
        
        # Top expense categories for the year
        expense_categories = {}
        for expense in yearly_expenses:
            expense_categories[expense.category] = expense_categories.get(expense.category, 0) + float(expense.amount)
        
        top_categories = sorted(expense_categories.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return Response({
            'period': 'yearly',
            'year': now.year,
            'summary': {
                'total_journal_entries': yearly_journal.count(),
                'total_expenses': float(total_expenses),
                'total_transactions': yearly_expenses.count(),
                'goals_created': yearly_goals.count(),
                'average_monthly_expenses': float(total_expenses / (now.month if now.month > 0 else 1))
            },
            'monthly_breakdown': monthly_data,
            'top_expense_categories': [
                {'category': cat, 'amount': amount} for cat, amount in top_categories
            ]
        })


class TempDataView(views.APIView):
    """
    Insert temporary/mock data with current timestamp
    POST /api/temp-data/
    """
    permission_classes = []
    
    def post(self, request):
        """
        Insert temporary data with current date timestamp for past 12 months
        """
        from django.utils import timezone
        import uuid
        from datetime import timedelta
        from django.contrib.auth.models import User
        
        # Get or create a default user for temp data
        user, created = User.objects.get_or_create(
            username='temp_user',
            defaults={
                'email': 'temp@example.com',
                'first_name': 'Temp',
                'last_name': 'User'
            }
        )
        
        current_datetime = timezone.now()
        current_date = current_datetime.date()
        
        # Create data for past 12 months
        expenses_created = 0
        goals_created = 0
        habits_created = 0
        journal_entries_created = 0
        
        expense_categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Utilities']
        goal_categories = ['daily', 'monthly', 'future']
        goal_statuses = ['active', 'completed', 'blocked']
        
        # Generate data for each of the past 12 months
        for months_ago in range(12):
            target_date = current_date - timedelta(days=months_ago * 30)  # Approximate months
            
            # Create 5-15 expenses per month
            num_expenses = random.randint(5, 15)
            for _ in range(num_expenses):
                expense_date = target_date - timedelta(days=random.randint(0, 29))
                expense = Expense.objects.create(
                    user=user,
                    date=expense_date,
                    item=f"Expense {random.choice(['Grocery', 'Gas', 'Entertainment', 'Shopping', 'Bills'])}",
                    category=random.choice(expense_categories),
                    quantity=random.randint(1, 3),
                    price=round(random.uniform(5.0, 200.0), 2)
                )
                expenses_created += 1
            
            # Create 2-5 goals per month
            num_goals = random.randint(2, 5)
            for _ in range(num_goals):
                goal = Goal.objects.create(
                    user=user,
                    text=f"Goal {random.choice(['Exercise', 'Read', 'Save Money', 'Learn', 'Travel'])} - {target_date.strftime('%B %Y')}",
                    category=random.choice(goal_categories),
                    status=random.choice(goal_statuses),
                    tags=[random.choice(['health', 'learning', 'finance', 'personal', 'career'])]
                )
                goals_created += 1
            
            # Create 1-3 journal entries per month
            num_entries = random.randint(1, 3)
            for _ in range(num_entries):
                entry_date = target_date - timedelta(days=random.randint(0, 29))
                # Check if journal entry already exists for this date
                if not JournalEntry.objects.filter(user=user, date=entry_date).exists():
                    journal_entry = JournalEntry.objects.create(
                        user=user,
                        date=entry_date,
                        content=f"Journal entry from {entry_date.strftime('%B %d, %Y')}. Today was a productive day with various activities and accomplishments."
                    )
                    journal_entries_created += 1
        
        # Create habits (only once)
        habit_names = ['Water Intake', 'Exercise', 'Reading', 'Meditation', 'Sleep']
        for habit_name in habit_names:
            habit = Habit.objects.create(
                id=str(uuid.uuid4()),
                user=user,
                name=habit_name,
                target=random.randint(5, 10),
                range_max=random.randint(10, 15)
            )
            habits_created += 1
            
            # Create habit scores for past 30 days
            for days_ago in range(30):
                score_date = current_date - timedelta(days=days_ago)
                # Check if habit score already exists for this date and habit
                if not DailyHabitScore.objects.filter(user=user, date=score_date, habit=habit).exists():
                    DailyHabitScore.objects.create(
                        user=user,
                        date=score_date,
                        habit=habit,
                        score=random.randint(0, habit.target)
                    )
        
        # Create some achievements
        achievement_titles = ['First Goal Completed', '30-Day Streak', 'Savings Target', 'Fitness Milestone']
        for title in achievement_titles:
            achievement_date = current_date - timedelta(days=random.randint(1, 365))
            Achievement.objects.create(
                user=user,
                title=title,
                description=f"Achievement unlocked: {title}",
                date=achievement_date
            )
        
        return Response({
            'success': True,
            'message': '12 months of historical data inserted successfully',
            'timestamp': current_datetime.isoformat(),
            'data': {
                'expenses': expenses_created,
                'goals': goals_created,
                'habits': habits_created,
                'journal_entries': journal_entries_created,
                'months_generated': 12,
                'habit_scores_created': habits_created * 30,
                'achievements_created': len(achievement_titles)
            }
        }, status=status.HTTP_201_CREATED)

