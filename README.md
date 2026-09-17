# Tracker Application

<p align="center">
  <strong>A centralized personal productivity and life-tracking platform</strong>
</p>

<p align="center">
  Track goals, habits, expenses, tasks, journals, achievements, and daily activities from a single dashboard.
</p>

<p align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge\&logo=typescript)
![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge\&logo=django)
![DRF](https://img.shields.io/badge/DRF-REST_API-A30000?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge\&logo=sqlite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge\&logo=tailwindcss)

</p>

---

## Overview

**Tracker Application** is a full-stack personal productivity system that centralizes different aspects of everyday tracking into one application.

Instead of maintaining separate applications for expenses, goals, habits, journaling, and planning, the platform provides a unified dashboard and shared data layer.

The application is built around modular frontend components and a Django REST API backend.

---

## Screenshots

> Add project screenshots to `docs/images/` and update the paths below.

### Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/4f53c498-b536-4498-b382-e6bd77f3ab02" alt="Tracker Dashboard" width="900">
</p>

### Goals & Progress

<p align="center">
  <img src="https://github.com/user-attachments/assets/b8535308-db92-436a-9632-6c1b51754c87" alt="Goals Dashboard" width="900">
</p>
### Expenses & Analytics

<p align="center">
  <img src="https://github.com/user-attachments/assets/8313e665-b4d3-40ca-95d6-59b3de3ff808" alt="Expense Analytics" width="900">
</p>

### Planner

<p align="center">
  <img src="https://github.com/user-attachments/assets/684fb986-4948-4eba-b49a-a7e7c96fe412" alt="Task Planner" width="900">
</p>

---

## Core Features

| Module       | Description                                               |
| ------------ | --------------------------------------------------------- |
| Dashboard    | Centralized overview of productivity and personal metrics |
| Goals        | Create and track daily, monthly, and future goals         |
| Habits       | Track completion history and habit streaks                |
| Expenses     | Record expenses and analyze spending                      |
| Journal      | Maintain daily journal entries                            |
| Planner      | Organize tasks using a visual planning interface          |
| Achievements | Track milestones, badges, and rewards                     |
| Quotes       | Save and manage inspirational quotes                      |
| Tools        | Calculator, clock, and productivity utilities             |
| AI Chat      | AI-assisted productivity and application interaction      |

---

## Application Architecture

```mermaid
flowchart TB
    User["User"]

    subgraph Frontend["Next.js Frontend"]
        UI["Dashboard & UI"]
        Goals["Goals"]
        Habits["Habits"]
        Expenses["Expenses"]
        Journal["Journal"]
        Planner["Planner"]
        Achievements["Achievements"]
        Tools["Tools"]
        Chat["AI Chat"]
        Services["API Services"]
    end

    subgraph Backend["Django Backend"]
        API["Django REST API"]
        Auth["Authentication"]
        Business["Business Logic"]
        Modules["Tracker Modules"]
    end

    DB[("SQLite Database")]

    User --> UI
    UI --> Goals
    UI --> Habits
    UI --> Expenses
    UI --> Journal
    UI --> Planner
    UI --> Achievements
    UI --> Tools
    UI --> Chat

    Goals --> Services
    Habits --> Services
    Expenses --> Services
    Journal --> Services
    Planner --> Services
    Achievements --> Services
    Chat --> Services

    Services --> API
    API --> Auth
    API --> Business
    Business --> Modules
    Modules --> DB
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Next.js
    participant A as REST API
    participant D as Django
    participant DB as SQLite

    U->>F: Perform action
    F->>A: HTTP Request
    A->>D: Validate request
    D->>D: Apply business logic
    D->>DB: Read / Write data
    DB-->>D: Result
    D-->>A: API Response
    A-->>F: JSON Response
    F-->>U: Update UI
```

---

## Feature Flow

```mermaid
mindmap
  root((Tracker Application))
    Productivity
      Goals
      Habits
      Planner
      Achievements
    Personal Tracking
      Expenses
      Journal
      Quotes
    Utilities
      Calculator
      Clock
      AI Chat
    Analytics
      Charts
      Progress
      Streaks
      Spending
```

---

## Technology Stack

### Frontend

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| Next.js 15    | Application framework     |
| React 19      | UI development            |
| TypeScript    | Type safety               |
| TailwindCSS   | Styling and responsive UI |
| Framer Motion | UI animations             |
| Recharts      | Data visualization        |

###
