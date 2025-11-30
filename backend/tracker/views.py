from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import JournalEntry
from .serializers import JournalEntrySerializer
import datetime

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
        
        return Response({
            'success': True,
            'data': data,
            'habits': [],
            'rules': [],
            'planner': {},
            'goals': {},
            'expenses': [],
            'quotes': [],
            'achievements': [],
            'userProfile': {
                'name': request.user.username,
                'email': request.user.email,
                'joinDate': request.user.date_joined.isoformat() if request.user.date_joined else None
            }
        }, status=status.HTTP_200_OK)

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
