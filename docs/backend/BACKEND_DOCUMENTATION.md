# Backend Documentation

## Step 5 — Backend Model Inventory

### User (Django Built-in)
- **Purpose**: Authentication and base user identity.
- **Important fields**: username, email, password, first_name, last_name, is_staff, is_active, date_joined.
- **Primary key**: Auto-incrementing `id`.
- **Foreign keys**: None.
- **Relationships**:
  - One-to-many with `JournalEntry` (related_name: `journal_entries`).
  - One-to-many with `QuoteSource` (related_name: `quote_sources`).
  - One-to-many with `Achievement` (related_name: `achievements`).
  - One-to-many with `Expense` (related_name: `expenses`).
  - One-to-many with `Goal` (related_name: `goals`).
  - One-to-many with `PlannerBlock` (related_name: `planner_blocks`).
  - One-to-many with `PlannerLink` (related_name: `planner_links`).
  - One-to-one with `UserProfile` (related_name: `profile`).
  - One-to-one with `PlannerSettings` (related_name: `planner_settings`).
  - One-to-many with `Habit` (related_name: `habits`).
  - One-to-many with `ScoringRule` (related_name: `scoring_rules`).
  - One-to-many with `DailyHabitScore` (related_name: `habit_scores`).
- **Important constraints**: username must be unique; email is not required by default.

---

### JournalEntry
- **Purpose**: Stores daily journal entries for a user.
- **Important fields**: user, date, content, created_at, updated_at.
- **Primary key**: Auto-incrementing `id`.
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: Belongs to one User.
- **Important constraints**:
  - `unique_together = ['user', 'date']` — one journal entry per user per date.
  - Ordered by `-date`.

---

### QuoteSource
- **Purpose**: Represents a source of quotes (Movie, Web Series, Book).
- **Important fields**: id, user, title, type, cover_image, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: One-to-many with `Quote` (related_name: `quotes`).
- **Important constraints**:
  - `type` choices: Movie, Web Series, Book.
  - Indexed on `(user, title)` and `(user, type)`.
  - Ordered by `-created_at`.

---

### Quote
- **Purpose**: Individual quote belonging to a QuoteSource.
- **Important fields**: id, source, text, author, image, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `source` → QuoteSource (CASCADE).
- **Relationships**: Belongs to one QuoteSource; one-to-many with `QuoteTag` (related_name: `tags`).
- **Important constraints**:
  - Indexed on `(source, author)`.
  - Ordered by `-created_at`.

---

### QuoteTag
- **Purpose**: Tags for quotes (implements many-to-many tagging).
- **Important fields**: quote, tag.
- **Primary key**: Auto-incrementing `id` (implicit).
- **Foreign keys**: `quote` → Quote (CASCADE).
- **Relationships**: Belongs to one Quote.
- **Important constraints**:
  - `unique_together = ['quote', 'tag']` — prevents duplicate tags per quote.
  - Indexed on `tag`.

---

### Achievement
- **Purpose**: Stores user achievements/badges.
- **Important fields**: user, title, description, date, image, created_at, updated_at.
- **Primary key**: Auto-incrementing `id`.
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: Belongs to one User.
- **Important constraints**:
  - Indexed on `(user, date)`.
  - Ordered by `-date`.

---

### Expense
- **Purpose**: Stores individual expense records.
- **Important fields**: user, date, item, category, quantity, price, created_at, updated_at.
- **Primary key**: Auto-incrementing `id`.
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: Belongs to one User.
- **Important constraints**:
  - `quantity` default = 1.
  - `price` is DecimalField(max_digits=10, decimal_places=2).
  - `total` property computes `quantity * price`.
  - Indexed on `(user, date)` and `(user, category)`.
  - Ordered by `-date`, `-created_at`.

---

