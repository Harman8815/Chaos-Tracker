
## Authentication

The Chaos Tracker backend uses robust, JWT-based authentication with both access and refresh tokens. All routes below expect and return JSON. Refer to this section whenever interacting with or extending authentication endpoints.

---

### Signup

**Endpoint:** `POST /api/auth/signup/`

**Purpose:** Register a new user account.

**Request Example:**
```
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Success Response:**
```
{
  "message": "User created successfully"
}
```

**Failure Example:**
```
{
  "message": "Username already exists"
}
```

---

### Login

**Endpoint:** `POST /api/auth/login/`

**Purpose:** Authenticate user and issue JWT tokens.

**Request Example:**
```
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Success Response:**
```
{
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "access": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Failure Example:**
```
{
  "message": "Invalid username or password"
}
```

---

### Refresh Token

**Endpoint:** `POST /api/auth/token/refresh/`

**Purpose:** Exchange a valid refresh token for a new access token.

**Request Example:**
```
{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response:**
```
{
  "access": "new_access_token_here"
}
```

**Failure Example:**
```
{
  "message": "Invalid or expired refresh token"
}
```

---

### Logout

**Endpoint:** `POST /api/auth/logout/`

**Purpose:** Invalidate a refresh token (supports token blacklisting for added security).

**Request Example:**
```
{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response:**
```
{
  "message": "User logged out successfully"
}
```

**Failure Example:**
```
{
  "message": "Invalid token or already logged out"
}
```

---
## Habit Tracker API

The Habit Tracker API manages user habits, including daily ratings, colors, and names.  
Each habit belongs to a user and can be filtered by month and year.

---

### Get Habits (`GET /api/habits/`)

**Purpose:** Fetch all habit tracker data for a user filtered by month and year.

**Query Parameters:**

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| user_id   | string | User ID (foreign key)                 |
| month     | int    | Month (1-12)                          |
| year      | int    | Year                                   |

**Success Response (200 OK):**

```json
[
  {
    "id": "a1b2c3",
    "name": "Exercise",
    "color": "#FF5733",
    "data": [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0]
  },
  {
    "id": "d4e5f6",
    "name": "Meditation",
    "color": "#33FF57",
    "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
]
````

**Invalid Case (Missing user_id):**

```json
{
  "error": "user_id is required"
}
```

---

### Create Habit (`POST /api/habits/create/`)

**Purpose:** Add a new habit for a user with initial daily ratings.

**Request Body:**

```json
{
  "name": "Meditation",
  "color": "#33FF57",
  "data": [0, 0, 0, 0, 0, 0, 0]
}
```

**Success Response (201 Created):**

```json
{
  "id": "d4e5f6",
  "message": "Habit created successfully"
}
```

**Invalid Case (Missing name):**

```json
{
  "name": ["This field is required."]
}
```

---

### Update Habit (`PATCH /api/habits/:id/`)

**Purpose:** Update habit details or modify daily ratings.

**Request Body (any field optional):**

```json
{
  "name": "Morning Meditation",
  "color": "#33AAFF",
  "data": [1, 0, 1, 0, 1, 0, 0]
}
```

**Success Response (200 OK):**

```json
{
  "message": "Habit updated successfully"
}
```

**Invalid Case (Invalid habit ID):**

```json
{
  "detail": "Not found."
}
```

---

### Delete Habit (`DELETE /api/habits/:id/delete/`)

**Purpose:** Remove a habit by ID for a user.

**Success Response (200 OK):**

```json
{
  "message": "Habit deleted successfully"
}
```

**Invalid Case (Invalid habit ID):**

```json
{
  "detail": "Not found."
}
```

---
