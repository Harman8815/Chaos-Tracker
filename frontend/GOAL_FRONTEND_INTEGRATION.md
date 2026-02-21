# Goal API Frontend Integration Guide

## Overview
This guide documents the frontend integration of the Goal API.

---

## 📁 File Structure

```
frontend/src/
├── services/
│   └── goalService.ts          # Complete goal API service
├── components/
│   └── trackers/
│       └── GoalTracker.tsx     # Updated component with API integration
```

---

## 🔧 Service Layer (`goalService.ts`)

### Available Functions

```typescript
import goalService from '@/services/goalService';

// Get all goals (with optional filters)
const response = await goalService.getAllGoals({
  category: 'daily',
  status: 'active'
});

// Create goal
await goalService.createGoal({
  text: 'Read 30 mins',
  category: 'daily',
  tags: ['learning']
});

// Update goal (e.g., toggle status)
await goalService.updateGoal('goal-id', {
  status: 'completed'
});

// Delete goal
await goalService.deleteGoal('goal-id');
```

---

## 📊 Component Integration (`GoalTracker.tsx`)

### Key Changes

1.  **State Management**: Switched from `DataContext` to local `useState` for goals.
2.  **API Integration**: Uses `goalService` for all CRUD operations.
3.  **Real-time Updates**: Fetches fresh data after every create/update/delete operation.
4.  **Delete Functionality**: Added a delete button to goal items.

### Data Flow

1.  **Fetch**: `useEffect` calls `fetchGoals` on mount.
2.  **Create**: `handleAddGoal` calls `goalService.createGoal` -> `fetchGoals`.
3.  **Update**: `handleToggleGoal` / `handleUpdateStatus` calls `goalService.updateGoal` -> `fetchGoals`.
4.  **Delete**: `handleDeleteGoal` calls `goalService.deleteGoal` -> `fetchGoals`.

---

## 🚀 Usage

Navigate to the Goals Tracker in the application. You should see your goals loaded from the backend. You can add, complete, block, trash, and delete goals, and changes will be persisted to the database.
