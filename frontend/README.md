# Tracker Application (Next.js)

## Overview
A modern, modular **daily tracker** built with **Next.js (App Router)**, TypeScript, and a clean component architecture. The app provides a full suite of features for tracking daily activities, managing settings, and visualizing data.

---

## Table of Contents
- [Features](#features)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features
| Category | Description |
|---|---|
| **Core Tracking** | Add, edit, and delete daily entries with timestamps. |
| **Data Persistence** | In‑memory mock data with easy swap to real API or local storage. |
| **Custom Settings** | User‑configurable settings (theme, notifications, etc.) via context providers. |
| **Analytics Dashboard** | Visual summaries and charts of tracked data. |
| **Responsive UI** | Mobile‑first design using vanilla CSS with modern UI patterns (glassmorphism, subtle animations). |
| **Modular Components** | Reusable UI components (`Header`, `EntryCard`, `SettingsPanel`, etc.) that can be extended independently. |
| **Custom Hooks** | Encapsulated logic (`useTracker`, `useSettings`) for clean state management. |
| **Type‑Safe** | Full TypeScript definitions for data models and component props. |

---

## Pages & Submenus

The application is organized into several top‑level pages and tools, each offering focused functionality:

| Page / Module | Features & Capabilities |
|---------------|-------------------------|
| **Dashboard** | Central hub with daily overview, quick-add widgets, and summary statistics. |
| **Planner** | Calendar-based task scheduling and event management. |
| **Journal** | Daily diary with markdown support for rich text entries. |
| **Goals** | Long-term goal setting with progress bars and milestone tracking. |
| **Expense Tracker** | Financial logging for daily expenses, categories, and budget monitoring. |
| **Points System** | Gamified tracking where users earn points for completing tasks and habits. |
| **Achievements** | Badge system rewarding consistency and milestones (e.g., "7-Day Streak"). |
| **Quotes** | Motivational quote collector to inspire daily progress. |
| **Profile** | User settings, avatar management, and account details. |
| **Tools** | Built-in utilities including **Calculator**, **Clock**, and **ai chat bot**. |

These pages are accessible via the main navigation menu and are built as modular Next.js routes, making it easy to extend or customize each section independently.

## Architecture & Folder Structure
```
src/
├─ app/                # Next.js App Router pages & layout
│   ├─ layout.tsx      # Root layout with providers
│   └─ page.tsx        # Home page (tracker overview)
├─ components/         # Reusable UI components
│   ├─ Header.tsx
│   ├─ EntryCard.tsx
│   └─ SettingsPanel.tsx
├─ context/            # React context providers
│   ├─ DataContext.tsx
│   └─ SettingsContext.tsx
├─ hooks/              # Custom hooks for business logic
│   ├─ useTracker.ts
│   └─ useSettings.ts
├─ data/               # Mock data (replace with API later)
├─ types.ts            # Global TypeScript interfaces
└─ styles/             # Global CSS (reset, variables, animations)
```
Each layer is deliberately isolated:
- **Components** focus purely on UI.
- **Context** supplies shared state.
- **Hooks** contain side‑effects and data manipulation.
- **Pages** compose everything together.

---

## Getting Started
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Tracker-1
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
4. **Explore** – add entries, tweak settings, and see analytics update in real‑time.

---

## Available Scripts
| Script | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server (hot‑reloading). |
| `npm run build` | Generates an optimized production build. |
| `npm start` | Serves the production build locally. |
| `npm run lint` | Runs ESLint for code quality checks. |
| `npm run format` | Formats code with Prettier. |

---

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes, ensuring TypeScript passes and linting is clean.
4. Open a Pull Request describing the enhancement.

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

*This README is intentionally modular and easy to navigate, providing a clear map of the project's capabilities and structure.*
