# Expense API Documentation

## Overview
The Expense API provides a comprehensive, modular set of endpoints for managing and analyzing expenses. Each endpoint serves a specific purpose, following REST principles and providing detailed analytics.

---

## Base URL
All expense endpoints are prefixed with: `/api/expenses/`

---

## 📋 CRUD Operations

### 1. List & Create Expenses
**Endpoint:** `GET /api/expenses/` | `POST /api/expenses/`

#### GET - List Expenses
**Description:** Get all expenses with optional filtering and summary statistics.

**Query Parameters:**
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (0-11, where 0 is January)
- `category` (optional): Filter by category name
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter until date (YYYY-MM-DD)

**Example Request:**
```http
GET /api/expenses/?year=2025&month=11
```

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

#### POST - Create Expense
**Description:** Create a new expense.

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

**Response:**
```json
{
  "success": true,
  "count": 1,
  "total_amount": 11.00,
  "category_breakdown": {
    "Food": 11.00
  },
  "expenses": [...]
}
```

---

### 2. Expense Detail
**Endpoint:** `GET /api/expenses/<id>/` | `PUT /api/expenses/<id>/` | `PATCH /api/expenses/<id>/` | `DELETE /api/expenses/<id>/`

#### GET - Retrieve Expense
**Description:** Get a specific expense by ID.

**Example Request:**
```http
GET /api/expenses/1/
```

**Response:**
```json
{
  "success": true,
  "expense": {
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
}
```

#### PUT/PATCH - Update Expense
**Description:** Update an expense (full or partial update).

**Request Body:**
```json
{
  "price": 175.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "expense": {...}
}
```

#### DELETE - Delete Expense
**Description:** Delete an expense.

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

## 📊 Analytics & Statistics Endpoints

### 3. Expense Summary
**Endpoint:** `GET /api/expenses/summary/`

**Description:** Get comprehensive summary statistics for expenses.

**Query Parameters:**
- `year` (optional): Filter by year
- `month` (optional): Filter by month (0-11)
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter

**Example Request:**
```http
GET /api/expenses/summary/?year=2025&month=11
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_expenses": 45,
    "total_amount": 5234.50,
    "average_per_expense": 116.32,
    "categories_count": 8,
    "unique_categories": ["Food", "Transport", "Entertainment", "Shopping", "Healthcare", "Utilities", "Education", "Other"]
  }
}
```

---

### 4. Expense Categories
**Endpoint:** `GET /api/expenses/categories/`

**Description:** Get all expense categories with count and total for each.

**Query Parameters:**
- `year` (optional): Filter by year
- `month` (optional): Filter by month (0-11)

**Example Request:**
```http
GET /api/expenses/categories/?year=2025&month=11
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "categories": [
    {
      "name": "Food",
      "count": 15,
      "total": 1234.50
    },
    {
      "name": "Transport",
      "count": 10,
      "total": 890.00
    },
    {
      "name": "Entertainment",
      "count": 8,
      "total": 450.00
    }
  ]
}
```

---

### 5. Expense Analytics
**Endpoint:** `GET /api/expenses/analytics/`

**Description:** Get detailed analytics including daily breakdown and category breakdown for a specific month.

**Query Parameters:**
- `year` (optional): Year (defaults to current year)
- `month` (optional): Month (0-11, defaults to current month)

**Example Request:**
```http
GET /api/expenses/analytics/?year=2025&month=11
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "year": 2025,
    "month": 11,
    "days_in_month": 31,
    "total_amount": 5234.50,
    "average_per_day": 168.85,
    "daily_breakdown": [
      {"day": 1, "total": 234.50},
      {"day": 2, "total": 156.00},
      {"day": 3, "total": 289.75}
    ],
    "category_breakdown": [
      {"name": "Food", "value": 1234.50},
      {"name": "Transport", "value": 890.00},
      {"name": "Entertainment", "value": 450.00}
    ]
  }
}
```

---

