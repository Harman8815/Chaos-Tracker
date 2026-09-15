"""Thin v1 controller for finance: expenses, income, accounts, budgets, recurring, transfers, subscriptions, alerts."""

from rest_framework import status
from rest_framework import serializers

from ._base import TrackerAPIView
from .serializers import (
    ExpenseQuerySerializer,
    ExpenseTopItemsQuerySerializer,
)
from ...domain.services import (
    expense_service,
    income_service,
    account_service,
    recurring_expense_service,
    transfer_service,
    subscription_service,
    budget_alert_service,
    budget_service,
)
from ...serializers import (
    ExpenseSerializer,
    IncomeSerializer,
    AccountSerializer,
    RecurringExpenseSerializer,
    TransferSerializer,
    SubscriptionSerializer,
    BudgetAlertSerializer,
    BudgetSerializer,
)


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
        instance = expense_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
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


# ==================== INCOME ====================


class IncomeQuerySerializer(serializers.Serializer):
    year = serializers.IntegerField(required=False, min_value=1900, max_value=9999)
    month = serializers.IntegerField(required=False, min_value=0, max_value=11)
    source = serializers.CharField(required=False, max_length=20, allow_blank=True)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)


class IncomeListCreateView(TrackerAPIView):
    serializer_class = IncomeSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(IncomeQuerySerializer)
        result = income_service.list_with_summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            source=query.get("source"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        incomes = result.pop("incomes")
        serializer = self.serializer_class(incomes, many=True)
        result["incomes"] = serializer.data
        return self.ok(data=result, count=result["count"])

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = income_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class IncomeDetailView(TrackerAPIView):
    serializer_class = IncomeSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = income_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"income": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = income_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(data={"income": serializer.data}, message="Income updated")

    def destroy(self, request, *args, **kwargs):
        income_service.delete(request.user, kwargs["id"])
        return self.ok(message="Income deleted", status_code=status.HTTP_204_NO_CONTENT)


class IncomeSummaryView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(IncomeQuerySerializer)
        summary = income_service.summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            source=query.get("source"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data={"summary": summary})


class IncomeMonthlyStatsView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(IncomeQuerySerializer)
        stats = income_service.monthly_stats(
            request.user,
            year=query.get("year"),
        )
        return self.ok(data=stats)


# ==================== ACCOUNTS ====================


class AccountListCreateView(TrackerAPIView):
    serializer_class = AccountSerializer

    def list(self, request, *args, **kwargs):
        is_active = request.query_params.get("is_active")
        if is_active is not None:
            is_active = is_active.lower() == "true"
        accounts = account_service.list(request.user, is_active=is_active)
        serializer = self.serializer_class(accounts, many=True)
        return self.ok(data=serializer.data, count=len(accounts))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = account_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class AccountDetailView(TrackerAPIView):
    serializer_class = AccountSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = account_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"account": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = account_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(data={"account": serializer.data}, message="Account updated")

    def destroy(self, request, *args, **kwargs):
        account_service.delete(request.user, kwargs["id"])
        return self.ok(message="Account deleted", status_code=status.HTTP_204_NO_CONTENT)


class AccountSummaryView(TrackerAPIView):
    def get(self, request):
        summary = account_service.summary(request.user)
        return self.ok(data={"summary": summary})


# ==================== RECURRING EXPENSES ====================


class RecurringExpenseQuerySerializer(serializers.Serializer):
    is_active = serializers.BooleanField(required=False)


class RecurringExpenseListCreateView(TrackerAPIView):
    serializer_class = RecurringExpenseSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(RecurringExpenseQuerySerializer)
        is_active = query.get("is_active")
        recurring = recurring_expense_service.list(request.user, is_active=is_active)
        serializer = self.serializer_class(recurring, many=True)
        return self.ok(data=serializer.data, count=len(recurring))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = recurring_expense_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class RecurringExpenseDetailView(TrackerAPIView):
    serializer_class = RecurringExpenseSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = recurring_expense_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"recurring_expense": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = recurring_expense_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(
            data={"recurring_expense": serializer.data}, message="Recurring expense updated"
        )

    def destroy(self, request, *args, **kwargs):
        recurring_expense_service.delete(request.user, kwargs["id"])
        return self.ok(message="Recurring expense deleted", status_code=status.HTTP_204_NO_CONTENT)


class RecurringExpenseProcessView(TrackerAPIView):
    """Process due recurring expenses and create actual expense records."""

    def post(self, request):
        created = recurring_expense_service.process_due(request.user)
        serializer = ExpenseSerializer(created, many=True)
        return self.ok(data={"created_expenses": serializer.data}, count=len(created))


# ==================== TRANSFERS ====================


class TransferQuerySerializer(serializers.Serializer):
    year = serializers.IntegerField(required=False, min_value=1900, max_value=9999)
    month = serializers.IntegerField(required=False, min_value=0, max_value=11)
    transfer_type = serializers.CharField(required=False, max_length=20, allow_blank=True)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)


