# Generated migration for Planner models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tracker', '0006_goal'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlannerBlock',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('title', models.CharField(default='New Block', max_length=255)),
                ('x', models.FloatField(default=0)),
                ('y', models.FloatField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='planner_blocks', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PlannerTask',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('text', models.CharField(max_length=500)),
                ('completed', models.BooleanField(default=False)),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='tracker.plannerblock')),
            ],
            options={
                'ordering': ['order', 'created_at'],
            },
        ),
        migrations.CreateModel(
            name='PlannerLink',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('from_block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outgoing_links', to='tracker.plannerblock')),
                ('to_block', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incoming_links', to='tracker.plannerblock')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='planner_links', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PlannerSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transform', models.JSONField(default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='planner_settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Planner settings',
            },
        ),
        migrations.AddIndex(
            model_name='plannerblock',
            index=models.Index(fields=['user'], name='tracker_pla_user_id_idx'),
        ),
        migrations.AddIndex(
            model_name='plannertask',
            index=models.Index(fields=['block', 'order'], name='tracker_pla_block_i_idx'),
        ),
        migrations.AddIndex(
            model_name='plannerlink',
            index=models.Index(fields=['user'], name='tracker_pla_user_id_idx2'),
        ),
    ]
