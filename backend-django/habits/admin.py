from django.contrib import admin
from .models import Habit

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "color", "get_data_length")
    list_filter = ("user",)
    search_fields = ("name", "user__username")

    # Optional: show length of data array
    def get_data_length(self, obj):
        return len(obj.data)
    get_data_length.short_description = "Days Recorded"
