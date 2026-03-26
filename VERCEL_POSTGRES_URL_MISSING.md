# ⚠️ ACTION REQUIRED: Add POSTGRES_URL to Vercel

## The Issue
Your Vercel deployment has all AWS/PG variables EXCEPT the critical `POSTGRES_URL` connection string.

## Quick Fix (2 minutes)

### Method 1: Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/james-projects-3eb6261c/brain-capture/settings/environment-variables

2. **Click "Add New"**

3. **Add Variable**:
   - **Key**: `POSTGRES_URL`
   - **Value**:
     ```
     postgresql://postgres:YOUR_ACTUAL_PASSWORD@my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require
     ```
   - **Environments**: Select all (Production, Preview, Development)

4. **Save**

5. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Method 2: Vercel CLI

```bash
# Add POSTGRES_URL (you'll be prompted to enter the value)
vercel env add POSTGRES_URL production

# When prompted, paste:
postgresql://postgres:YOUR_PASSWORD@my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require

# Also add for Preview and Development
vercel env add POSTGRES_URL preview
vercel env add POSTGRES_URL development

# Redeploy
vercel --prod --force
```

---

## Current Status

✅ **Deployed**: https://brain-capture-k7d7k82ee-james-projects-3eb6261c.vercel.app
✅ **GitHub**: https://github.com/soukoli/BrainCapture
✅ **Environment Variables**: 9/10 set (missing POSTGRES_URL)

⚠️ **Build Status**: Error (likely due to missing POSTGRES_URL)

---

## After Adding POSTGRES_URL

### Initialize Database

Option A: Via Vercel CLI
```bash
vercel env pull
npm run db:init
```

Option B: Direct Connection
```bash
psql "postgresql://..." -f scripts/init-db.sql
```

### Test Your App

1. Visit: https://brain-capture.vercel.app (once fixed)
2. Click "Get Started"
3. Create a task
4. Test drag-and-drop
5. Try voice input

---

## Why This Happened

The Vercel CLI pulled individual PG variables (PGHOST, PGUSER, etc.) but Next.js/Vercel Postgres needs the full `POSTGRES_URL` connection string.

---

## Next Steps

1. ✅ Code pushed to GitHub
2. ⏳ **Add POSTGRES_URL** ← You are here
3. ⏳ Redeploy on Vercel
4. ⏳ Initialize database
5. ⏳ Test live app
6. ⏳ Install as PWA on mobile

---

Need help? The deployment page is here:
https://vercel.com/james-projects-3eb6261c/brain-capture