### Goal
- **Purpose**: Represents a user goal with category, status, priority, and tracking fields.
- **Important fields**: user, text, category, status, tags, created_at, updated_at, completed_at, target, completed_tasks, description, start_date, due_date, priority, frequency, reminders, completion_criteria, notes.
- **Primary key**: Auto-incrementing `id`.
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: Belongs to one User.
- **Important constraints**:
  - `category` choices: daily, monthly, future.
  - `status` choices: active, completed, blocked, trashed.
  - `priority` choices: low, medium, high.
  - `tags` is a JSONField (list).
  - `reminders` is a JSONField (list).
  - Indexed on `(user, category)` and `(user, status)`.
  - Ordered by `-created_at`.

---

### PlannerBlock
- **Purpose**: Represents a draggable block in the planner canvas.
- **Important fields**: id, user, title, x, y, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**:
  - One-to-many with `PlannerTask` (related_name: `tasks`).
  - One-to-many with `PlannerLink` via `outgoing_links`.
  - One-to-many with `PlannerLink` via `incoming_links`.
- **Important constraints**:
  - `x`, `y` are FloatFields for canvas positioning.
  - Indexed on `user`.
  - Ordered by `-created_at`.

---

### PlannerTask
- **Purpose**: Individual task within a planner block.
- **Important fields**: id, block, text, completed, order, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `block` → PlannerBlock (CASCADE).
- **Relationships**: Belongs to one PlannerBlock.
- **Important constraints**:
  - `order` is IntegerField for task sequencing.
  - Indexed on `(block, order)`.
  - Ordered by `order`, `created_at`.

---

### PlannerLink
- **Purpose**: Represents a connection between two planner blocks.
- **Important fields**: id, user, from_block, to_block, created_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**:
  - `user` → User (CASCADE).
  - `from_block` → PlannerBlock (CASCADE, related_name: `outgoing_links`).
  - `to_block` → PlannerBlock (CASCADE, related_name: `incoming_links`).
- **Relationships**: Connects two PlannerBlocks.
- **Important constraints**:
  - Indexed on `user`.
  - Ordered by `-created_at`.

---

### PlannerSettings
- **Purpose**: Stores user-specific planner settings like canvas transform.
- **Important fields**: user, transform, created_at, updated_at.
- **Primary key**: Auto-incrementing `id` (implicit).
- **Foreign keys**: `user` → User (OneToOne, CASCADE).
- **Relationships**: One-to-one with User.
- **Important constraints**:
  - `transform` is JSONField storing `{scale, panX, panY}`.
  - `verbose_name_plural = 'Planner settings'`.

---

### Habit
- **Purpose**: Represents a habit to be tracked.
- **Important fields**: id, user, name, target, range_max, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**:
  - One-to-many with `DailyHabitScore` (related_name: `scores`).
- **Important constraints**:
  - `target` default = 1.
  - `range_max` default = 10.
  - Indexed on `user`.
  - Ordered by `created_at`.

---

### ScoringRule
- **Purpose**: Represents a rule for scoring points for habits.
- **Important fields**: id, user, activity, max_points, penalty_rule, zero_points_condition, scoring_logic, created_at, updated_at.
- **Primary key**: Custom `id` (CharField, max_length=100).
- **Foreign keys**: `user` → User (CASCADE).
- **Relationships**: Belongs to one User.
- **Important constraints**:
  - `max_points` default = 10.
  - Indexed on `user`.
  - Ordered by `created_at`.

---

### DailyHabitScore
- **Purpose**: Stores the score for a specific habit on a specific date.
- **Important fields**: user, date, habit, score, created_at, updated_at.
- **Primary key**: Auto-incrementing `id` (implicit).
- **Foreign keys**:
  - `user` → User (CASCADE).
  - `habit` → Habit (CASCADE).
- **Relationships**: Belongs to one User and one Habit.
- **Important constraints**:
  - `unique_together = ['user', 'date', 'habit']` — one score per user per habit per date.
  - `score` default = 0.
  - Indexed on `(user, date)`.
  - Ordered by `-date`.

---

### UserProfile
- **Purpose**: Extended user profile information.
- **Important fields**: user, bio, avatar_url, date_of_birth, location, website, timezone, created_at, updated_at.
- **Primary key**: Auto-incrementing `id` (implicit).
- **Foreign keys**: `user` → User (OneToOne, CASCADE).
- **Relationships**: One-to-one with User.
- **Important constraints**:
  - `timezone` default = 'UTC'.
  - `bio` max_length = 500.
  - Indexed on `user`.

