# Brain Capture

A minimal personal task management system focused on clarity, speed, and visual progress.

**Mobile-first design** for capturing thoughts anywhere.

## Philosophy

No reminders. No automation. No complexity.

Just **capture → organize → execute → finish**.

## Core Features (MVP)

- Create projects with colors
- Capture tasks quickly
- Assign tasks to projects
- Move tasks between projects
- Schedule tasks for "Today"
- Mark tasks as done

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (Vercel Postgres or AWS RDS)
- **Testing**: Playwright
- **Code Quality**: ESLint + Prettier + Husky

## Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop (for local database)

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL with Docker
npm run docker:up

# Set up environment variables
cp .env.example .env.local

# Push database schema
npm run db:push

# Seed with sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md)

## Environment Variables

Create a `.env.local` file:

**Local Development (Docker)**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brain_capture_dev
NODE_ENV=development
```

**Production Options:**

See [DEVELOPMENT.md](./DEVELOPMENT.md) for Vercel Postgres and AWS RDS configurations.

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Code Quality
npm run lint             # Lint code
npm run format           # Format code
npm run type-check       # TypeScript check
npm run check            # Run all checks

# Database (Drizzle ORM)
npm run db:push          # Push schema to database
npm run db:generate      # Generate migrations
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed sample data
npm run db:reset         # Full database reset

# Docker
npm run docker:up        # Start PostgreSQL
npm run docker:down      # Stop containers
npm run docker:reset     # Reset database

# Testing
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Interactive test mode
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete documentation.

## Project Structure

```
src/
├── app/                 # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── capture/        # Capture page
│   └── dashboard/      # Dashboard page
├── components/         # React components
│   ├── capture/        # Capture-related components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Reusable UI components
└── lib/                # Utilities and database
    ├── repositories/   # Data access layer
    ├── db.ts          # Database connection
    └── types.ts       # Type definitions
```

## Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - Complete development setup with Drizzle ORM and Docker
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and database design
- [CLAUDE.md](./CLAUDE.md) - AI assistant guidance for development
- [Idea/IDEA.MD](./Idea/IDEA.MD) - Original concept and vision

## Design Principles

- ⚡ **Fast to capture** - Minimal friction
- 🎯 **Simple to understand** - No complex workflows
- 🔄 **Easy to reorganize** - Flexible task management
- 🎨 **Visually clear** - Project colors for quick recognition
- 📱 **Mobile friendly** - Touch-first design

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Auto-deploys on every push to `main`.

### Database Setup

**Development**: Use local PostgreSQL or Vercel Postgres free tier

**Production**: Use Vercel Postgres or AWS RDS with IAM authentication

## Contributing

This is a personal project, but feel free to fork and adapt for your needs.

## License

MIT
