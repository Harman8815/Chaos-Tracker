"""Thin v1 controller for analytics endpoints."""
from rest_framework import status
from rest_framework import serializers

from ._base import TrackerAPIView
from ...domain.services import analytics_service


class AnalyticsQuerySerializer(serializers.Serializer):
    days = serializers.IntegerField(required=False, min_value=1, max_value=365, default=30)
    year = serializers.IntegerField(required=False, min_value=1900, max_value=9999)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)


class ProductivityScoreView(TrackerAPIView):
    """GET /api/v1/analytics/productivity/ - Unified productivity score"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.get_productivity_score(request.user, days=days)
        return self.ok(data=result)


class ConsistencyScoreView(TrackerAPIView):
    """GET /api/v1/analytics/consistency/ - Habit/activity consistency score"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.get_consistency_score(request.user, days=days)
        return self.ok(data=result)


class GoalVelocityView(TrackerAPIView):
    """GET /api/v1/analytics/goal-velocity/ - Goal completion speed"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.get_goal_velocity(request.user, days=days)
        return self.ok(data=result)


class FinancialHealthView(TrackerAPIView):
    """GET /api/v1/analytics/financial-health/ - Spending/cash-flow metrics"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.get_financial_health_metrics(request.user, days=days)
        return self.ok(data=result)


class TrendsView(TrackerAPIView):
    """GET /api/v1/analytics/trends/ - Rising/falling behavior detection"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.detect_trends(request.user, days=days)
        return self.ok(data=result)


class CorrelationsView(TrackerAPIView):
    """GET /api/v1/analytics/correlations/ - Cross-domain correlations"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.correlation_engine(request.user, days=days)
        return self.ok(data=result)


class InsightsView(TrackerAPIView):
    """GET /api/v1/analytics/insights/ - Generated explanations from metrics"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        result = analytics_service.generate_insights(request.user, days=days)
        return self.ok(data=result)


class AnalyticsDashboardView(TrackerAPIView):
    """GET /api/v1/analytics/dashboard/ - Complete analytics dashboard"""
    
    def get(self, request):
        query = self.validated_query(AnalyticsQuerySerializer)
        days = query.get("days", 30)
        
        # Get all analytics in parallel-ish manner
        productivity = analytics_service.get_productivity_score(request.user, days=days)
        consistency = analytics_service.get_consistency_score(request.user, days=days)
        velocity = analytics_service.get_goal_velocity(request.user, days=days)
        financial = analytics_service.get_financial_health_metrics(request.user, days=days)
        trends = analytics_service.detect_trends(request.user, days=days)
        correlations = analytics_service.correlation_engine(request.user, days=days)
        insights = analytics_service.generate_insights(request.user, days=days)
        
        return self.ok(data={
            "period_days": days,
            "productivity": productivity,
            "consistency": consistency,
            "goal_velocity": velocity,
            "financial_health": financial,
            "trends": trends,
            "correlations": correlations,
            "insights": insights,
        })