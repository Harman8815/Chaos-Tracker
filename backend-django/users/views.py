from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "User already exists"}, status=400)
    user = User.objects.create_user(username=username, password=password)
    return JsonResponse({"message": "User created successfully"})


@api_view(["POST"])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return JsonResponse({"message": "Logged out successfully"})
    except Exception:
        return JsonResponse({"error": "Invalid token"}, status=400)
