# Quote Collector API Documentation

This document describes all API endpoints for the Quote Collector feature.

## Base URL
All endpoints are prefixed with `/api/`

## Authentication
All endpoints require authentication. Include the session cookie or authentication token with each request.

---

## Quote Sources

### 1. List All Quote Sources
**Endpoint:** `GET /api/quotes/sources/`

**Description:** Retrieve all quote sources for the authenticated user.

**Query Parameters:**
- `type` (optional): Filter by source type (`Movie`, `Web Series`, `Book`)
- `include_quotes` (optional): Include full quotes in response (default: `true`)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "sources": [
    {
      "id": "bleach",
      "title": "Bleach",
      "type": "Web Series",
      "cover_image": "https://example.com/bleach.jpg",
      "quote_count": 5,
      "quotes": [
        {
          "id": "quote-uuid-1",
          "text": "If miracles only happen once...",
          "author": "Ichigo Kurosaki",
          "tags": ["philosophy", "determination"],
          "image": null,
          "created_at": "2025-11-30T10:00:00Z",
          "updated_at": "2025-11-30T10:00:00Z"
        }
      ],
      "created_at": "2025-11-30T10:00:00Z",
      "updated_at": "2025-11-30T10:00:00Z"
    }
  ]
}
```

---

### 2. Create Quote Source
**Endpoint:** `POST /api/quotes/sources/`

**Description:** Create a new quote source with optional quotes.

**Request Body:**
```json
{
  "id": "interstellar",
  "title": "Interstellar",
  "type": "Movie",
  "cover_image": "https://example.com/interstellar.jpg",
  "quotes": [
    {
      "id": "quote-uuid-1",
      "text": "Do not go gentle into that good night...",
      "author": "Professor Brand",
      "tags": ["poetry", "determination"],
      "image": "https://example.com/quote-image.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "source": {
    "id": "interstellar",
    "title": "Interstellar",
    "type": "Movie",
    "cover_image": "https://example.com/interstellar.jpg",
    "quote_count": 1,
    "quotes": [...],
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z"
  }
}
```

---

### 3. Get Quote Source Details
**Endpoint:** `GET /api/quotes/sources/{source_id}/`

**Description:** Retrieve a specific quote source with all its quotes.

**Response:**
```json
{
  "success": true,
  "source": {
    "id": "bleach",
    "title": "Bleach",
    "type": "Web Series",
    "cover_image": "https://example.com/bleach.jpg",
    "quote_count": 5,
    "quotes": [...],
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z"
  }
}
```

---

### 4. Update Quote Source
**Endpoint:** `PUT /api/quotes/sources/{source_id}/`

**Description:** Update a quote source's metadata (title, type, cover image).

**Request Body:**
```json
{
  "title": "Bleach: Thousand-Year Blood War",
  "type": "Web Series",
  "cover_image": "https://example.com/bleach-new.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "source": {
    "id": "bleach",
    "title": "Bleach: Thousand-Year Blood War",
    ...
  }
}
```

---

### 5. Delete Quote Source
**Endpoint:** `DELETE /api/quotes/sources/{source_id}/`

**Description:** Delete a quote source and all its associated quotes.

**Response:**
```json
{
  "success": true,
  "message": "Quote source deleted successfully"
}
```

---

## Quotes

### 6. List Quotes for a Source
**Endpoint:** `GET /api/quotes/sources/{source_id}/quotes/`

**Description:** Retrieve all quotes for a specific source.

**Query Parameters:**
- `tag` (optional): Filter quotes by tag

**Response:**
```json
{
  "success": true,
  "count": 5,
  "quotes": [
    {
      "id": "quote-uuid-1",
      "text": "If miracles only happen once...",
      "author": "Ichigo Kurosaki",
      "tags": ["philosophy", "determination"],
      "image": null,
      "created_at": "2025-11-30T10:00:00Z",
      "updated_at": "2025-11-30T10:00:00Z"
    }
  ]
}
```

---

### 7. Create Quote
**Endpoint:** `POST /api/quotes/sources/{source_id}/quotes/`

**Description:** Add a new quote to a source.

**Request Body:**
```json
{
  "id": "quote-uuid-2",
  "text": "Fear is not evil. It tells you what your weakness is.",
  "author": "Gildarts Clive",
  "tags": ["fear", "strength"],
  "image": "https://example.com/quote-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "quote": {
    "id": "quote-uuid-2",
    "text": "Fear is not evil...",
    "author": "Gildarts Clive",
    "tags": ["fear", "strength"],
    "image": "https://example.com/quote-image.jpg",
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z"
  }
}
```

---

### 8. Get Quote Details
**Endpoint:** `GET /api/quotes/{quote_id}/`

**Description:** Retrieve a specific quote.

**Response:**
```json
{
  "success": true,
  "quote": {
    "id": "quote-uuid-1",
    "text": "If miracles only happen once...",
    "author": "Ichigo Kurosaki",
    "tags": ["philosophy", "determination"],
    "image": null,
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T10:00:00Z"
  }
}
```

---

### 9. Update Quote
**Endpoint:** `PUT /api/quotes/{quote_id}/`

**Description:** Update a quote's content, author, tags, or image.

**Request Body:**
```json
{
  "text": "Updated quote text",
  "author": "Updated Author",
  "tags": ["new-tag", "another-tag"],
  "image": "https://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "quote": {
    "id": "quote-uuid-1",
    "text": "Updated quote text",
    "author": "Updated Author",
    "tags": ["new-tag", "another-tag"],
    "image": "https://example.com/new-image.jpg",
    "created_at": "2025-11-30T10:00:00Z",
    "updated_at": "2025-11-30T11:00:00Z"
  }
}
```

---

### 10. Delete Quote
**Endpoint:** `DELETE /api/quotes/{quote_id}/`

**Description:** Delete a specific quote.

**Response:**
```json
{
  "success": true,
  "message": "Quote deleted successfully"
}
```

---

## Search

### 11. Fuzzy Search
**Endpoint:** `GET /api/quotes/search/?q={query}`

**Description:** Search across all quote sources and quotes using fuzzy matching. Searches in:
- Source titles
- Quote text
- Authors
- Tags

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `limit` (optional): Maximum number of results (default: 20)

**Search Algorithm:**
- Uses fuzzy string matching with similarity scoring
- Matches are weighted by relevance:
  - Title matches: 10x weight
  - Tag matches: 8x weight
  - Author matches: 7x weight
  - Text matches: 5x weight
- Results sorted by relevance score (highest first)

**Example Request:**
```
GET /api/quotes/search/?q=philosophy&limit=10
```

**Response:**
```json
{
  "success": true,
  "query": "philosophy",
  "count": 3,
  "results": [
    {
      "source": {
        "id": "bleach",
        "title": "Bleach",
        "type": "Web Series",
        "cover_image": "https://example.com/bleach.jpg",
        "quote_count": 5,
        "created_at": "2025-11-30T10:00:00Z",
        "updated_at": "2025-11-30T10:00:00Z"
      },
      "matched_quotes": [
        {
          "id": "quote-uuid-1",
          "text": "If miracles only happen once...",
          "author": "Ichigo Kurosaki",
          "tags": ["philosophy", "determination"],
          "image": null,
          "created_at": "2025-11-30T10:00:00Z",
          "updated_at": "2025-11-30T10:00:00Z"
        }
      ],
      "relevance_score": 8.5,
      "match_type": "tag, text"
    }
  ]
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Search query is required"
}
```

```json
{
  "success": false,
  "error": "Search query must be at least 2 characters"
}
```

---

## Tags

### 12. Get All Tags
**Endpoint:** `GET /api/quotes/tags/`

**Description:** Retrieve all unique tags used across all user's quotes.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "tags": [
    "danger",
    "determination",
    "fear",
    "friendship",
    "funny",
    "hope",
    "humanity",
    "iconic",
    "impersonation",
    "love",
    "philosophy",
    "poetry",
    "power",
    "science",
    "strength",
    "superstition",
    "truth",
    "warning",
    "wisdom"
  ]
}
```

