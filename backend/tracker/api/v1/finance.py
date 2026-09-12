"""Thin v1 controller for expenses and analytics."""
from rest_framework import status

from .._base import TrackerAPIView
from ...domain.services import expense_service
from ...serializers import ExpenseSerializer


class ExpenseListCreateView(TrackerAPIView):
    serializer_class = ExpenseSerializer

    def list(self, request, *args, **kwargs):
        expenses = expense_service.list(
            request.user,
            year=request.query_params.get("year"),
            month=request.query_params.get("month"),
            category=request.query_params.get("category"),
            start_date=request.query_params.get("start_date"),
            end_date=request.query_params.get("end_date"),
        )
        serializer = self.serializer_class(expenses, many=True)
        total_amount = sum(float(e.total) for e in expenses)
        categories = {}
        for e in expenses:
            categories[e.category] = categories.get(e.category, 0.0) + float(e.total)
        return self.ok(data={
            "count": len(expenses),
            "total_amount": round(total_amount, 2),
            "category_breakdown": categories,
            "expenses": serializer.data,
        })

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = expense_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class ExpenseDetailView(TrackerAPIView):
    serializer_class = ExpenseSerializer

    def retrieve(self, request, *args, **kwargs):
        from ...domain.exceptions import NotFoundError
        instance = expense_service.list(request.user)
        instance = next((e for e in instance if str(e.id) == str(kwargs["id"])), None)
        if instance is None:
            return self.fail(NotFoundError("Expense not found"))
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
        summary = expense_service.summary(
            request.user,
            year=request.query_params.get("year"),
            month=request.query_params.get("month"),
            start_date=request.query_params.get("start_date"),
            end_date=request.query_params.get("end_date"),
        )
        return self.ok(data={"summary": summary})


class ExpenseCategoriesView(TrackerAPIView):
    def get(self, request):
        categories = expense_service.categories(
            request.user,
            year=request.query_params.get("year"),
            month=request.query_params.get("month"),
        )
        return self.ok(data=categories, count=len(categories))


class ExpenseAnalyticsView(TrackerAPIView):
    def get(self, request):
        analytics = expense_service.analytics(
            request.user,
            year=request.query_params.get("year"),
            month=request.query_params.get("month"),
        )
        return self.ok(data={"analytics": analytics})


class ExpenseMonthlyStatsView(TrackerAPIView):
    def get(self, request):
        stats = expense_service.monthly_stats(
            request.user,
            year=request.query_params.get("year"),
        )
        return self.ok(data=stats)


class ExpenseTopItemsView(TrackerAPIView):
    def get(self, request):
        items = expense_service.top_items(
            request.user,
            limit=request.query_params.get("limit", 10),
            year=request.query_params.get("year"),
            month=request.query_params.get("month"),
        )
        return self.ok(data=items, count=len(items))