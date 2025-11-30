from django.urls import path
from .views import SyncView, JournalEntryListCreateView, JournalEntryDetailView

urlpatterns = [
    path('sync/', SyncView.as_view(), name='sync'),
    path('journal/', JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('journal/<str:date>/', JournalEntryDetailView.as_view(), name='journal-detail'),
]
