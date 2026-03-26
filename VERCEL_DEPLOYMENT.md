# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**: Select `soukoli/BrainCapture`
3. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   POSTGRES_URL=postgresql://postgres:YOUR_PASSWORD@my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com:5432/postgres?sslmode=require

   AWS_ACCOUNT_ID=085597560799
   AWS_REGION=us-east-1
   AWS_RESOURCE_ARN=arn:aws:rds:us-east-1:085597560799:cluster:my-brain-capture
   AWS_ROLE_ARN=arn:aws:iam::085597560799:role/Vercel/access-my-brain-capture

   PGDATABASE=postgres
   PGHOST=my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com
   PGPORT=5432
   PGSSLMODE=require
   PGUSER=postgres
   ```

5. **Click Deploy** 🚀

---

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: brain-capture
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add POSTGRES_URL
vercel env add AWS_ACCOUNT_ID
vercel env add AWS_REGION
vercel env add AWS_RESOURCE_ARN
vercel env add AWS_ROLE_ARN

# Deploy to production
vercel --prod
```

---

## Environment Variables Required

### Production (All Environments)
```bash
POSTGRES_URL="postgresql://..."
AWS_ACCOUNT_ID="085597560799"
AWS_REGION="us-east-1"
AWS_RESOURCE_ARN="arn:aws:rds:..."
AWS_ROLE_ARN="arn:aws:iam::..."
```

### Optional
```bash
PGDATABASE="postgres"
PGHOST="my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com"
PGPORT="5432"
PGSSLMODE="require"
PGUSER="postgres"
```

---

## After Deployment

### 1. Initialize Database
Once deployed, your database schema needs to be initialized:

```bash
# Option A: Use Vercel CLI
vercel env pull .env.local
npm run db:init

# Option B: Connect directly
psql "postgresql://..." -f scripts/init-db.sql
```

### 2. Test Your Deployment
- Visit your Vercel URL (e.g., `https://brain-capture.vercel.app`)
- Click "Get Started" → Should redirect to `/dashboard`
- Try creating a task
- Test voice input
- Test drag-and-drop

### 3. Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Follow DNS configuration steps

---

## Vercel Configuration

Your project is already configured with:

✅ **`next.config.ts`** - Next.js configuration
✅ **`vercel.json`** - Vercel-specific settings
✅ **GitHub Integration** - Auto-deploys on push
✅ **PWA Support** - Mobile app ready

---

## Automatic Deployments

Now set up:
- **Production**: Push to `main` → Auto-deploys
- **Preview**: Open PR → Auto-generates preview URL
- **Rollback**: One-click rollback in Vercel dashboard

---

## Security Checklist

Before going live:

### Database
- ✅ RDS security group allows Vercel IPs
- ✅ SSL mode is `require`
- ✅ Strong password in use
- ⚠️ Consider rotating credentials
- ⚠️ Enable RDS encryption at rest

### Application
- ⚠️ Add authentication (NextAuth.js recommended)
- ⚠️ Add rate limiting for API routes
- ⚠️ Enable CORS restrictions
- ⚠️ Add API key validation (if needed)

### Vercel
- ✅ Environment variables are encrypted
- ✅ Preview deployments are protected
- ⚠️ Enable Vercel Password Protection (Settings → Protection)

---

## Monitoring

### Vercel Analytics (Built-in)
- Real-time visitor tracking
- Web vitals monitoring
- Performance insights

### Database Monitoring
- AWS RDS CloudWatch metrics
- Query performance insights
- Connection pool monitoring

### Application Monitoring
Add to your roadmap:
- Error tracking (Sentry)
- User analytics (PostHog, Mixpanel)
- Uptime monitoring (Better Uptime)

---

## Troubleshooting

### "Database connection failed"
1. Check Vercel environment variables are correct
2. Verify RDS security group allows Vercel IPs
3. Test connection: `vercel logs`
4. Check AWS IAM role permissions

### "Build failed"
1. Check TypeScript errors: `npm run type-check`
2. Check for missing dependencies
3. View build logs in Vercel dashboard
4. Test build locally: `npm run build`

### "Runtime error on dashboard"
1. Check server logs: `vercel logs --follow`
2. Verify database schema is initialized
3. Check API endpoint responses
4. Test database connection: `curl https://your-app.vercel.app/api/health`

---

## Performance Optimization

Already configured:
- ✅ Next.js 15 with Turbopack
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Edge runtime for API routes
- ✅ PWA with service worker

Consider adding:
- Redis caching (Upstash)
- CDN for static assets
- Database query optimization
- API response caching

---

## Cost Estimates

### Vercel
- **Hobby Plan**: Free
  - 100GB bandwidth/month
  - 6,000 build minutes/month
  - Unlimited domains

- **Pro Plan**: $20/month (if needed)
  - 1TB bandwidth
  - Better analytics
  - Team features

### AWS RDS
- **db.t4g.micro**: ~$15/month
- **Storage**: ~$0.10/GB/month
- **Backups**: Included

**Total**: ~$15-20/month (Hobby) or ~$35-40/month (Pro)

---

## Next Steps

1. ✅ Deploy to Vercel
2. 🔧 Initialize database
3. 🧪 Test all features
4. 📱 Test PWA installation on mobile
5. 🔐 Add authentication
6. 📊 Set up monitoring
7. 🌐 Add custom domain (optional)

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **AWS RDS Docs**: https://docs.aws.amazon.com/rds
- **Your Repo**: https://github.com/soukoli/BrainCapture

---

## Quick Commands

```bash
# Deploy
vercel --prod

# View logs
vercel logs --follow

# Check environment
vercel env ls

# Rollback
vercel rollback

# Open dashboard
vercel
```

---

Your app is ready to deploy! 🚀
