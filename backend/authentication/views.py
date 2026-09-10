from django.contrib.auth import authenticate, login, logout
from rest_framework import status, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from tracker.utils import success_response, error_response
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
            login(request, user)
            return success_response(
                data={
                    'message': 'Account created successfully',
                    'user': UserSerializer(user).data
                },
                status_code=status.HTTP_201_CREATED
            )
        return error_response(
            message=serializer.errors,
            code='VALIDATION_ERROR',
            status_code=status.HTTP_400_BAD_REQUEST
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
                return success_response(
                    data={
                        'message': 'Login successful',
                        'user': UserSerializer(user).data
                    },
                    status_code=status.HTTP_200_OK
                )
            
            return error_response(
                message='Invalid credentials',
                code='AUTH_ERROR',
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        
        return error_response(
            message=serializer.errors,
            code='VALIDATION_ERROR',
            status_code=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(views.APIView):
    """
    User logout endpoint
    POST /api/auth/logout/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        logout(request)
        return success_response(
            data={'message': 'Logged out successfully'},
            status_code=status.HTTP_200_OK
        )

class CurrentUserView(views.APIView):
    """
    Get current authenticated user
    GET /api/auth/me/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return success_response(
            data={'user': UserSerializer(request.user).data},
            status_code=status.HTTP_200_OK
        )
