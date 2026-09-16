from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journal_entries")
    date = models.DateField()
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ["user", "date"]

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class QuoteSource(models.Model):
    """
    Represents a source of quotes (Movie, Web Series, Book)
    """

    SOURCE_TYPES = [
        ("Movie", "Movie"),
        ("Web Series", "Web Series"),
        ("Book", "Book"),
    ]

    SOURCE_TYPES_KEYS = [k for k, _ in SOURCE_TYPES]

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quote_sources")
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    cover_image = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "title"]),
            models.Index(fields=["user", "type"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.type})"


class Quote(models.Model):
    """
    Individual quote belonging to a QuoteSource
    """

    id = models.CharField(max_length=100, primary_key=True)
    source = models.ForeignKey(QuoteSource, on_delete=models.CASCADE, related_name="quotes")
    text = models.TextField()
    author = models.CharField(max_length=255)
    image = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["source", "author"]),
        ]

    def __str__(self):
        return f"{self.text[:50]}... - {self.author}"


class QuoteTag(models.Model):
    """
    Tags for quotes (many-to-many relationship)
    """

    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name="tags")
    tag = models.CharField(max_length=50)

    class Meta:
        unique_together = ["quote", "tag"]
        indexes = [
            models.Index(fields=["tag"]),
        ]

    def __str__(self):
        return self.tag


class Achievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="achievements")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    image = models.URLField(max_length=500, blank=True, null=True)
    trigger_rule = models.JSONField(
        default=dict,
        blank=True,
        help_text='Optional rule describing what measurable event triggers this achievement, e.g. {"event_type": "planner_task_completed", "count": 7}',  # noqa: E501
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.title} - {self.date}"


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    date = models.DateField()
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["user", "category"]),
        ]

    def __str__(self):
        return f"{self.item} - {self.category} - ${self.price}"

    @property
    def total(self):
        """Calculate total cost (quantity * price)"""
        return self.quantity * self.price


class Goal(models.Model):
    GOAL_CATEGORIES = [
        ("daily", "Daily"),
        ("monthly", "Monthly"),
        ("future", "Future"),
    ]

    GOAL_STATUS = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("blocked", "Blocked"),
        ("trashed", "Trashed"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    GOAL_CATEGORIES_KEYS = [k for k, _ in GOAL_CATEGORIES]
    GOAL_STATUS_KEYS = [k for k, _ in GOAL_STATUS]
    PRIORITY_LEVELS_KEYS = [k for k, _ in PRIORITY_LEVELS]

    RECURRENCE_NONE = "none"
    RECURRENCE_DAILY = "daily"
    RECURRENCE_WEEKLY = "weekly"
    RECURRENCE_MONTHLY = "monthly"

    RECURRENCE_CHOICES = [
        (RECURRENCE_NONE, "None"),
        (RECURRENCE_DAILY, "Daily"),
        (RECURRENCE_WEEKLY, "Weekly"),
        (RECURRENCE_MONTHLY, "Monthly"),
    ]

    RECURRENCE_KEYS = [k for k, _ in RECURRENCE_CHOICES]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="goals")
    text = models.CharField(max_length=500)
    category = models.CharField(max_length=20, choices=GOAL_CATEGORIES, default="daily")
    status = models.CharField(max_length=20, choices=GOAL_STATUS, default="active")
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    target = models.IntegerField(default=1)
    completed_tasks = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default="medium")
    frequency = models.CharField(max_length=50, blank=True, null=True)
    recurrence = models.CharField(
        max_length=20, choices=RECURRENCE_CHOICES, default=RECURRENCE_NONE
    )
    reminders = models.JSONField(default=list, blank=True)
    completion_criteria = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "category"]),
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "recurrence"]),
        ]

    def __str__(self):
        return f"{self.category} - {self.text[:30]}"


class GoalMilestone(models.Model):
    """Break large goals into milestones (P3-06)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="milestones")
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name="milestones")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["goal", "order"]),
        ]

    def __str__(self):
        return f"{self.goal.text[:20]} - {self.title}"


class PlannerBlock(models.Model):
    """
    Represents a draggable block in the planner canvas
    """

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="planner_blocks")
    title = models.CharField(max_length=255, default="New Block")
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"{self.title} - ({self.x}, {self.y})"


class PlannerTask(models.Model):
    """
    Individual task within a planner block
    """

    RECURRENCE_NONE = "none"
    RECURRENCE_DAILY = "daily"
    RECURRENCE_WEEKLY = "weekly"

    RECURRENCE_CHOICES = [
        (RECURRENCE_NONE, "None"),
        (RECURRENCE_DAILY, "Daily"),
        (RECURRENCE_WEEKLY, "Weekly"),
    ]

    RECURRENCE_KEYS = [k for k, _ in RECURRENCE_CHOICES]

    id = models.CharField(max_length=100, primary_key=True)
    block = models.ForeignKey(PlannerBlock, on_delete=models.CASCADE, related_name="tasks")
    goal = models.ForeignKey(
        Goal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="planner_tasks",
        help_text="Goal this task contributes to",
    )
    text = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(max_length=10, choices=Goal.PRIORITY_LEVELS, default="medium")
    recurrence = models.CharField(
        max_length=20, choices=RECURRENCE_CHOICES, default=RECURRENCE_NONE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["block", "order"]),
            models.Index(fields=["goal"]),
            models.Index(fields=["due_date"]),
        ]

    def __str__(self):
        return f"{self.text[:30]} - {'✓' if self.completed else '○'}"


class PlannerTemplate(models.Model):
    """Reusable planning structure (P3-11)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="planner_templates")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    data = models.JSONField(default=dict, help_text="Snapshot of blocks/tasks/links")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return self.name