---

## Step 7 — Backend Route Inventory

Base path: `/api/` (configured in `tracker_backend/urls.py`).

### Authentication Routes (`/api/auth/`)

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| POST | `/api/auth/signup/` | Create new user account and auto-login | AllowAny | `username`, `password`, `email`, `first_name`, `last_name` | `success`, `message`, `user` | User |
| POST | `/api/auth/login/` | Authenticate user | AllowAny | `username`, `password` | `success`, `message`, `user` | User |
| POST | `/api/auth/logout/` | Log out current user | AllowAny | None | `success`, `message` | Session |
| GET | `/api/auth/me/` | Get current authenticated user | IsAuthenticated | None | `success`, `user` | User |

---

### Sync & Data Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model / Service |
|--------|-------|---------|------|----------------------|----------|------------------------|
| GET | `/api/sync/` | Return all app data for authenticated user | IsAuthenticated | None | `success`, `data`, `habits`, `rules`, `planner`, `goals`, `quotes`, `achievements`, `userProfile` | JournalEntry, Habit, ScoringRule, DailyHabitScore, QuoteSource, PlannerBlock, PlannerLink, PlannerSettings, Goal, Achievement, User |

---

### Journal Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/journal/` | List all journal entries for user | IsAuthenticated | None | `success`, list of entries | JournalEntry |
| POST | `/api/journal/` | Create or update journal entry (idempotent by date) | IsAuthenticated | `date`, `content` | `success`, entry data | JournalEntry |
| GET | `/api/journal/<str:date>/` | Get journal entry for specific date | IsAuthenticated | None | `success`, entry data or empty `{date, content}` | JournalEntry |
| PUT | `/api/journal/<str:date>/` | Update journal entry for specific date | IsAuthenticated | `date`, `content` | `success`, entry data | JournalEntry |
| DELETE | `/api/journal/<str:date>/` | Delete journal entry for specific date | IsAuthenticated | None | 204 No Content | JournalEntry |

---

### Quote Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/quotes/sources/` | List all quote sources (optionally include quotes) | IsAuthenticated | Query: `type` (filter), `include_quotes` (bool) | `success`, `count`, `sources` | QuoteSource |
| POST | `/api/quotes/sources/` | Create new quote source | IsAuthenticated | `id`, `title`, `type`, `cover_image` | `success`, `source` | QuoteSource |
| GET | `/api/quotes/sources/<str:source_id>/` | Get specific source with quotes | IsAuthenticated | None | `success`, `source` | QuoteSource, Quote |
| PUT | `/api/quotes/sources/<str:source_id>/` | Update quote source | IsAuthenticated | `title`, `type`, `cover_image` | `success`, `source` | QuoteSource |
| DELETE | `/api/quotes/sources/<str:source_id>/` | Delete source and all quotes | IsAuthenticated | None | `success`, `message` | QuoteSource, Quote |
| GET | `/api/quotes/search/` | Fuzzy search across sources, quotes, authors, tags | IsAuthenticated | Query: `q` (required, min 2 chars), `limit` | `success`, `query`, `count`, `results` | QuoteSource, Quote, QuoteTag |
| GET | `/api/quotes/tags/` | Get all unique tags for user's quotes | IsAuthenticated | None | `success`, `count`, `tags` | QuoteTag |
| GET | `/api/quotes/sources/<str:source_id>/quotes/` | List quotes for a source | IsAuthenticated | Query: `tag` (filter) | `success`, `count`, `quotes` | Quote |
| POST | `/api/quotes/sources/<str:source_id>/quotes/` | Create quote for source | IsAuthenticated | `text`, `author`, `tags`, `image` | `success`, `quote` | Quote |
| GET | `/api/quotes/<str:quote_id>/` | Get specific quote | IsAuthenticated | None | `success`, `quote` | Quote |
| PUT | `/api/quotes/<str:quote_id>/` | Update quote | IsAuthenticated | `text`, `author`, `tags`, `image` | `success`, `quote` | Quote |
| DELETE | `/api/quotes/<str:quote_id>/` | Delete quote | IsAuthenticated | None | `success`, `message` | Quote |

