"""Thin v1 controller for expenses and analytics."""
from rest_framework import status

from ._base import TrackerAPIView
from .serializers import (
    ExpenseQuerySerializer,
    ExpenseTopItemsQuerySerializer,
)
from ...domain.services import expense_service
from ...serializers import ExpenseSerializer


class ExpenseListCreateView(TrackerAPIView):
    serializer_class = ExpenseSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(ExpenseQuerySerializer)
        result = expense_service.list_with_summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        expenses = result.pop("expenses")
        serializer = self.serializer_class(expenses, many=True)
        result["expenses"] = serializer.data
        return self.ok(data=result, count=result["count"])

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = expense_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class ExpenseDetailView(TrackerAPIView):
    serializer_class = ExpenseSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = expense_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"expense": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = expense_service.update(request.user, kwargs["id"], serializer.validated_data, partial=True)
        serializer = self.serializer_class(instance)
        return self.ok(data={"expense": serializer.data}, message="Expense updated")

    def destroy(self, request, *args, **kwargs):
        expense_service.delete(request.user, kwargs["id"])
        return self.ok(message="Expense deleted", status_code=status.HTTP_204_NO_CONTENT)


class ExpenseSummaryView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(ExpenseQuerySerializer)
        summary = expense_service.summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data={"summary": summary})


class ExpenseCategoriesView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(ExpenseQuerySerializer)
        categories = expense_service.categories(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data=categories, count=len(categories))


class ExpenseAnalyticsView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(ExpenseQuerySerializer)
        analytics = expense_service.analytics(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data={"analytics": analytics})


class ExpenseMonthlyStatsView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(ExpenseQuerySerializer)
        stats = expense_service.monthly_stats(
            request.user,
            year=query.get("year"),
        )
        return self.ok(data=stats)


class ExpenseTopItemsView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(ExpenseTopItemsQuerySerializer)
        items = expense_service.top_items(
            request.user,
            limit=query.get("limit", 10),
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data={"top_expenses": items}, count=len(items))
