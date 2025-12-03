# Planner API Documentation

## Overview
The Planner API provides endpoints to manage a visual planning canvas with draggable blocks, tasks, and connections between blocks. Each user has their own planner data including blocks, links, and canvas transform settings.

## Data Structure

### PlannerData
```typescript
{
  blocks: TodoBlock[],
  links: BlockLink[],
  transform: CanvasTransform
}
```

### TodoBlock
```typescript
{
  id: string,
  title: string,
  x: number,
  y: number,
  tasks: Task[]
}
```

### Task
```typescript
{
  id: string,
  text: string,
  completed: boolean
}
```

### BlockLink
```typescript
{
  id: string,
  from: string,  // block ID
  to: string     // block ID
}
```

### CanvasTransform
```typescript
{
  scale: number,
  panX: number,
  panY: number
}
```

## Endpoints

### 1. Get Planner Data
**GET** `/api/planner/`

Retrieves all planner data for the authenticated user.

**Response:**
```json
{
  "success": true,
  "planner": {
    "blocks": [
      {
        "id": "block-uuid-1",
        "title": "Sprint Planning",
        "x": 100,
        "y": 150,
        "tasks": [
          {
            "id": "task-uuid-1",
            "text": "Review backlog",
            "completed": false
          },
          {
            "id": "task-uuid-2",
            "text": "Estimate stories",
            "completed": true
          }
        ]
      }
    ],
    "links": [
      {
        "id": "link-uuid-1",
        "from": "block-uuid-1",
        "to": "block-uuid-2"
      }
    ],
    "transform": {
      "scale": 1,
      "panX": 0,
      "panY": 0
    }
  }
}
```

---

### 2. Update Planner Data (Full Replace)
**PUT** `/api/planner/`

Replaces all planner data for the user. This will delete existing blocks and links and create new ones.

**Request Body:**
```json
{
  "blocks": [
    {
      "id": "block-uuid-1",
      "title": "New Block",
      "x": 200,
      "y": 300,
      "tasks": [
        {
          "id": "task-uuid-1",
          "text": "Task 1",
          "completed": false
        }
      ]
    }
  ],
  "links": [
    {
      "id": "link-uuid-1",
      "from": "block-uuid-1",
      "to": "block-uuid-2"
    }
  ],
  "transform": {
    "scale": 1.5,
    "panX": 100,
    "panY": 50
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Planner data updated successfully"
}
```

---

### 3. Partial Update Planner Data
**PATCH** `/api/planner/`

Partially updates planner data. Only the provided fields will be updated.

**Request Body Examples:**

**Update only blocks:**
```json
{
  "blocks": [
    {
      "id": "block-uuid-1",
      "title": "Updated Title",
      "x": 250,
      "y": 350,
      "tasks": [...]
    }
  ]
}
```

**Update only transform:**
```json
{
  "transform": {
    "scale": 1.2,
    "panX": 50,
    "panY": 25
  }
}
```

**Update only links:**
```json
{
  "links": [
    {
      "id": "link-uuid-1",
      "from": "block-uuid-1",
      "to": "block-uuid-2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Planner data updated successfully"
}
```

---

### 4. Get Specific Block
**GET** `/api/planner/blocks/<block_id>/`

Retrieves a specific block with its tasks.

**Response:**
```json
{
  "success": true,
  "block": {
    "id": "block-uuid-1",
    "title": "Sprint Planning",
    "x": 100,
    "y": 150,
    "tasks": [
      {
        "id": "task-uuid-1",
        "text": "Review backlog",
        "completed": false
      }
    ]
  }
}
```

---

### 5. Update Specific Block
**PUT** `/api/planner/blocks/<block_id>/`

Updates a specific block and optionally its tasks.

**Request Body:**
```json
{
  "title": "Updated Block Title",
  "x": 300,
  "y": 400,
  "tasks": [
    {
      "id": "task-uuid-1",
      "text": "Updated task",
      "completed": true
    },
    {
      "id": "task-uuid-2",
      "text": "New task",
      "completed": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Block updated successfully"
}
```

---

### 6. Delete Specific Block
**DELETE** `/api/planner/blocks/<block_id>/`

Deletes a specific block and all its associated links.

**Response:**
```json
{
  "success": true,
  "message": "Block deleted successfully"
}
```

---

## Usage Examples

### Frontend Integration

```typescript
import { plannerService } from '@/services/plannerService';

// Get planner data
const plannerData = await plannerService.getPlanner();

// Update entire planner
await plannerService.updatePlanner({
  blocks: [...],
  links: [...],
  transform: {...}
});

// Sync changes (partial update)
await plannerService.syncPlanner({
  blocks: updatedBlocks,
  transform: newTransform
});

// Delete a block
await plannerService.deleteBlock('block-uuid-1');
```

### Auto-save Implementation

```typescript
import { useEffect } from 'react';
import { debounce } from 'lodash';

const Planner = () => {
  const { plannerData } = useContext(DataContext);

  // Auto-save with debouncing
  useEffect(() => {
    const saveToBackend = debounce(async () => {
      await plannerService.syncPlanner(plannerData);
    }, 2000);

    saveToBackend();

    return () => saveToBackend.cancel();
  }, [plannerData]);

  // ... rest of component
};
```

---

## Database Models

### PlannerBlock
- `id` (CharField, PK): UUID
- `user` (ForeignKey): User
- `title` (CharField): Block title
- `x` (FloatField): X position
- `y` (FloatField): Y position
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### PlannerTask
- `id` (CharField, PK): UUID
- `block` (ForeignKey): PlannerBlock
- `text` (CharField): Task text
- `completed` (BooleanField): Completion status
- `order` (IntegerField): Display order
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

### PlannerLink
- `id` (CharField, PK): UUID
- `user` (ForeignKey): User
- `from_block` (ForeignKey): Source block
- `to_block` (ForeignKey): Target block
- `created_at` (DateTimeField)

### PlannerSettings
- `user` (OneToOneField): User
- `transform` (JSONField): Canvas transform state
- `created_at` (DateTimeField)
- `updated_at` (DateTimeField)

---

## Authentication
All endpoints require authentication. Include the session cookie or authentication token with each request.

## Error Handling

### 400 Bad Request
Invalid data format or missing required fields.

### 401 Unauthorized
User is not authenticated.

### 404 Not Found
Block with specified ID does not exist or doesn't belong to the user.

### 500 Internal Server Error
Server-side error occurred.

---

## Notes

1. **UUIDs**: All IDs (blocks, tasks, links) should be valid UUIDs generated on the client side.
2. **Cascade Deletion**: Deleting a block will automatically delete all its tasks and associated links.
3. **Transform Defaults**: If no transform is provided, defaults to `{scale: 1, panX: 0, panY: 0}`.
4. **Task Ordering**: Tasks are ordered by the `order` field, which is automatically set based on array position.
5. **Idempotency**: PUT and PATCH operations are idempotent - calling them multiple times with the same data produces the same result.
