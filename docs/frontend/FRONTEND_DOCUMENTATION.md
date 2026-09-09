# Frontend Documentation

## Step 1 — Frontend Page Inventory

### Pages

| Page Name | Route / Path | Short Purpose | Main Sections / Components |
|-----------|-------------|---------------|---------------------------|
| Home | `/` | Landing page for Chaos Tracker | `HomePage` |
| Dashboard | `/dashboard` | Main dashboard view | `Dashboard` |
| Profile | `/profile` | User profile page | `ProfilePage` |
| Edit Profile | `/edit-profile` | Edit user profile information | `EditProfilePage` |
| Achievements | `/achievements` | View user achievements | `Achievements` |
| Habits | `/habits` | Track daily habits | `HabitTracker` |
| Goals | `/goals` | Track goals | `GoalTracker` |
| Expense | `/expense` | Track expenses | `ExpenseTracker` |
| Journal | `/journal` | Journal entries | `JournalTracker` |
| Mood | `/mood` | Track mood | `MoodTracker` |
| Planner | `/planner` | Planner / scheduling | `Planner` |
| Points | `/points` | Track points | `PointsTracker` |
| Quotes | `/quotes` | Quote collection | `QuoteCollector` |
| Water | `/water` | Track water intake | `WaterTracker` |

### Notes
- The application uses Next.js App Router.
- Most tracker pages are wrapped in a `glass` styled container with `overflow-y-auto` and `p-6` padding.
- The root layout provides a global `Sidebar` and `Providers` wrapper.
- Route group `(app)` is used to share the app layout without affecting the URL.

---

## Step 2 — Frontend Page Details

### Home (`/`)
- **Purpose**: Landing page with animated background and welcome message.
- **Main UI**:
  - Vanta clouds animated background (Three.js).
  - Centered welcome heading and subtitle text.
  - No forms, tables, charts, or interactive controls visible on this page.

---

### Dashboard (`/dashboard`)
- **Purpose**: Main analytics dashboard with multiple visualizations and stats.
- **Charts**:
  - `MultiLineTrendChart`: Habit trends over 30 days.
  - `RadarChart`: Habit performance over last 7 days.
  - `PieChart`: Today's distribution of habit scores.
  - `PieChart` (donut): Monthly target progress (Completed vs Remaining).
  - `StreakBarChart`: Current streaks per habit.
  - `MonthlyAverageTable`: Monthly daily average per habit.
  - `WeeklyPerformanceChart`: Average score by day of week.
- **Cards / Sections**:
  - `StreakHighlight`: Top streaks display.
  - Habit Trends card with `CustomSelect` dropdown (All Habits / Avg Daily Score / per habit).
  - Habit Performance (7 Days) card with radar chart.
  - Today's Distribution card with pie chart.
  - Habit Streaks card with bar chart and `StreakStats`.
  - Monthly Daily Average card with table.
  - Weekly Performance card with bar chart and best-day highlight.
  - Tracker Rank card: level, XP progress bar, lifetime XP, days active.
  - AI Daily Reflection card: markdown summary with Regenerate button.
  - Monthly Target card: donut chart and current time display.
- **Controls**:
  - `CustomSelect` for trend filtering.
  - Button to regenerate AI reflection.
- **No tables/forms/modals** besides embedded chart components.

---

### Profile (`/profile`)
- **Purpose**: Display user profile, stats, and activity history.
- **Cards / Sections**:
  - Profile Card: avatar, name, rank, bio, edit button, location, GitHub/LinkedIn links.
  - Community Stats card: views, solutions, reputation.
  - Skills card: skill tags.
  - `CircleStats`: Habit consistency donut (Perfect / Good / Fair segments) with legend.
  - `BadgesSection`: Recent badges grid.
  - `Heatmap`: Submission calendar (yearly GitHub-style heatmap) with month labels and legend.
  - Recent Activity list: last 5 active dates with habit counts, scores, and journal snippet.
- **Buttons**:
  - Edit Profile button navigates to `/edit-profile`.
- **No charts beyond custom SVG heatmap and circle donut**.

---

