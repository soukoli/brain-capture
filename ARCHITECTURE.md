# Architecture

Technical architecture and implementation details for Brain Capture.

## Overview

Brain Capture is a Next.js 15 application with a PostgreSQL database, designed for mobile-first task capture and organization.

## Architecture Layers

### Current State

The application has been cleaned up from the old implementation. The following remain:

**Frontend:**

- Next.js 15 App Router structure
- Basic home page (landing page)
- UI components: Button, Card, Select, Tabs (Radix UI)
- Navbar component (layout)

**Backend:**

- API routes: `/api/health`, `/api/check-env`
- Database layer with Drizzle ORM
- Database schema defined in `src/lib/db/schema.ts`

**To be implemented for MVP:**

- Project management pages
- Task capture and organization
- Today's focus view
- Mobile-first UI components

### Previous Architecture (Removed)

The following have been removed as they were part of an over-complex implementation:

- `/capture` page with voice input
- `/dashboard` page with complex task board
- `/examples/voice-input` demo page
- Voice recognition hooks and components
- Old repository layer using `sql` template tags
- Complex API routes for projects/ideas/dashboard
- E2E tests for old implementation

### 3. Database (PostgreSQL)

```
┌──────────────┐         ┌──────────────┐
│   projects   │◄────┐   │     tags     │
├──────────────┤     │   ├──────────────┤
│ id           │     │   │ id           │
│ name         │     │   │ name         │
│ color        │     │   └──────────────┘
│ description  │     │          │
│ status       │     │          │
│ user_id      │     │          │
└──────────────┘     │          │
       ▲             │          │
       │             │          │
       │             │          ▼
┌──────────────┐     │   ┌──────────────┐
│    ideas     │─────┘   │  idea_tags   │
├──────────────┤         ├──────────────┤
│ id           │◄────────│ idea_id      │
│ content      │         │ tag_id       │
│ polished     │         └──────────────┘
│ project_id   │ (FK)
│ user_id      │
│ status       │
│ priority     │
│ created_at   │
└──────────────┘
```

## Database Connection Strategy

The application supports three database connection methods with automatic fallback:

### Priority Order

1. **POSTGRES_URL** (highest priority)
   - Standard connection string
   - Simplest for development and Vercel Postgres

2. **IAM Authentication** (AWS RDS + Vercel)
   - Uses Vercel OIDC token to assume AWS role
   - Generates temporary RDS authentication token
   - Required env vars: `PGHOST`, `PGUSER`, `PGDATABASE`, `AWS_REGION`, `AWS_ROLE_ARN`, `VERCEL_OIDC_TOKEN`

3. **Standard PG Credentials**
   - Individual connection parameters
   - Required: `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPORT`

### Connection Pooling

- Uses `pg` Pool for connection management
- Pool is created once and reused across requests
- For IAM auth, tokens are regenerated per connection (required for 15-min token expiration)

## Database Schema

### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT '#3B82F6',
  status VARCHAR(50) DEFAULT 'active',
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Status values**: `active`, `archived`, `completed`

### Ideas Table

```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  polished TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'inbox',
  priority VARCHAR(50),
  capture_method VARCHAR(50),
  ai_processed BOOLEAN DEFAULT false,
  ai_metadata JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  focus_warning_threshold INTEGER DEFAULT 7200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Status values**: `inbox`, `in-progress`, `completed`, `archived`, `deleted`

**Priority values**: `low`, `medium`, `high`, `urgent`

**Capture methods**: `quick`, `voice`, `import`, `email`, `api`

### Tags Tables

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE idea_tags (
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (idea_id, tag_id)
);
```

### Key Indexes

```sql
-- Ideas
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_project_id ON ideas(project_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_user_status ON ideas(user_id, status);

-- Projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);

-- Tags
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_idea_tags_idea_id ON idea_tags(idea_id);
CREATE INDEX idx_idea_tags_tag_id ON idea_tags(tag_id);
```

### Triggers

Automatic `updated_at` timestamp updates:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Type System

### Database Types (`src/lib/db.ts`)

Match PostgreSQL schema exactly:

```typescript
interface Idea {
  id: string;
  content: string;
  polished: string | null;
  project_id: string | null;
  user_id: string;
  status: "inbox" | "in-progress" | "completed" | "archived" | "deleted";
  priority: "low" | "medium" | "high" | "urgent" | null;
  created_at: Date;
  updated_at: Date;
  // ... other fields
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: "active" | "archived" | "completed";
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
```

