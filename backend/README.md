# Tracker Backend

This is the Django REST Framework backend for the Tracker Application.

## Setup

1.  **Create Virtual Environment:**
    ```bash
    python -m venv venv
    ```

2.  **Activate Virtual Environment:**
    *   Windows: `.\venv\Scripts\activate`
    *   Mac/Linux: `source venv/bin/activate`

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You might need to generate requirements.txt first: `pip freeze > requirements.txt`)*

4.  **Run Migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Create Superuser (Optional):**
    ```bash
    python manage.py createsuperuser
    ```

6.  **Run Server:**
    ```bash
    python manage.py runserver
    ```
    Server will run on: http://localhost:8000

## Authentication API Endpoints

### Public Endpoints
*   **Signup:** `POST /api/auth/signup/`
    *   Body: `{"username": "...", "email": "...", "password": "..."}`
    *   Response: `{"success": true, "message": "Account created successfully", "user": {...}}`

*   **Login:** `POST /api/auth/login/`
    *   Body: `{"username": "...", "password": "..."}`
    *   Response: `{"success": true, "message": "Login successful", "user": {...}}`

*   **Logout:** `POST /api/auth/logout/`
    *   Response: `{"success": true, "message": "Logged out successfully"}`

### Protected Endpoints (Authentication Required)
*   **Get Current User:** `GET /api/auth/me/`
    *   Headers: Session cookie (automatically included)
    *   Response: `{"success": true, "user": {...}}`

## Database

- **Engine:** SQLite 3
- **Location:** `db.sqlite3` (root directory)

## Authentication

- **Type:** Session-based authentication
- **Cookie Name:** `sessionid`
- **CORS:** Enabled for `http://localhost:3000`
- **CSRF Protection:** Enabled

## Admin Panel

Access Django admin at: http://localhost:8000/admin/

Login with your superuser credentials to manage:
- Users
- Sessions
- Other models

## Documentation

For complete integration guide and testing instructions, see:
- **[AUTH_INTEGRATION.md](../AUTH_INTEGRATION.md)** - Comprehensive integration documentation
- **[QUICK_START.md](../QUICK_START.md)** - Quick start testing guide