### Edit Profile (`/edit-profile`)
- **Purpose**: Edit user profile details.
- **Forms / Inputs**:
  - Profile Picture section: avatar URL input with live preview.
  - Basic Information: website input.
  - Personal Information: name input, email input (disabled), location input, bio textarea.
- **Buttons**:
  - Cancel, Save Changes.
- **Feedback**:
  - Error message banner (red).
  - Success message banner (green).
- **No tables, charts, or modals**.

---

### Achievements (`/achievements`)
- **Purpose**: Manage and view achievements.
- **Cards / Sections**:
  - Control Card: view toggle (timeline/grid), New Achievement button, Login button, sort dropdown, tag filter buttons.
  - Scrollable content area for timeline or grid view.
- **Modals**:
  - `AchievementModal`: create/edit/delete achievement.
  - `GalleryModal`: image gallery viewer.
  - Login Dialog: username/password form.
- **Filters / Controls**:
  - View toggle buttons (Timeline / Grid).
  - Sort by Date dropdown (`asc` / `desc`).
  - Tag filter buttons with Clear option.
- **No charts or tables**.

---

### Habits (`/habits`)
- **Purpose**: Track daily habits.
- **Cards**:
  - Single `Card` with `CardHeader`/`CardTitle`: "Today's Habits".
- **Lists**:
  - Habit list items with checkbox toggle, name, and completed styling.
- **Form / Inputs**:
  - New habit text input with Add button (Plus icon).
- **Buttons**:
  - Checkbox toggles per habit.
  - Add habit button.
- **No charts, tables, modals, or filters**.

---

### Goals (`/goals`)
- **Purpose**: Manage goals with categories, statuses, and priorities.
- **Modals**:
  - `CreateGoalModal`: form for creating new goals.
  - `GoalDashboard` overlay: stats cards, pie chart, bar chart, completion rate, insights.
- **Cards / Sections**:
  - Header with Dashboard and Create Goal buttons.
  - Search and Filter Card: search input, category select, show/hide completed toggle.
  - Category tabs (Daily / Monthly / Future).
  - Masonry grid of `CategoryCard` (yellow tint) and `IndividualTaskCard` (blue tint).
- **Goal Cards display**:
  - Title, status badge, category badge, due date, priority indicator, progress bar, completion criteria, task count, block/delete actions.
- **Charts** (in dashboard modal):
  - `PieChart`: goal status breakdown.
  - `BarChart`: weekly completions.
- **Controls**:
  - Search input.
  - Category dropdown.
  - Show/Hide completed toggle button.
  - Tabs for goal type.
- **No tables**.

---

### Expense (`/expense`)
- **Purpose**: Track expenses with analytics.
- **Charts**:
  - `BarChart`: Daily spending for current month.
  - `PieChart`: Category breakdown.
- **Cards**:
  - Charts row card.
  - Main card containing filters, table, and pagination.
- **Table**:
  - Columns: Date, Item, Category, Quantity, Price, Total (computed), Actions.
  - Inline editable cells (inputs inside table).
  - Sortable headers with ascending/descending indicators.
- **Filters / Controls**:
  - Month select dropdown.
  - Year select dropdown.
  - Add Entry button (opens modal).
  - Rows per page select (10/25/50).
  - Prev/Next pagination buttons.
- **Modals**:
  - `AddExpenseModal`: form with date, item, category, quantity, price inputs.
- **No dropdowns beyond selects, no additional charts**.

---

### Journal (`/journal`)
- **Purpose**: Write and review journal entries.
- **Tabs**:
  - Editor / History toggle.
- **Editor Tab**:
  - Two-column layout: Editor card + Preview card.
  - Textarea for markdown input.
  - Formatting buttons: Bold, Italic, H3.
  - Save button.
  - Live markdown preview (`dangerouslySetInnerHTML`).
- **History Tab**:
  - Calendar grid card with month/year selects.
  - Day cells showing entry preview snippets.
  - Click day with entry opens `JournalEntryModal`.
  - Click empty day jumps to editor for that date.
- **Modals**:
  - `JournalEntryModal`: full entry view with Edit button.
- **No charts, tables, or complex filters**.

---

### Mood (`/mood`)
- **Purpose**: Quick daily mood selection.
- **Cards**:
  - Single card with four mood buttons in a grid (Great, Good, Okay, Bad).
