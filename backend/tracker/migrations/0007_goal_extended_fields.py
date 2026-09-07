from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0006_goal'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='completed_tasks',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='goal',
            name='target',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='goal',
            name='completion_criteria',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='due_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='frequency',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='goal',
            name='priority',
            field=models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium', max_length=10),
        ),
        migrations.AddField(
            model_name='goal',
            name='reminders',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='goal',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
