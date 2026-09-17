from rest_framework import serializers


class ExpenseQuerySerializer(serializers.Serializer):
    year = serializers.IntegerField(required=False, min_value=1900, max_value=9999)
    month = serializers.IntegerField(required=False, min_value=0, max_value=11)
    category = serializers.CharField(required=False, max_length=100, allow_blank=True)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)


class ExpenseTopItemsQuerySerializer(ExpenseQuerySerializer):
    limit = serializers.IntegerField(required=False, min_value=0, max_value=100)


class GoalQuerySerializer(serializers.Serializer):
    category = serializers.ChoiceField(
        required=False,
        choices=["daily", "monthly", "future"],
    )
    status = serializers.ChoiceField(
        required=False,
        choices=["active", "completed", "blocked", "trashed"],
    )


class QuoteSourceQuerySerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        required=False,
        choices=["Movie", "Web Series", "Book"],
        source="source_type",
    )
    include_quotes = serializers.BooleanField(required=False, default=False)


class QuoteListQuerySerializer(serializers.Serializer):
    tag = serializers.CharField(required=False, max_length=50, allow_blank=True)


class QuoteSearchQuerySerializer(serializers.Serializer):
    q = serializers.CharField(required=False, min_length=2, max_length=500, allow_blank=True)
    limit = serializers.IntegerField(required=False, min_value=0, max_value=100)