---

### Achievement Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/achievements/` | List all achievements for user | IsAuthenticated | None | `success`, list of achievements | Achievement |
| POST | `/api/achievements/` | Create new achievement | IsAuthenticated | `title`, `description`, `date`, `image` | `success`, achievement data | Achievement |
| GET | `/api/achievements/<int:id>/` | Get specific achievement | IsAuthenticated | None | `success`, achievement data | Achievement |
| PUT/PATCH | `/api/achievements/<int:id>/` | Update achievement | IsAuthenticated | `title`, `description`, `date`, `image` | `success`, achievement data | Achievement |
| DELETE | `/api/achievements/<int:id>/` | Delete achievement | IsAuthenticated | None | 204 No Content | Achievement |

---

### Expense Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/expenses/` | List expenses with optional filters | IsAuthenticated | Query: `year`, `month`, `category`, `start_date`, `end_date` | `success`, `count`, `total_amount`, `category_breakdown`, `expenses` | Expense |
| POST | `/api/expenses/` | Create new expense | IsAuthenticated | `date`, `item`, `category`, `quantity`, `price` | `success`, expense data | Expense |
| GET | `/api/expenses/summary/` | Get expense summary statistics | IsAuthenticated | Query: `year`, `month`, `start_date`, `end_date` | `success`, `summary` | Expense |
| GET | `/api/expenses/categories/` | Get categories with totals | IsAuthenticated | Query: `year`, `month` | `success`, `count`, `categories` | Expense |
| GET | `/api/expenses/analytics/` | Get detailed monthly analytics | IsAuthenticated | Query: `year`, `month` | `success`, `analytics` (daily_breakdown, category_breakdown, etc.) | Expense |
| GET | `/api/expenses/monthly-stats/` | Get monthly stats for entire year | IsAuthenticated | Query: `year` | `success`, `year`, `total_amount`, `monthly_stats` | Expense |
| GET | `/api/expenses/top-items/` | Get top expenses by amount | IsAuthenticated | Query: `limit`, `year`, `month` | `success`, `count`, `top_expenses` | Expense |
| GET | `/api/expenses/<int:id>/` | Get specific expense | IsAuthenticated | None | `success`, `expense` | Expense |
| PUT/PATCH | `/api/expenses/<int:id>/` | Update expense | IsAuthenticated | `date`, `item`, `category`, `quantity`, `price` | `success`, `message`, `expense` | Expense |
| DELETE | `/api/expenses/<int:id>/` | Delete expense | IsAuthenticated | None | `success`, `message` | Expense |

---

### Goal Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/goals/` | List goals with optional filters | IsAuthenticated | Query: `category`, `status` | `success`, `count`, `goals` | Goal |
| POST | `/api/goals/` | Create new goal | IsAuthenticated | `text`, `category`, `tags`, `target`, `completed_tasks`, `description`, `start_date`, `due_date`, `priority`, `frequency`, `reminders`, `completion_criteria`, `notes` | `success`, goal data | Goal |
| GET | `/api/goals/<int:id>/` | Get specific goal | IsAuthenticated | None | `success`, goal data | Goal |
| PUT/PATCH | `/api/goals/<int:id>/` | Update goal | IsAuthenticated | Any goal fields | `success`, `message`, `goal` | Goal |
| DELETE | `/api/goals/<int:id>/` | Delete goal | IsAuthenticated | None | `success`, `message` | Goal |

---

