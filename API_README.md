# Brain Capture API & Database

Complete API infrastructure and database setup for Brain Capture application.

## Table of Contents
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)

---

## Database Setup

### 1. Create Postgres Database

**Option A: Vercel Postgres (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage > Create Database
3. Select "Postgres" (powered by Neon)
4. Copy the connection string

**Option B: Neon Direct**
1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project
3. Copy the connection string

### 2. Configure Environment Variables

Create `.env.local` in project root:

```bash
POSTGRES_URL=postgresql://username:password@host/database?sslmode=require
```

### 3. Initialize Database Schema

Run the initialization script:

```bash
# Using psql
psql $POSTGRES_URL -f scripts/init-db.sql

# Or using Vercel Postgres CLI
vercel env pull .env.local
npm run db:init
```

### 4. Verify Connection

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## API Endpoints

### Ideas

#### Create Idea
```http
POST /api/ideas
Content-Type: application/json

{
  "content": "Build a todo app with AI",
  "user_id": "user123",
  "project_id": "uuid-here",
  "priority": "high",
  "capture_method": "quick",
  "tags": ["feature", "ai"]
}
```

#### List Ideas
```http
GET /api/ideas?user_id=user123&status=inbox&limit=20&offset=0
```

Query parameters:
- `user_id` (required): User identifier
- `status`: inbox | processed | archived | deleted
- `project_id`: Filter by project UUID
- `priority`: low | medium | high | urgent
- `search`: Search in content and polished text
- `tag`: Filter by tag name
- `limit`: Items per page (1-100, default: 20)
- `offset`: Pagination offset (default: 0)
- `sort`: created_at | updated_at | priority (default: created_at)
- `order`: asc | desc (default: desc)

#### Get Idea
```http
GET /api/ideas/{id}
```

#### Update Idea
```http
PUT /api/ideas/{id}
Content-Type: application/json

{
  "status": "processed",
  "polished": "Enhanced version of the idea",
  "priority": "urgent",
  "tags": ["feature", "priority"]
}
```

#### Delete Idea
```http
DELETE /api/ideas/{id}
```

### Projects

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "Work Ideas",
  "description": "Work-related thoughts",
  "color": "#10B981",
  "user_id": "user123"
}
```

#### List Projects
```http
GET /api/projects?user_id=user123&include_stats=true
```

Query parameters:
- `user_id` (required): User identifier
- `status`: active | archived | completed
- `include_stats`: Include idea counts (default: true)

#### Get Project
```http
GET /api/projects/{id}?include_stats=true
```

#### Update Project
```http
PUT /api/projects/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "archived"
}
```

#### Delete Project
```http
DELETE /api/projects/{id}
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**List Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "pages": 3
  }
}
```

**Error Response:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["content"],
      "message": "Content is required"
    }
  ]
}
```

---

## Database Schema

### Tables

#### `ideas`
Stores captured ideas and thoughts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| content | TEXT | Raw idea content |
| polished | TEXT | AI-enhanced version |
| project_id | UUID | Foreign key to projects |
| user_id | VARCHAR(255) | User identifier |
| status | VARCHAR(50) | inbox/processed/archived/deleted |
| priority | VARCHAR(50) | low/medium/high/urgent |
| capture_method | VARCHAR(50) | quick/voice/import/email/api |
| ai_processed | BOOLEAN | AI processing flag |
| ai_metadata | JSONB | AI processing metadata |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes:**
- `idx_ideas_user_id` on user_id
- `idx_ideas_project_id` on project_id
- `idx_ideas_status` on status
- `idx_ideas_created_at` on created_at DESC
- `idx_ideas_user_status` on (user_id, status)

#### `projects`
Organizes ideas into projects.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Project name |
| description | TEXT | Project description |
| color | VARCHAR(50) | Hex color code |
| status | VARCHAR(50) | active/archived/completed |
| user_id | VARCHAR(255) | User identifier |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes:**
- `idx_projects_user_id` on user_id
- `idx_projects_status` on status
- `idx_projects_user_status` on (user_id, status)

#### `tags`
Global tag registry.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | Tag name (unique) |
| created_at | TIMESTAMP | Creation time |

**Indexes:**
- `idx_tags_name` on name

#### `idea_tags`
Many-to-many relationship between ideas and tags.