class PlannerLink(models.Model):
    """
    Represents a connection between two planner blocks
    """

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="planner_links")
    from_block = models.ForeignKey(
        PlannerBlock, on_delete=models.CASCADE, related_name="outgoing_links"
    )
    to_block = models.ForeignKey(
        PlannerBlock, on_delete=models.CASCADE, related_name="incoming_links"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"{self.from_block.title} → {self.to_block.title}"


class PlannerSettings(models.Model):
    """
    Stores user-specific planner settings like canvas transform
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="planner_settings")
    transform = models.JSONField(default=dict)  # {scale, panX, panY}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Planner settings"

    def __str__(self):
        return f"{self.user.username}'s planner settings"


class Habit(models.Model):
    """
    Represents a habit to be tracked
    """

    SCHEDULE_DAILY = "daily"
    SCHEDULE_WEEKLY = "weekly"
    SCHEDULE_CUSTOM = "custom"

    SCHEDULE_CHOICES = [
        (SCHEDULE_DAILY, "Daily"),
        (SCHEDULE_WEEKLY, "Weekly"),
        (SCHEDULE_CUSTOM, "Custom"),
    ]

    SCHEDULE_KEYS = [k for k, _ in SCHEDULE_CHOICES]

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="habits")
    goal = models.ForeignKey(
        Goal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="habits",
        help_text="Goal this habit supports",
    )
    name = models.CharField(max_length=255)
    target = models.IntegerField(default=1)
    range_max = models.IntegerField(default=10)
    schedule = models.CharField(max_length=20, choices=SCHEDULE_CHOICES, default=SCHEDULE_DAILY)
    schedule_days = models.JSONField(
        default=list, blank=True, help_text="Weekdays (0=Mon..6=Sun) for weekly/custom schedules"
    )
    reminders = models.JSONField(
        default=list, blank=True, help_text="Optional reminder config list"
    )
    grace_period = models.IntegerField(default=0, help_text="Missed-day grace before streak breaks")
    streak = models.IntegerField(default=0, help_text="Current consecutive-day streak")
    completed_dates = models.JSONField(
        default=list, blank=True, help_text="ISO dates the habit was completed"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["goal"]),
        ]

    def __str__(self):
        return self.name


class ScoringRule(models.Model):
    """
    Represents a rule for scoring points
    """

    id = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scoring_rules")
    activity = models.CharField(max_length=255)
    max_points = models.IntegerField(default=10)
    penalty_rule = models.CharField(max_length=255, blank=True)
    zero_points_condition = models.CharField(max_length=255, blank=True)
    scoring_logic = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return self.activity


class DailyHabitScore(models.Model):
    """
    Stores the score for a specific habit on a specific date
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="habit_scores")
    date = models.DateField()
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="scores")
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ["user", "date", "habit"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.habit.name} - {self.date}: {self.score}"


class UserProfile(models.Model):
    """
    Extended user profile information
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, max_length=500)
    avatar_url = models.URLField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=200, blank=True)
    timezone = models.CharField(max_length=50, default="UTC")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Mood(models.Model):
    MOOD_CHOICES = [
        ("happy", "Happy"),
        ("sad", "Sad"),
        ("neutral", "Neutral"),
        ("excited", "Excited"),
        ("tired", "Tired"),
        ("grateful", "Grateful"),
        ("anxious", "Anxious"),
        ("energetic", "Energetic"),
    ]

    MOOD_CHOICES_KEYS = [k for k, _ in MOOD_CHOICES]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="moods")
    date = models.DateField()
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ["user", "date"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.mood}"


class Water(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_entries")
    date = models.DateField()
    glasses = models.IntegerField(default=0)
    target = models.IntegerField(default=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ["user", "date"]
        indexes = [
            models.Index(fields=["user", "date"]),
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
        ("goal_created", "Goal Created"),
        ("goal_updated", "Goal Updated"),
        ("goal_completed", "Goal Completed"),
        ("goal_deleted", "Goal Deleted"),
        ("planner_task_created", "Planner Task Created"),
        ("planner_task_completed", "Planner Task Completed"),
        ("planner_task_deleted", "Planner Task Deleted"),
        ("habit_created", "Habit Created"),
        ("habit_log", "Habit Log"),
        ("achievement_earned", "Achievement Earned"),
        ("expense_created", "Expense Created"),
        ("expense_updated", "Expense Updated"),
        ("expense_deleted", "Expense Deleted"),
        ("journal_updated", "Journal Updated"),
        ("mood_logged", "Mood Logged"),
        ("water_logged", "Water Logged"),
        ("budget_created", "Budget Created"),
        ("budget_exceeded", "Budget Exceeded"),
    ]

    EVENT_TYPE_KEYS = [k for k, _ in EVENT_TYPES]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    subject_type = models.CharField(
        max_length=100, blank=True, help_text='Model name of the related object, e.g. "Goal"'
    )
    subject_id = models.CharField(
        max_length=100, blank=True, help_text="String id of the related object"
    )
    occurred_at = models.DateTimeField(
        default=timezone.now, help_text="When the event actually happened"
    )
    payload = models.JSONField(default=dict, blank=True, help_text="Optional structured extra data")

    class Meta:
        ordering = ["-occurred_at"]
        indexes = [
            models.Index(fields=["user", "event_type"]),
            models.Index(fields=["user", "occurred_at"]),
            models.Index(fields=["user", "subject_type", "subject_id"]),
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

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_activity")
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
    mood = models.CharField(max_length=20, blank=True, default="")

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
        ordering = ["-date"]
        unique_together = ["user", "date"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class Budget(models.Model):
    """Category/month budget for expense intelligence (P2-07).

    A budget defines the planned spending cap for a single category
    within a single calendar month. The finance service compares actual
    expenses against this cap to surface alerts and analytics.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budgets")
    category = models.CharField(max_length=100)
    year = models.IntegerField()
    month = models.IntegerField()  # 1-12
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-month", "category"]
        unique_together = ["user", "category", "year", "month"]
        indexes = [
            models.Index(fields=["user", "year", "month"]),
        ]

    def __str__(self):
        return f"{self.category} - {self.year}/{self.month:02d} - ${self.amount}"

    @property
    def period(self):
        return f"{self.year}-{self.month:02d}"