### Planner Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/planner/` | Get all planner data (blocks, links, transform) | IsAuthenticated | None | `success`, `planner` | PlannerBlock, PlannerTask, PlannerLink, PlannerSettings |
| PUT | `/api/planner/` | Replace all planner data | IsAuthenticated | `blocks`, `links`, `transform` | `success`, `message` | PlannerBlock, PlannerTask, PlannerLink, PlannerSettings |
| PATCH | `/api/planner/` | Partially update planner data | IsAuthenticated | `blocks`, `links`, `transform` | `success`, `message` | PlannerBlock, PlannerTask, PlannerLink, PlannerSettings |
| GET | `/api/planner/blocks/<str:block_id>/` | Get specific block with tasks | IsAuthenticated | None | `success`, `block` | PlannerBlock, PlannerTask |
| PUT | `/api/planner/blocks/<str:block_id>/` | Update specific block and tasks | IsAuthenticated | `title`, `x`, `y`, `tasks` | `success`, `message` | PlannerBlock, PlannerTask |
| DELETE | `/api/planner/blocks/<str:block_id>/` | Delete block and associated links | IsAuthenticated | None | `success`, `message` | PlannerBlock, PlannerLink, PlannerTask |

---

### Points / Habits Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/points/habits/` | List all habits | IsAuthenticated | None | `success`, list of habits | Habit |
| POST | `/api/points/habits/` | Create new habit | IsAuthenticated | `name`, `target`, `range_max` | `success`, habit data | Habit |
| GET | `/api/points/habits/<str:id>/` | Get specific habit | IsAuthenticated | None | `success`, habit data | Habit |
| PUT/PATCH | `/api/points/habits/<str:id>/` | Update habit | IsAuthenticated | `name`, `target`, `range_max` | `success`, habit data | Habit |
| DELETE | `/api/points/habits/<str:id>/` | Delete habit | IsAuthenticated | None | 204 No Content | Habit |
| GET | `/api/points/rules/` | List all scoring rules | IsAuthenticated | None | `success`, list of rules | ScoringRule |
| POST | `/api/points/rules/` | Create new scoring rule | IsAuthenticated | `activity`, `max_points`, `penalty_rule`, `zero_points_condition`, `scoring_logic` | `success`, rule data | ScoringRule |
| GET | `/api/points/rules/<str:id>/` | Get specific scoring rule | IsAuthenticated | None | `success`, rule data | ScoringRule |
| PUT/PATCH | `/api/points/rules/<str:id>/` | Update scoring rule | IsAuthenticated | Any rule fields | `success`, rule data | ScoringRule |
| DELETE | `/api/points/rules/<str:id>/` | Delete scoring rule | IsAuthenticated | None | 204 No Content | ScoringRule |
| GET | `/api/points/scores/` | Get scores for date range | IsAuthenticated | Query: `start_date`, `end_date` | `success`, list of scores | DailyHabitScore |
| POST | `/api/points/scores/` | Update score for habit on date | IsAuthenticated | `date`, `habit_id`, `score` | `success`, score data | DailyHabitScore |
| GET | `/api/points/data/` | Get all points data (habits, rules, daily scores) | IsAuthenticated | None | `success`, `habits`, `rules`, `dailyData` | Habit, ScoringRule, DailyHabitScore |
| GET | `/api/points/analytics/streaks/` | Get current and best streaks per habit | IsAuthenticated | None | `success`, `streaks` | Habit, DailyHabitScore |
| GET | `/api/points/analytics/today-distribution/` | Get distribution of scores for today | IsAuthenticated | None | `success`, `date`, `total`, `habits` | Habit, DailyHabitScore |
| GET | `/api/points/analytics/habit-performance/7/` | Get last 7 days performance per habit | IsAuthenticated | Query: `habit_id` (optional) | `success`, `start_date`, `end_date`, `data` | Habit, DailyHabitScore |
| GET | `/api/points/analytics/habit-trend/30/` | Get 30-day trend for habit(s) | IsAuthenticated | Query: `habit_id`, `start_date`, `end_date`, `min_score` | `success`, `start_date`, `end_date`, `data` | Habit, DailyHabitScore |

---

### User Profile Route

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model |
|--------|-------|---------|------|----------------------|----------|---------------|
| GET | `/api/user/profile/` | Get current user profile | IsAuthenticated | None | `success`, profile data | UserProfile |
| PUT/PATCH | `/api/user/profile/` | Update user profile | IsAuthenticated | `bio`, `avatar_url`, `date_of_birth`, `location`, `website`, `timezone` | `success`, profile data | UserProfile |

