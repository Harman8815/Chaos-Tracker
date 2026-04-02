# Tracker Application

A comprehensive personal productivity application for tracking daily activities, goals, expenses, habits, and journal entries.

**Frontend:** Next.js + TypeScript + TailwindCSS  
**Backend:** Django + Django REST Framework + SQLite

---

## � What This Project Does

The Tracker Application is a full-stack personal productivity suite that helps users:

- **Track Expenses**: Monitor spending by category with analytics
- **Manage Goals**: Set and track daily, monthly, and future goals
- **Build Habits**: Track habit streaks and progress
- **Journal**: Daily diary with rich text entries
- **Plan Tasks**: Visual planner with drag-and-drop blocks
- **Earn Achievements**: Gamified system with badges and rewards
- **Collect Quotes**: Inspirational quote collection
- **Use Tools**: Built-in calculator, clock, and AI chat

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database
- **Session Authentication** - User management

---

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start server**
   ```bash
   python manage.py runserver
   ```
   Backend runs on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

---

## 📁 Directory Structure

```
Tracker Application/
├── backend/                    # Django REST API
│   ├── authentication/         # User authentication
│   ├── tracker/               # Core models and views
│   ├── tracker_backend/       # Django settings
│   ├── requirements.txt       # Python dependencies
│   └── manage.py            # Django management
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── types.ts       # TypeScript types
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

---

## 📚 API Documentation

Comprehensive API documentation available at `backend/API_DOCUMENTATION.md`

**Key Endpoints:**
- `/api/auth/` - User authentication
- `/api/expenses/` - Expense management
- `/api/goals/` - Goal tracking
- `/api/habits/` - Habit management
- `/api/journal/` - Journal entries
- `/api/planner/` - Task planning

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