class TransferListCreateView(TrackerAPIView):
    serializer_class = TransferSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(TransferQuerySerializer)
        result = transfer_service.list_with_summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            transfer_type=query.get("transfer_type"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        transfers = result.pop("transfers")
        serializer = self.serializer_class(transfers, many=True)
        result["transfers"] = serializer.data
        return self.ok(data=result, count=result["count"])

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = transfer_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class TransferDetailView(TrackerAPIView):
    serializer_class = TransferSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = transfer_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"transfer": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = transfer_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(data={"transfer": serializer.data}, message="Transfer updated")

    def destroy(self, request, *args, **kwargs):
        transfer_service.delete(request.user, kwargs["id"])
        return self.ok(message="Transfer deleted", status_code=status.HTTP_204_NO_CONTENT)


class TransferSummaryView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(TransferQuerySerializer)
        summary = transfer_service.summary(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            transfer_type=query.get("transfer_type"),
            start_date=query.get("start_date"),
            end_date=query.get("end_date"),
        )
        return self.ok(data={"summary": summary})


# ==================== SUBSCRIPTIONS ====================


class SubscriptionQuerySerializer(serializers.Serializer):
    status = serializers.CharField(required=False, max_length=20, allow_blank=True)


class SubscriptionListCreateView(TrackerAPIView):
    serializer_class = SubscriptionSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(SubscriptionQuerySerializer)
        subscriptions = subscription_service.list(request.user, status=query.get("status"))
        serializer = self.serializer_class(subscriptions, many=True)
        return self.ok(data=serializer.data, count=len(subscriptions))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = subscription_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class SubscriptionDetailView(TrackerAPIView):
    serializer_class = SubscriptionSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = subscription_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"subscription": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = subscription_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(data={"subscription": serializer.data}, message="Subscription updated")

    def destroy(self, request, *args, **kwargs):
        subscription_service.delete(request.user, kwargs["id"])
        return self.ok(message="Subscription deleted", status_code=status.HTTP_204_NO_CONTENT)


class SubscriptionSummaryView(TrackerAPIView):
    def get(self, request):
        summary = subscription_service.summary(request.user)
        return self.ok(data={"summary": summary})


class SubscriptionUpcomingView(TrackerAPIView):
    def get(self, request):
        days = int(request.query_params.get("days", 30))
        upcoming = subscription_service.get_upcoming(request.user, days=days)
        serializer = SubscriptionSerializer(upcoming, many=True)
        return self.ok(data=serializer.data, count=len(upcoming))


# ==================== BUDGET ALERTS ====================


class BudgetAlertQuerySerializer(serializers.Serializer):
    is_read = serializers.BooleanField(required=False)
    is_dismissed = serializers.BooleanField(required=False)


class BudgetAlertListView(TrackerAPIView):
    serializer_class = BudgetAlertSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(BudgetAlertQuerySerializer)
        alerts = budget_alert_service.list(
            request.user,
            is_read=query.get("is_read"),
            is_dismissed=query.get("is_dismissed"),
        )
        serializer = self.serializer_class(alerts, many=True)
        return self.ok(data=serializer.data, count=len(alerts))


class BudgetAlertDetailView(TrackerAPIView):
    serializer_class = BudgetAlertSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = budget_alert_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"alert": serializer.data})