- **Buttons**:
  - Mood option buttons with icons (Smile, Meh, Frown, Angry).
  - Selection highlight border/background.
- **Feedback**:
  - Text confirming selected mood.
- **No forms, tables, charts, modals, or filters**.

---

### Planner (`/planner`)
- **Purpose**: Infinite canvas planner with draggable todo blocks and linking.
- **Canvas**:
  - Pannable/zoomable canvas with dot-grid background.
  - Zoom controls (- / + / percentage).
  - Add Block button.
- **Blocks**:
  - Draggable `TodoBlockComponent` cards with editable title.
  - Task list inside each block with checkboxes and delete.
  - Add task input at bottom of block.
  - Link and delete block actions in header.
- **Links**:
  - SVG arrow links between blocks.
- **Controls**:
  - Mouse drag to pan canvas.
  - Scroll wheel to zoom.
  - Click block in linking mode to create link.
- **No tables, charts, forms, modals, or filters**.

---

### Points (`/points`)
- **Purpose**: Track habit points with daily/monthly/yearly views.
- **Charts**:
  - `TrajectoryChart`: SVG line chart of daily totals across the month with dots and tooltips.
- **Cards / Sections**:
  - View toggle (daily/monthly/yearly).
  - Month navigation (< >).
  - Daily view: sticky grid with habits as rows, days as columns, scores as colored cells, totals column, target column, monthly progress bars.
  - Monthly view: progress summary cards + scoring rules table.
  - Yearly view: summary table with progress bars.
- **Tables**:
  - Scoring Rules table (monthly view): Activity, Max Points, Penalty Rule, 0 Points Condition, Scoring Logic.
  - Yearly Summary table: Habit, Total Score, Yearly Target, Progress.
- **Controls**:
  - Edit toggle switch.
  - Manage Habits button.
  - Inline editable target inputs in daily grid.
  - Clickable score cells to cycle scores (when editable).
- **No modals or filters beyond view toggles**.

---

### Quotes (`/quotes`)
- **Purpose**: Search, collect, and manage quotes from sources.
- **Views**:
  - Home search view: large search input, suggestion dropdown, Add Source button, starfield background.
  - Search results view: grid of source cards with cover images.
  - Source detail view: source header with back button, cover image, Add Quote / Edit Source / Delete Source buttons, grouped quotes by tag.
- **Cards**:
  - Source cards in search results grid.
  - Quote cards in source detail (blockquote style).
- **Modals**:
  - `SourceModal`: add/edit source (title, type, cover image).
  - `QuoteModal`: add/edit quote (text, author, tags, image).
- **Filters / Controls**:
  - Search input with debounced suggestions.
  - Tag-based grouping in source detail.
  - Highlight text in suggestions.
- **No tables or charts**.

---

### Water (`/water`)
- **Purpose**: Track daily water intake.
- **Cards**:
  - Single card with circular progress indicator.
- **Visualization**:
  - SVG donut/ring showing glasses consumed out of target (8).
  - Center text showing current count.
- **Buttons**:
  - Plus / Minus buttons to adjust glasses.
  - Buttons disable at min (0) and max (8).
- **No forms, tables, charts, modals, or filters**.

---

## Step 3 — Frontend Charts & Visualizations

### Dashboard (`/dashboard`)

#### MultiLineTrendChart
- **Chart type**: Area chart with overlaid line charts (Recharts `AreaChart` + `Area` + `Line`).
- **What it displays**: Habit scores over the last 30 days.
- **Axes**:
  - X-axis: Date (formatted as `Mon DD`).
  - Y-axis: Score (dynamic domain based on max value, padded by 10%).
- **Segments**: One colored area/line per habit.
- **What it communicates**: Daily score trends per habit; allows spotting consistency, gaps, and improvements over a month.
- **Tooltip**: Shows date label and score value for each habit at the hovered point.
- **Filters/controls**: `CustomSelect` dropdown to switch between "All Habits", "Avg Daily Score", or a single habit.

