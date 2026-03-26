# Database & API Setup Guide

Quick guide to get the Brain Capture API and database running.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Vercel Postgres or Neon)
- psql CLI tool (optional, for database initialization)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /Users/I314819/SAPDevelop/ai/CoP/SoukoliAI/projects/brain-capture-prod
npm install
```

### 2. Create Database

**Option A: Vercel Postgres**
```bash
# Go to Vercel Dashboard
# Storage > Create Database > Postgres
# Copy connection string
```

**Option B: Neon**
```bash
# Go to https://console.neon.tech/
# Create new project
# Copy connection string
```

### 3. Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your database URL
# POSTGRES_URL=postgresql://user:password@host/database?sslmode=require
```

### 4. Initialize Database Schema

**Option A: Using psql CLI**
```bash
# Make sure POSTGRES_URL is set in .env.local
source .env.local
psql $POSTGRES_URL -f scripts/init-db.sql
```

**Option B: Using Vercel Postgres Dashboard**
1. Go to Vercel Dashboard > Storage > Your Database
2. Click "Query" tab
3. Copy contents of `scripts/init-db.sql`
4. Paste and run

**Option C: Using npm script** (requires psql)
```bash
npm run db:init
```

### 5. Start Development Server

```bash
npm run dev
```

Server starts at: http://localhost:3000

### 6. Verify Setup

```bash
# Check health
curl http://localhost:3000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2024-01-01T00:00:00.000Z"
# }
```

## Test API Endpoints

### Create an Idea
```bash
curl -X POST http://localhost:3000/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first idea",
    "user_id": "test-user"
  }'
```

### List Ideas
```bash
curl "http://localhost:3000/api/ideas?user_id=test-user"
```

### Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "user_id": "test-user"
  }'
```

### List Projects
```bash
curl "http://localhost:3000/api/projects?user_id=test-user"
```

## File Structure

```
brain-capture-prod/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── ideas/
│   │       │   ├── route.ts              # POST /api/ideas, GET /api/ideas
│   │       │   └── [id]/route.ts         # GET/PUT/DELETE /api/ideas/:id
│   │       ├── projects/
│   │       │   ├── route.ts              # POST /api/projects, GET /api/projects
│   │       │   └── [id]/route.ts         # GET/PUT/DELETE /api/projects/:id
│   │       └── health/
│   │           └── route.ts              # GET /api/health
│   └── lib/
│       ├── db.ts                         # Database client & types
│       ├── validations.ts                # Zod validation schemas
│       ├── api-examples.ts               # API usage examples
│       └── repositories/
│           ├── ideas.ts                  # Idea data access layer
│           └── projects.ts               # Project data access layer
├── scripts/
│   └── init-db.sql                       # Database schema
├── .env.example                          # Environment template
├── .env.local                            # Your local config (create this)
└── API_README.md                         # Full API documentation
```

## Common Issues

### Cannot connect to database
- Check `POSTGRES_URL` in `.env.local`
- Verify database is running
- Ensure connection string includes `?sslmode=require`

### Tables don't exist
- Run database initialization: `npm run db:init`
- Or manually run `scripts/init-db.sql` in database

### TypeScript errors
- Run: `npm run type-check`
- Make sure `@vercel/postgres` and `zod` are installed

### API returns 500 errors
- Check server logs: `npm run dev`
- Verify database connection: `npm run db:health`
- Check `.env.local` configuration

## Next Steps

1. **Add Authentication**: Implement user authentication
2. **Build UI Components**: Create React components that use the API
3. **Add AI Processing**: Integrate OpenAI for idea enhancement
4. **Deploy to Vercel**: Push to GitHub and deploy
5. **Setup CI/CD**: Add automated testing and deployment

## Resources

- [API Documentation](./API_README.md) - Complete API reference
- [Database Schema](./scripts/init-db.sql) - Full schema definition
- [API Examples](./src/lib/api-examples.ts) - Code examples
- [Next.js Docs](https://nextjs.org/docs) - Next.js documentation
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Database docs

## Quick Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:init            # Initialize database
npm run db:reset           # Reset database (caution!)
npm run db:health          # Check database connection

# Code Quality
npm run lint               # Lint code
npm run format             # Format code
npm run type-check         # Check TypeScript
npm run check              # Run all checks
```

## Support

For detailed API documentation, see [API_README.md](./API_README.md)

For issues, please check:
1. Server logs (`npm run dev` output)
2. Database connection (`.env.local` configuration)
3. API health endpoint (`/api/health`)
