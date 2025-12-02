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