#### RadarChart
- **Chart type**: Radar/spider chart (Recharts `RadarChart`).
- **What it displays**: Average habit performance over the last 7 days.
- **Axes**: Each axis represents one habit name; radial axis represents average score (domain auto-scaled).
- **What it communicates**: Balanced performance across habits; gaps show weaker areas.
- **Tooltip**: Shows axis label and formatted average score.
- **Filters/controls**: None on the chart itself; data is derived from the last 7 days of `data`.

#### PieChart — Today's Distribution
- **Chart type**: Pie chart (Recharts `PieChart`).
- **What it displays**: Distribution of today's habit scores.
- **Segments**: Each slice represents a habit; size = score for today.
- **What it communicates**: How today's effort is distributed across habits.
- **Tooltip**: Shows habit name and score value.
- **Filters/controls**: None; updates automatically with data changes.

#### PieChart — Monthly Target (Donut)
- **Chart type**: Donut chart (Recharts `PieChart` with `innerRadius`).
- **What it displays**: Monthly progress toward total habit target.
- **Segments**: "Completed" (total achieved score this month) vs "Remaining" (target minus achieved).
- **What it communicates**: Overall monthly completion progress.
- **Tooltip**: Shows segment name and value.
- **Filters/controls**: None.

#### StreakBarChart
- **Chart type**: Bar chart (Recharts `BarChart`).
- **What it displays**: Current streak length per habit.
- **Axes**:
  - X-axis: Habit name.
  - Y-axis: Streak count.
- **What it communicates**: Which habits have the longest unbroken streaks.
- **Tooltip**: Shows habit name and streak count.
- **Filters/controls**: "Show More / Show Less" button to expand beyond top 5 habits.

#### MonthlyAverageTable
- **Chart type**: Sortable table (custom component, not Recharts).
- **What it displays**: Average daily score per habit for the current month.
- **Columns**: Habit name, Avg score.
- **What it communicates**: Which habits have the highest monthly average.
- **Tooltip**: None.
- **Filters/controls**: Click column headers to sort by name or average.

#### WeeklyPerformanceChart
- **Chart type**: Bar chart (Recharts `BarChart`).
- **What it displays**: Average total score by day of week (Sun–Sat).
- **Axes**:
  - X-axis: Day abbreviation (Sun, Mon, Tue, etc.).
  - Y-axis: Average score.
- **What it communicates**: Which days of the week are most productive on average.
- **Tooltip**: Shows day and formatted average score.
- **Filters/controls**: None. Best day is highlighted below the chart.

---

### Profile (`/profile`)

#### Heatmap (Submission Calendar)
- **Chart type**: Custom HTML/SVG grid heatmap (GitHub-contribution-style).
- **What it displays**: Daily habit activity intensity over the last ~365 days.
- **Axes**: Weeks (columns) by day-of-week (rows).
- **Segments**: Each cell colored by total daily score (0 = inactive, up to max intensity).
- **What it communicates**: Long-term consistency and active periods.
- **Tooltip**: Browser `title` attribute showing `date: score points`.
- **Filters/controls**: None; auto-generated from the last year of data.

#### CircleStats (Habit Consistency)
- **Chart type**: SVG donut/ring chart (custom circles with `strokeDasharray`).
- **What it displays**: Ratio of perfect / good / fair days.
- **Segments**:
  - Green: Perfect days (>60 points).
  - Yellow: Good days (>30 points).
  - Blue: Fair days (>0 points).
- **What it communicates**: Overall consistency quality of tracked days.
- **Tooltip**: None.
- **Filters/controls**: None.

---

### Goals (`/goals`)

#### GoalDashboard — PieChart
- **Chart type**: Pie chart (Recharts `PieChart`).
- **What it displays**: Goal status breakdown.
- **Segments**: Completed, Active, Blocked, Trashed.
- **What it communicates**: Distribution of goal statuses.
- **Tooltip**: Shows status name and count.
- **Filters/controls**: None; reflects current filtered goals in dashboard.

#### GoalDashboard — BarChart
- **Chart type**: Bar chart (Recharts `BarChart`).
- **What it displays**: Weekly goal completions (last 5 weeks).
- **Axes**:
  - X-axis: Week label (`M/D` format).
  - Y-axis: Number of completed goals.
- **What it communicates**: Completion velocity over recent weeks.
- **Tooltip**: Shows week and count.
- **Filters/controls**: None.

