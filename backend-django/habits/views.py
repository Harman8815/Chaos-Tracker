from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from calendar import monthrange

from .models import Habit
from .serializers import HabitSerializer


# GET habits for the authenticated user for a specific month/year
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_habits(request):
    month = request.query_params.get("month")
    year = request.query_params.get("year")

    if not month or not year:
        return Response({"error": "month and year are required"}, status=400)

    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return Response({"error": "Invalid month or year"}, status=400)

    num_days = monthrange(year, month)[1]
    habits = Habit.objects.filter(user=request.user, month=month, year=year)
    response = []

    for habit in habits:
        habit_data = habit.data or []
        if len(habit_data) < num_days:
            habit_data += [0] * (num_days - len(habit_data))

        response.append({
            "id": str(habit.id),
            "name": habit.name,
            "color": habit.color,
            "data": habit_data[:num_days]
        })

    return Response(response, status=200)


# CREATE a new habit for the current user for a specific month/year
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_habit(request):
    month = request.query_params.get("month")
    year = request.query_params.get("year")

    if not month or not year:
        return Response({"error": "month and year are required"}, status=400)

    try:
        month = int(month)
        year = int(year)
    except ValueError:
        return Response({"error": "Invalid month or year"}, status=400)

    data = request.data.copy()
    serializer = HabitSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user, month=month, year=year)  # pass month/year too
        return Response(
            {"id": serializer.data["id"], "message": "Habit created successfully"},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# UPDATE habit for the current user
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_habit(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    serializer = HabitSerializer(habit, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Habit updated successfully"}, status=200)
    return Response(serializer.errors, status=400)


# DELETE habit entirely or only month data for current user
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_habit(request, habit_id):
    habit = get_object_or_404(Habit, id=habit_id, user=request.user)
    month = request.query_params.get("month")
    year = request.query_params.get("year")

    if month and year:
        try:
            month = int(month)
            year = int(year)
        except ValueError:
            return Response({"error": "Invalid month or year"}, status=400)

        # Ensure month/year matches the habit
        if habit.month != month or habit.year != year:
            return Response({"error": "Habit does not exist for this month/year"}, status=404)

        num_days = monthrange(year, month)[1]
        habit.data = [0] * num_days
        habit.save()
        return Response(
            {"message": f"Habit data for {month}/{year} deleted"},
            status=200
        )

    habit.delete()
    return Response({"message": "Habit deleted successfully"}, status=200)
