# Mock Data for Tracker Application

This folder contains sample data files for development and testing purposes of the Tracker Application backend.

## Files Overview

### `sample_expenses.json`
Contains sample expense records with various categories:
- Food, Transport, Entertainment, Shopping, Healthcare, Education
- Different price ranges and quantities
- Realistic expense scenarios

### `sample_goals.json`
Contains sample goals across different categories:
- **Daily goals**: Exercise, reading, meditation
- **Monthly goals**: Course completion, savings targets
- **Future goals**: Learning new skills, major life goals
- Various statuses: active, completed, blocked
- Tags for better organization

### `sample_habits.json`
Contains sample habits and scoring rules:
- Common health and productivity habits
- Target values and maximum ranges
- Scoring rules with penalty conditions
- Point allocation systems

### `sample_quotes.json`
Contains sample quotes and quote sources:
- Movies, Books, Web Series
- Multiple quotes per source
- Tags for categorization
- Author information

### `sample_planner_data.json`
Contains sample planner canvas data:
- Multiple blocks with tasks
- Block connections/links
- Canvas transform settings
- Task completion states

## Usage

### For Development
Use these files as reference data structures when:
- Building frontend components
- Testing API endpoints
- Creating UI mockups
- Writing integration tests

### For Testing
Load this data using the `/api/populate-data/` endpoint or manually create records based on these structures.

### Data Structure Notes

#### IDs
- Quote sources and quotes use string IDs
- Habits use UUID strings
- Planner blocks and tasks use UUID strings

#### Dates
- All dates are in ISO format: `YYYY-MM-DD`
- Current date used in most examples: `2025-12-21`

#### Categories
- **Expense Categories**: Food, Transport, Entertainment, Shopping, Healthcare, Education, Utilities
- **Goal Categories**: daily, monthly, future
- **Goal Statuses**: active, completed, blocked, trashed
- **Source Types**: Movie, Web Series, Book

#### Tags
- Used for categorization and filtering
- Stored as arrays of strings
- Helpful for search functionality

## Integration with Backend

The mock data follows the same structure as the Django models:

- **Expense** → `Expense` model
- **Goals** → `Goal` model  
- **Habits** → `Habit` and `ScoringRule` models
- **Quotes** → `QuoteSource` and `Quote` models
- **Planner** → `PlannerBlock`, `PlannerTask`, `PlannerLink` models

## Temporary Data API

Use the `/api/temp-data/` endpoint to insert temporary data with current timestamps. This is useful for:
- Testing with current date context
- Populating fresh data for demos
- Creating test scenarios

```bash
curl -X POST http://localhost:8000/api/temp-data/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Notes

- All monetary values are in USD
- Coordinates in planner data are pixel-based
- Task order determines display sequence
- Scoring rules implement gamification logic