class Income(models.Model):
    """Income record for tracking money sources (P4-05)."""

    SOURCE_TYPES = [
        ("salary", "Salary"),
        ("freelance", "Freelance"),
        ("investment", "Investment"),
        ("gift", "Gift"),
        ("refund", "Refund"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="incomes")
    date = models.DateField()
    source = models.CharField(max_length=20, choices=SOURCE_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["user", "source"]),
        ]

    def __str__(self):
        return f"{self.get_source_display()} - ${self.amount} - {self.date}"


class Account(models.Model):
    """Account/Wallet model for tracking money sources (P4-06)."""

    ACCOUNT_TYPES = [
        ("checking", "Checking"),
        ("savings", "Savings"),
        ("credit", "Credit Card"),
        ("cash", "Cash"),
        ("investment", "Investment"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="USD")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["user", "is_active"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_account_type_display()}) - ${self.balance}"


class RecurringExpense(models.Model):
    """Recurring expense template for automatic creation (P4-04)."""

    FREQUENCY_CHOICES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recurring_expenses")
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    day_of_month = models.IntegerField(
        null=True, blank=True, help_text="Day of month for monthly frequency (1-31)"
    )
    day_of_week = models.IntegerField(
        null=True, blank=True, help_text="Day of week for weekly frequency (0=Mon..6=Sun)"
    )
    next_occurrence = models.DateField(
        help_text="Next date this recurring expense should be created"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["next_occurrence"]
        indexes = [
            models.Index(fields=["user", "is_active"]),
            models.Index(fields=["next_occurrence"]),
        ]

    def __str__(self):
        return f"{self.item} - {self.get_frequency_display()} - ${self.price}"

    @property
    def total(self):
        return self.quantity * self.price


class RecurringIncome(models.Model):
    """Recurring income template for automatic creation."""

    FREQUENCY_CHOICES = [
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
    ]

    SOURCE_TYPES = [
        ("salary", "Salary"),
        ("freelance", "Freelance"),
        ("investment", "Investment"),
        ("gift", "Gift"),
        ("refund", "Refund"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recurring_incomes")
    name = models.CharField(max_length=255)
    source = models.CharField(max_length=20, choices=SOURCE_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    day_of_month = models.IntegerField(
        null=True, blank=True, help_text="Day of month for monthly frequency (1-31)"
    )
    next_occurrence = models.DateField(
        help_text="Next date this recurring income should be created"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["next_occurrence"]
        indexes = [
            models.Index(fields=["user", "is_active"]),
            models.Index(fields=["next_occurrence"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.get_frequency_display()} - ${self.amount}"


class BudgetAlert(models.Model):
    """Budget threshold alerts (P4-03)."""

    ALERT_TYPES = [
        ("threshold", "Threshold Reached"),
        ("exceeded", "Budget Exceeded"),
        ("projected", "Projected to Exceed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budget_alerts")
    budget = models.ForeignKey("Budget", on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    threshold_percent = models.IntegerField(
        default=80, help_text="Alert when spending reaches this percentage of budget"
    )
    message = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    triggered_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-triggered_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["budget", "alert_type"]),
        ]

    def __str__(self):
        return (
            f"{self.budget.category} - {self.get_alert_type_display()} ({self.threshold_percent}%)"
        )


class Transfer(models.Model):
    """Money transfer between accounts (P4-07)."""

    TRANSFER_TYPES = [
        ("internal", "Internal Transfer"),
        ("deposit", "Deposit"),
        ("withdrawal", "Withdrawal"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transfers")
    from_account = models.ForeignKey(
        Account, on_delete=models.SET_NULL, null=True, blank=True, related_name="transfers_from"
    )
    to_account = models.ForeignKey(
        Account, on_delete=models.SET_NULL, null=True, blank=True, related_name="transfers_to"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transfer_type = models.CharField(max_length=20, choices=TRANSFER_TYPES, default="internal")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="completed")
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["from_account"]),
            models.Index(fields=["to_account"]),
        ]

    def __str__(self):
        from_name = self.from_account.name if self.from_account else "External"
        to_name = self.to_account.name if self.to_account else "External"
        return f"{from_name} → {to_name} - ${self.amount}"


class Subscription(models.Model):
    """Subscription tracking for recurring services (P4-09)."""

    BILLING_CYCLES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("paused", "Paused"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subscriptions")
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES)
    next_billing_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["next_billing_date"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["next_billing_date"]),
        ]

    def __str__(self):
        return f"{self.name} - ${self.amount}/{self.get_billing_cycle_display()}"


class Notification(models.Model):
    """In-app notification for user (P6-01)."""

    TYPE_CHOICES = [
        ("goal_deadline", "Goal Deadline"),
        ("habit_reminder", "Habit Reminder"),
        ("budget_alert", "Budget Alert"),
        ("streak_alert", "Streak Alert"),
        ("achievement_earned", "Achievement Earned"),
        ("weekly_summary", "Weekly Summary"),
        ("monthly_summary", "Monthly Summary"),
        ("recurring_transaction", "Recurring Transaction"),
        ("system", "System"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("normal", "Normal"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="normal")
    title = models.CharField(max_length=255)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True, help_text="Extra context data")
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["user", "type"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.title[:50]}"


class NotificationPreference(models.Model):
    """User notification preferences (P6-02, P6-15)."""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="notification_preferences"
    )

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
    quiet_hours_start = models.TimeField(
        null=True, blank=True, help_text="Start of quiet hours (24h format)"
    )
    quiet_hours_end = models.TimeField(
        null=True, blank=True, help_text="End of quiet hours (24h format)"
    )
    timezone = models.CharField(max_length=50, default="UTC")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Notification preferences"

    def __str__(self):
        return f"{self.user.username}'s notification preferences"

    def is_type_enabled(self, notification_type):
        """Check if a specific notification type is enabled."""
        field_map = {
            "goal_deadline": "goal_deadline_enabled",
            "habit_reminder": "habit_reminder_enabled",
            "budget_alert": "budget_alert_enabled",
            "streak_alert": "streak_alert_enabled",
            "achievement_earned": "achievement_enabled",
            "weekly_summary": "weekly_summary_enabled",
            "monthly_summary": "monthly_summary_enabled",
            "recurring_transaction": "recurring_transaction_enabled",
            "system": "system_enabled",
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
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    ]

    JOB_TYPES = [
        ("goal_deadline_check", "Goal Deadline Check"),
        ("habit_reminder", "Habit Reminder"),
        ("budget_alert_check", "Budget Alert Check"),
        ("streak_alert_check", "Streak Alert Check"),
        ("weekly_summary", "Weekly Summary"),
        ("monthly_summary", "Monthly Summary"),
        ("recurring_expense_process", "Recurring Expense Process"),
        ("recurring_income_process", "Recurring Income Process"),
        ("subscription_billing", "Subscription Billing"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="scheduled_jobs", null=True, blank=True
    )
    job_type = models.CharField(max_length=50, choices=JOB_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    scheduled_at = models.DateTimeField()
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True, help_text="Job-specific data")
    result = models.JSONField(default=dict, blank=True, help_text="Job result data")
    error_message = models.TextField(blank=True, default="")
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["scheduled_at"]
        indexes = [
            models.Index(fields=["status", "scheduled_at"]),
            models.Index(fields=["job_type", "status"]),
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"{self.job_type} - {self.status} - {self.scheduled_at}"

    def can_retry(self):
        return self.retry_count < self.max_retries and self.status == "failed"

    def schedule_retry(self, delay_minutes=5):
        from django.utils import timezone
        from datetime import timedelta

        self.retry_count += 1
        self.next_retry_at = timezone.now() + timedelta(minutes=delay_minutes)
        self.status = "pending"
        self.error_message = ""
        self.save(
            update_fields=["retry_count", "next_retry_at", "status", "error_message", "updated_at"]
        )


class NotificationDeduplication(models.Model):
    """Track recently sent notifications to avoid spam (P6-14)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notification_dedupes")
    notification_type = models.CharField(max_length=30)
    dedupe_key = models.CharField(
        max_length=255, help_text="Unique key for deduplication (e.g., goal_id, habit_id)"
    )
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "notification_type", "dedupe_key"]
        indexes = [
            models.Index(fields=["user", "notification_type"]),
            models.Index(fields=["sent_at"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.notification_type} - {self.dedupe_key}"


class AIConversation(models.Model):
    """AI conversation/chat session (P7-03)."""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("archived", "Archived"),
        ("deleted", "Deleted"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_conversations")
    title = models.CharField(max_length=255, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    model = models.CharField(max_length=100, default="gemini-2.5-flash")
    system_prompt = models.TextField(blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-last_message_at", "-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "last_message_at"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title or 'Untitled'} ({self.status})"


class AIMessage(models.Model):
    """Individual message in an AI conversation (P7-04)."""

    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
        ("system", "System"),
        ("tool", "Tool"),
    ]

    conversation = models.ForeignKey(
        AIConversation, on_delete=models.CASCADE, related_name="messages"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    tool_calls = models.JSONField(
        default=list, blank=True, help_text="Structured tool calls made by assistant"
    )
    tool_call_id = models.CharField(
        max_length=100, blank=True, default="", help_text="ID of tool call this message responds to"
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["conversation", "created_at"]),
        ]

    def __str__(self):
        return f"{self.conversation_id} - {self.role} - {self.content[:50]}"


class AITool(models.Model):
    """Registered AI tool/function (P7-05)."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    parameters_schema = models.JSONField(help_text="JSON Schema for tool parameters")
    required_permissions = models.JSONField(
        default=list, blank=True, help_text="List of required permissions"
    )
    is_destructive = models.BooleanField(default=False, help_text="Whether tool modifies data")
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class AIToolCall(models.Model):
    """Record of an AI tool invocation (P7-09, P7-14)."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("executing", "Executing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    ]

    conversation = models.ForeignKey(
        AIConversation, on_delete=models.CASCADE, related_name="tool_calls"
    )
    message = models.ForeignKey(
        AIMessage, on_delete=models.CASCADE, related_name="tool_call_records", null=True, blank=True
    )
    tool = models.ForeignKey(AITool, on_delete=models.PROTECT, related_name="calls")
    arguments = models.JSONField()
    result = models.JSONField(null=True, blank=True)
    error = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    requires_confirmation = models.BooleanField(default=False)
    confirmed_by_user = models.BooleanField(default=False)
    executed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["conversation", "status"]),
            models.Index(fields=["tool", "status"]),
        ]

    def __str__(self):
        return f"{self.tool.name} - {self.status}"


class AIActionConfirmation(models.Model):
    """User confirmation for destructive AI actions (P7-13)."""

    tool_call = models.OneToOneField(
        AIToolCall, on_delete=models.CASCADE, related_name="confirmation"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Confirmation for {
            self.tool_call_id} - {
            'Confirmed' if self.confirmed else 'Pending'}"


class UserPreference(models.Model):
    """User preferences for AI behavior (P8-01)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="ai_preferences")

    # AI behavior settings
    response_length = models.CharField(
        max_length=20,
        choices=[
            ("brief", "Brief"),
            ("normal", "Normal"),
            ("detailed", "Detailed"),
        ],
        default="normal",
    )
    auto_execute_tools = models.BooleanField(
        default=False, help_text="Auto-execute non-destructive tools"
    )
    include_context_summary = models.BooleanField(
        default=True, help_text="Include conversation summary in context"
    )

    # Memory settings
    memory_enabled = models.BooleanField(default=True, help_text="Enable memory system")
    memory_retention_days = models.IntegerField(
        default=90, help_text="Days to retain memory entries"
    )
    max_memory_entries = models.IntegerField(
        default=1000, help_text="Maximum memory entries per user"
    )

    # Notification settings for AI
    notify_on_tool_execution = models.BooleanField(default=False)
    notify_on_memory_created = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User preferences"

    def __str__(self):
        return f"{self.user.username}'s AI preferences"


class AIMemory(models.Model):
    """Structured memory entries for conversation context (P8-02, P8-03)."""

    MEMORY_TYPES = [
        ("fact", "Fact"),
        ("preference", "Preference"),
        ("goal", "Goal"),
        ("habit", "Habit"),
        ("person", "Person"),
        ("event", "Event"),
        ("note", "Note"),
        ("summary", "Conversation Summary"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("normal", "Normal"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_memories")
    conversation = models.ForeignKey(
        AIConversation, on_delete=models.SET_NULL, null=True, blank=True, related_name="memories"
    )
    memory_type = models.CharField(max_length=20, choices=MEMORY_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="normal")

    # Content
    title = models.CharField(max_length=255)
    content = models.TextField()
    entities = models.JSONField(
        default=dict, blank=True, help_text="Extracted entities (people, dates, amounts, etc.)"
    )

    # Source
    source_message = models.ForeignKey(
        AIMessage, on_delete=models.SET_NULL, null=True, blank=True, related_name="memories_created"
    )
    confidence = models.FloatField(default=1.0, help_text="Confidence score 0-1")

    # Vector embedding for retrieval (P8-06)
    embedding = models.JSONField(
        null=True, blank=True, help_text="Vector embedding for semantic search"
    )
    embedding_model = models.CharField(max_length=100, blank=True, default="")

    # Lifecycle
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Auto-expiry (P8-10)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)
    access_count = models.IntegerField(default=0)

    class Meta:
        ordering = ["-priority", "-created_at"]
        indexes = [
            models.Index(fields=["user", "is_active", "memory_type"]),
            models.Index(fields=["user", "is_active", "priority"]),
            models.Index(fields=["user", "expires_at"]),
            models.Index(fields=["conversation"]),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.memory_type}: {self.title[:50]}"

    def increment_access(self):
        """Track memory access for relevance scoring."""
        from django.utils import timezone

        self.access_count += 1
        self.last_accessed_at = timezone.now()
        self.save(update_fields=["access_count", "last_accessed_at", "updated_at"])


class AIMemorySummarization(models.Model):
    """Track conversation summarization jobs (P8-04)."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    conversation = models.ForeignKey(
        AIConversation, on_delete=models.CASCADE, related_name="summarizations"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    source_message_count = models.IntegerField(default=0)
    summary_text = models.TextField(blank=True, default="")
    summary_memory = models.ForeignKey(
        AIMemory, on_delete=models.SET_NULL, null=True, blank=True, related_name="summarizations"
    )
    error = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Summarization for {self.conversation_id} - {self.status}"


# =============================================================================
# Phase 9 — ML & Prediction Models
# =============================================================================


class MLDataSet(models.Model):
    """Prepared training datasets (P9-01)."""

    DATA_TYPES = [
        ("expenses", "Expenses"),
        ("habits", "Habits"),
        ("goals", "Goals"),
        ("mood", "Mood"),
        ("journal", "Journal"),
        ("water", "Water"),
        ("combined", "Combined"),
    ]

    SPLIT_TYPES = [
        ("train", "Train"),
        ("validation", "Validation"),
        ("test", "Test"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_datasets")
    name = models.CharField(max_length=255)
    data_type = models.CharField(max_length=20, choices=DATA_TYPES)
    split = models.CharField(max_length=20, choices=SPLIT_TYPES, default="train")
    records_count = models.IntegerField(default=0)
    features = models.JSONField(
        default=list, blank=True, help_text="List of feature names included"
    )
    file_path = models.CharField(max_length=500, blank=True, default="")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "data_type"]),
            models.Index(fields=["user", "split"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_data_type_display()} / {self.get_split_display()})"


class MLFeature(models.Model):
    """Behavioral features for ML models (P9-02)."""

    FEATURE_TYPES = [
        ("numerical", "Numerical"),
        ("categorical", "Categorical"),
        ("boolean", "Boolean"),
        ("temporal", "Temporal"),
        ("aggregate", "Aggregate"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_features")
    name = models.CharField(max_length=255)
    feature_type = models.CharField(max_length=20, choices=FEATURE_TYPES)
    description = models.TextField(blank=True)
    source_domains = models.JSONField(
        default=list, blank=True, help_text="Which tracker domains this feature derives from"
    )
    computation_logic = models.TextField(
        blank=True, help_text="Description or code snippet of how feature is computed"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_active"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_feature_type_display()})"


class MLDataQualityCheck(models.Model):
    """Data quality check results (P9-03)."""

    CHECK_TYPES = [
        ("completeness", "Completeness"),
        ("uniqueness", "Uniqueness"),
        ("validity", "Validity"),
        ("consistency", "Consistency"),
        ("freshness", "Freshness"),
        ("outliers", "Outliers"),
    ]

    SEVERITY = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_quality_checks")
    check_type = models.CharField(max_length=20, choices=CHECK_TYPES)
    domain = models.CharField(
        max_length=50, blank=True, help_text="Which domain was checked (expenses, habits, etc.)"
    )
    severity = models.CharField(max_length=10, choices=SEVERITY, default="medium")
    total_records = models.IntegerField(default=0)
    valid_records = models.IntegerField(default=0)
    invalid_records = models.IntegerField(default=0)
    details = models.JSONField(default=dict, blank=True, help_text="Detailed findings")
    message = models.TextField(blank=True)
    passed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "check_type"]),
            models.Index(fields=["user", "domain"]),
        ]

    def __str__(self):
        return f"{self.get_check_type_display()} — {self.domain or 'general'}"


class MLTransactionCategory(models.Model):
    """Transaction categorization prediction (P9-04)."""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ml_transaction_categories"
    )
    transaction_id = models.CharField(max_length=100, blank=True, default="")
    item_name = models.CharField(max_length=255, blank=True, default="")
    predicted_category = models.CharField(max_length=100, blank=True, default="")
    confidence = models.FloatField(default=0.0)
    alternative_categories = models.JSONField(default=list, blank=True)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "predicted_category"]),
        ]

    def __str__(self):
        return f"{self.item_name} → {self.predicted_category} ({self.confidence:.2f})"


class MLSpendingPrediction(models.Model):
    """Spending prediction for future periods (P9-05)."""

    PERIOD_TYPES = [
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_spending_predictions")
    category = models.CharField(max_length=100, blank=True, default="")
    period_type = models.CharField(max_length=20, choices=PERIOD_TYPES, default="monthly")
    period_start = models.DateField()
    period_end = models.DateField()
    predicted_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    lower_bound = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    upper_bound = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    confidence = models.FloatField(default=0.0)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-period_start"]
        indexes = [
            models.Index(fields=["user", "category", "period_start"]),
        ]

    def __str__(self):
        return f"Spending {self.category} — {self.period_start} to {self.period_end}"


class MLHabitConsistency(models.Model):
    """Habit consistency prediction (P9-06)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_habit_consistency")
    habit_id = models.CharField(max_length=100, blank=True, default="")
    habit_name = models.CharField(max_length=255, blank=True, default="")
    prediction_date = models.DateField()
    likelihood_of_miss = models.FloatField(
        default=0.0, help_text="Probability 0-1 that habit will be missed"
    )
    contributing_factors = models.JSONField(default=dict, blank=True)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-prediction_date"]
        indexes = [
            models.Index(fields=["user", "habit_id", "prediction_date"]),
        ]

    def __str__(self):
        return f"{self.habit_name} — miss probability: {self.likelihood_of_miss:.2f}"


class MLGoalCompletion(models.Model):
    """Goal completion probability prediction (P9-07)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_goal_completion")
    goal_id = models.CharField(max_length=100, blank=True, default="")
    goal_text = models.CharField(max_length=500, blank=True, default="")
    predicted_probability = models.FloatField(
        default=0.0, help_text="Probability 0-1 of completion"
    )
    estimated_completion_date = models.DateField(null=True, blank=True)
    remaining_days = models.IntegerField(default=0)
    contributing_factors = models.JSONField(default=dict, blank=True)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-predicted_probability"]
        indexes = [
            models.Index(fields=["user", "goal_id"]),
        ]

    def __str__(self):
        return f"{self.goal_text[:50]} — {self.predicted_probability:.2f}"


class MLAnomaly(models.Model):
    """Anomaly detection results (P9-08)."""

    ANOMALY_TYPES = [
        ("spending", "Spending"),
        ("habit", "Habit"),
        ("goal", "Goal"),
        ("activity", "Activity"),
        ("financial", "Financial"),
    ]

    SEVERITY = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_anomalies")
    anomaly_type = models.CharField(max_length=20, choices=ANOMALY_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY, default="medium")
    domain = models.CharField(max_length=50, blank=True)
    description = models.TextField()
    detected_value = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True, default=None
    )
    expected_range_low = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True, default=None
    )
    expected_range_high = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True, default=None
    )
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "anomaly_type", "is_resolved"]),
        ]

    def __str__(self):
        return f"{self.get_anomaly_type_display()} anomaly — {self.description[:50]}"


class MLRecommendationScore(models.Model):
    """Recommendation ranking scores (P9-09)."""

    RANK_TYPES = [
        ("expense", "Expense"),
        ("habit", "Habit"),
        ("goal", "Goal"),
        ("productivity", "Productivity"),
        ("finance", "Finance"),
        ("general", "General"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ml_recommendation_scores"
    )
    rank_type = models.CharField(max_length=20, choices=RANK_TYPES)
    target_id = models.CharField(max_length=100, blank=True, default="")
    target_type = models.CharField(max_length=50, blank=True, default="")
    score = models.FloatField(default=0.0)
    rank = models.IntegerField(default=0)
    reason = models.TextField(blank=True)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["rank"]
        indexes = [
            models.Index(fields=["user", "rank_type", "rank"]),
        ]

    def __str__(self):
        return f"Rank #{self.rank} — {self.target_type}/{self.target_id} ({self.score:.2f})"


class MLEvaluation(models.Model):
    """Model evaluation metrics (P9-10)."""

    METRIC_TYPES = [
        ("accuracy", "Accuracy"),
        ("precision", "Precision"),
        ("recall", "Recall"),
        ("f1", "F1 Score"),
        ("auc_roc", "AUC-ROC"),
        ("rmse", "RMSE"),
        ("mae", "MAE"),
        ("r2", "R²"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_evaluations")
    model_name = models.CharField(max_length=100)
    model_version = models.CharField(max_length=50, blank=True, default="")
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES)
    value = models.FloatField(default=0.0)
    dataset_name = models.CharField(max_length=255, blank=True, default="")
    evaluation_date = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-evaluation_date"]
        indexes = [
            models.Index(fields=["user", "model_name", "model_version"]),
        ]

    def __str__(self):
        return f"{
            self.model_name} v{
            self.model_version} — {
            self.get_metric_type_display()}: {
                self.value:.4f}"


class MLModelVersion(models.Model):
    """Model version tracking (P9-11)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_model_versions")
    model_name = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    status = models.CharField(
        max_length=20,
        default="active",
        choices=[
            ("draft", "Draft"),
            ("active", "Active"),
            ("archived", "Archived"),
            ("deprecated", "Deprecated"),
        ],
    )
    training_data_set = models.CharField(max_length=255, blank=True, default="")
    features_used = models.JSONField(default=list, blank=True)
    hyperparameters = models.JSONField(default=dict, blank=True)
    performance_metrics = models.JSONField(default=dict, blank=True)
    file_path = models.CharField(max_length=500, blank=True, default="")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "model_name"]),
            models.Index(fields=["user", "model_name", "version"]),
        ]

    def __str__(self):
        return f"{self.model_name} v{self.version} ({self.status})"


class MLModelMonitoring(models.Model):
    """Model drift and degradation monitoring (P9-12)."""

    MONITOR_TYPES = [
        ("data_drift", "Data Drift"),
        ("concept_drift", "Concept Drift"),
        ("performance_degradation", "Performance Degradation"),
        ("feature_importance_shift", "Feature Importance Shift"),
    ]

    ALERT_LEVELS = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ml_monitoring")
    model_name = models.CharField(max_length=100)
    model_version = models.CharField(max_length=50, blank=True, default="")
    monitor_type = models.CharField(max_length=30, choices=MONITOR_TYPES)
    alert_level = models.CharField(max_length=10, choices=ALERT_LEVELS, default="info")
    current_value = models.FloatField(default=0.0)
    baseline_value = models.FloatField(default=0.0)
    threshold = models.FloatField(default=0.1)
    message = models.TextField(blank=True)
    is_acknowledged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "model_name", "monitor_type"]),
            models.Index(fields=["user", "alert_level"]),
        ]

    def __str__(self):
        return f"{
            self.model_name} — {
            self.get_monitor_type_display()}: {
            self.get_alert_level_display()}"


# =============================================================================
# Phase 10 — Personal Intelligence Engine Models
# =============================================================================


class UnifiedPersonalState(models.Model):
    """Current user state snapshot (P10-01)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="personal_state")
    state_data = models.JSONField(
        default=dict, blank=True, help_text="Comprehensive user state including all domains"
    )
    last_updated = models.DateTimeField(auto_now=True)
    productivity_score = models.FloatField(default=0.0)
    financial_health = models.FloatField(default=0.0)
    goal_progress = models.FloatField(default=0.0)
    habit_consistency = models.FloatField(default=0.0)
    mood_trend = models.CharField(max_length=20, blank=True, default="")

    def __str__(self):
        return f"State: {self.user.username}"


class CrossDomainReasoning(models.Model):
    """Cross-domain reasoning results (P10-02)."""

    REASONING_TYPES = [
        ("correlation", "Correlation"),
        ("causal", "Causal"),
        ("pattern", "Pattern"),
        ("trend", "Trend"),
        ("comparison", "Comparison"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cross_domain_reasoning")
    reasoning_type = models.CharField(max_length=20, choices=REASONING_TYPES)
    domains_involved = models.JSONField(
        default=list, blank=True, help_text="List of domains analyzed"
    )
    insight = models.TextField()
    confidence = models.FloatField(default=0.0)
    supporting_evidence = models.JSONField(default=dict, blank=True)
    is_validated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "reasoning_type"]),
        ]

    def __str__(self):
        return f"{self.get_reasoning_type_display()} — {self.domains_involved}"


class RankedRecommendation(models.Model):
    """Ranked recommendations from engine (P10-03)."""

    RECOMMENDATION_TYPES = [
        ("habit", "Habit"),
        ("goal", "Goal"),
        ("expense", "Expense"),
        ("productivity", "Productivity"),
        ("finance", "Finance"),
        ("wellness", "Wellness"),
        ("general", "General"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ranked_recommendations")
    rec_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPES)
    target_id = models.CharField(max_length=100, blank=True, default="")
    target_title = models.CharField(max_length=255, blank=True, default="")
    rank = models.IntegerField(default=0)
    score = models.FloatField(default=0.0)
    explanation = models.TextField(blank=True, help_text="Why this recommendation exists")
    action_suggested = models.TextField(blank=True)
    is_accepted = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["rank"]
        indexes = [
            models.Index(fields=["user", "rec_type", "rank"]),
        ]

    def __str__(self):
        return f"#{self.rank} {self.target_title[:50]}"


class Opportunity(models.Model):
    """Improvement opportunities (P10-04)."""

    OPPORTUNITY_TYPES = [
        ("habit", "Habit"),
        ("goal", "Goal"),
        ("finance", "Finance"),
        ("productivity", "Productivity"),
        ("wellness", "Wellness"),
        ("learning", "Learning"),
    ]

    SEVERITY = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="opportunities")
    opportunity_type = models.CharField(max_length=20, choices=OPPORTUNITY_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY, default="medium")
    potential_impact = models.TextField(blank=True)
    suggested_action = models.TextField(blank=True)
    is_actioned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "opportunity_type", "is_actioned"]),
        ]

    def __str__(self):
        return f"{self.title[:50]}"


class Risk(models.Model):
    """Detected potential negative trends (P10-05)."""

    RISK_TYPES = [
        ("habit_decline", "Habit Decline"),
        ("goal_stall", "Goal Stall"),
        ("overspending", "Overspending"),
        ("productivity_drop", "Productivity Drop"),
        ("health", "Health Risk"),
        ("financial", "Financial Risk"),
    ]

    SEVERITY = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="risks")
    risk_type = models.CharField(max_length=20, choices=RISK_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY, default="medium")
    trend_direction = models.CharField(
        max_length=20,
        choices=[
            ("increasing", "Increasing"),
            ("decreasing", "Decreasing"),
            ("stable", "Stable"),
        ],
        default="increasing",
    )
    estimated_timeframe = models.CharField(
        max_length=100, blank=True, help_text='e.g. "2 weeks", "1 month"'
    )
    is_mitigated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "risk_type", "severity"]),
        ]

    def __str__(self):
        return f"{self.get_risk_type_display()} — {self.title[:50]}"


class Intervention(models.Model):
    """Generic intervention for corrective actions (P10-06/07/08)."""

    INTERVENTION_TYPES = [
        ("goal", "Goal"),
        ("financial", "Financial"),
        ("productivity", "Productivity"),
    ]

    STATUS = [
        ("suggested", "Suggested"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interventions")
    intervention_type = models.CharField(max_length=20, choices=INTERVENTION_TYPES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default="suggested")
    priority = models.CharField(
        max_length=10,
        choices=[
            ("low", "Low"),
            ("medium", "Medium"),
            ("high", "High"),
            ("urgent", "Urgent"),
        ],
        default="medium",
    )
    expected_outcome = models.TextField(blank=True)
    steps = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "intervention_type", "status"]),
        ]

    def __str__(self):
        return f"{self.get_intervention_type_display()}: {self.title[:50]}"


class DailyPlan(models.Model):
    """Personalized adaptive daily plan (P10-09)."""

    PRIORITY = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_plans")
    date = models.DateField()
    plan_data = models.JSONField(
        default=dict, blank=True, help_text="Plan items with tasks, habits, goals"
    )
    overall_priority = models.CharField(max_length=10, choices=PRIORITY, default="medium")
    confidence = models.FloatField(default=0.0)
    generated_by_model = models.CharField(max_length=50, blank=True, default="")
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["user", "date"]),
        ]

    def __str__(self):
        return f"Plan for {self.date} — {self.user.username}"


class WeeklyStrategy(models.Model):
    """Weekly strategy generation (P10-10)."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="weekly_strategies")
    week_start_date = models.DateField()
    priorities = models.JSONField(
        default=list, blank=True, help_text="List of priority items for the week"
    )
    focus_areas = models.JSONField(default=list, blank=True)
    key_goals = models.JSONField(default=list, blank=True)
    risk_mitigations = models.JSONField(default=list, blank=True)
    confidence = models.FloatField(default=0.0)
    generated_by_model = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-week_start_date"]
        indexes = [
            models.Index(fields=["user", "week_start_date"]),
        ]

    def __str__(self):
        return f"Strategy week of {self.week_start_date}"


class Explanation(models.Model):
    """Explainable recommendations (P10-11)."""

    EXPLANATION_TYPES = [
        ("recommendation", "Recommendation"),
        ("prediction", "Prediction"),
        ("insight", "Insight"),
        ("intervention", "Intervention"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="explanations")
    explanation_type = models.CharField(max_length=20, choices=EXPLANATION_TYPES)
    target_id = models.CharField(max_length=100, blank=True, default="")
    title = models.CharField(max_length=255, blank=True, default="")
    explanation_text = models.TextField()
    reasoning_steps = models.JSONField(default=list, blank=True, help_text="Step-by-step reasoning")
    supporting_data = models.JSONField(default=dict, blank=True)
    confidence = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "explanation_type"]),
        ]

    def __str__(self):
        return f"{self.get_explanation_type_display()}: {self.title[:50]}"


class UserFeedback(models.Model):
    """Feedback loop from user acceptance/rejection (P10-12)."""

    FEEDBACK_TYPES = [
        ("recommendation", "Recommendation"),
        ("intervention", "Intervention"),
        ("prediction", "Prediction"),
        ("insight", "Insight"),
    ]

    ACTION_CHOICES = [
        ("accepted", "Accepted"),
        ("dismissed", "Dismissed"),
        ("partially_accepted", "Partially Accepted"),
        ("skipped", "Skipped"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedback")
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    target_id = models.CharField(max_length=100, blank=True, default="")
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    feedback_text = models.TextField(blank=True)
    relevance_score = models.FloatField(default=0.0, help_text="User-rated relevance 0-1")
    model_version = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "feedback_type", "action"]),
        ]

    def __str__(self):
        return f"{self.get_action_display()}: {self.target_id[:50]}"