| Column | Type | Description |
|--------|------|-------------|
| idea_id | UUID | Foreign key to ideas |
| tag_id | UUID | Foreign key to tags |
| created_at | TIMESTAMP | Creation time |

**Indexes:**
- `idx_idea_tags_idea_id` on idea_id
- `idx_idea_tags_tag_id` on tag_id

---

## Development

### Project Structure

```
src/
├── app/
│   └── api/
│       ├── ideas/
│       │   ├── route.ts          # POST, GET ideas
│       │   └── [id]/route.ts     # GET, PUT, DELETE idea
│       ├── projects/
│       │   ├── route.ts          # POST, GET projects
│       │   └── [id]/route.ts     # GET, PUT, DELETE project
│       └── health/
│           └── route.ts          # Health check
└── lib/
    ├── db.ts                     # Database client
    ├── validations.ts            # Zod schemas
    └── repositories/
        ├── ideas.ts              # Idea data access
        └── projects.ts           # Project data access

scripts/
└── init-db.sql                   # Database schema
```

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL 14+ (Vercel Postgres/Neon)
- **ORM**: Native Postgres client (@vercel/postgres)
- **Validation**: Zod
- **TypeScript**: Full type safety

### Running Locally

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL

# Initialize database
npm run db:init

# Start development server
npm run dev

# Test API
curl http://localhost:3000/api/health
```

### Testing API Endpoints

```bash
# Create an idea
curl -X POST http://localhost:3000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test idea",
    "user_id": "test-user"
  }'

# List ideas
curl "http://localhost:3000/api/ideas?user_id=test-user"

# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "user_id": "test-user"
  }'
```

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Add API infrastructure"
git push origin main
```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel Dashboard > Settings > Environment Variables
   - Add `POSTGRES_URL` with your connection string
   - Apply to Production, Preview, and Development

4. **Deploy**
   - Vercel will automatically deploy
   - Initialize database using Vercel Postgres dashboard

5. **Verify**
```bash
curl https://your-app.vercel.app/api/health
```

### Database Migration Strategy

**Initial Setup:**
1. Run `scripts/init-db.sql` in Vercel Postgres dashboard
2. Or connect via psql: `psql $POSTGRES_URL -f scripts/init-db.sql`

**Future Migrations:**
- Create numbered migration files: `scripts/migrations/001_add_column.sql`
- Run manually via Vercel dashboard or psql
- Consider migration tools like [node-pg-migrate](https://github.com/salsita/node-pg-migrate)

---

## Security Considerations

### Current Implementation
- Input validation with Zod
- SQL injection prevention (parameterized queries)
- UUID-based IDs (not sequential)
- CORS headers configured

### TODO: Add Authentication
```typescript
// Example: Add to API routes
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Use session.user.id as user_id
}
```

### TODO: Rate Limiting
Consider adding rate limiting with [Vercel Rate Limiting](https://vercel.com/docs/security/rate-limiting).

---

## Performance Optimizations

- **Connection Pooling**: Handled by @vercel/postgres
- **Indexes**: Created on frequently queried columns
- **Pagination**: Default limit of 20 items
- **Prepared Statements**: Parameterized queries prevent SQL injection
- **JSON Columns**: `ai_metadata` as JSONB for flexible data

---

## Troubleshooting

### Database Connection Errors

**Error**: `Connection refused`
- Verify `POSTGRES_URL` in `.env.local`
- Check database is running
- Ensure SSL mode is set: `?sslmode=require`

**Error**: `relation "ideas" does not exist`
- Run database initialization: `psql $POSTGRES_URL -f scripts/init-db.sql`

### API Errors

**Error**: `Validation failed`
- Check request body matches schema
- Verify required fields are present
- Check data types (UUIDs, enums, etc.)

**Error**: `CORS error`
- CORS headers are set in API routes
- For custom domains, update CORS configuration

---

## Next Steps

1. **Add Authentication**: Implement NextAuth.js or Clerk
2. **Add AI Processing**: Integrate OpenAI for idea polishing
3. **Add Search**: Implement full-text search with PostgreSQL
4. **Add Analytics**: Track usage patterns
5. **Add Webhooks**: Notify external systems of changes
6. **Add Export**: Allow users to export their data
7. **Add Batch Operations**: Bulk update/delete

---

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
