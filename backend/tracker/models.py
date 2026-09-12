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

    RECURRENCE_NONE = 'none'
    RECURRENCE_DAILY = 'daily'
    RECURRENCE_WEEKLY = 'weekly'
    RECURRENCE_MONTHLY = 'monthly'

    RECURRENCE_CHOICES = [
        (RECURRENCE_NONE, 'None'),
        (RECURRENCE_DAILY, 'Daily'),
        (RECURRENCE_WEEKLY, 'Weekly'),
        (RECURRENCE_MONTHLY, 'Monthly'),
    ]

    RECURRENCE_KEYS = [k for k, _ in RECURRENCE_CHOICES]

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
    recurrence = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default=RECURRENCE_NONE)
    reminders = models.JSONField(default=list, blank=True)
    completion_criteria = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'category']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'recurrence']),
        ]

    def __str__(self):
        return f"{self.category} - {self.text[:30]}"


class GoalMilestone(models.Model):
    """Break large goals into milestones (P3-06)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='milestones')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['goal', 'order']),
        ]

    def __str__(self):
        return f"{self.goal.text[:20]} - {self.title}"


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
    RECURRENCE_NONE = 'none'
    RECURRENCE_DAILY = 'daily'
    RECURRENCE_WEEKLY = 'weekly'

    RECURRENCE_CHOICES = [
        (RECURRENCE_NONE, 'None'),
        (RECURRENCE_DAILY, 'Daily'),
        (RECURRENCE_WEEKLY, 'Weekly'),
    ]

    RECURRENCE_KEYS = [k for k, _ in RECURRENCE_CHOICES]

    id = models.CharField(max_length=100, primary_key=True)
    block = models.ForeignKey(PlannerBlock, on_delete=models.CASCADE, related_name='tasks')
    goal = models.ForeignKey(
        Goal, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='planner_tasks', help_text='Goal this task contributes to',
    )
    text = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=Goal.PRIORITY_LEVELS, default='medium')
    recurrence = models.CharField(max_length=20, choices=RECURRENCE_CHOICES, default=RECURRENCE_NONE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['block', 'order']),
            models.Index(fields=['goal']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"{self.text[:30]} - {'✓' if self.completed else '○'}"


class PlannerTemplate(models.Model):
    """Reusable planning structure (P3-11)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planner_templates')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, help_text='Snapshot of blocks/tasks/links')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return self.name


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
    SCHEDULE_DAILY = 'daily'
    SCHEDULE_WEEKLY = 'weekly'
    SCHEDULE_CUSTOM = 'custom'

    SCHEDULE_CHOICES = [
        (SCHEDULE_DAILY, 'Daily'),
        (SCHEDULE_WEEKLY, 'Weekly'),
        (SCHEDULE_CUSTOM, 'Custom'),
    ]

    SCHEDULE_KEYS = [k for k, _ in SCHEDULE_CHOICES]

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    goal = models.ForeignKey(
        Goal, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='habits', help_text='Goal this habit supports',
    )
    name = models.CharField(max_length=255)
    target = models.IntegerField(default=1)
    range_max = models.IntegerField(default=10)
    schedule = models.CharField(max_length=20, choices=SCHEDULE_CHOICES, default=SCHEDULE_DAILY)
    schedule_days = models.JSONField(default=list, blank=True, help_text='Weekdays (0=Mon..6=Sun) for weekly/custom schedules')
    reminders = models.JSONField(default=list, blank=True, help_text='Optional reminder config list')
    grace_period = models.IntegerField(default=0, help_text='Missed-day grace before streak breaks')
    streak = models.IntegerField(default=0, help_text='Current consecutive-day streak')
    completed_dates = models.JSONField(default=list, blank=True, help_text='ISO dates the habit was completed')
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


