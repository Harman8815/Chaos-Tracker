from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Prefetch
from django.db.models import Q, Count, Prefetch
from .models import JournalEntry, QuoteSource, Quote, QuoteTag, Achievement, Expense, Goal
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
    GoalSerializer
)
import datetime
from datetime import timedelta
import random
import uuid
from difflib import SequenceMatcher
import urllib.request


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


class PopulateDataView(views.APIView):
    """
    POST /api/populate-data/
    Populate database with dummy data for journal and quotes.
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

        # --- Populate Journal ---
        today = datetime.date.today()
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



