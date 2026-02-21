# Tracker Application - API Documentation

## Overview

This Django REST Framework backend provides comprehensive APIs for managing personal tracking data including expenses, goals, planner blocks, quotes, achievements, habits, and journal entries.

## Base URL

All API endpoints are prefixed with: `http://localhost:8000/api/`

## Authentication

The application uses session-based authentication. All endpoints (except signup/login) require authentication.

### Authentication Endpoints

#### POST /api/auth/signup/
Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login/
Authenticate user and create session.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/logout/
End user session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me/
Get current authenticated user information.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "bio": "Software developer",
      "avatar_url": "",
      "location": "New York",
      "timezone": "UTC"
    }
  }
}
```

---

## Expense Management API

### Base URL: `/api/expenses/`

#### GET /api/expenses/
List all expenses with optional filtering.

**Query Parameters:**
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (0-11, where 0 is January)
- `category` (optional): Filter by category name
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter until date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "count": 45,
  "total_amount": 5234.50,
  "category_breakdown": {
    "Food": 1234.50,
    "Transport": 890.00,
    "Entertainment": 450.00
  },
  "expenses": [
    {
      "id": 1,
      "date": "2025-12-01",
      "item": "Groceries",
      "category": "Food",
      "quantity": 1,
      "price": "150.00",
      "total": "150.00",
      "created_at": "2025-12-01T10:30:00Z",
      "updated_at": "2025-12-01T10:30:00Z"
    }
  ]
}
```

#### POST /api/expenses/
Create a new expense.

**Request Body:**
```json
{
  "date": "2025-12-02",
  "item": "Coffee",
  "category": "Food",
  "quantity": 2,
  "price": 5.50
}
```

#### GET /api/expenses/<id>/
Retrieve a specific expense.

#### PUT/PATCH /api/expenses/<id>/
Update an expense.

#### DELETE /api/expenses/<id>/
Delete an expense.

### Analytics Endpoints

#### GET /api/expenses/summary/
Get comprehensive summary statistics.

#### GET /api/expenses/categories/
Get category breakdown with counts and totals.

#### GET /api/expenses/analytics/
Get detailed monthly analytics for charts.

#### GET /api/expenses/monthly-stats/
Get yearly monthly statistics.

#### GET /api/expenses/top-items/
Get top expenses by amount.

---

## Goals Management API

### Base URL: `/api/goals/`

