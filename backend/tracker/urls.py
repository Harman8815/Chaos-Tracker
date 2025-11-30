from django.urls import path
from .views import (
    SyncView,
    JournalEntryListCreateView,
    JournalEntryDetailView,
    QuoteSourceListCreateView,
    QuoteSourceDetailView,
    QuoteListCreateView,
    QuoteDetailView,
    QuoteFuzzySearchView,
    QuoteTagsView,
    PopulateDataView,
)

urlpatterns = [
    # Sync endpoint
    path('sync/', SyncView.as_view(), name='sync'),
    
    # Journal endpoints
    path('journal/', JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('journal/<str:date>/', JournalEntryDetailView.as_view(), name='journal-detail'),
    
    # Quote Source endpoints
    path('quotes/sources/', QuoteSourceListCreateView.as_view(), name='quote-source-list-create'),
    path('quotes/sources/<str:source_id>/', QuoteSourceDetailView.as_view(), name='quote-source-detail'),
    
    # Search endpoint
    path('quotes/search/', QuoteFuzzySearchView.as_view(), name='quote-fuzzy-search'),
    
    # Tags endpoint
    path('quotes/tags/', QuoteTagsView.as_view(), name='quote-tags'),

    # Quote endpoints (nested under source)
    path('quotes/sources/<str:source_id>/quotes/', QuoteListCreateView.as_view(), name='quote-list-create'),
    
    # Quote endpoints (direct access)
    path('quotes/<str:quote_id>/', QuoteDetailView.as_view(), name='quote-detail'),
    
    # Populate Data endpoint
    path('populate-data/', PopulateDataView.as_view(), name='populate-data'),
]
