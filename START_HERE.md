# 🎯 START HERE - Brain Capture Template

## One-Time Setup

```bash
npm install
./setup.sh    # Optional: Sets up git template and ensures hooks work
```

## Start Developing

```bash
npm run dev
```

Open http://localhost:3000 and start coding!

## The Magic ✨

Every time you commit:
- ✅ Code auto-formats
- ✅ Lint issues auto-fix
- ✅ Types checked

Every time you push:
- ✅ CI runs all tests
- ✅ Auto-deploys to Vercel

Every Monday:
- ✅ Dependencies auto-update via PR

## Your Workflow

```bash
# 1. Code your feature
npm run dev

# 2. Commit (auto-formatted!)
git add .
git commit -m "feat: add awesome feature"

# 3. Push (auto-deploys!)
git push
```

That's it! No manual formatting, no manual deploys, no hassle.

## Quick Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run check        # Check everything
npm run format       # Format all files
npm run update       # Update dependencies
```

## Documentation

1. **[READY.md](./READY.md)** - Complete feature overview
2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Command cheat sheet
3. **[WORKFLOW.md](./WORKFLOW.md)** - Detailed daily workflow
4. **[SETUP.md](./SETUP.md)** - Architecture deep dive

## What's Included

- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Tailwind CSS + Radix UI components
- ✅ ESLint + Prettier (auto-configured)
- ✅ Pre-commit hooks (Husky + Lint-Staged)
- ✅ GitHub Actions CI/CD
- ✅ Vercel deployment config
- ✅ Weekly dependency updates
- ✅ VS Code settings

## Common Questions

**Q: Do I need to format code manually?**
A: No! Formats automatically on save and commit.

**Q: Do I need to configure deployment?**
A: No! Just push to GitHub, import to Vercel, done.

**Q: How do I keep dependencies updated?**
A: Automatic! Weekly PRs with updates.

**Q: What about linting errors?**
A: Auto-fixed on commit. Only blocking errors stop commits.

**Q: Can I customize?**
A: Yes! Edit configs, but defaults work great.

## Deploy to Vercel

```bash
# 1. Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Click Deploy
# Done! 🎉
```

## Pro Tips

🚀 **Use git aliases for speed:**
```bash
git config alias.c 'commit -m'
git config alias.p 'push'

# Then:
git add . && git c "feat: new thing" && git p
```

📝 **Commit message format:**
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code improvements
- `docs:` for documentation

🎨 **VS Code extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Need Help?

- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for commands
- Check [WORKFLOW.md](./WORKFLOW.md) for detailed workflows
- Check [SETUP.md](./SETUP.md) for customization

## You're Ready! 🚀

Just run `npm run dev` and start building.

Everything else is automated!
