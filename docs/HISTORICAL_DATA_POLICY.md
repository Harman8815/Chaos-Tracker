# Historical Data Policy (P2-10)

## Purpose

Define retention, aggregation, and pruning rules for Chaos Tracker data
as the system accumulates history.

## Retention Rules

| Data Class | Model(s) | Retention | Rationale |
|---|---|---|---|
| Raw events | `UserEvent` | 24 months | Audit trail; compacted by `EventService.delete_before` |
| Daily aggregates | `DailyActivityAggregate` | 7 years | Long-term trend analysis |
| Habit scores | `DailyHabitScore` | 24 months | Consistency analytics |
| Expenses | `Expense` | 7 years | Financial history / tax-like records |
| Budgets | `Budget` | 7 years | Historical budget comparison |
| Goals | `Goal` | Indefinite (soft-delete via status) | Personal history |
| Achievements | `Achievement` | Indefinite | Milestone record |
| Journal | `JournalEntry` | Indefinite | User-owned; no automatic deletion |
| Mood / Water | `Mood`, `Water` | 7 years | Health trend analysis |

## Aggregation Rules

- `DailyActivityAggregate` is the only cross-domain rollup table.
- Weekly/monthly aggregates are computed on-demand by the analytics
  service from `DailyActivityAggregate` rows; they are not stored.
- `UserEvent` rows are append-only; compaction deletes raw rows older
  than the retention window after aggregates are up to date.

## Pruning Procedure

1. Ensure `DailyActivityAggregate` is current for the pruning window.
2. Call `event_service.delete_before(user, cutoff)` for each user.
3. Run periodically (e.g. nightly) via a management command.

## Management Command

`python manage.py compact_history --months 24`

## Privacy Notes

- Pruning is per-user; the user's own data is never shared.
- Aggregated rows are scoped to the requesting user.
- No PII is stored in `UserEvent.payload` beyond what the user entered.