---

### Export / Import Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model / Service |
|--------|-------|---------|------|----------------------|----------|------------------------|
| GET | `/api/export/<str:format_type>/` | Export user data as JSON, CSV (zip), or PDF | IsAuthenticated | Path: `format_type` = `json`, `csv`, or `pdf` | File download | JournalEntry, Habit, DailyHabitScore, Expense, Goal, QuoteSource, Quote |
| POST | `/api/import/<str:format_type>/` | Import data from JSON or CSV (zip) | IsAuthenticated | Path: `format_type` = `json` or `csv`; multipart `file` | `success`, `message`, `results` | JournalEntry, Expense, Goal, Habit, DailyHabitScore |

---

### Analytics Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model / Service |
|--------|-------|---------|------|----------------------|----------|------------------------|
| GET | `/api/analytics/<str:period>/` | Get monthly or yearly analytics summary | IsAuthenticated | Path: `period` = `monthly` or `yearly` | `success`, `period`, and aggregated data | JournalEntry, Expense, Goal, DailyHabitScore |

---

### Dev / Populate Routes

| Method | Route | Purpose | Auth | Request Body / Params | Response | Related Model / Service |
|--------|-------|---------|------|----------------------|----------|------------------------|
| GET/POST | `/api/populate-data/` | Populate database with dummy data for development | None | None (GET) or None (POST) | `success`, `message`, `stats` | Habit, ScoringRule, DailyHabitScore, JournalEntry, QuoteSource, Quote, QuoteTag, Achievement, Expense, Goal |
| POST | `/api/temp-data/` | Insert 12 months of temporary mock data | None | None | `success`, `message`, `timestamp`, `data` | Expense, Goal, JournalEntry, Habit, DailyHabitScore, Achievement |

---

## Step 8 — Backend Services / Agents

### Services

The backend does not implement a dedicated service layer. Business logic is contained directly within Django views (`tracker/views.py`). The frontend, however, uses API service modules under `frontend/src/services/`:

| Service File | Purpose |
|--------------|---------|
| `achievementService.ts` | CRUD operations for achievements |
| `dashboardService.ts` | Aggregates dashboard data from points API; fetches streaks, today distribution, 7-day performance, 30-day trend |
| `expenseService.ts` | CRUD and analytics for expenses |
| `exportService.ts` | Data export utilities |
| `geminiService.ts` | AI-powered daily reflection via Google GenAI |
| `goalService.ts` | CRUD operations for goals |
| `plannerService.ts` | CRUD for planner blocks, tasks, links, settings |
| `pointsService.ts` | CRUD for habits, scoring rules, daily scores; fetches points data |
| `profileService.ts` | User profile CRUD |
| `quoteService.ts` | CRUD for quote sources and quotes; fuzzy search |

### AI / Chat Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `getAIPoweredSummary` | `frontend/src/services/geminiService.ts` | Generates a motivational daily reflection using Google GenAI (`gemini-2.5-flash`). Sends yesterday's habit scores, journal entry, and monthly target analysis to the model. |

### External Integrations

| Integration | Direction | Details |
|-------------|-----------|---------|
| Google GenAI (Gemini) | Frontend → External API | Used only in `geminiService.ts` to generate AI reflections. Requires `process.env.API_KEY`. |
| None (Backend) | — | The backend has no external API integrations, webhooks, or third-party service calls. |

### Agents / Tools / ML / Background Processing

- **Agents**: None implemented.
- **Tools**: None implemented (beyond standard Django REST Framework utilities).
- **ML components**: None implemented.
- **Background processing**: None implemented (no Celery, Redis, Channels, or cron schedulers found).
- **WebSockets / Real-time**: None implemented.



---

## Step 6 — Model Relationships

### Relationship Summary