class Income(models.Model):
    """Income record for tracking money sources (P4-05)."""

    SOURCE_TYPES = [
        ('salary', 'Salary'),
        ('freelance', 'Freelance'),
        ('investment', 'Investment'),
        ('gift', 'Gift'),
        ('refund', 'Refund'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incomes')
    date = models.DateField()
    source = models.CharField(max_length=20, choices=SOURCE_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['user', 'source']),
        ]

    def __str__(self):
        return f"{self.get_source_display()} - ${self.amount} - {self.date}"


class Account(models.Model):
    """Account/Wallet model for tracking money sources (P4-06)."""

    ACCOUNT_TYPES = [
        ('checking', 'Checking'),
        ('savings', 'Savings'),
        ('credit', 'Credit Card'),
        ('cash', 'Cash'),
        ('investment', 'Investment'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_account_type_display()}) - ${self.balance}"


class RecurringExpense(models.Model):
    """Recurring expense template for automatic creation (P4-04)."""

    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recurring_expenses')
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    day_of_month = models.IntegerField(null=True, blank=True, help_text='Day of month for monthly frequency (1-31)')
    day_of_week = models.IntegerField(null=True, blank=True, help_text='Day of week for weekly frequency (0=Mon..6=Sun)')
    next_occurrence = models.DateField(help_text='Next date this recurring expense should be created')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['next_occurrence']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['next_occurrence']),
        ]

    def __str__(self):
        return f"{self.item} - {self.get_frequency_display()} - ${self.price}"

    @property
    def total(self):
        return self.quantity * self.price


class RecurringIncome(models.Model):
    """Recurring income template for automatic creation."""

    FREQUENCY_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    SOURCE_TYPES = [
        ('salary', 'Salary'),
        ('freelance', 'Freelance'),
        ('investment', 'Investment'),
        ('gift', 'Gift'),
        ('refund', 'Refund'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recurring_incomes')
    name = models.CharField(max_length=255)
    source = models.CharField(max_length=20, choices=SOURCE_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    day_of_month = models.IntegerField(null=True, blank=True, help_text='Day of month for monthly frequency (1-31)')
    next_occurrence = models.DateField(help_text='Next date this recurring income should be created')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['next_occurrence']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['next_occurrence']),
        ]

    def __str__(self):
        return f"{self.name} - {self.get_frequency_display()} - ${self.amount}"


class BudgetAlert(models.Model):
    """Budget threshold alerts (P4-03)."""

    ALERT_TYPES = [
        ('threshold', 'Threshold Reached'),
        ('exceeded', 'Budget Exceeded'),
        ('projected', 'Projected to Exceed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budget_alerts')
    budget = models.ForeignKey('Budget', on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    threshold_percent = models.IntegerField(default=80, help_text='Alert when spending reaches this percentage of budget')
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    triggered_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-triggered_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['budget', 'alert_type']),
        ]

    def __str__(self):
        return f"{self.budget.category} - {self.get_alert_type_display()} ({self.threshold_percent}%)"


class Transfer(models.Model):
    """Money transfer between accounts (P4-07)."""

    TRANSFER_TYPES = [
        ('internal', 'Internal Transfer'),
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transfers')
    from_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transfers_from')
    to_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transfers_to')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transfer_type = models.CharField(max_length=20, choices=TRANSFER_TYPES, default='internal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
            models.Index(fields=['from_account']),
            models.Index(fields=['to_account']),
        ]

    def __str__(self):
        from_name = self.from_account.name if self.from_account else 'External'
        to_name = self.to_account.name if self.to_account else 'External'
        return f"{from_name} → {to_name} - ${self.amount}"


class Subscription(models.Model):
    """Subscription tracking for recurring services (P4-09)."""

    BILLING_CYCLES = [
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('paused', 'Paused'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES)
    next_billing_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['next_billing_date']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['next_billing_date']),
        ]

    def __str__(self):
        return f"{self.name} - ${self.amount}/{self.get_billing_cycle_display()}"


class Notification(models.Model):
    """In-app notification for user (P6-01)."""

    TYPE_CHOICES = [
        ('goal_deadline', 'Goal Deadline'),
        ('habit_reminder', 'Habit Reminder'),
        ('budget_alert', 'Budget Alert'),
        ('streak_alert', 'Streak Alert'),
        ('achievement_earned', 'Achievement Earned'),
        ('weekly_summary', 'Weekly Summary'),
        ('monthly_summary', 'Monthly Summary'),
        ('recurring_transaction', 'Recurring Transaction'),
        ('system', 'System'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True, help_text='Extra context data')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'type']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.title[:50]}"


