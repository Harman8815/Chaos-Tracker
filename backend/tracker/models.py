from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

    SOURCE_TYPES_KEYS = [k for k, _ in SOURCE_TYPES]
    
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
    trigger_rule = models.JSONField(
        default=dict, blank=True,
        help_text='Optional rule describing what measurable event triggers this achievement, e.g. {"event_type": "planner_task_completed", "count": 7}',
    )
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

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    GOAL_CATEGORIES_KEYS = [k for k, _ in GOAL_CATEGORIES]
    GOAL_STATUS_KEYS = [k for k, _ in GOAL_STATUS]
    PRIORITY_LEVELS_KEYS = [k for k, _ in PRIORITY_LEVELS]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    text = models.CharField(max_length=500)
    category = models.CharField(max_length=20, choices=GOAL_CATEGORIES, default='daily')
    status = models.CharField(max_length=20, choices=GOAL_STATUS, default='active')
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    target = models.IntegerField(default=1)
    completed_tasks = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    frequency = models.CharField(max_length=50, blank=True, null=True)
    reminders = models.JSONField(default=list, blank=True)
    completion_criteria = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

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
    goal = models.ForeignKey(
        Goal, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='planner_tasks', help_text='Goal this task contributes to',
    )
    text = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['block', 'order']),
            models.Index(fields=['goal']),
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
    goal = models.ForeignKey(
        Goal, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='habits', help_text='Goal this habit supports',
    )
    name = models.CharField(max_length=255)
    target = models.IntegerField(default=1)
    range_max = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['goal']),
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


class UserProfile(models.Model):
    """
    Extended user profile information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    avatar_url = models.URLField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=200, blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Mood(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('neutral', 'Neutral'),
        ('excited', 'Excited'),
        ('tired', 'Tired'),
        ('grateful', 'Grateful'),
        ('anxious', 'Anxious'),
        ('energetic', 'Energetic'),
    ]

    MOOD_CHOICES_KEYS = [k for k, _ in MOOD_CHOICES]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moods')
    date = models.DateField()
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.mood}"


class Water(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_entries')
    date = models.DateField()
    glasses = models.IntegerField(default=0)
    target = models.IntegerField(default=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.glasses}/{self.target} glasses"


class UserEvent(models.Model):
    """Universal audit trail for important application events.

    Records measurable actions (goal created/completed, task completed,
    habit logged, achievement earned, expense created, etc.) so that
    achievements, daily aggregates and analytics can be derived from a
    single chronological source of truth.
    """

    EVENT_TYPES = [
        ('goal_created', 'Goal Created'),
        ('goal_updated', 'Goal Updated'),
        ('goal_completed', 'Goal Completed'),
        ('goal_deleted', 'Goal Deleted'),
        ('planner_task_created', 'Planner Task Created'),
        ('planner_task_completed', 'Planner Task Completed'),
        ('planner_task_deleted', 'Planner Task Deleted'),
        ('habit_created', 'Habit Created'),
        ('habit_log', 'Habit Log'),
        ('achievement_earned', 'Achievement Earned'),
        ('expense_created', 'Expense Created'),
        ('expense_updated', 'Expense Updated'),
        ('expense_deleted', 'Expense Deleted'),
        ('journal_updated', 'Journal Updated'),
        ('mood_logged', 'Mood Logged'),
        ('water_logged', 'Water Logged'),
        ('budget_created', 'Budget Created'),
        ('budget_exceeded', 'Budget Exceeded'),
    ]

    EVENT_TYPE_KEYS = [k for k, _ in EVENT_TYPES]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    subject_type = models.CharField(max_length=100, blank=True, help_text='Model name of the related object, e.g. "Goal"')
    subject_id = models.CharField(max_length=100, blank=True, help_text='String id of the related object')
    occurred_at = models.DateTimeField(default=timezone.now, help_text='When the event actually happened')
    payload = models.JSONField(default=dict, blank=True, help_text='Optional structured extra data')

    class Meta:
        ordering = ['-occurred_at']
        indexes = [
            models.Index(fields=['user', 'event_type']),
            models.Index(fields=['user', 'occurred_at']),
            models.Index(fields=['user', 'subject_type', 'subject_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.event_type} - {self.occurred_at.isoformat()}"


class DailyActivityAggregate(models.Model):
    """Central representation of a user's day.

    Aggregates presence/counts from every tracker domain for a single
    ``(user, date)`` pair. Heavy per-domain detail is intentionally NOT
    stored here; this model answers "what happened on this day?" while
    the individual models remain the source of truth for detail.

    The aggregate is recomputed by the analytics service when domains
    change, so it is a derived cache rather than canonical data.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_activity')
    date = models.DateField()

    # Habits
    habits_completed = models.IntegerField(default=0)
    habits_total = models.IntegerField(default=0)

    # Goals
    goals_completed = models.IntegerField(default=0)
    goals_created = models.IntegerField(default=0)

    # Planner
    planner_tasks_completed = models.IntegerField(default=0)
    planner_tasks_created = models.IntegerField(default=0)

    # Journal
    has_journal = models.BooleanField(default=False)

    # Mood
    mood = models.CharField(max_length=20, blank=True, default='')

    # Water
    water_glasses = models.IntegerField(default=0)
    water_target = models.IntegerField(default=0)

    # Expenses
    expense_count = models.IntegerField(default=0)
    expense_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Points / score
    points = models.IntegerField(default=0)

    # Achievements
    achievements_earned = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class Budget(models.Model):
    """Category/month budget for expense intelligence (P2-07).

    A budget defines the planned spending cap for a single category
    within a single calendar month. The finance service compares actual
    expenses against this cap to surface alerts and analytics.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=100)
    year = models.IntegerField()
    month = models.IntegerField()  # 1-12
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-month', 'category']
        unique_together = ['user', 'category', 'year', 'month']
        indexes = [
            models.Index(fields=['user', 'year', 'month']),
        ]

    def __str__(self):
        return f"{self.category} - {self.year}/{self.month:02d} - ${self.amount}"

    @property
    def period(self):
        return f"{self.year}-{self.month:02d}"

