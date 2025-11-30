# Quote Collector - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         QuoteCollector Component                        │    │
│  │  (src/components/trackers/QuoteCollector.tsx)          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Quote Service (quoteService.ts)                │    │
│  │  - getAllQuoteSources()                                │    │
│  │  - createQuoteSource()                                 │    │
│  │  - fuzzySearchQuotes() ⭐                              │    │
│  │  - createQuote()                                       │    │
│  │  - updateQuote()                                       │    │
│  │  - deleteQuote()                                       │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     │ HTTP Requests                              │
│                     │ (with session auth)                        │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      │ REST API
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│                      BACKEND (Django)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              URL Router (urls.py)                       │    │
│  │  /api/quotes/sources/          → QuoteSourceViews      │    │
│  │  /api/quotes/search/           → FuzzySearchView ⭐    │    │
│  │  /api/quotes/{id}/             → QuoteViews            │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Views (views.py)                       │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  QuoteFuzzySearchView                        │     │    │
│  │  │  - Searches across all sources & quotes      │     │    │
│  │  │  - Uses SequenceMatcher for fuzzy matching   │     │    │
│  │  │  - Calculates relevance scores               │     │    │
│  │  │  - Returns sorted results                    │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  QuoteSourceListCreateView                   │     │    │
│  │  │  QuoteSourceDetailView                       │     │    │
│  │  │  QuoteListCreateView                         │     │    │
│  │  │  QuoteDetailView                             │     │    │
│  │  │  QuoteTagsView                               │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Serializers (serializers.py)                 │    │
│  │  - QuoteSourceSerializer                               │    │
│  │  - QuoteSerializer                                     │    │
│  │  - SearchResultSerializer                              │    │
│  │  - Data transformation & validation                    │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ▼                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Models (models.py)                         │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  QuoteSource                                 │     │    │
│  │  │  - id, title, type, cover_image             │     │    │
│  │  │  - user (FK to User)                        │     │    │
│  │  └──────────────────┬───────────────────────────┘     │    │
│  │                     │ 1-to-many                        │    │
│  │                     ▼                                  │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  Quote                                       │     │    │
│  │  │  - id, text, author, image                  │     │    │
│  │  │  - source (FK to QuoteSource)               │     │    │
│  │  └──────────────────┬───────────────────────────┘     │    │
│  │                     │ 1-to-many                        │    │
│  │                     ▼                                  │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  QuoteTag                                    │     │    │
│  │  │  - tag, quote (FK to Quote)                 │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ▼                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      │ SQL Queries
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│                    DATABASE (SQLite)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  tracker_quotesource                                   │    │
│  │  - id (PK), user_id (FK), title, type, cover_image    │    │
│  │  - created_at, updated_at                              │    │
│  │  [Indexes: user+title, user+type]                      │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  tracker_quote                                         │    │
│  │  - id (PK), source_id (FK), text, author, image       │    │
│  │  - created_at, updated_at                              │    │
│  │  [Indexes: source+author]                              │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  tracker_quotetag                                      │    │
│  │  - id (PK), quote_id (FK), tag                        │    │
│  │  [Indexes: tag]                                        │    │
│  │  [Unique: quote+tag]                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fuzzy Search Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User enters search query: "philosphy" (typo)                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Frontend calls: fuzzySearchQuotes("philosphy")              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. API Request: GET /api/quotes/search/?q=philosphy            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. QuoteFuzzySearchView processes request                      │
│     - Fetches all user's sources with quotes                    │
│     - For each source:                                          │
│       ┌─────────────────────────────────────────────────┐      │
│       │  a. Check title similarity                      │      │
│       │     "Bleach" vs "philosphy" → 0.1 (no match)   │      │
│       │                                                  │      │
│       │  b. For each quote:                             │      │
│       │     - Check text similarity                     │      │
│       │     - Check author similarity                   │      │
│       │     - Check tag similarity                      │      │
│       │       "philosophy" vs "philosphy" → 0.89 ✅     │      │
│       │       Score: 0.89 × 8 = 7.12                    │      │
│       │                                                  │      │
│       │  c. Add matched quotes to result                │      │
│       │  d. Calculate total relevance score             │      │
│       └─────────────────────────────────────────────────┘      │
│     - Sort results by relevance score (descending)              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Return search results:                                      │
│     {                                                            │
│       "results": [                                               │
│         {                                                        │
│           "source": { "id": "bleach", "title": "Bleach" },     │
│           "matched_quotes": [                                   │
│             {                                                    │
│               "text": "If miracles...",                         │
│               "tags": ["philosophy", "determination"]           │
│             }                                                    │
│           ],                                                     │
│           "relevance_score": 7.12,                              │
│           "match_type": "tag"                                   │
│         }                                                        │
│       ]                                                          │
│     }                                                            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Frontend displays results sorted by relevance               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Example: Creating a Quote

