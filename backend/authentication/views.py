from django.contrib.auth import authenticate, login, logout
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import SignupSerializer, LoginSerializer, UserSerializer

class SignupView(views.APIView):
    """
    User signup endpoint
    POST /api/auth/signup/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Automatically log in the user after signup
            login(request, user)
            return Response(
                {
                    'success': True,
                    'message': 'Account created successfully',
                    'user': UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'success': False,
                'error': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class LoginView(views.APIView):
    """
    User login endpoint
    POST /api/auth/login/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return Response(
                    {
                        'success': True,
                        'message': 'Login successful',
                        'user': UserSerializer(user).data
                    },
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {
                    'success': False,
                    'error': 'Invalid credentials'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(
            {
                'success': False,
                'error': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(views.APIView):
    """
    User logout endpoint
    POST /api/auth/logout/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        logout(request)
        return Response(
            {
                'success': True,
                'message': 'Logged out successfully'
            },
            status=status.HTTP_200_OK
        )

class CurrentUserView(views.APIView):
    """
    Get current authenticated user
    GET /api/auth/me/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(
            {
                'success': True,
                'user': UserSerializer(request.user).data
            },
            status=status.HTTP_200_OK
        )
