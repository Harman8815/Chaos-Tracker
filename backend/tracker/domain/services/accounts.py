"""Finance (accounts) domain service.

Owns Account CRUD plus analytics. All queries are scoped to the requesting user.
"""

from django.db import models
from ...models import Account
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.accounts")


class AccountService:
    def list(self, user, *, is_active=None):
        qs = Account.objects.filter(user=user)
        if is_active is not None:
            qs = qs.filter(is_active=is_active)
        return list(qs)

    def get_by_id(self, user, account_id):
        account = Account.objects.filter(id=account_id, user=user).first()
        if account is None:
            raise NotFoundError("Account not found")
        return account

    def create(self, user, data):
        name = validation.bounded_text(data.get("name"), max_length=100, field="name")
        account_type = validation.bounded_text(
            data.get("account_type"), max_length=20, field="account_type"
        )
        if account_type not in dict(Account.ACCOUNT_TYPES):
            raise ValidationError(
                f"Invalid account_type. Must be one of: {[k for k, _ in Account.ACCOUNT_TYPES]}"
            )
        balance = validation.bounded_decimal(data.get("balance", 0), field="balance")
        currency = validation.bounded_text(
            data.get("currency", "USD"), max_length=3, field="currency"
        )
        is_active = data.get("is_active", True)
        account = Account.objects.create(
            user=user,
            name=name,
            account_type=account_type,
            balance=balance,
            currency=currency,
            is_active=is_active,
        )
        logger.info("accounts.create user_id=%s id=%s", user.id, account.id)
        return account

    def update(self, user, account_id, data, *, partial=True):
        account = Account.objects.filter(id=account_id, user=user).first()
        if account is None:
            raise NotFoundError("Account not found")
        if "name" in data:
            account.name = validation.bounded_text(data["name"], max_length=100, field="name")
        if "account_type" in data:
            account_type = validation.bounded_text(
                data["account_type"], max_length=20, field="account_type"
            )
            if account_type not in dict(Account.ACCOUNT_TYPES):
                raise ValidationError(
                    f"Invalid account_type. Must be one of: {[k for k, _ in Account.ACCOUNT_TYPES]}"
                )
            account.account_type = account_type
        if "balance" in data:
            account.balance = validation.bounded_decimal(data["balance"], field="balance")
        if "currency" in data:
            account.currency = validation.bounded_text(
                data["currency"], max_length=3, field="currency"
            )
        if "is_active" in data:
            account.is_active = data["is_active"]
        account.save()
        logger.info("accounts.update user_id=%s id=%s", user.id, account.id)
        return account

    def delete(self, user, account_id):
        account = Account.objects.filter(id=account_id, user=user).first()
        if account is None:
            raise NotFoundError("Account not found")
        account.delete()
        logger.info("accounts.delete user_id=%s id=%s", user.id, account_id)
        return True

    def get_total_balance(self, user):
        """Get total balance across all active accounts."""
        total = Account.objects.filter(user=user, is_active=True).aggregate(
            total=models.Sum("balance")
        )["total"]
        return float(total) if total else 0.0

    def summary(self, user):
        """Get account summary with total balance and count by type."""
        accounts = self.list(user, is_active=True)
        total_balance = sum(float(a.balance) for a in accounts)
        type_breakdown = {}
        for account in accounts:
            key = account.account_type
            type_breakdown[key] = type_breakdown.get(key, 0.0) + float(account.balance)
        return {
            "total_accounts": len(accounts),
            "total_balance": round(total_balance, 2),
            "type_breakdown": type_breakdown,
        }


account_service = AccountService()
