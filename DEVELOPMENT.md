# Development Setup with Drizzle ORM

This guide will help you set up the Brain Capture development environment using Docker Compose and Drizzle ORM.

## Prerequisites

- Node.js 18+
- Docker Desktop
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Database

```bash
# Start PostgreSQL with Docker
npm run docker:up

# Or use docker-compose directly
docker-compose up -d
```

### 3. Set Up Environment

```bash
# Copy example env file
cp .env.example .env.local

# The default configuration should work with Docker setup
```

Default `.env.local` for local development:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/brain_capture_dev
NODE_ENV=development
```

**Note**: The Docker container uses port **5433** (not 5432) to avoid conflicts with any local PostgreSQL installation.

### 4. Push Database Schema

```bash
# Push Drizzle schema to database
npm run db:push

# Or run migrations if you prefer
npm run db:generate
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
# Add sample data for development
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Commands

### Docker

```bash
npm run docker:up          # Start PostgreSQL container
npm run docker:down        # Stop containers
npm run docker:reset       # Reset database (removes all data)
```

### Drizzle ORM

```bash
npm run db:push            # Push schema changes to database (quick, for dev)
npm run db:generate        # Generate migration files
npm run db:migrate         # Run migrations
npm run db:studio          # Open Drizzle Studio (visual database browser)
npm run db:seed            # Seed database with sample data
npm run db:reset           # Full reset: restart Docker, push schema, seed data
```

### Health Check

```bash
npm run db:health          # Check database connection via API
```

## Database Access

### Drizzle Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at [https://local.drizzle.studio](https://local.drizzle.studio)

### pgAdmin (Optional)

If you want a full-featured database manager, start pgAdmin:

```bash
docker-compose --profile tools up -d
```

Access at [http://localhost:5050](http://localhost:5050)

- Email: `admin@brain-capture.local`
- Password: `admin`

Add server connection:

- Host: `postgres` (when running in Docker network)
- Port: `5432`
- Database: `brain_capture_dev`
- Username: `postgres`
- Password: `postgres`

## Development Workflow

### Making Schema Changes

1. Edit `src/lib/db/schema.ts`
2. Push changes to database:

```bash
# Quick way (development)
npm run db:push

# Or generate migration (production-ready)
npm run db:generate
npm run db:migrate
```

### Working with Drizzle ORM

```typescript
import { getDb } from "@/lib/db";
import { projects, ideas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const db = getDb();

// Insert
await db.insert(projects).values({
  name: "My Project",
  color: "#3B82F6",
  userId: "user-123",
});

// Query
const allProjects = await db.select().from(projects);

// Query with filter
const userProjects = await db.select().from(projects).where(eq(projects.userId, "user-123"));

// Update
await db.update(projects).set({ name: "Updated Name" }).where(eq(projects.id, projectId));

// Delete
await db.delete(projects).where(eq(projects.id, projectId));
```

### Type Safety

Drizzle provides full TypeScript type safety:

```typescript
import type { Project, NewProject } from "@/lib/db/schema";

// Insert type (all fields with defaults are optional)
const newProject: NewProject = {
  name: "Project",
  userId: "user-123",
  // color is optional (has default)
  // id is optional (auto-generated)
};

// Select type (all fields as they are in database)
const project: Project = await db.query.projects.findFirst();
```

## Troubleshooting

### Port Already in Use

If port 5432 is already in use:

1. Edit `docker-compose.yml`
2. Change ports to `"5433:5432"`
3. Update `.env.local`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/brain_capture_dev`

### Database Connection Failed

```bash
# Check if container is running
docker ps

# Check container logs
docker logs brain-capture-db

# Restart containers
npm run docker:down && npm run docker:up
```

### Schema Out of Sync

```bash
# Reset everything
npm run db:reset
```

## Folder Structure

```
src/lib/db/
├── schema.ts          # Drizzle schema definitions
├── index.ts           # Database connection and exports
└── seed.ts            # Sample data for development

drizzle/              # Generated migration files
drizzle.config.ts     # Drizzle Kit configuration
docker-compose.yml    # Local database setup
```

## Production Deployment

For production (Vercel):

1. Use Vercel Postgres or AWS RDS
2. Set `DATABASE_URL` or `POSTGRES_URL` in environment variables
3. Run migrations via Vercel dashboard or deployment hook

```bash
# Generate production migration
npm run db:generate

# Commit migration files to git
git add drizzle/
git commit -m "feat: add database migration"
```

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