---

### Expense (`/expense`)

#### BarChart — Daily Spending
- **Chart type**: Bar chart (Recharts `BarChart`).
- **What it displays**: Daily spending totals for the selected month.
- **Axes**:
  - X-axis: Day of month (1–28/29/30/31).
  - Y-axis: Total spending amount.
- **What it communicates**: Spending distribution across the month; today's bar is highlighted.
- **Tooltip**: Shows day and formatted spending value.
- **Filters/controls**: Month and year dropdowns affect the data; today's date is auto-highlighted.

#### PieChart — Category Breakdown
- **Chart type**: Pie chart (Recharts `PieChart`).
- **What it displays**: Spending breakdown by category.
- **Segments**: Each slice represents an expense category.
- **What it communicates**: Which categories consume the most budget.
- **Tooltip**: Shows category name and value.
- **Filters/controls**: Month and year dropdowns affect the underlying data.

---

### Points (`/points`)

#### TrajectoryChart
- **Chart type**: SVG line chart (custom component, not Recharts).
- **What it displays**: Daily total points trajectory across the current month.
- **Axes**:
  - X-axis: Day of month (1–28/29/30/31).
  - Y-axis: Total points earned that day.
- **What it communicates**: Points momentum and consistency throughout the month.
- **Tooltip**: SVG `<title>` element on each dot showing `Day N: value`.
- **Filters/controls**: Month navigation (< >) changes the displayed month.

---

### Water (`/water`)

#### Water Intake Indicator
- **Chart type**: SVG donut/ring (custom circles with `strokeDasharray`).
- **What it displays**: Progress toward daily water goal.
- **Segments**: Single ring segment representing glasses consumed out of target (8).
- **What it communicates**: How close the user is to reaching their water goal.
- **Tooltip**: None.
- **Filters/controls**: Plus/Minus buttons adjust the count; ring updates instantly.

---

## Step 4 — Frontend Verification

### Verification Summary
- **Missing pages**: None. All 14 `page.tsx` files under `frontend/src/app/(app)/` are documented.
- **Missing charts**: None. All chart/visualization components used by documented pages are included.
- **Incorrect descriptions**: None found. Descriptions match actual source code behavior.
- **Duplicate pages**: None.
- **Components incorrectly described as pages**: None.
- **Planned features accidentally documented as implemented**: None.
- **Unused components not documented as pages**: `YearlySummaryView.tsx` exists in `frontend/src/components/` but is not imported by any route and has no corresponding `page.tsx`; it is correctly excluded from the page inventory.

### Notes
- The `test-sidebar/` directory under `frontend/src/app/` is empty and contains no routes.
- All documented pages use the `(app)` route group and share the root layout with `Sidebar` and `Providers`.

---

## Step 9 — Final Verification

### Verification Summary
- **Missing pages**: None. All 14 `page.tsx` files under `frontend/src/app/(app)/` are documented.
- **Missing charts**: None. All chart/visualization components used by documented pages are included.
- **Incorrect descriptions**: None found. Descriptions match actual source code behavior.
- **Duplicate pages**: None.
- **Components incorrectly described as pages**: None.
- **Planned features accidentally documented as implemented**: None.
- **Unused components not documented as pages**: `YearlySummaryView.tsx` exists in `frontend/src/components/` but is not imported by any route and has no corresponding `page.tsx`; it is correctly excluded from the page inventory.

### Chart Completeness Check
- Dashboard: `MultiLineTrendChart`, `RadarChart`, `PieChart` (today), `PieChart` (donut), `StreakBarChart`, `MonthlyAverageTable`, `WeeklyPerformanceChart` — all documented.
- Profile: `Heatmap`, `CircleStats` — documented.
- Goals: `PieChart`, `BarChart` (in `GoalDashboard`) — documented.
- Expense: `BarChart`, `PieChart` — documented.
- Points: `TrajectoryChart` — documented.
- Water: SVG donut ring — documented.

### Notes
- The `test-sidebar/` directory under `frontend/src/app/` is empty and contains no routes.
- All documented pages use the `(app)` route group and share the root layout with `Sidebar` and `Providers`.

---
