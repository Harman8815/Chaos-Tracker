
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