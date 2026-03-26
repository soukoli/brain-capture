# Development Workflow Guide

## 🚀 Getting Started (One Time Setup)

```bash
npm install
npx husky init
```

## 💻 Daily Development

### Start coding

```bash
npm run dev
```

Open http://localhost:3000 - changes auto-reload

### Commit your work

```bash
git add .
git commit -m "feat: describe what you built"
```

Pre-commit hooks auto-fix formatting and linting!

### Push and deploy

```bash
git push
```

Vercel auto-deploys from main branch

## 🛠 Useful Commands

### Check everything before commit

```bash
npm run check
```

Runs format + lint + type-check

### Update all dependencies

```bash
npm run update
```

Updates package.json to latest versions

### Format code manually

```bash
npm run format
```

## 🤖 Automation

### What happens automatically:

**On every commit:**

- ✅ Code auto-formatted with Prettier
- ✅ ESLint auto-fixes issues
- ✅ TypeScript checked

**On every push:**

- ✅ CI runs all checks
- ✅ Vercel deploys if on main

**Every Monday:**

- ✅ GitHub Action checks for dependency updates
- ✅ Creates PR if updates available

## 📝 Commit Message Tips

Use these prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code cleanup
- `docs:` - Documentation
- `chore:` - Maintenance

Examples:

```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: navbar responsive on mobile"
git commit -m "refactor: simplify API calls"
```

## 🎯 Focus on Building

Everything boring is automated:

- ✅ No manual formatting
- ✅ No manual lint fixing
- ✅ No manual dependency updates
- ✅ No deployment setup

Just code, commit, push. Done!

## 🔧 VS Code Setup

Install recommended extensions (popup appears automatically):

- ESLint
- Prettier
- Tailwind CSS IntelliSense

Auto-formatting on save is already configured!

## 📦 Adding New Dependencies

```bash
npm install package-name
```

That's it! GitHub Actions will keep it updated.

## 🐛 If Something Breaks

### Reset everything:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Skip pre-commit hooks (only if urgent):

```bash
git commit -m "fix: urgent hotfix" --no-verify
```

## 💡 Pro Tips

1. **Fast commits**: Create git aliases

```bash
git config alias.c 'commit -m'
git config alias.p 'push'

# Now use:
git add . && git c "feat: new feature" && git p
```

2. **Quick setup for new features**: Copy components from `src/components/ui`

3. **Instant preview**: Vercel creates preview URLs for every PR

4. **Local type checking**: VS Code shows errors inline - fix as you code