#### GET /api/goals/
List all goals with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (`daily`, `monthly`, `future`)
- `status` (optional): Filter by status (`active`, `completed`, `blocked`, `trashed`)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "goals": [
    {
      "id": 1,
      "text": "Drink 8 glasses of water",
      "category": "daily",
      "status": "active",
      "tags": ["health"],
      "created_at": "2025-12-01T10:30:00Z",
      "updated_at": "2025-12-01T10:30:00Z",
      "completed_at": null
    }
  ]
}
```

#### POST /api/goals/
Create a new goal.

**Request Body:**
```json
{
  "text": "Read 30 minutes",
  "category": "daily",
  "tags": ["learning", "personal"]
}
```

#### GET /api/goals/<id>/
Retrieve a specific goal.

#### PUT/PATCH /api/goals/<id>/
Update a goal.

#### DELETE /api/goals/<id>/
Delete a goal.

---

## Planner API

### Base URL: `/api/planner/`

#### GET /api/planner/
Get all planner data for the authenticated user.

**Response:**
```json
{
  "success": true,
  "planner": {
    "blocks": [
      {
        "id": "block-uuid-1",
        "title": "Sprint Planning",
        "x": 100,
        "y": 150,
        "tasks": [
          {
            "id": "task-uuid-1",
            "text": "Review backlog",
            "completed": false,
            "order": 0
          }
        ]
      }
    ],
    "links": [
      {
        "id": "link-uuid-1",
        "from": "block-uuid-1",
        "to": "block-uuid-2"
      }
    ],
    "transform": {
      "scale": 1,
      "panX": 0,
      "panY": 0
    }
  }
}
```

#### PUT /api/planner/
Replace all planner data.

#### PATCH /api/planner/
Partially update planner data.

#### GET /api/planner/blocks/<block_id>/
Get a specific block.

#### PUT /api/planner/blocks/<block_id>/
Update a specific block.

#### DELETE /api/planner/blocks/<block_id>/
Delete a specific block.

---

## Quotes API

### Base URL: `/api/quotes/`

#### GET /api/quotes/
List all quotes with optional filtering.

#### POST /api/quotes/
Create a new quote.

#### GET /api/quotes/sources/
List all quote sources.

#### POST /api/quotes/sources/
Create a new quote source.

#### GET /api/quotes/sources/<source_id>/
Get a specific source with its quotes.

#### PUT/PATCH /api/quotes/sources/<source_id>/
Update a quote source.

#### DELETE /api/quotes/sources/<source_id>/
Delete a quote source.

---

## Achievements API

### Base URL: `/api/achievements/`

#### GET /api/achievements/
List all achievements.

#### POST /api/achievements/
Create a new achievement.

#### GET /api/achievements/<id>/
Get a specific achievement.

#### PUT/PATCH /api/achievements/<id>/
Update an achievement.

#### DELETE /api/achievements/<id>/
Delete an achievement.

---

## Habits API

### Base URL: `/api/habits/`

#### GET /api/habits/
List all habits.

#### POST /api/habits/
Create a new habit.

#### GET /api/habits/<id>/
Get a specific habit.

#### PUT/PATCH /api/habits/<id>/
Update a habit.

#### DELETE /api/habits/<id>/
Delete a habit.

#### GET /api/habits/scores/
Get habit scores for a date range.

#### POST /api/habits/scores/
Record habit scores.

---

## Journal API

### Base URL: `/api/journal/`

#### GET /api/journal/
List all journal entries.

#### POST /api/journal/
Create a new journal entry.

#### GET /api/journal/<date>/
Get journal entry for a specific date.

#### PUT/PATCH /api/journal/<date>/
Update journal entry for a specific date.

#### DELETE /api/journal/<date>/
Delete journal entry for a specific date.

---

## Development & Testing

### Temporary Data API

#### POST /api/temp-data/
Insert comprehensive historical data for the past 12 months.

**Response:**
```json
{
  "success": true,
  "message": "12 months of historical data inserted successfully",
  "timestamp": "2025-12-21T10:30:00Z",
  "data": {
    "expenses": 120,
    "goals": 42,
    "habits": 5,
    "journal_entries": 24,
    "months_generated": 12,
    "habit_scores_created": 150,
    "achievements_created": 4
  }
}
```

**Data Generated:**
- **Expenses**: 5-15 expenses per month for the past 12 months (60-180 total)
- **Goals**: 2-5 goals per month with various categories and statuses
- **Journal Entries**: 1-3 journal entries per month
- **Habits**: 5 core habits with 30 days of scoring data
- **Achievements**: 4 sample achievements with random dates

**Categories Used:**
- **Expense Categories**: Food, Transport, Entertainment, Shopping, Healthcare, Education, Utilities
- **Goal Categories**: daily, monthly, future
- **Goal Statuses**: active, completed, blocked

### Data Population

#### GET /api/populate-data/
Populate database with sample data for testing.

**Response:**
```json
{
  "success": true,
  "message": "Sample data populated successfully",
  "created": {
    "expenses": 50,
    "goals": 20,
    "habits": 5,
    "achievements": 10
  }
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Data Formats & Conventions

### Date Format
All dates use ISO format: `YYYY-MM-DD`

### DateTime Format
All datetime fields use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

### Currency
All monetary values are stored as Decimal with 2 decimal places and returned as strings.

### UUIDs
All IDs (except user IDs) use UUID strings for primary keys.

### JSON Fields
Tags and other array data are stored as JSON fields in the database.

---

## Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "johndoe", "password": "password123"}'

# Get expenses
curl -X GET http://localhost:8000/api/expenses/ \
  -b cookies.txt

# Create expense
curl -X POST http://localhost:8000/api/expenses/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"date": "2025-12-21", "item": "Test", "category": "Food", "quantity": 1, "price": 10.00}'
```

### Using Postman

1. Import the collection (if provided)
2. Set base URL to `http://localhost:8000/api/`
3. Use the authentication endpoints to get session cookies
4. Include cookies in subsequent requests

---

## Development Setup

### Requirements
- Python 3.8+
- Django 5.2+
- Django REST Framework

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Database
- **Engine**: SQLite 3
- **Location**: `db.sqlite3` (project root)

### Admin Panel
Access at: `http://localhost:8000/admin/`

---

## API Rate Limiting

Currently no rate limiting is implemented. Consider adding for production use.

## CORS

CORS is enabled for `http://localhost:3000` for frontend development.

## Security Notes

- All endpoints require authentication except signup/login
- Session-based authentication with secure cookies
- CSRF protection enabled
- SQL injection protection via Django ORM
- XSS protection via Django templates and serializers
