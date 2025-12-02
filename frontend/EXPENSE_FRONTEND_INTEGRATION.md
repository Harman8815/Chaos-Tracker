# Expense API Frontend Integration Guide

## Overview
This guide documents the complete frontend integration of the Expense API, providing a modular and scalable architecture for expense management.

---

## 📁 File Structure

```
frontend/src/
├── services/
│   └── expenseService.ts          # Complete expense API service
├── components/
│   └── trackers/
│       └── ExpenseTracker.tsx     # Updated component with API integration
└── api/
    └── client.ts                   # Updated with PATCH method
```

---

## 🔧 Service Layer (`expenseService.ts`)

### Overview
The `expenseService.ts` provides a complete abstraction layer for all expense-related API calls.

### Features
✅ **Type-safe** - Full TypeScript types for all requests/responses  
✅ **Modular** - Each API endpoint is a separate function  
✅ **Clean** - Automatic query parameter handling  
✅ **Error handling** - Built into the API client  

### Available Functions

#### CRUD Operations
```typescript
import expenseService from '@/services/expenseService';

// Get all expenses (with optional filters)
const expenses = await expenseService.getAllExpenses({
  year: 2025,
  month: 11,
  category: 'Food'
});

// Get specific expense
const expense = await expenseService.getExpenseById('123');

// Create expense
const newExpense = await expenseService.createExpense({
  date: '2025-12-02',
  item: 'Groceries',
  category: 'Food',
  quantity: 1,
  price: 150.00
});

// Update expense
const updated = await expenseService.updateExpense('123', {
  price: 175.00
});

// Delete expense
await expenseService.deleteExpense('123');
```

#### Analytics Functions
```typescript
// Get summary statistics
const summary = await expenseService.getExpenseSummary({
  year: 2025,
  month: 11
});

// Get category breakdown
const categories = await expenseService.getExpenseCategories({
  year: 2025,
  month: 11
});

// Get detailed analytics (for charts)
const analytics = await expenseService.getExpenseAnalytics({
  year: 2025,
  month: 11
});

// Get yearly monthly statistics
const yearlyStats = await expenseService.getMonthlyStats(2025);

// Get top expenses
const topExpenses = await expenseService.getTopExpenses({
  limit: 10,
  year: 2025,
  month: 11
});
```

---

## 📊 Component Integration (`ExpenseTracker.tsx`)

### Key Changes

#### 1. **State Management**
```typescript
const [expenses, setExpenses] = useState<Expense[]>([]);
const [loading, setLoading] = useState(true);
const [analytics, setAnalytics] = useState<any>(null);
```

#### 2. **Data Fetching**
```typescript
// Fetch expenses for current month
const fetchExpenses = useCallback(async () => {
  try {
    setLoading(true);
    const response = await expenseService.getAllExpenses({
      year: date.year,
      month: date.month
    });
    setExpenses(response.expenses || []);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    setExpenses([]);
  } finally {
    setLoading(false);
  }
}, [date.year, date.month]);

// Fetch analytics for charts
const fetchAnalytics = useCallback(async () => {
  try {
    const response = await expenseService.getExpenseAnalytics({
      year: date.year,
      month: date.month
    });
    setAnalytics(response.analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    setAnalytics(null);
  }
}, [date.year, date.month]);
```

#### 3. **CRUD Operations**
```typescript
// Create
const handleAddExpense = useCallback(async (newExpense: Omit<Expense, 'id'>) => {
  try {
    await expenseService.createExpense(newExpense);
    await fetchExpenses();
    await fetchAnalytics();
  } catch (error) {
    console.error('Error creating expense:', error);
  }
}, [fetchExpenses, fetchAnalytics]);

// Update
const handleUpdateExpense = async (id: string, updatedField: Partial<Expense>) => {
  try {
    await expenseService.updateExpense(id, updatedField);
    await fetchExpenses();
    await fetchAnalytics();
  } catch (error) {
    console.error('Error updating expense:', error);
  }
};

// Delete
const handleDeleteExpense = async (id: string) => {
  try {
    await expenseService.deleteExpense(id);
    await fetchExpenses();
    await fetchAnalytics();
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};
```

#### 4. **Auto-refresh on Date Change**
```typescript
useEffect(() => {
  fetchExpenses();
  fetchAnalytics();
}, [fetchExpenses, fetchAnalytics]);
```

---

## 🎨 UI Features

### Loading State
```typescript
if (loading && !analytics) {
  return (
    <TrackerWrapper tracker={trackerInfo}>
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading expenses...</div>
      </div>
    </TrackerWrapper>
  );
}
```

### Charts Integration
- **Daily Chart**: Uses `analytics.daily_breakdown` from API
- **Pie Chart**: Uses `analytics.category_breakdown` from API
- Both charts update automatically when month/year changes

### Inline Editing
- Expenses can be edited directly in the table
- Changes are saved immediately via API
- Auto-refresh after successful update

### Delete Button
- Added delete button to each row
- Confirms deletion via API
- Refreshes data after successful deletion

---

## 🔄 Data Flow

```
User Action → Component Handler → Service Function → API Client → Backend
                                                                      ↓
Component Update ← State Update ← Response Transform ← API Response ←
```

### Example: Adding an Expense

