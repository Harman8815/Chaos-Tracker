"""Migration safety utilities and patterns."""

from django.db import migrations, models
from django.db.migrations.operations import RunSQL, RunPython
from django.db.migrations.writer import MigrationWriter
from django.db.migrations.loader import MigrationLoader
from django.db import connection
from typing import List, Callable, Optional


class SafeMigrationMixin:
    """Mixin providing safe migration patterns."""

    @staticmethod
    def safe_add_column(model_name: str, field: models.Field, preserve_default: bool = True):
        """Safely add a column with proper default handling."""
        return migrations.AddField(
            model_name=model_name,
            name=field.name,
            field=field,
            preserve_default=preserve_default,
        )

    @staticmethod
    def safe_alter_column(model_name: str, field: models.Field):
        """Safely alter a column."""
        return migrations.AlterField(
            model_name=model_name,
            name=field.name,
            field=field,
        )

    @staticmethod
    def safe_remove_column(model_name: str, field_name: str):
        """Safely remove a column."""
        return migrations.RemoveField(
            model_name=model_name,
            name=field_name,
        )

    @staticmethod
    def safe_rename_column(model_name: str, old_name: str, new_name: str):
        """Safely rename a column."""
        return migrations.RenameField(
            model_name=model_name,
            old_name=old_name,
            new_name=new_name,
        )

    @staticmethod
    def conditional_run_sql(forward_sql: str, reverse_sql: str = None, elidable: bool = False):
        """Run SQL conditionally - only if not already applied."""
        return RunSQL(
            sql=forward_sql,
            reverse_sql=reverse_sql or migrations.RunSQL.noop,
            elidable=elidable,
        )

    @staticmethod
    def conditional_run_python(forward_fn: Callable, reverse_fn: Callable = None, elidable: bool = False):
        """Run Python conditionally - only if not already applied."""
        return RunPython(
            code=forward_fn,
            reverse_code=reverse_fn or migrations.RunPython.noop,
            elidable=elidable,
        )


def check_migration_safety(apps, schema_editor) -> List[str]:
    """Check for common migration safety issues."""
    issues = []

    # Check for non-nullable columns without defaults
    with connection.cursor() as cursor:
        if connection.vendor == 'postgresql':
            cursor.execute("""
                SELECT table_name, column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND is_nullable = 'NO'
                AND column_default IS NULL
                AND table_name NOT IN ('django_migrations', 'django_content_type', 'auth_permission')
            """)
            for row in cursor.fetchall():
                issues.append(f"Non-nullable column without default: {row[0]}.{row[1]} ({row[2]})")

        elif connection.vendor == 'sqlite':
            cursor.execute("SELECT sql FROM sqlite_master WHERE type='table'")
            for row in cursor.fetchall():
                sql = row[0] or ''
                if 'NOT NULL' in sql and 'DEFAULT' not in sql:
                    issues.append(f"Potential non-nullable column without default in: {sql[:100]}")

    return issues


def create_data_migration_safe(
    apps,
    model_name: str,
    field_name: str,
    transform_fn: Callable,
    reverse_fn: Callable = None,
    batch_size: int = 1000,
):
    """Create a safe data migration that processes in batches."""
    Model = apps.get_model('tracker', model_name)

    def forward(apps, schema_editor):
        queryset = Model.objects.all()
        total = queryset.count()

        for i in range(0, total, batch_size):
            batch = queryset[i:i + batch_size]
            for obj in batch:
                current_value = getattr(obj, field_name)
                new_value = transform_fn(current_value, obj)
                if new_value != current_value:
                    setattr(obj, field_name, new_value)
            Model.objects.bulk_update(batch, [field_name])

    def reverse(apps, schema_editor):
        if reverse_fn:
            queryset = Model.objects.all()
            total = queryset.count()
            for i in range(0, total, batch_size):
                batch = queryset[i:i + batch_size]
                for obj in batch:
                    current_value = getattr(obj, field_name)
                    new_value = reverse_fn(current_value, obj)
                    if new_value != current_value:
                        setattr(obj, field_name, new_value)
                Model.objects.bulk_update(batch, [field_name])

    return migrations.RunPython(forward, reverse or migrations.RunPython.noop)


def validate_migration_dependencies(migration_loader: MigrationLoader, app_label: str) -> List[str]:
    """Validate migration dependencies are correct."""
    issues = []

    graph = migration_loader.graph
    leaf_nodes = graph.leaf_nodes(app_label)

    for node in leaf_nodes:
        migration = migration_loader.get_migration(node[0], node[1])
        for dep in migration.dependencies:
            if dep[0] != app_label:
                # Cross-app dependency - verify it exists
                try:
                    migration_loader.get_migration(dep[0], dep[1])
                except KeyError:
                    issues.append(f"Missing dependency: {dep[0]}.{dep[1]} (required by {node})")

    return issues


class MigrationPlanValidator:
    """Validate migration plan before applying."""

    def __init__(self, app_label: str = 'tracker'):
        self.app_label = app_label

    def get_plan(self) -> List:
        """Get migration plan."""
        loader = MigrationLoader(connection)
        return loader.graph.plan(loader.graph.leaf_nodes(self.app_label))

    def check_conflicts(self) -> List[str]:
        """Check for migration conflicts."""
        loader = MigrationLoader(connection)
        return loader.detect_conflicts()

    def check_unapplied(self) -> List:
        """Get unapplied migrations."""
        loader = MigrationLoader(connection)
        return list(loader.unmigrated_apps)

    def validate(self) -> dict:
        """Run all validation checks."""
        return {
            'plan': self.get_plan(),
            'conflicts': self.check_conflicts(),
            'unapplied': self.check_unapplied(),
            'safety_issues': check_migration_safety(None, None),
        }


def generate_safe_migration_template(
    name: str,
    operations: List,
    dependencies: List = None,
    replaces: List = None,
) -> str:
    """Generate a migration file with safe defaults."""
    from django.db import migrations

    class Migration(migrations.Migration):
        initial = False
        dependencies = dependencies or [
            ('tracker', '__latest__'),
        ]
        replaces = replaces or []
        operations = operations

    writer = MigrationWriter(Migration)
    return writer.as_string()