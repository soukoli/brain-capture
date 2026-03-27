# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brain Capture is a minimal personal task management system focused on **mobile-first** usage. The core philosophy is clarity, speed, and visual progress over complex productivity features.

**Important**: The current codebase is a skeleton implementation with existing database schema and API structure. Before implementing new features, the existing structure should be reviewed and cleared/refactored to align with the simplified vision described in `Idea/IDEA.MD`.

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

Located in `scripts/init-db.sql`. Core tables:

- **projects**: User projects with name, color, status, description
- **ideas**: Tasks/notes with content, status (inbox/in-progress/completed/archived/deleted), priority, capture_method, AI metadata
- **tags**: Tag definitions
- **idea_tags**: Many-to-many junction table

Key constraint: Ideas reference projects with `ON DELETE SET NULL` (deleting a project orphans its ideas, doesn't delete them).

### Key Files

- `src/lib/db.ts` - Database connection pool management and query helpers (supports IAM auth)
- `src/lib/repositories/` - Data access layer for projects, ideas, tasks
- `src/lib/types.ts` - Frontend types (simplified Project/Capture models)
- `src/lib/validations.ts` - Input validation schemas
- `src/app/api/` - API route handlers
- `scripts/init-db.sql` - Database schema definition

### Type System Duality

**Important**: There are two parallel type systems:

1. **Database types** (`src/lib/db.ts`): `Idea`, `Project` - matches PostgreSQL schema exactly
2. **Frontend types** (`src/lib/types.ts`): `Capture`, `Project` - simplified for UI

When working across boundaries, be aware of field name differences (e.g., `project_id` vs `projectId`, `created_at` vs `createdAt`).

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

```bash
# Run all tests
npm run test:e2e

# Development modes
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:debug   # Debug mode
npm run test:e2e:headed  # Headed browser mode

# Device-specific
npm run test:e2e:mobile  # Mobile browsers only
npm run test:e2e:desktop # Desktop browsers only

# Browser-specific
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Feature-specific
npm run test:capture     # Capture flow tests
npm run test:voice       # Voice input tests
npm run test:keyboard    # Keyboard shortcuts
npm run test:projects    # Project management
npm run test:a11y        # Accessibility tests
npm run test:perf        # Performance tests
npm run test:visual      # Visual regression tests

# Utilities
npm run test:update-snapshots  # Update visual snapshots
npm run test:report            # View test report
npm run test:install           # Install Playwright browsers
```

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

Required for database connection (choose one method):

**Method 1: Connection String**

```
POSTGRES_URL=postgresql://...
```

**Method 2: IAM Authentication (AWS RDS + Vercel)**

```
PGHOST=your-rds-instance.region.rds.amazonaws.com
PGUSER=your-db-user
PGDATABASE=brain_capture
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::account:role/role-name
VERCEL_OIDC_TOKEN=<auto-provided-by-vercel>
```

**Method 3: Standard PG Credentials**

```
PGHOST=localhost
PGUSER=postgres
PGDATABASE=brain_capture
PGPORT=5432
```

## Git Workflow

- Husky pre-commit hooks run format + lint automatically
- Commit messages follow conventional commits format (see `.github/COMMIT_CONVENTION.md`)
- Push to `main` triggers auto-deploy to Vercel

## Important Notes

- The existing codebase has more features than the MVP scope - simplify before adding new features
- Database schema includes advanced features (AI metadata, tags, time tracking) that are **out of scope** for v1
- Focus on the core workflow: capture → organize → execute → finish
- Mobile-first design is critical - test on actual devices or mobile viewport
- Project colors are a key visual element - make them prominent in the UI