### Frontend Types (`src/lib/types.ts`)

To be defined based on MVP requirements. Will follow camelCase convention for consistency with JavaScript/TypeScript naming standards.

## Repository Pattern

To be implemented using Drizzle ORM for the MVP. Will provide a clean data access layer for:

- Project CRUD operations
- Task/Idea CRUD operations
- Query methods for dashboard views

## API Design

Currently only diagnostic API routes exist:

- `GET /api/health` - Database health check
- `GET /api/check-env` - Environment variable diagnostic

**To be implemented for MVP:**

All API routes will follow REST conventions with Drizzle ORM for data access.

## Frontend State Management

Currently using local component state. For v1 MVP, no global state management is needed.

Future considerations:

- React Context for user session
- SWR or React Query for server state caching

## Mobile-First Design

### Responsive Breakpoints (Tailwind)

```
sm:  640px   (Small tablets)
md:  768px   (Tablets)
lg:  1024px  (Laptops)
xl:  1280px  (Desktops)
```

### Touch Targets

All interactive elements minimum 44x44px for touch accessibility.

### Mobile Navigation

- Bottom tab bar on mobile
- Side navigation on desktop

## Performance Considerations

### Database

- Indexes on frequently queried fields
- Connection pooling to reduce overhead
- Prepared statements via parameterized queries

### Frontend

- Next.js server components for initial render
- Client components only when interactivity needed
- Image optimization via Next.js Image component

### Caching

- Static pages cached at CDN (Vercel Edge Network)
- API responses use appropriate cache headers
- Database connection pool reused across requests

## Security

### SQL Injection Prevention

All queries use parameterized statements:

```typescript
await sql`SELECT * FROM ideas WHERE id = ${id}`;
// NOT: `SELECT * FROM ideas WHERE id = '${id}'`
```

### Input Validation

Zod schemas validate all user input before database operations.

### Environment Variables

- Never commit secrets to git
- Use Vercel environment variables in production
- `.env.local` for local development (gitignored)

## Testing Strategy

To be implemented for MVP. Will use Playwright for E2E tests covering:

- Project creation and management
- Task capture and organization
- Mobile-specific interactions
- Keyboard shortcuts

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Auto-detected as Next.js project
3. Set environment variables in dashboard
4. Automatic deployments on git push

### Environment Setup

Production environment variables:

- Database credentials (Vercel Postgres or AWS RDS)
- AWS credentials (if using IAM auth)

### Database Migrations

For production:

1. Generate migrations: `npm run db:generate`
2. Commit migration files to git
3. Deploy to Vercel (migrations run automatically)
4. Or use Vercel Postgres dashboard SQL editor to run `scripts/init-db.sql`

## Future Enhancements (Post-MVP)

**Not in scope for v1**, but schema supports:

- AI-powered task processing (`ai_processed`, `ai_metadata`)
- Time tracking (`time_spent_seconds`, `started_at`, `completed_at`)
- Priority management (`priority` field)
- Tagging system (`tags`, `idea_tags` tables)
- Voice capture (`capture_method: 'voice'`)

## Troubleshooting

### Database Connection Issues

```bash
# Check connection
npm run db:health

# Verify environment variables
npm run dev  # Check console for connection logs
```

### IAM Authentication Failures

- Verify AWS role trust relationship includes Vercel OIDC provider
- Check `VERCEL_OIDC_TOKEN` is available (only in Vercel runtime)
- Ensure RDS security group allows Vercel IP ranges

### Build Failures

```bash
# Type check
npm run type-check

# Lint check
npm run lint

# Run all checks
npm run check
```

## Development Guidelines

### Code Style

- Prettier for formatting (auto-runs on commit)
- ESLint for code quality
- TypeScript strict mode enabled

### Commit Convention

Follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
chore: maintenance tasks
```

See `.github/COMMIT_CONVENTION.md` for details.

### File Organization

```
src/
├── app/              # Pages and API routes (Next.js App Router)
├── components/       # React components (organized by feature)
├── lib/             # Shared utilities
│   ├── repositories/ # Data access layer
│   ├── db.ts        # Database connection
│   ├── types.ts     # Type definitions
│   └── utils.ts     # Helper functions
└── hooks/           # Custom React hooks
```

Keep components focused and single-purpose. Extract shared logic to `lib/` utilities.
