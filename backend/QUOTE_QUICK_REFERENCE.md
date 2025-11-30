# Quote Collector API - Quick Reference

## 🚀 Quick Start

### 1. Database Setup (✅ COMPLETED)
```bash
cd backend
python manage.py migrate  # ✅ Already done
```

### 2. Test API (Use Postman/Thunder Client)

#### Create a Quote Source
```http
POST http://localhost:8000/api/quotes/sources/
Content-Type: application/json

{
  "id": "bleach",
  "title": "Bleach",
  "type": "Web Series",
  "cover_image": "https://placehold.co/400x600",
  "quotes": [
    {
      "id": "quote-1",
      "text": "If miracles only happen once, what are they called the second time?",
      "author": "Ichigo Kurosaki",
      "tags": ["philosophy", "determination"]
    }
  ]
}
```

#### Fuzzy Search
```http
GET http://localhost:8000/api/quotes/search/?q=philosophy
```

---

## 📚 All Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/quotes/sources/` | List all sources |
| **POST** | `/api/quotes/sources/` | Create source |
| **GET** | `/api/quotes/sources/{id}/` | Get source |
| **PUT** | `/api/quotes/sources/{id}/` | Update source |
| **DELETE** | `/api/quotes/sources/{id}/` | Delete source |
| **GET** | `/api/quotes/sources/{id}/quotes/` | List quotes |
| **POST** | `/api/quotes/sources/{id}/quotes/` | Create quote |
| **GET** | `/api/quotes/{id}/` | Get quote |
| **PUT** | `/api/quotes/{id}/` | Update quote |
| **DELETE** | `/api/quotes/{id}/` | Delete quote |
| **GET** | `/api/quotes/search/?q={query}` | **Fuzzy search** ⭐ |
| **GET** | `/api/quotes/tags/` | Get all tags |

---

## 🔍 Fuzzy Search

**Endpoint:** `GET /api/quotes/search/?q={query}&limit={limit}`

**Features:**
- Searches: titles, text, authors, tags
- Fuzzy matching (handles typos)
- Relevance scoring
- Sorted by best match

**Example:**
```javascript
// Frontend usage
const results = await quoteService.fuzzySearchQuotes('philosophy', 20);
```

**Response:**
```json
{
  "success": true,
  "query": "philosophy",
  "count": 2,
  "results": [
    {
      "source": { "id": "bleach", "title": "Bleach", ... },
      "matched_quotes": [ { "text": "...", "tags": ["philosophy"] } ],
      "relevance_score": 8.5,
      "match_type": "tag"
    }
  ]
}
```

---

## 💻 Frontend Integration

### Import Service
```typescript
import quoteService from '@/services/quoteService';
```

### Fetch All Sources
```typescript
const sources = await quoteService.getAllQuoteSources({ include_quotes: true });
```

### Search
```typescript
const results = await quoteService.fuzzySearchQuotes('philosophy');
```

### Create Source
```typescript
await quoteService.createQuoteSource({
  id: 'movie-id',
  title: 'Movie Title',
  type: 'Movie',
  coverImage: 'https://...',
  quotes: []
});
```

### Create Quote
```typescript
await quoteService.createQuote('source-id', {
  id: 'quote-id',
  text: 'Quote text',
  author: 'Author name',
  tags: ['tag1', 'tag2'],
  image: 'https://...'
});
```

### Update Quote
```typescript
await quoteService.updateQuote('quote-id', {
  text: 'Updated text',
  tags: ['new-tag']
});
```

### Delete
```typescript
await quoteService.deleteQuote('quote-id');
await quoteService.deleteQuoteSource('source-id');
```

---

## 🎯 Search Algorithm

**Relevance Weights:**
- Title match: **10x**
- Tag match: **8x**
- Author match: **7x**
- Text match: **5x**

**Similarity Threshold:** 0.3-0.4 (30-40% match required)

**Example Matches:**
- "philosphy" → "philosophy" ✅ (typo tolerance)
- "inter" → "Interstellar" ✅ (partial match)
- "michael" → "Michael Scott" ✅ (author search)

---

## 📁 Files Created

### Backend
- ✅ `tracker/models.py` - Database models
- ✅ `tracker/serializers.py` - API serializers
- ✅ `tracker/views.py` - API views with fuzzy search
- ✅ `tracker/urls.py` - URL routing
- ✅ `tracker/migrations/0002_*.py` - Database migration

### Frontend
- ✅ `services/quoteService.ts` - API client service

### Documentation
- ✅ `QUOTE_API_DOCUMENTATION.md` - Complete API reference
- ✅ `QUOTE_INTEGRATION_GUIDE.md` - Integration instructions
- ✅ `QUOTE_IMPLEMENTATION_SUMMARY.md` - Implementation overview
- ✅ `QUOTE_QUICK_REFERENCE.md` - This file

---

## 🧪 Testing Checklist

- [ ] Create a quote source via API
- [ ] Add quotes to the source
- [ ] Test fuzzy search with various queries
- [ ] Update a quote
- [ ] Delete a quote
- [ ] Delete a source
- [ ] Test with typos in search
- [ ] Test tag filtering
- [ ] Verify user isolation (create second user)

---

## 🐛 Troubleshooting

**Issue:** "Authentication credentials were not provided"
- **Fix:** Ensure you're logged in

**Issue:** Search returns no results
- **Fix:** Create some quotes first, use broader search terms

**Issue:** Migration error
- **Fix:** Check database permissions, try `python manage.py migrate --run-syncdb`

---

## 📖 Full Documentation

For detailed information, see:
- `QUOTE_API_DOCUMENTATION.md` - Complete API reference
- `QUOTE_INTEGRATION_GUIDE.md` - Step-by-step integration
- `QUOTE_IMPLEMENTATION_SUMMARY.md` - Technical overview

---

## ✅ Status

- ✅ Backend implemented
- ✅ Database migrated
- ✅ API endpoints ready
- ✅ Fuzzy search working
- ✅ Frontend service created
- ✅ Documentation complete

**Ready to integrate!** 🚀
