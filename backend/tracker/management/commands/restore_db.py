"""Management command for database restore from backup."""

import os
import gzip
import shutil
import json
import tarfile
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import connection


class Command(BaseCommand):
    help = "Restore database from backup file."

    def add_arguments(self, parser):
        parser.add_argument(
            "backup_file",
            type=str,
            help="Path to backup file (.sql, .sql.gz, or manifest.json)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            default=False,
            help="Skip confirmation prompt",
        )
        parser.add_argument(
            "--no-migrate",
            action="store_true",
            default=False,
            help="Skip running migrations after restore",
        )
        parser.add_argument(
            "--restore-media",
            action="store_true",
            default=False,
            help="Also restore media files if available",
        )

    def handle(self, *args, **options):
        backup_path = Path(options["backup_file"])
        force = options["force"]
        no_migrate = options["no_migrate"]
        restore_media = options["restore_media"]

        if not backup_path.exists():
            raise CommandError(f"Backup file not found: {backup_path}")

        # Check if it's a manifest file
        if backup_path.name.endswith("_manifest.json"):
            manifest_path = backup_path
            with open(manifest_path) as f:
                manifest = json.load(f)
            backup_path = manifest_path.parent / manifest["backup_file"]
            media_file = manifest.get("media_file")
        else:
            manifest = None
            media_file = None

        if not backup_path.exists():
            raise CommandError(f"Backup file not found: {backup_path}")

        # Confirmation
        if not force:
            confirm = input(
                f"This will REPLACE the current database with {backup_path}. Continue? [y/N]: "
            )
            if confirm.lower() != "y":
                self.stdout.write("Cancelled")
                return

        self.stdout.write(f"Restoring from: {backup_path}")

        try:
            self._restore_database(backup_path)
        except Exception as e:
            raise CommandError(f"Restore failed: {e}")

        # Restore media
        if restore_media and manifest and media_file:
            media_path = manifest_path.parent / media_file
            if media_path.exists():
                self._restore_media(media_path, manifest.get("compressed", True))

        # Run migrations
        if not no_migrate:
            self.stdout.write("Running migrations...")
            from django.core.management import call_command

            call_command("migrate", verbosity=0)

        self.stdout.write(self.style.SUCCESS("Restore completed successfully"))

    def _restore_database(self, backup_path: Path):
        """Restore database from backup."""
        db_settings = settings.DATABASES["default"]

        if db_settings["ENGINE"] == "django.db.backends.sqlite3":
            self._restore_sqlite(backup_path, db_settings)
        elif db_settings["ENGINE"] == "django.db.backends.postgresql":
            self._restore_postgresql(backup_path, db_settings)
        elif db_settings["ENGINE"] == "django.db.backends.mysql":
            self._restore_mysql(backup_path, db_settings)
        else:
            raise CommandError(f"Unsupported database engine: {db_settings['ENGINE']}")

    def _restore_sqlite(self, backup_path: Path, db_settings):
        """Restore SQLite database."""
        db_path = Path(db_settings["NAME"])

        # Close any existing connections
        connection.close()

        # Backup current database
        if db_path.exists():
            backup_current = db_path.with_suffix(".sqlite3.pre_restore")
            shutil.copy2(db_path, backup_current)
            self.stdout.write(f"Current database backed up to: {backup_current}")

        # Restore
        if backup_path.suffix == ".gz":
            with gzip.open(backup_path, "rb") as f_in:
                with open(db_path, "wb") as f_out:
                    shutil.copyfileobj(f_in, f_out)
        else:
            shutil.copy2(backup_path, db_path)

        self.stdout.write(f"SQLite database restored to: {db_path}")

    def _restore_postgresql(self, backup_path: Path):
        """Restore PostgreSQL database."""
        import subprocess

        db = settings.DATABASES["default"]

        # Terminate existing connections
        terminate_sql = f"""
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = '{db['NAME']}' AND pid <> pg_backend_pid();
        """
        with connection.cursor() as cursor:
            cursor.execute(terminate_sql)

        # Drop and recreate database
        drop_cmd = [
            "dropdb",
            "-h",
            db.get("HOST", "localhost"),
            "-p",
            str(db.get("PORT", 5432)),
            "-U",
            db["USER"],
            db["NAME"],
        ]
        create_cmd = [
            "createdb",
            "-h",
            db.get("HOST", "localhost"),
            "-p",
            str(db.get("PORT", 5432)),
            "-U",
            db["USER"],
            db["NAME"],
        ]
        restore_cmd = [
            "psql",
            "-h",
            db.get("HOST", "localhost"),
            "-p",
            str(db.get("PORT", 5432)),
            "-U",
            db["USER"],
            "-d",
            db["NAME"],
        ]

        env = os.environ.copy()
        if db.get("PASSWORD"):
            env["PGPASSWORD"] = db["PASSWORD"]

        subprocess.run(drop_cmd, env=env, check=False)  # Ignore if not exists
        subprocess.run(create_cmd, env=env, check=True)

        if backup_path.suffix == ".gz":
            with gzip.open(backup_path, "rb") as f_in:
                subprocess.run(restore_cmd, stdin=f_in, env=env, check=True)
        else:
            with open(backup_path, "rb") as f_in:
                subprocess.run(restore_cmd, stdin=f_in, env=env, check=True)

        self.stdout.write("PostgreSQL database restored")

    def _restore_mysql(self, backup_path: Path):
        """Restore MySQL database."""
        import subprocess

        db = settings.DATABASES["default"]

        restore_cmd = [
            "mysql",
            "-h",
            db.get("HOST", "localhost"),
            "-P",
            str(db.get("PORT", 3306)),
            "-u",
            db["USER"],
            f"-p{db['PASSWORD']}" if db.get("PASSWORD") else "",
            db["NAME"],
        ]

        if backup_path.suffix == ".gz":
            with gzip.open(backup_path, "rb") as f_in:
                subprocess.run(restore_cmd, stdin=f_in, check=True)
        else:
            with open(backup_path, "rb") as f_in:
                subprocess.run(restore_cmd, stdin=f_in, check=True)

        self.stdout.write("MySQL database restored")

    def _restore_media(self, media_path: Path, compressed: bool):
        """Restore media files."""
        media_root = getattr(settings, "MEDIA_ROOT", None)
        if not media_root:
            self.stdout.write("MEDIA_ROOT not configured, skipping media restore")
            return

        media_root = Path(media_root)
        if media_root.exists():
            shutil.rmtree(media_root)

        if compressed and media_path.suffix == ".gz":
            with tarfile.open(media_path, "r:gz") as tar:
                tar.extractall(media_root.parent)
        else:
            shutil.copytree(media_path / "media", media_root)

        self.stdout.write(f"Media restored to: {media_root}")