1. **User clicks "Add Entry"**
   - Modal opens with form

2. **User submits form**
   - `handleAddExpense` is called

3. **Service layer makes API call**
   ```typescript
   expenseService.createExpense(newExpense)
   ```

4. **API client sends POST request**
   ```http
   POST /api/expenses/
   Content-Type: application/json
   
   {
     "date": "2025-12-02",
     "item": "Groceries",
     "category": "Food",
     "quantity": 1,
     "price": 150.00
   }
   ```

5. **Backend creates expense and returns response**

6. **Component refreshes data**
   ```typescript
   await fetchExpenses();
   await fetchAnalytics();
   ```

7. **UI updates with new data**

---

## 📝 TypeScript Types

### Request Types
```typescript
interface ExpenseCreateRequest {
  date: string;
  item: string;
  category: string;
  quantity: number;
  price: number;
}
```

### Response Types
```typescript
interface ExpenseListResponse {
  success: boolean;
  count: number;
  total_amount: number;
  category_breakdown: Record<string, number>;
  expenses: Expense[];
}

interface ExpenseAnalytics {
  success: boolean;
  analytics: {
    year: number;
    month: number;
    days_in_month: number;
    total_amount: number;
    average_per_day: number;
    daily_breakdown: Array<{ day: number; total: number }>;
    category_breakdown: Array<{ name: string; value: number }>;
  };
}
```

---

## 🚀 Usage Examples

### Example 1: Basic Expense List
```typescript
import expenseService from '@/services/expenseService';

const MyComponent = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await expenseService.getAllExpenses();
      setExpenses(response.expenses);
    };
    fetchData();
  }, []);

  return (
    <ul>
      {expenses.map(expense => (
        <li key={expense.id}>{expense.item} - ${expense.price}</li>
      ))}
    </ul>
  );
};
```

### Example 2: Monthly Analytics Dashboard
```typescript
const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchAnalytics = async () => {
      const response = await expenseService.getExpenseAnalytics({
        year: 2025,
        month
      });
      setAnalytics(response.analytics);
    };
    fetchAnalytics();
  }, [month]);

  return (
    <div>
      <h2>Total: ${analytics?.total_amount || 0}</h2>
      <DailyChart data={analytics?.daily_breakdown || []} />
      <CategoryChart data={analytics?.category_breakdown || []} />
    </div>
  );
};
```

### Example 3: Category Filter
```typescript
const CategoryFilter = () => {
  const [category, setCategory] = useState('Food');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await expenseService.getAllExpenses({ category });
      setExpenses(response.expenses);
    };
    fetchData();
  }, [category]);

  return (
    <div>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        {/* ... */}
      </select>
      {/* Display filtered expenses */}
    </div>
  );
};
```

---

## ⚡ Performance Optimizations

### 1. **Memoization**
```typescript
const sortedExpenses = useMemo(() => {
  // Sorting logic
}, [expenses, sortConfig]);
```

### 2. **Callback Optimization**
```typescript
const fetchExpenses = useCallback(async () => {
  // Fetch logic
}, [date.year, date.month]);
```

### 3. **Pagination**
- Client-side pagination for better UX
- Reduces DOM nodes rendered
- Configurable items per page

---

## 🔐 Authentication

All API calls automatically include:
- **CSRF Token** (from cookies)
- **Session Cookie** (credentials: 'include')

No manual authentication needed in components!

---

## 🐛 Error Handling

### Service Layer
```typescript
try {
  const response = await expenseService.getAllExpenses();
  // Success handling
} catch (error) {
  console.error('Error fetching expenses:', error);
  // Error handling (show toast, fallback data, etc.)
}
```

### API Client
- Automatically throws errors for non-2xx responses
- Parses error messages from backend
- Handles network errors

---

## ✅ Testing Checklist

- [x] Fetch expenses on component mount
- [x] Create new expense via modal
- [x] Update expense inline
- [x] Delete expense
- [x] Filter by month/year
- [x] Display charts with analytics data
- [x] Pagination works correctly
- [x] Sorting works for all columns
- [x] Loading states display
- [x] Error handling works

---

## 🎯 Next Steps

### Potential Enhancements
1. **Add search/filter** by item name
2. **Export to CSV** functionality
3. **Bulk operations** (delete multiple, bulk edit)
4. **Category management** (add/edit custom categories)
5. **Budget tracking** (set monthly budgets per category)
6. **Notifications** (budget alerts, high spending warnings)
7. **Recurring expenses** (auto-create monthly bills)
8. **Charts library** (replace custom charts with Recharts/Chart.js)

---

## 📚 Related Documentation

- [Backend API Documentation](./EXPENSE_API_DOCUMENTATION.md)
- [API Client Documentation](../frontend/src/api/README.md)
- [TypeScript Types](../frontend/src/types.ts)

---

## 🎉 Summary

The expense tracker is now fully integrated with the backend API:

✅ **Modular service layer** with all API functions  
✅ **Real-time data** fetching and updates  
✅ **Analytics integration** for charts  
✅ **CRUD operations** fully functional  
✅ **Type-safe** TypeScript implementation  
✅ **Error handling** throughout  
✅ **Performance optimized** with memoization  

The frontend is production-ready and can scale with additional features! 🚀