```
Frontend                    Backend                     Database
   │                          │                            │
   │  createQuote()           │                            │
   ├─────────────────────────>│                            │
   │  POST /api/quotes/       │                            │
   │  sources/bleach/quotes/  │                            │
   │                          │                            │
   │                          │  Validate data             │
   │                          │  (QuoteCreateUpdate        │
   │                          │   Serializer)              │
   │                          │                            │
   │                          │  Create Quote              │
   │                          ├───────────────────────────>│
   │                          │  INSERT INTO               │
   │                          │  tracker_quote             │
   │                          │                            │
   │                          │  Create Tags               │
   │                          ├───────────────────────────>│
   │                          │  INSERT INTO               │
   │                          │  tracker_quotetag          │
   │                          │                            │
   │                          │<───────────────────────────┤
   │                          │  Quote + Tags created      │
   │                          │                            │
   │  Response with           │                            │
   │  created quote           │                            │
   │<─────────────────────────┤                            │
   │                          │                            │
   │  Update UI               │                            │
   │                          │                            │
```

---

## Relevance Scoring Example

```
Query: "funny"

Source 1: "The Office"
├─ Title match: "The Office" vs "funny" → 0.1 (weak)
│  Score: 0.1 × 10 = 1.0
│
├─ Quote 1: "Would I rather be feared or loved..."
│  ├─ Text match: 0.05 (weak)
│  ├─ Author match: "Michael Scott" vs "funny" → 0.0
│  └─ Tag match: "funny" vs "funny" → 1.0 ✅
│     Score: 1.0 × 8 = 8.0
│
├─ Quote 2: "I'm not superstitious..."
│  └─ Tag match: "funny" → 1.0 ✅
│     Score: 8.0
│
└─ Total Score: 1.0 + 8.0 + 8.0 = 17.0 ⭐⭐⭐

Source 2: "Breaking Bad"
├─ Title match: 0.0
│
├─ Quote 1: "Yeah, bitch! Magnets!"
│  └─ Tag match: "funny" → 1.0 ✅
│     Score: 8.0
│
└─ Total Score: 8.0 ⭐

Results (sorted by score):
1. The Office (17.0) ← Appears first
2. Breaking Bad (8.0)
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User logs in via /api/auth/login/                           │
│     - Django creates session                                    │
│     - Session cookie sent to browser                            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. All subsequent requests include session cookie              │
│     - apiClient automatically includes credentials              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Backend validates session                                   │
│     - IsAuthenticated permission class                          │
│     - request.user populated with authenticated user            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Views filter data by user                                   │
│     - QuoteSource.objects.filter(user=request.user)            │
│     - User can only see their own quotes                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
backend/
├── tracker/
│   ├── models.py                    ← Database models
│   ├── serializers.py               ← API serializers
│   ├── views.py                     ← API views + fuzzy search
│   ├── urls.py                      ← URL routing
│   └── migrations/
│       └── 0002_quotesource_...py   ← Database migration
│
├── QUOTE_API_DOCUMENTATION.md       ← Complete API reference
├── QUOTE_INTEGRATION_GUIDE.md       ← Integration instructions
├── QUOTE_IMPLEMENTATION_SUMMARY.md  ← Technical overview
├── QUOTE_QUICK_REFERENCE.md         ← Quick reference
└── QUOTE_ARCHITECTURE.md            ← This file

frontend/
└── src/
    ├── services/
    │   └── quoteService.ts          ← API client service
    │
    ├── components/
    │   └── trackers/
    │       └── QuoteCollector.tsx   ← Main component (to be updated)
    │
    └── types.ts                     ← TypeScript types
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend                                                        │
│  - Next.js (React framework)                                    │
│  - TypeScript (type safety)                                     │
│  - Tailwind CSS (styling)                                       │
│  - Axios (HTTP client via apiClient)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Backend                                                         │
│  - Django 5.2.8 (web framework)                                 │
│  - Django REST Framework (API framework)                        │
│  - Python difflib.SequenceMatcher (fuzzy matching)             │
│  - SQLite (database - production: PostgreSQL)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Authentication                                                  │
│  - Django Session Authentication                                │
│  - CSRF Protection                                              │
│  - User isolation via foreign keys                              │
└─────────────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Clean separation of concerns
- ✅ RESTful API design
- ✅ Efficient database queries
- ✅ Fuzzy search with relevance scoring
- ✅ User data isolation
- ✅ Type-safe frontend integration
- ✅ Scalable and maintainable code
