from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Chaos Tracker API is running!"})


urlpatterns = [
    path("", home),  # directly call home()
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
]
