from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class SyncView(views.APIView):
    """
    Sync endpoint for application data
    GET /api/sync/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Return all application data for the authenticated user
        For now, returns empty data structure
        """
        return Response({
            'success': True,
            'data': {},
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
