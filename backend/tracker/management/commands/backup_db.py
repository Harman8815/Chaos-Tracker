"""Management command for database backup and disaster recovery."""
import os
import shutil
import gzip
import json
from datetime import datetime, timedelta
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import connection
from django.apps import apps


class Command(BaseCommand):
    help = "Create database backup with optional compression and verification."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output-dir",
            type=str,
            default=None,
            help="Backup output directory (default: settings.BACKUP_DIR)",
        )
        parser.add_argument(
            "--compress",
            action="store_true",
            default=True,
            help="Compress backup with gzip",
        )
        parser.add_argument(
            "--no-compress",
            action="store_false",
            dest="compress",
            help="Do not compress backup",
        )
        parser.add_argument(
            "--verify",
            action="store_true",
            default=True,
            help="Verify backup after creation",
        )
        parser.add_argument(
            "--include-media",
            action="store_true",
            default=False,
            help="Include media files in backup",
        )
        parser.add_argument(
            "--retention-days",
            type=int,
            default=None,
            help="Override default retention period",
        )

    def handle(self, *args, **options):
        output_dir = Path(options["output_dir"] or getattr(settings, 'BACKUP_DIR', settings.BASE_DIR / 'backups'))
        compress = options["compress"]
        verify = options["verify"]
        include_media = options["include_media"]
        retention_days = options["retention_days"] or getattr(settings, 'BACKUP_RETENTION_DAYS', 30)

        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        db_name = self._get_database_name()
        backup_name = f"backup_{db_name}_{timestamp}"
        backup_path = output_dir / f"{backup_name}.sql"
        if compress:
            backup_path = output_dir / f"{backup_name}.sql.gz"

        self.stdout.write(f"Creating backup: {backup_path}")

        try:
            self._create_sql_dump(backup_path, compress)
        except Exception as e:
            raise CommandError(f"Backup failed: {e}")

        # Verify backup
        if verify:
            self._verify_backup(backup_path, compress)

        # Include media files
        media_path = None
        if include_media:
            media_path = self._backup_media(output_dir, backup_name, compress)

        # Create manifest
        manifest = self._create_manifest(backup_path, media_path, compress, db_name)
        manifest_path = output_dir / f"{backup_name}_manifest.json"
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

        # Cleanup old backups
        self._cleanup_old_backups(output_dir, retention_days)

        self.stdout.write(self.style.SUCCESS(f"Backup completed: {backup_path}"))
        self.stdout.write(f"Manifest: {manifest_path}")

    def _get_database_name(self) -> str:
        db_settings = settings.DATABASES['default']
        if db_settings['ENGINE'] == 'django.db.backends.sqlite3':
            return Path(db_settings['NAME']).stem
        return db_settings.get('NAME', 'unknown')

    def _create_sql_dump(self, backup_path: Path, compress: bool):
        """Create SQL dump using Django's connection."""
        db_settings = settings.DATABASES['default']

        if db_settings['ENGINE'] == 'django.db.backends.sqlite3':
            self._dump_sqlite(backup_path, compress)
        elif db_settings['ENGINE'] == 'django.db.backends.postgresql':
            self._dump_postgresql(backup_path, compress)
        elif db_settings['ENGINE'] == 'django.db.backends.mysql':
            self._dump_mysql(backup_path, compress)
        else:
            raise CommandError(f"Unsupported database engine: {db_settings['ENGINE']}")

    def _dump_sqlite(self, backup_path: Path, compress: bool):
        """Dump SQLite database."""
        db_path = settings.DATABASES['default']['NAME']

        if compress:
            with open(db_path, 'rb') as f_in:
                with gzip.open(backup_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
        else:
            shutil.copy2(db_path, backup_path)

    def _dump_postgresql(self, backup_path: Path, compress: bool):
        """Dump PostgreSQL database using pg_dump."""
        import subprocess
        db = settings.DATABASES['default']

        cmd = [
            'pg_dump',
            '-h', db.get('HOST', 'localhost'),
            '-p', str(db.get('PORT', 5432)),
            '-U', db['USER'],
            '-d', db['NAME'],
            '--no-owner',
            '--no-privileges',
        ]

        env = os.environ.copy()
        if db.get('PASSWORD'):
            env['PGPASSWORD'] = db['PASSWORD']

        if compress:
            with gzip.open(backup_path, 'wb') as f_out:
                subprocess.run(cmd, stdout=f_out, env=env, check=True)
        else:
            with open(backup_path, 'wb') as f_out:
                subprocess.run(cmd, stdout=f_out, env=env, check=True)

    def _dump_mysql(self, backup_path: Path, compress: bool):
        """Dump MySQL database using mysqldump."""
        import subprocess
        db = settings.DATABASES['default']

        cmd = [
            'mysqldump',
            '-h', db.get('HOST', 'localhost'),
            '-P', str(db.get('PORT', 3306)),
            '-u', db['USER'],
            f"-p{db['PASSWORD']}" if db.get('PASSWORD') else '',
            '--single-transaction',
            '--routines',
            '--triggers',
            db['NAME'],
        ]

        if compress:
            with gzip.open(backup_path, 'wb') as f_out:
                subprocess.run(cmd, stdout=f_out, check=True)
        else:
            with open(backup_path, 'wb') as f_out:
                subprocess.run(cmd, stdout=f_out, check=True)

    def _verify_backup(self, backup_path: Path, compress: bool):
        """Verify backup file is readable."""
        if compress:
            try:
                with gzip.open(backup_path, 'rb') as f:
                    f.read(1024)  # Read first 1KB to verify
            except Exception as e:
                raise CommandError(f"Backup verification failed: {e}")
        else:
            if not backup_path.exists() or backup_path.stat().st_size == 0:
                raise CommandError("Backup file is empty or missing")

        self.stdout.write("Backup verification passed")

    def _backup_media(self, output_dir: Path, backup_name: str, compress: bool) -> Path:
        """Backup media files."""
        media_root = getattr(settings, 'MEDIA_ROOT', None)
        if not media_root or not Path(media_root).exists():
            self.stdout.write("No media directory found, skipping")
            return None

        media_backup = output_dir / f"{backup_name}_media"
        if compress:
            media_backup = output_dir / f"{backup_name}_media.tar.gz"
            import tarfile
            with tarfile.open(media_backup, 'w:gz') as tar:
                tar.add(media_root, arcname='media')
        else:
            media_backup = output_dir / f"{backup_name}_media"
            shutil.copytree(media_root, media_backup / 'media')

        self.stdout.write(f"Media backup: {media_backup}")
        return media_backup

    def _create_manifest(self, backup_path: Path, media_path: Path, compress: bool, db_name: str) -> dict:
        """Create backup manifest with metadata."""
        stat = backup_path.stat()
        return {
            "created_at": datetime.now().isoformat(),
            "database": db_name,
            "backup_file": backup_path.name,
            "backup_size_bytes": stat.st_size,
            "compressed": compress,
            "media_file": media_path.name if media_path else None,
            "django_version": self._get_django_version(),
            "apps": [app.name for app in apps.get_app_configs()],
        }

    def _get_django_version(self) -> str:
        import django
        return django.get_version()

    def _cleanup_old_backups(self, output_dir: Path, retention_days: int):
        """Remove backups older than retention period."""
        cutoff = datetime.now() - timedelta(days=retention_days)
        deleted = 0

        for backup_file in output_dir.glob("backup_*"):
            try:
                mtime = datetime.fromtimestamp(backup_file.stat().st_mtime)
                if mtime < cutoff:
                    backup_file.unlink()
                    deleted += 1
            except Exception:
                pass

        # Also cleanup manifest files
        for manifest in output_dir.glob("*_manifest.json"):
            try:
                mtime = datetime.fromtimestamp(manifest.stat().st_mtime)
                if mtime < cutoff:
                    manifest.unlink()
                    deleted += 1
            except Exception:
                pass

        if deleted:
            self.stdout.write(f"Cleaned up {deleted} old backup files")