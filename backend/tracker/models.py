from django.db import models
from django.contrib.auth.models import User

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries')
    date = models.DateField()
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class QuoteSource(models.Model):
    """
    Represents a source of quotes (Movie, Web Series, Book)
    """
    SOURCE_TYPES = [
        ('Movie', 'Movie'),
        ('Web Series', 'Web Series'),
        ('Book', 'Book'),
    ]
    
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quote_sources')
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    cover_image = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'title']),
            models.Index(fields=['user', 'type']),
        ]

    def __str__(self):
        return f"{self.title} ({self.type})"

    @property
    def quote_count(self):
        return self.quotes.count()


class Quote(models.Model):
    """
    Individual quote belonging to a QuoteSource
    """
    id = models.CharField(max_length=100, primary_key=True)
    source = models.ForeignKey(QuoteSource, on_delete=models.CASCADE, related_name='quotes')
    text = models.TextField()
    author = models.CharField(max_length=255)
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['source', 'author']),
        ]

    def __str__(self):
        return f"{self.text[:50]}... - {self.author}"


class QuoteTag(models.Model):
    """
    Tags for quotes (many-to-many relationship)
    """
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='tags')
    tag = models.CharField(max_length=50)

    class Meta:
        unique_together = ['quote', 'tag']
        indexes = [
            models.Index(fields=['tag']),
        ]

    def __str__(self):
        return self.tag


class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.date}"


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    date = models.DateField()
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['user', 'category']),
        ]

    def __str__(self):
        return f"{self.item} - {self.category} - ${self.price}"
    
    @property
    def total(self):
        """Calculate total cost (quantity * price)"""
        return self.quantity * self.price


class Goal(models.Model):
    GOAL_CATEGORIES = [
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
        ('future', 'Future'),
    ]
    
    GOAL_STATUS = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
        ('trashed', 'Trashed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    text = models.CharField(max_length=500)
    category = models.CharField(max_length=20, choices=GOAL_CATEGORIES, default='daily')
    status = models.CharField(max_length=20, choices=GOAL_STATUS, default='active')
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'category']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"{self.category} - {self.text[:30]}"


class PlannerBlock(models.Model):
    """
    Represents a draggable block in the planner canvas
    """
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planner_blocks')
    title = models.CharField(max_length=255, default='New Block')
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.title} - ({self.x}, {self.y})"


class PlannerTask(models.Model):
    """
    Individual task within a planner block
    """
    id = models.CharField(max_length=100, primary_key=True)
    block = models.ForeignKey(PlannerBlock, on_delete=models.CASCADE, related_name='tasks')
    text = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['block', 'order']),
        ]

    def __str__(self):
        return f"{self.text[:30]} - {'✓' if self.completed else '○'}"


class PlannerLink(models.Model):
    """
    Represents a connection between two planner blocks
    """
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planner_links')
    from_block = models.ForeignKey(PlannerBlock, on_delete=models.CASCADE, related_name='outgoing_links')
    to_block = models.ForeignKey(PlannerBlock, on_delete=models.CASCADE, related_name='incoming_links')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.from_block.title} → {self.to_block.title}"


class PlannerSettings(models.Model):
    """
    Stores user-specific planner settings like canvas transform
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='planner_settings')
    transform = models.JSONField(default=dict)  # {scale, panX, panY}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Planner settings'

    def __str__(self):
        return f"{self.user.username}'s planner settings"


class Habit(models.Model):
    """
    Represents a habit to be tracked
    """
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=255)
    target = models.IntegerField(default=1)
    range_max = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return self.name


class ScoringRule(models.Model):
    """
    Represents a rule for scoring points
    """
    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scoring_rules')
    activity = models.CharField(max_length=255)
    max_points = models.IntegerField(default=10)
    penalty_rule = models.CharField(max_length=255, blank=True)
    zero_points_condition = models.CharField(max_length=255, blank=True)
    scoring_logic = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return self.activity


class DailyHabitScore(models.Model):
    """
    Stores the score for a specific habit on a specific date
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habit_scores')
    date = models.DateField()
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='scores')
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date', 'habit']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.habit.name} - {self.date}: {self.score}"

