# Tracker Application - Full Stack Personal Productivity Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.2-092E20.svg)](https://www.djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6.svg)](https://www.typescriptlang.org/)

A comprehensive personal tracking and productivity application built with a modern full-stack architecture. This application helps users manage their daily activities, goals, expenses, habits, journal entries, and more through an intuitive and feature-rich interface.

**🌟 Live Demo:** [Coming Soon] | **📖 Documentation:** [API Docs](backend/API_DOCUMENTATION.md) | **🚀 Quick Start:** [Setup Guide](#-installation--setup)

---

## 🔗 Connect & Contribute

[![GitHub stars](https://img.shields.io/github/stars/Harman8815/Tracker.svg?style=social&label=Star)](https://github.com/Harman8815/Tracker)
[![GitHub forks](https://img.shields.io/github/forks/Harman8815/Tracker.svg?style=social&label=Fork)](https://github.com/Harman8815/Tracker/fork)
[![GitHub issues](https://img.shields.io/github/issues/Harman8815/Tracker.svg)](https://github.com/Harman8815/Tracker/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Harman8815/Tracker.svg)](https://github.com/Harman8815/Tracker/pulls)

**📧 Contact:** [Your Email] | **🐦 Twitter:** [@YourTwitter] | **💼 LinkedIn:** [Your LinkedIn] | **🌐 Website:** [Your Website]

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-black?logo=framer&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![Recharts](https://img.shields.io/badge/Recharts-3.5.1-orange?logo=recharts&logoColor=white)

**Backend:**
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![Django REST](https://img.shields.io/badge/Django_REST-3.16-FF0000?logo=djangorestframework&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)

**Development Tools:**
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![npm](https://img.shields.io/badge/npm-9.0+-CB3837?logo=npm&logoColor=white)
![PowerShell](https://img.shields.io/badge/PowerShell-5391FE?logo=powershell&logoColor=white)

---

## 🚀 Features

### Core Modules

| Module | Description | Key Features | Status |
|--------|-------------|--------------|--------|
| **Dashboard** | Central hub with overview widgets | Daily summaries, quick actions, statistics | ✅ Active |
| **Planner** | Visual task planning system | Drag-and-drop blocks, task linking, canvas view | ✅ Active |
| **Journal** | Personal diary with rich text | Markdown support, daily entries, mood tracking | ✅ Active |
| **Goals** | Goal setting and tracking | Daily/Monthly/Future goals, progress tracking | ✅ Active |
| **Expense Tracker** | Financial management | Categorization, analytics, monthly reports | ✅ Active |
| **Habits** | Habit formation system | Streak tracking, scoring, visual progress | ✅ Active |
| **Achievements** | Gamification system | Badges, milestones, rewards | ✅ Active |
| **Quotes** | Inspirational content | Collection by source, tags, search | ✅ Active |
| **Profile** | User management | Settings, avatar, preferences | ✅ Active |
| **Tools** | Built-in utilities | Calculator, Clock, AI Chat Bot | ✅ Active |

### Technical Features

![🔐 Authentication](https://img.shields.io/badge/🔐-Authentication-success) Secure session-based auth with signup/login/logout  
![📱 Responsive](https://img.shields.io/badge/📱-Responsive_Design-blue) Mobile-first approach with modern UI patterns  
![🎨 Modern UI](https://img.shields.io/badge/🎨-Modern_UI-purple) Glassmorphism effects, smooth animations, dark/light themes  
![📊 Analytics](https://img.shields.io/badge/📊-Analytics-green) Comprehensive data visualization and reporting  
![🔄 Real-time](https://img.shields.io/badge/🔄-Real_time_Updates-orange) Instant UI updates with React state management  
![🌐 API-First](https://img.shields.io/badge/🌐-API_First-red) RESTful API design with comprehensive documentation

---

## 📁 Project Structure

```
Tracker Application/
├── backend/                    # Django REST API
│   ├── authentication/         # User authentication module
│   ├── tracker/                # Core tracking models and views
│   ├── tracker_backend/        # Django project settings
│   ├── API_DOCUMENTATION.md    # Comprehensive API docs
│   ├── requirements.txt        # Python dependencies
│   └── manage.py              # Django management script
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── constants.tsx       # App constants and configurations
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.ts     # TailwindCSS configuration
└── README.md                  # This file
```

---

## 🛠️ Installation & Setup

### Prerequisites

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) 
![npm](https://img.shields.io/badge/npm-9.0+-CB3837?logo=npm&logoColor=white)

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

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```
   
   ![Backend Running](https://img.shields.io/badge/Backend-Running_on_8000-success?logo=django&logoColor=white)
   
   Backend will be available at `http://localhost:8000`

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
   
   ![Frontend Running](https://img.shields.io/badge/Frontend-Running_on_3000-informational?logo=next.js&logoColor=white)
   
   Frontend will be available at `http://localhost:3000`

---

## 📚 API Documentation

The backend provides a comprehensive REST API documented in `backend/API_DOCUMENTATION.md`. Key endpoints include:

### Authentication
![🔐 Auth](https://img.shields.io/badge/🔐-Authentication-blue) `POST /api/auth/signup/` - Create new account  
![🔐 Auth](https://img.shields.io/badge/🔐-Authentication-blue) `POST /api/auth/login/` - User login  
![🔐 Auth](https://img.shields.io/badge/🔐-Authentication-blue) `POST /api/auth/logout/` - User logout  
![🔐 Auth](https://img.shields.io/badge/🔐-Authentication-blue) `GET /api/auth/me/` - Get current user info

### Core Modules
![💰](https://img.shields.io/badge/💰-Expenses-green) `GET/POST /api/expenses/` - Expense management  
![🎯](https://img.shields.io/badge/🎯-Goals-orange) `GET/POST /api/goals/` - Goal tracking  
![🔄](https://img.shields.io/badge/🔄-Habits-purple) `GET/POST /api/habits/` - Habit management  
![📝](https://img.shields.io/badge/📝-Journal-blue) `GET/POST /api/journal/` - Journal entries  
![📋](https://img.shields.io/badge/📋-Planner-red) `GET/POST /api/planner/` - Planner data  
![💬](https://img.shields.io/badge/💬-Quotes-yellow) `GET/POST /api/quotes/` - Quote collection  
![🏆](https://img.shields.io/badge/🏆-Achievements-gold) `GET/POST /api/achievements/` - Achievement system

### Development Tools
![🛠️](https://img.shields.io/badge/🛠️-Dev_Tools-gray) `POST /api/temp-data/` - Generate sample data  
![🛠️](https://img.shields.io/badge/🛠️-Dev_Tools-gray) `GET /api/populate-data/` - Populate with test data

---

## 🎯 Usage Examples

### Starting the Application

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open browser** to `http://localhost:3000`
3. **Create account** or login with existing credentials
4. **Explore modules** using the sidebar navigation

### Key Workflows

**Adding Expenses:**
```typescript
// Frontend example
const expense = {
  date: "2025-12-21",
  item: "Coffee",
  category: "Food",
  quantity: 2,
  price: 5.50
};
```

**Creating Goals:**
```typescript
// Frontend example
const goal = {
  text: "Read 30 minutes daily",
  category: "daily",
  tags: ["learning", "personal"]
};
```

**Planner Usage:**
- Create blocks by clicking "Add Block"
- Drag blocks to reposition
- Link blocks to show dependencies
- Add tasks within blocks

---

## 🔧 Development

### Available Scripts

**Frontend:**
![npm](https://img.shields.io/badge/npm-run_dev-61DAFB?logo=npm&logoColor=black) `npm run dev` - Development server  
![npm](https://img.shields.io/badge/npm-run_build-000000?logo=npm&logoColor=white) `npm run build` - Production build  
![npm](https://img.shields.io/badge/npm-start-000000?logo=npm&logoColor=white) `npm start` - Production server  
![npm](https://img.shields.io/badge/npm-run_lint-61DAFB?logo=npm&logoColor=black) `npm run lint` - Code linting

**Backend:**
![Python](https://img.shields.io/badge/python-manage_py_runserver-3776AB?logo=python&logoColor=white) `python manage.py runserver` - Development server  
![Python](https://img.shields.io/badge/python-manage_py_migrate-3776AB?logo=python&logoColor=white) `python manage.py migrate` - Database migrations  
![Python](https://img.shields.io/badge/python-manage_py_createsuperuser-3776AB?logo=python&logoColor=white) `python manage.py createsuperuser` - Admin user  
![Python](https://img.shields.io/badge/python-manage_py_shell-3776AB?logo=python&logoColor=white) `python manage.py shell` - Django shell

### Database

![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white) **Engine**: SQLite 3  
📍 **Location**: `backend/db.sqlite3`  
🔧 **Admin Panel**: `http://localhost:8000/admin/`

### Testing

![🧪](https://img.shields.io/badge/🧪-Testing-blue) Use the built-in development tools:
- API testing via browser or Postman
- Frontend testing in development mode
- Sample data generation via `/api/temp-data/`

---

## 🎨 UI Components

The application features a modern, component-based architecture:

### Key Components
![⚛️](https://img.shields.io/badge/⚛️-React_Components-61DAFB?logo=react&logoColor=black) **Sidebar** - Navigation with collapsible design  
![⚛️](https://img.shields.io/badge/⚛️-React_Components-61DAFB?logo=react&logoColor=black) **Header** - User info and actions  
![⚛️](https://img.shields.io/badge/⚛️-React_Components-61DAFB?logo=react&logoColor=black) **EntryCard** - Reusable data display cards  
![⚛️](https://img.shields.io/badge/⚛️-React_Components-61DAFB?logo=react&logoColor=black) **SettingsPanel** - Configuration interface  
![⚛️](https://img.shields.io/badge/⚛️-React_Components-61DAFB?logo=react&logoColor=black) **Modal** - Overlays for forms and details

### Design System
![🎨](https://img.shields.io/badge/🎨-Design_System-purple) **Colors**: TailwindCSS color palette  
![📝](https://img.shields.io/badge/📝-Typography-blue) **Typography**: Clean, readable fonts  
![🎬](https://img.shields.io/badge/🎬-Animations-orange) **Animations**: Framer Motion transitions  
![📱](https://img.shields.io/badge/📱-Responsive-green) **Responsive**: Mobile-first breakpoints

---

## 🔐 Security

![🔒](https://img.shields.io/badge/🔒-Security-success) **Session-based authentication** with secure cookies  
![🛡️](https://img.shields.io/badge/🛡️-CSRF_Protection-blue) **CSRF protection** enabled  
![🌐](https://img.shields.io/badge/🌐-CORS-green) **CORS** configured for development  
![💉](https://img.shields.io/badge/💉-SQL_Injection_Protection-red) **SQL injection protection** via Django ORM  
![🔍](https://img.shields.io/badge/🔍-XSS_Protection-orange) **XSS protection** through proper sanitization

---

## 🚀 Deployment

### Production Considerations

![🚀](https://img.shields.io/badge/🚀-Production-blue) **Backend:**
- Set `DEBUG = False`
- Configure proper `ALLOWED_HOSTS`
- Use production database (PostgreSQL/MySQL)
- Set up environment variables for `SECRET_KEY`

![🌍](https://img.shields.io/badge/🌍-Front_Deployment-green) **Frontend:**
- Build with `npm run build`
- Deploy to static hosting (Vercel, Netlify)
- Update API base URL to production endpoint

### Environment Variables

![🔧](https://img.shields.io/badge/🔧-Environment_Variables-yellow) Create `.env` files for sensitive data:

**Backend (.env):**
```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## 🤝 Contributing

![🤝](https://img.shields.io/badge/🤝-Contributions_Welcome-brightgreen) **Contributing Guidelines:**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Code Style
![🎨](https://img.shields.io/badge/🎨-Code_Style-blue) **TypeScript** for type safety  
![✨](https://img.shields.io/badge/✨-ESLint-purple) **ESLint** for code quality  
![📝](https://img.shields.io/badge/📝-Prettier-orange) **Prettier** for formatting  
![📋](https://img.shields.io/badge/📋-Component_Patterns-green) Follow existing component patterns

---

## 📄 License

![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg) This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

![🙏](https://img.shields.io/badge/🙏-Acknowledgments-blue) **Special thanks to:**

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white) **Next.js** team for the excellent framework  
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white) **Django** for the robust backend  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white) **TailwindCSS** for the utility-first CSS framework  
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-black?logo=framer&logoColor=white) **Framer Motion** for smooth animations

---

## 📞 Support

![💬](https://img.shields.io/badge/💬-Get_Help-green) **Need help? Contact us:**

1. **Check** existing documentation
2. **Review** API documentation in `backend/API_DOCUMENTATION.md`
3. **Create** an issue for bugs or feature requests
4. **Join** discussions for community support

---

## 🌟 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Harman8815/Tracker)
![GitHub language count](https://img.shields.io/github/languages/count/Harman8815/Tracker)
![GitHub top language](https://img.shields.io/github/languages/top/Harman8815/Tracker)
![GitHub last commit](https://img.shields.io/github/last-commit/Harman8815/Tracker)

---

*Built with ❤️ for personal productivity and growth*
