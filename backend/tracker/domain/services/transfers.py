"""Finance (transfers) domain service.

Owns Transfer CRUD plus analytics. All queries are scoped to the requesting user.
"""
from datetime import date

from ...models import Transfer, Account
from .. import validation
from ..exceptions import NotFoundError, ValidationError
from ..logging import get_logger

logger = get_logger("tracker.domain.transfers")


class TransferService:
    def list(
            self,
            user,
            *,
            year=None,
            month=None,
            transfer_type=None,
            start_date=None,
            end_date=None):
        qs = Transfer.objects.filter(user=user)
        if year is not None or month is not None:
            qs = self._apply_period_filters(qs, year=year, month=month)
        if transfer_type:
            qs = qs.filter(transfer_type=transfer_type)
        if start_date:
            qs = qs.filter(date__gte=validation.parse_date(start_date, field="start_date"))
        if end_date:
            qs = qs.filter(date__lte=validation.parse_date(end_date, field="end_date"))
        return list(qs)

    def _apply_period_filters(self, qs, *, year, month):
        today = date.today()
        try:
            y = int(year) if year is not None else today.year
            m = int(month) + 1 if month is not None else None
        except (TypeError, ValueError):
            raise ValidationError("Invalid year or month")
        if y < 1 or y > 9999:
            raise ValidationError("Year must be between 1 and 9999")
        if m is not None and (m < 1 or m > 12):
            raise ValidationError("Month must be between 0 and 11")
        if m is None:
            return qs.filter(date__year=y)
        return qs.filter(date__year=y, date__month=m)

    def list_with_summary(
            self,
            user,
            *,
            year=None,
            month=None,
            transfer_type=None,
            start_date=None,
            end_date=None):
        transfers = self.list(
            user,
            year=year,
            month=month,
            transfer_type=transfer_type,
            start_date=start_date,
            end_date=end_date,
        )
        total_amount = sum(float(t.amount) for t in transfers)
        type_breakdown = {}
        for t in transfers:
            type_breakdown[t.transfer_type] = type_breakdown.get(
                t.transfer_type, 0.0) + float(t.amount)
        return {
            "count": len(transfers),
            "total_amount": round(total_amount, 2),
            "type_breakdown": type_breakdown,
            "transfers": transfers,
        }

    def get_by_id(self, user, transfer_id):
        transfer = Transfer.objects.filter(id=transfer_id, user=user).first()
        if transfer is None:
            raise NotFoundError("Transfer not found")
        return transfer

    def create(self, user, data):
        amount = validation.bounded_decimal(data.get("amount"), field="amount")
        if amount <= 0:
            raise ValidationError("amount must be positive")
        transfer_type = validation.bounded_text(
            data.get(
                "transfer_type",
                "internal"),
            max_length=20,
            field="transfer_type")
        if transfer_type not in dict(Transfer.TRANSFER_TYPES):
            raise ValidationError(
                f"Invalid transfer_type. Must be one of: {[k for k, _ in Transfer.TRANSFER_TYPES]}")
        status = validation.bounded_text(
            data.get(
                "status",
                "completed"),
            max_length=20,
            field="status")
        if status not in dict(Transfer.STATUS_CHOICES):
            raise ValidationError(
                f"Invalid status. Must be one of: {[k for k, _ in Transfer.STATUS_CHOICES]}")
        transfer_date = validation.parse_date(data.get("date"), field="date")
        description = data.get("description", "")

        from_account = None
        to_account = None
        if data.get("from_account"):
            from_account = Account.objects.filter(id=data["from_account"], user=user).first()
            if from_account is None:
                raise NotFoundError("From account not found")
        if data.get("to_account"):
            to_account = Account.objects.filter(id=data["to_account"], user=user).first()
            if to_account is None:
                raise NotFoundError("To account not found")

        # Update account balances if internal transfer and completed
        if transfer_type == 'internal' and status == 'completed' and from_account and to_account:
            from_account.balance -= amount
            to_account.balance += amount
            from_account.save()
            to_account.save()
        elif transfer_type == 'withdrawal' and status == 'completed' and from_account:
            from_account.balance -= amount
            from_account.save()
        elif transfer_type == 'deposit' and status == 'completed' and to_account:
            to_account.balance += amount
            to_account.save()

        transfer = Transfer.objects.create(
            user=user,
            from_account=from_account,
            to_account=to_account,
            amount=amount,
            transfer_type=transfer_type,
            status=status,
            date=transfer_date,
            description=description,
        )
        logger.info("transfers.create user_id=%s id=%s", user.id, transfer.id)
        return transfer

    def update(self, user, transfer_id, data, *, partial=True):
        transfer = Transfer.objects.filter(id=transfer_id, user=user).first()
        if transfer is None:
            raise NotFoundError("Transfer not found")
        # For simplicity, we don't support changing amounts or accounts on update
        # as that would require reversing previous balance changes
        if "status" in data:
            status = validation.bounded_text(data["status"], max_length=20, field="status")
            if status not in dict(Transfer.STATUS_CHOICES):
                raise ValidationError(
                    f"Invalid status. Must be one of: {[k for k, _ in Transfer.STATUS_CHOICES]}")
            # Handle balance updates if status changes
            if transfer.status == 'completed' and status != 'completed':
                # Revert balance changes
                if transfer.transfer_type == 'internal' and transfer.from_account and transfer.to_account:
                    transfer.from_account.balance += transfer.amount
                    transfer.to_account.balance -= transfer.amount
                    transfer.from_account.save()
                    transfer.to_account.save()
                elif transfer.transfer_type == 'withdrawal' and transfer.from_account:
                    transfer.from_account.balance += transfer.amount
                    transfer.from_account.save()
                elif transfer.transfer_type == 'deposit' and transfer.to_account:
                    transfer.to_account.balance -= transfer.amount
                    transfer.to_account.save()
            elif transfer.status != 'completed' and status == 'completed':
                # Apply balance changes
                if transfer.transfer_type == 'internal' and transfer.from_account and transfer.to_account:
                    transfer.from_account.balance -= transfer.amount
                    transfer.to_account.balance += transfer.amount
                    transfer.from_account.save()
                    transfer.to_account.save()
                elif transfer.transfer_type == 'withdrawal' and transfer.from_account:
                    transfer.from_account.balance -= transfer.amount
                    transfer.from_account.save()
                elif transfer.transfer_type == 'deposit' and transfer.to_account:
                    transfer.to_account.balance += transfer.amount
                    transfer.to_account.save()
            transfer.status = status
        if "date" in data:
            transfer.date = validation.parse_date(data["date"], field="date")
        if "description" in data:
            transfer.description = data["description"]
        transfer.save()
        logger.info("transfers.update user_id=%s id=%s", user.id, transfer.id)
        return transfer

    def delete(self, user, transfer_id):
        transfer = Transfer.objects.filter(id=transfer_id, user=user).first()
        if transfer is None:
            raise NotFoundError("Transfer not found")
        # Revert balance changes if completed
        if transfer.status == 'completed':
            if transfer.transfer_type == 'internal' and transfer.from_account and transfer.to_account:
                transfer.from_account.balance += transfer.amount
                transfer.to_account.balance -= transfer.amount
                transfer.from_account.save()
                transfer.to_account.save()
            elif transfer.transfer_type == 'withdrawal' and transfer.from_account:
                transfer.from_account.balance += transfer.amount
                transfer.from_account.save()
            elif transfer.transfer_type == 'deposit' and transfer.to_account:
                transfer.to_account.balance -= transfer.amount
                transfer.to_account.save()
        transfer.delete()
        logger.info("transfers.delete user_id=%s id=%s", user.id, transfer_id)
        return True

    def summary(
            self,
            user,
            *,
            year=None,
            month=None,
            transfer_type=None,
            start_date=None,
            end_date=None):
        qs = Transfer.objects.filter(user=user)
        if year is not None or month is not None:
            qs = self._apply_period_filters(qs, year=year, month=month)
        if transfer_type:
            qs = qs.filter(transfer_type=transfer_type)
        if start_date:
            qs = qs.filter(date__gte=validation.parse_date(start_date, field="start_date"))
        if end_date:
            qs = qs.filter(date__lte=validation.parse_date(end_date, field="end_date"))
        transfers = list(qs)
        total_count = len(transfers)
        total_amount = sum(float(t.amount) for t in transfers)
        types = sorted({t.transfer_type for t in transfers})
        return {
            "total_transfers": total_count,
            "total_amount": round(total_amount, 2),
            "types_count": len(types),
            "unique_types": types,
        }


transfer_service = TransferService()
