from rest_framework import serializers
from .models import JournalEntry, QuoteSource, Quote, QuoteTag, Achievement, Expense, Goal, PlannerBlock, PlannerTask, PlannerLink, PlannerSettings, Habit, ScoringRule, DailyHabitScore, UserProfile

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
        fields = ['id', 'text', 'category', 'status', 'tags', 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


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

