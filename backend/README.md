# Tracker Backend

This is the Django backend for the Tracker Application.

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

5.  **Run Server:**
    ```bash
    python manage.py runserver
    ```

## API Endpoints

*   **Signup:** `POST /api/auth/signup/`
    *   Body: `{"username": "...", "email": "...", "password": "..."}`
*   **Login:** `POST /api/auth/login/`
    *   Body: `{"username": "...", "password": "..."}`
*   **Logout:** `POST /api/auth/logout/`