### 6. Monthly Statistics
**Endpoint:** `GET /api/expenses/monthly-stats/`

**Description:** Get monthly expense statistics for an entire year.

**Query Parameters:**
- `year` (optional): Year (defaults to current year)

**Example Request:**
```http
GET /api/expenses/monthly-stats/?year=2025
```

**Response:**
```json
{
  "success": true,
  "year": 2025,
  "total_amount": 45678.90,
  "monthly_stats": [
    {
      "month": 0,
      "month_name": "January",
      "count": 42,
      "total": 3456.78
    },
    {
      "month": 1,
      "month_name": "February",
      "count": 38,
      "total": 3123.45
    },
    ...
  ]
}
```

---

### 7. Top Expenses
**Endpoint:** `GET /api/expenses/top-items/`

**Description:** Get the top expenses by total amount.

**Query Parameters:**
- `limit` (optional): Number of items to return (default: 10)
- `year` (optional): Filter by year
- `month` (optional): Filter by month (0-11)

**Example Request:**
```http
GET /api/expenses/top-items/?limit=5&year=2025&month=11
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "top_expenses": [
    {
      "id": 23,
      "date": "2025-12-15",
      "item": "Electronics",
      "category": "Shopping",
      "quantity": 1,
      "price": 499.99,
      "total": 499.99
    },
    {
      "id": 45,
      "date": "2025-12-20",
      "item": "Course Fee",
      "category": "Education",
      "quantity": 1,
      "price": 299.00,
      "total": 299.00
    }
  ]
}
```

---

## 🔐 Authentication
All expense endpoints require authentication. Include the session cookie or authentication token with each request.

---

## 📝 Notes

### Month Indexing
- Frontend uses 0-11 (JavaScript standard): January = 0, December = 11
- Backend converts to 1-12 (Python standard): January = 1, December = 12
- Always pass month as 0-11 in API requests

### Date Format
- All dates should be in ISO format: `YYYY-MM-DD`
- Example: `2025-12-02`

### Currency
- All price and total fields are returned as strings with 2 decimal places
- Store prices with up to 10 digits and 2 decimal places

---

## 🎯 Use Cases

### Use Case 1: Monthly Dashboard
```http
# Get summary
GET /api/expenses/summary/?year=2025&month=11

# Get analytics (charts data)
GET /api/expenses/analytics/?year=2025&month=11

# Get category breakdown
GET /api/expenses/categories/?year=2025&month=11
```

### Use Case 2: Yearly Overview
```http
# Get monthly stats for entire year
GET /api/expenses/monthly-stats/?year=2025
```

### Use Case 3: Expense Management
```http
# List all expenses for a month
GET /api/expenses/?year=2025&month=11

# Create new expense
POST /api/expenses/
{
  "date": "2025-12-02",
  "item": "Groceries",
  "category": "Food",
  "quantity": 1,
  "price": 150.00
}

# Update expense
PATCH /api/expenses/123/
{
  "price": 175.00
}

# Delete expense
DELETE /api/expenses/123/
```

---

## ✅ API Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/expenses/` | GET | List expenses with filters & summary |
| `/expenses/` | POST | Create new expense |
| `/expenses/<id>/` | GET | Get specific expense |
| `/expenses/<id>/` | PUT/PATCH | Update expense |
| `/expenses/<id>/` | DELETE | Delete expense |
| `/expenses/summary/` | GET | Get expense summary stats |
| `/expenses/categories/` | GET | Get category breakdown |
| `/expenses/analytics/` | GET | Get detailed monthly analytics |
| `/expenses/monthly-stats/` | GET | Get yearly monthly statistics |
| `/expenses/top-items/` | GET | Get top expenses by amount |

---

## 🚀 Testing
You can test these APIs using:
1. Browser (GET requests)
2. Postman
3. cURL
4. Frontend application

Example cURL:
```bash
curl -X GET "http://localhost:8000/api/expenses/analytics/?year=2025&month=11" \
  -H "Cookie: sessionid=your-session-id"
```
