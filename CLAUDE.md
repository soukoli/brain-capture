# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brain Capture is a minimal personal task management system focused on **mobile-first** usage. The core philosophy is clarity, speed, and visual progress over complex productivity features.

**Current Status**: The codebase has been cleaned up from an over-complex initial implementation. We now have a clean slate with:

- Database schema (Drizzle ORM + PostgreSQL) in `src/lib/db/schema.ts`
- Basic Next.js 15 structure with home page
- UI component library (Radix UI components)
- Health and diagnostic API endpoints
- Docker Compose setup for local development

**Ready to implement**: The simplified MVP as described in `Idea/IDEA.MD`.

### Core Workflow

1. Create projects (with name and color)
2. Capture tasks/notes quickly
3. Organize tasks under projects
4. Select tasks to work on "Today"
5. Complete tasks and see progress

**No reminders, no automation, no complexity** - just capture → organize → execute → finish.

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Next.js API routes + PostgreSQL
- **Database**: PostgreSQL via `@vercel/postgres` or AWS RDS with IAM auth
- **Testing**: Playwright for E2E tests
- **Code Quality**: ESLint, Prettier, Husky

### Database Connection Strategy

The app supports multiple database connection methods with priority order:

1. **POSTGRES_URL** (highest priority) - Standard connection string
2. **IAM Authentication** - AWS RDS with Vercel OIDC token (requires `PGHOST`, `PGUSER`, `PGDATABASE`, `AWS_REGION`, `AWS_ROLE_ARN`, `VERCEL_OIDC_TOKEN`)
3. **Standard PG credentials** - Individual env vars (`PGHOST`, `PGUSER`, `PGDATABASE`, `PGPORT`)

All env vars support `test_` prefix fallback for local testing.

### Database Schema

Database schema is defined using Drizzle ORM in `src/lib/db/schema.ts`. Core tables:

- **projects**: User projects with name, color, status, description
- **ideas**: Tasks/notes with content, status (inbox/in-progress/completed/archived/deleted), priority, capture_method, AI metadata
- **tags**: Tag definitions
- **idea_tags**: Many-to-many junction table

Key constraint: Ideas reference projects with `ON DELETE SET NULL` (deleting a project orphans its ideas, doesn't delete them).

### Key Files

- `src/lib/db/` - Drizzle ORM database connection and schema
  - `schema.ts` - Database schema definitions
  - `index.ts` - Connection pool and DB instance
- `src/lib/types.ts` - Frontend types (to be defined for MVP)
- `src/lib/validations.ts` - Input validation schemas (to be implemented)
- `src/app/api/` - API route handlers (currently only health and check-env)
- `src/components/ui/` - Radix UI components (Button, Card, Select, Tabs)
- `src/components/layout/` - Layout components (Navbar)

### Database Types

Drizzle ORM provides type-safe database access. Types are exported from `src/lib/db/schema.ts`:

- `Project`, `NewProject` - Project table types
- `Idea`, `NewIdea` - Ideas/tasks table types
- `Tag`, `NewTag` - Tag table types
- `IdeaTag`, `NewIdeaTag` - Junction table types

All database fields use camelCase in Drizzle schema (e.g., `projectId`, `createdAt`).

## Development Commands

### Setup

```bash
npm install
npm run db:setup         # Run database setup script
npm run db:init          # Initialize database schema from scripts/init-db.sql
npm run db:health        # Check database connection
```

### Development

```bash
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting without writing
npm run type-check       # TypeScript type checking
npm run check            # Run format + lint + type-check
```

### Testing

E2E tests will be implemented with Playwright once MVP features are built. The test commands are defined in `package.json` but no tests exist yet.

## First Version Scope

The MVP should **only** include:

- Project creation (name + color)
- Task creation (content + optional description)
- Assign tasks to projects
- Move tasks between projects
- Schedule tasks for "Today"
- Mark tasks as done

**Everything else should be removed or deprioritized**. The existing schema has many advanced features (AI processing, tags, priorities, time tracking) that are **NOT** part of the first version.

## Design Principles

When implementing features:

- ⚡ **Fast to capture** - Minimize friction for creating tasks
- 🎯 **Simple to understand** - No complex workflows or options
- 🔄 **Easy to reorganize** - Drag & drop, quick moves between projects
- 🎨 **Visually clear** - Use project colors for quick visual recognition
- 📱 **Mobile friendly** - Touch-first design, large tap targets

## Database Initialization

For development:

```bash
npm run docker:up    # Start PostgreSQL
npm run db:push      # Push schema to database
npm run db:seed      # Add sample data
```

For production (Vercel):

```bash
# Generate and commit migrations
npm run db:generate
git add drizzle/ && git commit -m "feat: database migration"
git push

# Or use Vercel Postgres dashboard SQL editor to run scripts/init-db.sql
```

## Environment Variables

For local development with Docker:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/brain_capture_dev
NODE_ENV=development
```

For production (choose one method):

**Method 1: Connection String (Vercel Postgres)**

```
DATABASE_URL=postgresql://...
# or
POSTGRES_URL=postgresql://...
```

**Method 2: IAM Authentication (AWS RDS + Vercel)** - Not currently supported, requires implementation

**Method 3: Standard PG Credentials**

```
PGHOST=your-host
PGUSER=postgres
PGDATABASE=brain_capture
PGPORT=5432
```

## Git Workflow

- Husky pre-commit hooks run format + lint automatically
- Commit messages follow conventional commits format (see `.github/COMMIT_CONVENTION.md`)
- Push to `main` triggers auto-deploy to Vercel

## Important Notes

- The codebase has been cleaned up and is ready for MVP implementation
- Database schema includes advanced features (AI metadata, tags, time tracking) that are **out of scope** for v1 - these can be ignored during initial implementation
- Focus on the core workflow: capture → organize → execute → finish
- Mobile-first design is critical - test on actual devices or mobile viewport
- Project colors are a key visual element - make them prominent in the UI
- Use Drizzle ORM for all database operations (no raw SQL unless absolutely necessary)

## What Was Removed

The following were removed from the over-complex initial implementation:

- `/capture` page with voice input functionality
- `/dashboard` page with complex task board
- `/examples/voice-input` demo page
- Voice recognition hooks and components
- Old repository layer using `sql` template tags
- Complex API routes for projects/ideas/dashboard (these will be reimplemented simply for MVP)
- E2E tests for old implementation (will be rewritten for MVP)

## Next Steps for MVP

1. Implement basic project CRUD pages
2. Implement task capture and list views
3. Implement "Today" view for focused task selection
4. Add mobile-optimized UI components
5. Write E2E tests for core workflows
