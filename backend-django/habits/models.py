from django.db import models
from django.contrib.auth.models import User

class Habit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="habits")
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # e.g., "#FF5733"
    month = models.IntegerField()  # 1-12
    year = models.IntegerField()   # e.g., 2025
    data = models.JSONField(default=list, blank=True)  # daily ratings array

    class Meta:
        unique_together = ("user", "name", "month", "year")  # optional: prevent duplicate habits for same month/year

    def __str__(self):
        return f"{self.name} ({self.month}/{self.year})"
