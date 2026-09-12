from rest_framework import serializers
from .models import JournalEntry, QuoteSource, Quote, QuoteTag, Achievement, Expense, Goal, PlannerBlock, PlannerTask, PlannerLink, PlannerSettings, Habit, ScoringRule, DailyHabitScore, UserProfile, Mood, Water, Budget, Income, Account, RecurringExpense, RecurringIncome, BudgetAlert, Transfer, Subscription, Notification, NotificationPreference, ScheduledJob, NotificationDeduplication

import base64



class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'date', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuoteTagSerializer(serializers.Serializer):
    """
    Simple serializer for tags (just strings)
    """
    tag = serializers.CharField(max_length=50)


class QuoteSerializer(serializers.ModelSerializer):
    """
    Serializer for individual quotes
    """
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'tags', 'image', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_tags(self, obj):
        """Return tags as a list of strings"""
        return [tag.tag for tag in obj.tags.all()]


class QuoteCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating quotes with tags
    """
    id = serializers.CharField(read_only=True)
    image = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'tags', 'image']
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        quote = Quote.objects.create(**validated_data)
        
        # Create tags
        for tag in tags_data:
            QuoteTag.objects.create(quote=quote, tag=tag.strip())
        
        return quote
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        
        # Update quote fields
        instance.text = validated_data.get('text', instance.text)
        instance.author = validated_data.get('author', instance.author)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        
        # Update tags if provided
        if tags_data is not None:
            # Remove old tags
            instance.tags.all().delete()
            # Create new tags
            for tag in tags_data:
                QuoteTag.objects.create(quote=instance, tag=tag.strip())
        
        return instance


class QuoteSourceSerializer(serializers.ModelSerializer):
    """
    Serializer for quote sources with nested quotes
    """
    quotes = QuoteSerializer(many=True, read_only=True)
    quote_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = QuoteSource
        fields = ['id', 'title', 'type', 'cover_image', 'quotes', 'quote_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'quote_count']


class QuoteSourceListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing quote sources (without full quotes)
    """
    quote_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = QuoteSource
        fields = ['id', 'title', 'type', 'cover_image', 'quote_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'quote_count']


class QuoteSourceCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating quote sources
    """
    id = serializers.CharField(read_only=True)
    cover_image = serializers.CharField(required=False, allow_blank=True)
    quotes = QuoteCreateUpdateSerializer(many=True, required=False)
    
    class Meta:
        model = QuoteSource
        fields = ['id', 'title', 'type', 'cover_image', 'quotes']
    
    def create(self, validated_data):
        quotes_data = validated_data.pop('quotes', [])
        source = QuoteSource.objects.create(**validated_data)
        
        # Create quotes
        for quote_data in quotes_data:
            tags_data = quote_data.pop('tags', [])
            quote = Quote.objects.create(source=source, **quote_data)
            
            # Create tags for quote
            for tag in tags_data:
                QuoteTag.objects.create(quote=quote, tag=tag.strip())
        
        return source
    
    def update(self, instance, validated_data):
        quotes_data = validated_data.pop('quotes', None)
        
        # Update source fields
        instance.title = validated_data.get('title', instance.title)
        instance.type = validated_data.get('type', instance.type)
        instance.cover_image = validated_data.get('cover_image', instance.cover_image)
        instance.save()
        
        # Note: We don't update quotes here - use separate quote endpoints
        # This prevents accidental deletion of quotes when updating source
        
        return instance


class SearchResultSerializer(serializers.Serializer):
    """
    Serializer for search results with relevance scoring
    """
    source = QuoteSourceListSerializer()
    matched_quotes = QuoteSerializer(many=True)
    relevance_score = serializers.FloatField()
    match_type = serializers.CharField()  # 'title', 'tag', 'author', 'text'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'date', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExpenseSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Expense
        fields = ['id', 'date', 'item', 'category', 'quantity', 'price', 'total', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total', 'created_at', 'updated_at']


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'text', 'category', 'status', 'tags', 'created_at', 'updated_at', 'completed_at', 'target', 'completed_tasks', 'description', 'start_date', 'due_date', 'priority', 'frequency', 'reminders', 'completion_criteria', 'notes']
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']


# ==================== PLANNER SERIALIZERS ====================

class PlannerTaskSerializer(serializers.Serializer):
    """
    Serializer for individual tasks within a planner block
    """
    id = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=500)
    completed = serializers.BooleanField(default=False)


class PlannerBlockSerializer(serializers.Serializer):
    """
    Serializer for planner blocks with nested tasks
    """
    id = serializers.CharField(max_length=100)
    title = serializers.CharField(max_length=255)
    x = serializers.FloatField()
    y = serializers.FloatField()
    tasks = PlannerTaskSerializer(many=True, required=False)


class PlannerLinkSerializer(serializers.Serializer):
    """
    Serializer for links between planner blocks
    """
    id = serializers.CharField(max_length=100)
    from_field = serializers.CharField(max_length=100, source='from')
    to = serializers.CharField(max_length=100)

    def to_representation(self, instance):
        """Custom representation to use 'from' instead of 'from_field'"""
        ret = super().to_representation(instance)
        ret['from'] = ret.pop('from_field')
        return ret


class PlannerDataSerializer(serializers.Serializer):
    """
    Complete planner data structure
    """
    blocks = PlannerBlockSerializer(many=True, required=False)
    links = PlannerLinkSerializer(many=True, required=False)
    transform = serializers.JSONField(required=False)


# ==================== POINTS SERIALIZERS ====================

class HabitSerializer(serializers.ModelSerializer):
    rangeMax = serializers.IntegerField(source='range_max', required=False)

    class Meta:
        model = Habit
        fields = ['id', 'name', 'target', 'rangeMax', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ScoringRuleSerializer(serializers.ModelSerializer):
    maxPoints = serializers.IntegerField(source='max_points')
    penaltyRule = serializers.CharField(source='penalty_rule', required=False, allow_blank=True)
    zeroPointsCondition = serializers.CharField(source='zero_points_condition', required=False, allow_blank=True)
    scoringLogic = serializers.CharField(source='scoring_logic', required=False, allow_blank=True)

    class Meta:
        model = ScoringRule
        fields = ['id', 'activity', 'maxPoints', 'penaltyRule', 'zeroPointsCondition', 'scoringLogic', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DailyHabitScoreSerializer(serializers.ModelSerializer):
    habit_id = serializers.CharField(source='habit.id', read_only=True)
    
    class Meta:
        model = DailyHabitScore
        fields = ['date', 'habit_id', 'score', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'bio', 'avatar_url', 'date_of_birth', 'location', 
            'website', 'timezone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Handle nested user fields if needed
        user_data = {}
        for field in ['first_name', 'last_name']:
            if field in validated_data:
                user_data[field] = validated_data.pop(field)
        
        if user_data:
            for field, value in user_data.items():
                setattr(instance.user, field, value)
            instance.user.save()
        
        return super().update(instance, validated_data)


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id', 'date', 'mood', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Water
        fields = ['id', 'date', 'glasses', 'target', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BudgetSerializer(serializers.ModelSerializer):
    period = serializers.CharField(read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'category', 'year', 'month', 'amount', 'period', 'created_at', 'updated_at']
        read_only_fields = ['id', 'period', 'created_at', 'updated_at']


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'date', 'source', 'amount', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'account_type', 'balance', 'currency', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RecurringExpenseSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = RecurringExpense
        fields = ['id', 'item', 'category', 'quantity', 'price', 'total', 'frequency', 'start_date', 'end_date', 'day_of_month', 'day_of_week', 'next_occurrence', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total', 'next_occurrence', 'created_at', 'updated_at']


class BudgetAlertSerializer(serializers.ModelSerializer):
    budget_category = serializers.CharField(source='budget.category', read_only=True)
    budget_amount = serializers.DecimalField(source='budget.amount', max_digits=12, decimal_places=2, read_only=True)
    budget_period = serializers.CharField(source='budget.period', read_only=True)
    
    class Meta:
        model = BudgetAlert
        fields = ['id', 'budget', 'budget_category', 'budget_amount', 'budget_period', 'alert_type', 'threshold_percent', 'message', 'is_read', 'is_dismissed', 'triggered_at', 'created_at']
        read_only_fields = ['id', 'budget_category', 'budget_amount', 'budget_period', 'triggered_at', 'created_at']


class TransferSerializer(serializers.ModelSerializer):
    from_account_name = serializers.CharField(source='from_account.name', read_only=True)
    to_account_name = serializers.CharField(source='to_account.name', read_only=True)
    
    class Meta:
        model = Transfer
        fields = ['id', 'from_account', 'from_account_name', 'to_account', 'to_account_name', 'amount', 'transfer_type', 'status', 'date', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'from_account_name', 'to_account_name', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'name', 'category', 'amount', 'billing_cycle', 'next_billing_date', 'start_date', 'end_date', 'status', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'priority', 'title', 'message', 'data', 'is_read', 'read_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'read_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            'goal_deadline_enabled', 'habit_reminder_enabled', 'budget_alert_enabled',
            'streak_alert_enabled', 'achievement_enabled', 'weekly_summary_enabled',
            'monthly_summary_enabled', 'recurring_transaction_enabled', 'system_enabled',
            'in_app_enabled', 'email_enabled', 'push_enabled',
            'quiet_hours_start', 'quiet_hours_end', 'timezone',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ScheduledJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledJob
        fields = ['id', 'user', 'job_type', 'status', 'scheduled_at', 'started_at', 'completed_at',
                  'payload', 'result', 'error_message', 'retry_count', 'max_retries', 'next_retry_at',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'started_at', 'completed_at', 'retry_count']


class NotificationDeduplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationDeduplication
        fields = ['id', 'user', 'notification_type', 'dedupe_key', 'sent_at']
        read_only_fields = ['id', 'sent_at']


class RecurringIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringIncome
        fields = ['id', 'name', 'source', 'amount', 'frequency', 'start_date', 'end_date',
                  'day_of_month', 'next_occurrence', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'next_occurrence']