class NotificationPreference(models.Model):
    """User notification preferences (P6-02, P6-15)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')

    # Type-specific toggles
    goal_deadline_enabled = models.BooleanField(default=True)
    habit_reminder_enabled = models.BooleanField(default=True)
    budget_alert_enabled = models.BooleanField(default=True)
    streak_alert_enabled = models.BooleanField(default=True)
    achievement_enabled = models.BooleanField(default=True)
    weekly_summary_enabled = models.BooleanField(default=True)
    monthly_summary_enabled = models.BooleanField(default=True)
    recurring_transaction_enabled = models.BooleanField(default=True)
    system_enabled = models.BooleanField(default=True)

    # Delivery channels
    in_app_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=False)

    # Quiet hours (P6-15)
    quiet_hours_start = models.TimeField(null=True, blank=True, help_text='Start of quiet hours (24h format)')
    quiet_hours_end = models.TimeField(null=True, blank=True, help_text='End of quiet hours (24h format)')
    timezone = models.CharField(max_length=50, default='UTC')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Notification preferences'

    def __str__(self):
        return f"{self.user.username}'s notification preferences"

    def is_type_enabled(self, notification_type):
        """Check if a specific notification type is enabled."""
        field_map = {
            'goal_deadline': 'goal_deadline_enabled',
            'habit_reminder': 'habit_reminder_enabled',
            'budget_alert': 'budget_alert_enabled',
            'streak_alert': 'streak_alert_enabled',
            'achievement_earned': 'achievement_enabled',
            'weekly_summary': 'weekly_summary_enabled',
            'monthly_summary': 'monthly_summary_enabled',
            'recurring_transaction': 'recurring_transaction_enabled',
            'system': 'system_enabled',
        }
        field = field_map.get(notification_type)
        return getattr(self, field, True) if field else True

    def is_in_quiet_hours(self, check_time=None):
        """Check if current time is within quiet hours."""
        from django.utils import timezone
        if not self.quiet_hours_start or not self.quiet_hours_end:
            return False
        if check_time is None:
            check_time = timezone.now().time()
        if self.quiet_hours_start <= self.quiet_hours_end:
            return self.quiet_hours_start <= check_time <= self.quiet_hours_end
        # Crosses midnight
        return check_time >= self.quiet_hours_start or check_time <= self.quiet_hours_end


class ScheduledJob(models.Model):
    """Background job for recurring operations (P6-04, P6-12)."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    JOB_TYPES = [
        ('goal_deadline_check', 'Goal Deadline Check'),
        ('habit_reminder', 'Habit Reminder'),
        ('budget_alert_check', 'Budget Alert Check'),
        ('streak_alert_check', 'Streak Alert Check'),
        ('weekly_summary', 'Weekly Summary'),
        ('monthly_summary', 'Monthly Summary'),
        ('recurring_expense_process', 'Recurring Expense Process'),
        ('recurring_income_process', 'Recurring Income Process'),
        ('subscription_billing', 'Subscription Billing'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_jobs', null=True, blank=True)
    job_type = models.CharField(max_length=50, choices=JOB_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_at = models.DateTimeField()
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True, help_text='Job-specific data')
    result = models.JSONField(default=dict, blank=True, help_text='Job result data')
    error_message = models.TextField(blank=True, default='')
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['scheduled_at']
        indexes = [
            models.Index(fields=['status', 'scheduled_at']),
            models.Index(fields=['job_type', 'status']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"{self.job_type} - {self.status} - {self.scheduled_at}"

    def can_retry(self):
        return self.retry_count < self.max_retries and self.status == 'failed'

    def schedule_retry(self, delay_minutes=5):
        from django.utils import timezone
        from datetime import timedelta
        self.retry_count += 1
        self.next_retry_at = timezone.now() + timedelta(minutes=delay_minutes)
        self.status = 'pending'
        self.error_message = ''
        self.save(update_fields=['retry_count', 'next_retry_at', 'status', 'error_message', 'updated_at'])


class NotificationDeduplication(models.Model):
    """Track recently sent notifications to avoid spam (P6-14)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_dedupes')
    notification_type = models.CharField(max_length=30)
    dedupe_key = models.CharField(max_length=255, help_text='Unique key for deduplication (e.g., goal_id, habit_id)')
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'notification_type', 'dedupe_key']
        indexes = [
            models.Index(fields=['user', 'notification_type']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.notification_type} - {self.dedupe_key}"

