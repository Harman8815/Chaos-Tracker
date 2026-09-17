# v2.0.0 Release Notes

## Overview
Major release transitioning from v1.5.0 with significant UI refactoring, new AI/intelligence features, finance tracking, real-time capabilities, and infrastructure improvements.

## Comparing: [v1.5.0](https://github.com/Harman8815/Chaos-Tracker/compare/v1.5.0...v2.0.0) → [v2.0.0](https://github.com/Harman8815/Chaos-Tracker/compare/v1.5.0...v2.0.0)

## Highlights

### CustomSelect Component (UI Migration)
- New `CustomSelect` component replacing all native `<select>` elements
- Migrated in: SettingsModal, GoalTracker, ExpenseTracker, Achievements, JournalTracker, QuoteCollector, CreateGoalModal
- Added to `ui/index.ts` exports and DropdownMenu updates

### AI & Intelligence
- AI streaming service and offline sync service
- AI assistant API views, serializers, and tool system
- Structured JSON logging with request ID tracking
- Sanitization, AI security, query optimization, migration safety modules

### Finance Tracking
- Income, Account, RecurringExpense, Transfer, Subscription, BudgetAlert, Budgets models
- Full API endpoints and domain services
- Frontend types and service layer

### Real-Time Features
- Server-Sent Events for real-time dashboard updates
- RealtimeProvider, CommandPalette, keyboard shortcuts integration
- Online status indicator

### Backend Improvements
- Namespaced v1 API versioning
- Enhanced analytics service methods
- Database backup/restore management commands
- createadmin command for demo admin provisioning
- Structured logging improvements

### Frontend Improvements
- PieChart responsiveness and tooltip styling refactor
- Dashboard layout adjustments
- CreateGoalModal two-column form restructure
- Hooks: dashboard layout, global search, keyboard shortcuts, online status
- Theme tokens, events, offline queue, search, shortcuts utilities

### Testing & CI
- CI workflow with deployment/ML docs
- Unit tests for various services
- Domain and v1 regression coverage
- flake8, black, autopep8 code formatting

---

## Installation / Upgrade

```bash
git pull origin main
git checkout v2.0.0
```

## Tags
- **Previous:** v1.5.0
- **Current:** v2.0.0
