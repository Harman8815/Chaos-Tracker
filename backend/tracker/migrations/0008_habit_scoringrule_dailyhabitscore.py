# Generated migration for Points models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tracker', '0007_plannerblock_plannertask_plannerlink_plannersettings'),
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('target', models.IntegerField(default=1)),
                ('range_max', models.IntegerField(default=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='habits', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='ScoringRule',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('activity', models.CharField(max_length=255)),
                ('max_points', models.IntegerField(default=10)),
                ('penalty_rule', models.CharField(blank=True, max_length=255)),
                ('zero_points_condition', models.CharField(blank=True, max_length=255)),
                ('scoring_logic', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scoring_rules', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='DailyHabitScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('score', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('habit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scores', to='tracker.habit')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='habit_scores', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.AddIndex(
            model_name='habit',
            index=models.Index(fields=['user'], name='tracker_hab_user_id_idx'),
        ),
        migrations.AddIndex(
            model_name='scoringrule',
            index=models.Index(fields=['user'], name='tracker_sco_user_id_idx'),
        ),
        migrations.AddIndex(
            model_name='dailyhabitscore',
            index=models.Index(fields=['user', 'date'], name='tracker_dai_user_id_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='dailyhabitscore',
            unique_together={('user', 'date', 'habit')},
        ),
    ]
