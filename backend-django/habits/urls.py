from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_habits, name='get_habits'),
    path('create/', views.create_habit, name='create_habit'),
    path('<uuid:habit_id>/', views.update_habit, name='update_habit'),
    path('<uuid:habit_id>/delete/', views.delete_habit, name='delete_habit'),
]