| Relationship Type | Models | Details |
|-------------------|--------|---------|
| One-to-one | User ↔ UserProfile | `UserProfile.user` is OneToOneField to User. |
| One-to-one | User ↔ PlannerSettings | `PlannerSettings.user` is OneToOneField to User. |
| One-to-many | User → JournalEntry | `JournalEntry.user` ForeignKey to User. |
| One-to-many | User → QuoteSource | `QuoteSource.user` ForeignKey to User. |
| One-to-many | User → Achievement | `Achievement.user` ForeignKey to User. |
| One-to-many | User → Expense | `Expense.user` ForeignKey to User. |
| One-to-many | User → Goal | `Goal.user` ForeignKey to User. |
| One-to-many | User → PlannerBlock | `PlannerBlock.user` ForeignKey to User. |
| One-to-many | User → PlannerLink | `PlannerLink.user` ForeignKey to User. |
| One-to-many | User → Habit | `Habit.user` ForeignKey to User. |
| One-to-many | User → ScoringRule | `ScoringRule.user` ForeignKey to User. |
| One-to-many | User → DailyHabitScore | `DailyHabitScore.user` ForeignKey to User. |
| One-to-many | QuoteSource → Quote | `Quote.source` ForeignKey to QuoteSource. |
| One-to-many | Quote → QuoteTag | `QuoteTag.quote` ForeignKey to Quote. |
| One-to-many | Habit → DailyHabitScore | `DailyHabitScore.habit` ForeignKey to Habit. |
| One-to-many | PlannerBlock → PlannerTask | `PlannerTask.block` ForeignKey to PlannerBlock. |
| One-to-many | PlannerBlock → PlannerLink (outgoing) | `PlannerLink.from_block` ForeignKey to PlannerBlock. |
| One-to-many | PlannerBlock → PlannerLink (incoming) | `PlannerLink.to_block` ForeignKey to PlannerBlock. |

### Many-to-Many (Simulated)
- **Quote ↔ Tag**: Implemented via `QuoteTag` intermediate model (not Django's built-in ManyToManyField). Each `QuoteTag` links one `Quote` to one tag string. This allows multiple tags per quote and efficient tag indexing.

### Mermaid ER Diagram

```mermaid
erDiagram
    User ||--o| UserProfile : "has profile"
    User ||--o| PlannerSettings : "has settings"
    User ||--o{ JournalEntry : "writes"
    User ||--o{ QuoteSource : "owns"
    User ||--o{ Achievement : "earns"
    User ||--o{ Expense : "records"
    User ||--o{ Goal : "creates"
    User ||--o{ PlannerBlock : "owns"
    User ||--o{ PlannerLink : "owns"
    User ||--o{ Habit : "tracks"
    User ||--o{ ScoringRule : "defines"
    User ||--o{ DailyHabitScore : "scores"

    QuoteSource ||--o{ Quote : "contains"
    Quote ||--o{ QuoteTag : "tagged with"
    Habit ||--o{ DailyHabitScore : "scored daily"
    PlannerBlock ||--o{ PlannerTask : "contains"
    PlannerBlock ||--o{ PlannerLink : "from"
    PlannerBlock ||--o{ PlannerLink : "to"
    ```

---

## Step 9 — Final Verification

### Verification Summary
- **Missing pages**: N/A (backend models/routes only).
- **Missing backend models**: None. All 15 Django models (including built-in User) are documented.
- **Model relationships**: All one-to-one, one-to-many, and simulated many-to-many relationships are documented with an accurate Mermaid ER diagram.
- **Missing backend routes**: None. All routes from `tracker/urls.py` and `authentication/urls.py` are documented.
- **Services/agents accurately represented**: Frontend services listed accurately. No backend service layer, agents, tools, ML components, or background processing exist beyond standard Django REST Framework views.
- **No hypothetical features added**: Only implemented code is documented.
- **No Git commits/tags/releases created**: No Git history was modified.

### Route Count Verification
- Authentication: 4 routes
- Tracker app: 38 routes
- Total documented: 42 routes
- Total in code: 42 routes (verified against `urls.py` files)

### Model Count Verification
- Total models in code: 15 (verified via grep for `class.*models.Model`)
- Total documented: 15

