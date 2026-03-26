# Database Setup Guide

## Quick Start

### 1. Add Your Database Password

Edit `.env.local` and replace `YOUR_PASSWORD_HERE` with your actual AWS RDS password:

```bash
POSTGRES_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require"
```

### 2. Run Database Setup

```bash
npm run db:setup
```

This script will:
- ✅ Check your environment configuration
- ✅ Test database connection
- ✅ Initialize schema (tables, indexes, triggers)
- ✅ Insert sample data

### 3. Start the App

```bash
npm run dev
```

Visit: http://localhost:3000/dashboard

---

## Manual Setup (Alternative)

If the automated script doesn't work, run these commands manually:

### 1. Test Connection
```bash
source .env.local
psql "$POSTGRES_URL" -c "SELECT version();"
```

### 2. Initialize Database
```bash
psql "$POSTGRES_URL" -f scripts/init-db.sql
```

### 3. Verify Tables
```bash
psql "$POSTGRES_URL" -c "\dt"
```

You should see:
- `projects`
- `ideas`
- `tags`
- `idea_tags`

---

## Database Schema

### Ideas Table (with Time Tracking)
```sql
- id (UUID)
- content (TEXT)
- status (inbox | in-progress | completed | archived | deleted)
- priority (low | medium | high | urgent)
- started_at (TIMESTAMP) -- ⏱️ When task moved to "in-progress"
- completed_at (TIMESTAMP) -- ✅ When task completed
- time_spent_seconds (INTEGER) -- Total time tracked
- focus_warning_threshold (INTEGER) -- Warning after N seconds (default 7200 = 2h)
- project_id (UUID FK)
- created_at, updated_at (TIMESTAMP)
```

### Projects Table
```sql
- id (UUID)
- name (VARCHAR)
- color (VARCHAR) -- Hex color code
- status (active | archived | completed)
- user_id (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

### Tags & idea_tags
Many-to-many relationship for tagging ideas.

---

## Environment Variables

Your `.env.local` should have:

```bash
# Primary connection string (REQUIRED)
POSTGRES_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require"

# AWS Configuration (for Vercel deployment)
AWS_ACCOUNT_ID="085597560799"
AWS_REGION="us-east-1"
AWS_RESOURCE_ARN="arn:aws:rds:us-east-1:085597560799:cluster:my-brain-capture"
AWS_ROLE_ARN="arn:aws:iam::085597560799:role/Vercel/access-my-brain-capture"

# PostgreSQL Individual Components (optional)
PGDATABASE="postgres"
PGHOST="my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com"
PGPORT="5432"
PGSSLMODE="require"
PGUSER="postgres"
```

---

## Troubleshooting

### Connection Refused
- Check if RDS instance is running
- Verify security group allows your IP
- Confirm VPN/network access to AWS

### Authentication Failed
- Double-check password in `.env.local`
- Ensure no extra spaces in connection string
- Verify IAM role permissions (for Vercel deployment)

### SSL Error
- Ensure `sslmode=require` is in connection string
- Check RDS SSL certificate is valid

### Permission Denied
- Verify `postgres` user has CREATE privileges
- Check IAM role permissions for RDS access

---

## Sample Data

The setup script inserts sample data:

**Projects**:
- Personal (blue)
- Work (green)
- Side Project (orange)

**Tags**:
- urgent, research, feature, bug, idea, meeting, learning

You can delete or modify this data after setup.

---

## Database Commands Reference

```bash
# Setup database
npm run db:setup

# Reinitialize (WARNING: Drops all data!)
npm run db:reset

# Check API health
npm run db:health

# Connect to database
psql "$POSTGRES_URL"

# List tables
psql "$POSTGRES_URL" -c "\dt"

# View schema
psql "$POSTGRES_URL" -c "\d ideas"

# Count records
psql "$POSTGRES_URL" -c "SELECT COUNT(*) FROM ideas;"
```

---

## Next Steps

After database is set up:

1. ✅ Database initialized
2. 🚀 Run `npm run dev`
3. 🌐 Open http://localhost:3000/dashboard
4. 📝 Create your first task!

---

## Deployment to Vercel

When deploying to Vercel, add these environment variables in Vercel Dashboard:

1. Go to: Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure `POSTGRES_URL` is set
4. Deploy!

Vercel will use IAM authentication with the `AWS_ROLE_ARN` for secure access.
