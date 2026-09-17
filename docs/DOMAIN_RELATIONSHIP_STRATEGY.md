# Cross-Domain Relationship Strategy (P2-01)

## Purpose

Define how goals, habits, planner tasks, achievements, journal entries, mood,
expenses, and daily activity connect inside Chaos Tracker.

## Guiding Principles

1. Every domain owns its data; relationships are FK/JSON references, not copies.
2. Ownership always flows through `User`.
3. Relationships are lazy; heavy joins happen only in analytics queries.
4. New domains attach via stable foreign keys, not ad-hoc string fields.

## Relationship Map

```text
User
 ├─ Goal  (1) ------ (N) PlannerTask   via goal FK
 ├─ Goal  (1) ------ (N) Habit         via goal FK
 ├─ Goal  (1) ------ (N) Achievement   via trigger rule
 ├─ Habit (1) ------ (N) DailyHabitScore
 ├─ Expense(1) ------ (N) Budget       via category + period
 ├─ JournalEntry(1) - (1) DailyActivityAggregate  via date
 ├─ Mood (1) --------- (1) DailyActivityAggregate  via date
 ├─ Water (1) -------- (1) DailyActivityAggregate  via date
 └─ UserEvent (1) ---- (N) any domain   via event_type + subject
```

## Linking Rules

### Goal → PlannerTask (P2-02)
- `PlannerTask` gains an optional `goal` FK.
- Completing a task may increment `Goal.completed_tasks` (P3-07).

### Goal → Habit (P2-03)
- `Habit` gains an optional `goal` FK.
- A habit's daily score contributes to goal progress when configured.

### Achievement → Measurable Events (P2-04)
- `Achievement` gains an optional `trigger` rule (event type + threshold).
- Achievements are awarded by evaluating `UserEvent` history.

### Journal → Daily Activity (P2-05)
- `JournalEntry` is keyed by `date`; `DailyActivityAggregate` is keyed by `date`.
- The aggregate reads journal presence as a boolean flag.

### Mood → Daily Activity (P2-06)
- `Mood` is keyed by `date`; the aggregate stores the mood value.

### Expense → Category/Budget (P2-07)
- `Expense.category` is the natural key.
- `Budget` is `(user, category, year, month)`.

## Implementation Order

1. `UserEvent` model (P2-09) — universal audit trail.
2. `DailyActivityAggregate` model (P2-08) — daily rollup.
3. FK fields: `PlannerTask.goal`, `Habit.goal`, `Budget` (P2-02, P2-03, P2-07).
4. `Achievement.trigger_rule` (P2-04).
5. Historical policy (P2-10).