# Quote Collector - Backend Integration Guide

This guide explains how to integrate the new Quote Collector API with your frontend.

## 📋 Table of Contents
1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Migration from Local Storage](#migration-from-local-storage)

---

## 🎯 Overview

The Quote Collector backend provides:
- ✅ Full CRUD operations for Quote Sources and Quotes
- ✅ **Fuzzy Search** with intelligent relevance scoring
- ✅ Tag management and filtering
- ✅ User-specific data isolation
- ✅ Optimized database queries with prefetching
- ✅ RESTful API design

### Key Features of Fuzzy Search:
- Searches across: **titles**, **quote text**, **authors**, and **tags**
- Uses `SequenceMatcher` for fuzzy string matching
- Weighted relevance scoring:
  - Title matches: **10x** weight
  - Tag matches: **8x** weight
  - Author matches: **7x** weight
  - Text matches: **5x** weight
- Results sorted by relevance (highest first)
- Configurable result limit

---

## 🗄️ Database Setup

### 1. Run Migrations

The migrations have already been created. Apply them:

```bash
cd backend
python manage.py migrate
```

This creates the following tables:
- `tracker_quotesource` - Stores quote sources (movies, books, web series)
- `tracker_quote` - Stores individual quotes
- `tracker_quotetag` - Stores tags for quotes (many-to-many)

### 2. Verify Tables

```bash
python manage.py dbshell
```

```sql
.tables
-- Should show: tracker_quotesource, tracker_quote, tracker_quotetag

.schema tracker_quotesource
.schema tracker_quote
.schema tracker_quotetag
```

---

## 🔌 API Endpoints

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotes/sources/` | List all sources |
| POST | `/api/quotes/sources/` | Create source |
| GET | `/api/quotes/sources/{id}/` | Get source details |
| PUT | `/api/quotes/sources/{id}/` | Update source |
| DELETE | `/api/quotes/sources/{id}/` | Delete source |
| GET | `/api/quotes/sources/{id}/quotes/` | List quotes for source |
| POST | `/api/quotes/sources/{id}/quotes/` | Create quote |
| GET | `/api/quotes/{id}/` | Get quote details |
| PUT | `/api/quotes/{id}/` | Update quote |
| DELETE | `/api/quotes/{id}/` | Delete quote |
| **GET** | **`/api/quotes/search/?q={query}`** | **Fuzzy search** |
| GET | `/api/quotes/tags/` | Get all tags |

See `QUOTE_API_DOCUMENTATION.md` for detailed documentation.

---

## 🎨 Frontend Integration

### Step 1: Import the Quote Service

The quote service is already created at `frontend/src/services/quoteService.ts`.

```typescript
import quoteService from '@/services/quoteService';
```

### Step 2: Update QuoteCollector Component

Replace the current local state management with API calls. Here's how to update the main operations:

#### A. Fetch All Sources (on component mount)

```typescript
import { useEffect, useState } from 'react';
import quoteService from '@/services/quoteService';

const QuoteCollector = () => {
  const [allSources, setAllSources] = useState<QuoteSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setLoading(true);
        const sources = await quoteService.getAllQuoteSources({
          include_quotes: true
        });
        setAllSources(sources);
      } catch (err) {
        setError('Failed to load quote sources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  // ... rest of component
};
```

#### B. Replace Search with Fuzzy Search API

```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!searchQuery.trim() || searchQuery.trim().length < 2) {
    setError('Search query must be at least 2 characters');
    return;
  }

  try {
    setLoading(true);
    setActiveSearch(searchQuery);
    
    // Use fuzzy search API
    const results = await quoteService.fuzzySearchQuotes(searchQuery, 20);
    
    // Extract sources from search results
    const sources = results.map(result => result.source);
    setSearchResults(sources);
    
    setSelectedSource(null);
  } catch (err) {
    setError('Search failed');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### C. Update Create Source

```typescript
const handleSaveSource = async (sourceToSave: QuoteSource) => {
  try {
    setLoading(true);
    
    const exists = allSources.some(s => s.id === sourceToSave.id);
    
    if (exists) {
      // Update existing source
      await quoteService.updateQuoteSource(sourceToSave.id, {
        title: sourceToSave.title,
        type: sourceToSave.type,
        coverImage: sourceToSave.coverImage,
      });
    } else {
      // Create new source
      await quoteService.createQuoteSource(sourceToSave);
    }
    
    // Refresh sources
    const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
    setAllSources(sources);
    
    setModalState(null);
    
    if (selectedSource?.id === sourceToSave.id) {
      const updated = await quoteService.getQuoteSource(sourceToSave.id);
      setSelectedSource(updated);
    }
  } catch (err) {
    setError('Failed to save source');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### D. Update Delete Source

```typescript
const handleDeleteSource = async (sourceId: string) => {
  if (!window.confirm("Are you sure you want to delete this entire source and all its quotes?")) {
    return;
  }

  try {
    setLoading(true);
    await quoteService.deleteQuoteSource(sourceId);
    
    // Refresh sources
    const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
    setAllSources(sources);
    
    resetToHome();
  } catch (err) {
    setError('Failed to delete source');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### E. Update Create/Update Quote

```typescript
const handleSaveQuote = async (quoteToSave: Quote) => {
  if (!selectedSource) return;

  try {
    setLoading(true);
    
    const quoteExists = selectedSource.quotes.some(q => q.id === quoteToSave.id);
    
    if (quoteExists) {
      // Update existing quote
      await quoteService.updateQuote(quoteToSave.id, {
        text: quoteToSave.text,
        author: quoteToSave.author,
        tags: quoteToSave.tags,
        image: quoteToSave.image,
      });
    } else {
      // Create new quote
      await quoteService.createQuote(selectedSource.id, quoteToSave);
    }
    
    // Refresh the source
    const updatedSource = await quoteService.getQuoteSource(selectedSource.id);
    setSelectedSource(updatedSource);
    
    // Update in allSources
    setAllSources(prev => 
      prev.map(s => s.id === updatedSource.id ? updatedSource : s)
    );
    
    setModalState(null);
  } catch (err) {
    setError('Failed to save quote');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### F. Update Delete Quote

```typescript
const handleDeleteQuote = async (quoteId: string) => {
  if (!selectedSource || !window.confirm("Delete this quote?")) return;

  try {
    setLoading(true);
    await quoteService.deleteQuote(quoteId);
    
    // Refresh the source
    const updatedSource = await quoteService.getQuoteSource(selectedSource.id);
    setSelectedSource(updatedSource);
    
    // Update in allSources
    setAllSources(prev => 
      prev.map(s => s.id === updatedSource.id ? updatedSource : s)
    );
  } catch (err) {
    setError('Failed to delete quote');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### Step 3: Add Loading and Error States

```typescript
// Add to your component
{loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-card-bg p-6 rounded-lg">
      <p className="text-lg">Loading...</p>
    </div>
  </div>
)}

{error && (
  <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
    <p>{error}</p>
    <button onClick={() => setError(null)} className="mt-2 underline">
      Dismiss
    </button>
  </div>
)}
```

---

## 🧪 Testing

### 1. Test with Postman/Thunder Client

#### Create a Quote Source
```http
POST http://localhost:8000/api/quotes/sources/
Content-Type: application/json

{
  "id": "test-movie",
  "title": "Test Movie",
  "type": "Movie",
  "cover_image": "https://placehold.co/400x600",
  "quotes": [
    {
      "id": "quote-1",
      "text": "This is a test quote",
      "author": "Test Author",
      "tags": ["test", "philosophy"]
    }
  ]
}
```

#### Fuzzy Search
```http
GET http://localhost:8000/api/quotes/search/?q=philosophy&limit=10
```

#### Get All Sources
```http
GET http://localhost:8000/api/quotes/sources/
```

### 2. Test from Frontend

```typescript
// In browser console
const testSearch = async () => {
  const results = await quoteService.fuzzySearchQuotes('philosophy');
  console.log('Search results:', results);
};

testSearch();
```

---

## 🔄 Migration from Local Storage

### Option 1: Manual Migration (Recommended)

1. Export existing data from `DataContext`
2. Create a migration script:

```typescript
// frontend/src/utils/migrateQuotes.ts
import quoteService from '@/services/quoteService';
import { DUMMY_QUOTES } from '@/data/quotes_data';

export const migrateQuotesToBackend = async () => {
  try {
    for (const source of DUMMY_QUOTES) {
      await quoteService.createQuoteSource(source);
      console.log(`Migrated: ${source.title}`);
    }
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
```

3. Run once in browser console:
```javascript
migrateQuotesToBackend();
```

### Option 2: Sync Endpoint

The `/api/sync/` endpoint now returns quotes data. You can use this to:
1. Load initial data on app start
2. Sync between devices
3. Backup/restore functionality

---

## 🚀 Next Steps

1. ✅ **Run migrations** - `python manage.py migrate`
2. ✅ **Test API endpoints** - Use Postman/Thunder Client
3. ✅ **Update QuoteCollector component** - Replace local state with API calls
4. ✅ **Test fuzzy search** - Try various search queries
5. ✅ **Migrate existing data** - Use migration script
6. ✅ **Remove dummy data** - Clean up `quotes_data.ts` after migration

---

## 📝 Notes

- **Authentication**: All endpoints require authentication
- **User Isolation**: Users can only access their own quotes
- **Fuzzy Search**: Minimum 2 characters required
- **Performance**: Database queries are optimized with prefetching
- **Error Handling**: All API calls should be wrapped in try-catch

---

## 🐛 Troubleshooting

### Issue: "Authentication credentials were not provided"
**Solution**: Ensure you're logged in and session cookie is being sent with requests.

### Issue: Search returns no results
**Solution**: 
- Check if quotes exist in database
- Verify search query is at least 2 characters
- Try broader search terms

### Issue: Quotes not showing after creation
**Solution**: 
- Check browser console for errors
- Verify API response in Network tab
- Ensure you're refreshing the source after creation

---

## 📚 Additional Resources

- [QUOTE_API_DOCUMENTATION.md](./QUOTE_API_DOCUMENTATION.md) - Complete API reference
- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [React Query](https://tanstack.com/query/latest) - Consider for better data fetching

---

**Happy Coding! 🎉**
