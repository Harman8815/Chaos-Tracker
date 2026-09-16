"""Create the demo ``admin`` account used by the login page's auto-fill button.

The frontend ``LoginPage`` ships with demo credentials (admin / Admin@123).
This command makes those credentials actually work in the database so the
demo flow is end-to-end usable without manual user creation.

Usage:
    python manage.py createadmin
    python manage.py createadmin --username admin --password Admin@123 --email admin@example.com
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the demo admin account (admin / Admin@123)."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="admin")
        parser.add_argument("--password", default="Admin@123")
        parser.add_argument("--email", default="admin@example.com")
        parser.add_argument(
            "--force", action="store_true", help="Update password if user already exists."
        )

    def handle(self, *args, **options):
        User = get_user_model()
        username = options["username"]
        password = options["password"]
        email = options["email"]

        user, created = User.objects.get_or_create(
            username=username, defaults={"email": email}
        )
        if created:
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Created demo admin user '{username}' (id={user.id})."
                )
            )
        elif options["force"]:
            user.set_password(password)
            user.email = email
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated demo admin user '{username}' (id={user.id})."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"Demo admin user '{username}' already exists (id={user.id}). "
                    "Use --force to reset the password."
                )
            )