---

## Data Models

### QuoteSource
```typescript
{
  id: string;              // Unique identifier
  title: string;           // Source title
  type: 'Movie' | 'Web Series' | 'Book';
  cover_image: string;     // URL to cover image
  quote_count: number;     // Number of quotes (read-only)
  quotes: Quote[];         // Array of quotes
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

### Quote
```typescript
{
  id: string;              // Unique identifier
  text: string;            // Quote text
  author: string;          // Quote author
  tags: string[];          // Array of tag strings
  image?: string;          // Optional image URL
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Quote source not found"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Integration Notes

### Frontend Integration Steps:

1. **Create API Service** (`frontend/src/services/quoteService.ts`):
   - Implement methods for all CRUD operations
   - Use the fuzzy search endpoint for search functionality
   - Handle authentication with session cookies

2. **Update QuoteCollector Component**:
   - Replace local state management with API calls
   - Implement loading states and error handling
   - Use the fuzzy search API instead of local filtering

3. **Sync Endpoint**:
   - The `/api/sync/` endpoint now includes quotes data
   - Use this for initial data load

### Migration Strategy:

1. Run migrations: `python manage.py makemigrations && python manage.py migrate`
2. Create initial quote sources from dummy data
3. Update frontend to use API instead of local storage
4. Test all CRUD operations
5. Test fuzzy search with various queries

---

## Performance Considerations

- **Pagination**: Consider adding pagination for large quote collections
- **Caching**: Implement caching for frequently accessed sources
- **Indexing**: Database indexes are already set up for:
  - User + Title lookups
  - User + Type filtering
  - Tag searches
  - Source + Author lookups

---

## Future Enhancements

1. **Bulk Operations**: Add endpoints for bulk import/export
2. **Quote Sharing**: Add public sharing URLs
3. **Advanced Filters**: Filter by date range, multiple tags, etc.
4. **Full-Text Search**: Integrate PostgreSQL full-text search for better performance
5. **Quote Collections**: Group quotes into custom collections
6. **Favorites**: Mark favorite quotes
7. **Statistics**: Add analytics for most-used tags, authors, etc.