class BudgetAlertMarkReadView(TrackerAPIView):
    def post(self, request, *args, **kwargs):
        alert = budget_alert_service.mark_read(request.user, kwargs["id"])
        serializer = BudgetAlertSerializer(alert)
        return self.ok(data={"alert": serializer.data}, message="Alert marked as read")


class BudgetAlertMarkDismissedView(TrackerAPIView):
    def post(self, request, *args, **kwargs):
        alert = budget_alert_service.mark_dismissed(request.user, kwargs["id"])
        serializer = BudgetAlertSerializer(alert)
        return self.ok(data={"alert": serializer.data}, message="Alert dismissed")


class BudgetAlertMarkAllReadView(TrackerAPIView):
    def post(self, request):
        count = budget_alert_service.mark_all_read(request.user)
        return self.ok(data={"marked_count": count}, message=f"Marked {count} alerts as read")


class BudgetAlertCheckView(TrackerAPIView):
    """Check budgets and create alerts if thresholds reached."""

    def post(self, request):
        year = request.data.get("year")
        month = request.data.get("month")
        if not year or not month:
            return self.error(
                "year and month are required", status_code=status.HTTP_400_BAD_REQUEST
            )
        alerts = budget_alert_service.check_and_create_alerts(
            request.user, year=int(year), month=int(month)
        )
        serializer = BudgetAlertSerializer(alerts, many=True)
        return self.ok(data={"created_alerts": serializer.data}, count=len(alerts))


class BudgetAlertUnreadCountView(TrackerAPIView):
    def get(self, request):
        count = budget_alert_service.get_unread_count(request.user)
        return self.ok(data={"unread_count": count})


# ==================== BUDGETS ====================


class BudgetQuerySerializer(serializers.Serializer):
    year = serializers.IntegerField(required=False, min_value=1900, max_value=9999)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12)
    category = serializers.CharField(required=False, max_length=100, allow_blank=True)


class BudgetListCreateView(TrackerAPIView):
    serializer_class = BudgetSerializer

    def list(self, request, *args, **kwargs):
        query = self.validated_query(BudgetQuerySerializer)
        budgets = budget_service.list(
            request.user,
            year=query.get("year"),
            month=query.get("month"),
            category=query.get("category"),
        )
        serializer = self.serializer_class(budgets, many=True)
        return self.ok(data=serializer.data, count=len(budgets))

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = budget_service.create(request.user, serializer.validated_data)
        serializer = self.serializer_class(instance)
        return self.ok(data=serializer.data, status_code=status.HTTP_201_CREATED)


class BudgetDetailView(TrackerAPIView):
    serializer_class = BudgetSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = budget_service.get_by_id(request.user, kwargs["id"])
        serializer = self.serializer_class(instance)
        return self.ok(data={"budget": serializer.data})

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = budget_service.update(
            request.user, kwargs["id"], serializer.validated_data, partial=True
        )
        serializer = self.serializer_class(instance)
        return self.ok(data={"budget": serializer.data}, message="Budget updated")

    def destroy(self, request, *args, **kwargs):
        budget_service.delete(request.user, kwargs["id"])
        return self.ok(message="Budget deleted", status_code=status.HTTP_204_NO_CONTENT)


class BudgetActualVsBudgetView(TrackerAPIView):
    def get(self, request):
        query = self.validated_query(BudgetQuerySerializer)
        year = query.get("year")
        month = query.get("month")
        if not year or not month:
            return self.error(
                "year and month are required", status_code=status.HTTP_400_BAD_REQUEST
            )
        result = budget_service.actual_vs_budget(
            request.user,
            year=int(year),
            month=int(month),
            category=query.get("category"),
        )
        return self.ok(data=result)
