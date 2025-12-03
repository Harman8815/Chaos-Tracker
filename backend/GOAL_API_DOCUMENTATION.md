# Goal API Documentation

## Overview
The Goal API provides endpoints for managing user goals across different categories (daily, monthly, future).

---

## Base URL
All goal endpoints are prefixed with: `/api/goals/`

---

## 📋 CRUD Operations

### 1. List & Create Goals
**Endpoint:** `GET /api/goals/` | `POST /api/goals/`

#### GET - List Goals
**Description:** Get all goals with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (`daily`, `monthly`, `future`)
- `status` (optional): Filter by status (`active`, `completed`, `blocked`, `trashed`)

**Example Request:**
```http
GET /api/goals/?category=daily&status=active
```

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

#### POST - Create Goal
**Description:** Create a new goal.

**Request Body:**
```json
{
  "text": "Read 30 minutes",
  "category": "daily",
  "tags": ["learning", "personal"]
}
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "goals": [...]
}
```

---

### 2. Goal Detail
**Endpoint:** `GET /api/goals/<id>/` | `PUT /api/goals/<id>/` | `PATCH /api/goals/<id>/` | `DELETE /api/goals/<id>/`

#### GET - Retrieve Goal
**Description:** Get a specific goal by ID.

**Example Request:**
```http
GET /api/goals/1/
```

**Response:**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "goal": {
    "id": 1,
    "text": "Drink 8 glasses of water",
    "category": "daily",
    "status": "active",
    "tags": ["health"],
    "created_at": "2025-12-01T10:30:00Z",
    "updated_at": "2025-12-01T10:30:00Z",
    "completed_at": null
  }
}
```

#### PATCH - Update Goal Status
**Description:** Update a goal (e.g., mark as completed).

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "goal": {
    "id": 1,
    "status": "completed",
    "completed_at": "2025-12-02T12:00:00Z",
    ...
  }
}
```

#### DELETE - Delete Goal
**Description:** Delete a goal.

**Response:**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

## 🔐 Authentication
All goal endpoints require authentication. Include the session cookie or authentication token with each request.

---

## 📝 Notes

### Categories
- `daily`
- `monthly`
- `future`

### Statuses
- `active`
- `completed`
- `blocked`
- `trashed`

### Tags
- Sent as a list of strings: `["tag1", "tag2"]`

---

## 🚀 Testing
You can populate dummy data using:
`GET /api/populate-data/`
