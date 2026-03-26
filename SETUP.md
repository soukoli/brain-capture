# Setup Guide

## Architecture Overview

### File Structure

```
src/
  app/                    # Next.js 15 App Router
    layout.tsx           # Root layout (metadata, fonts)
    page.tsx             # Home page
    globals.css          # Tailwind + custom CSS
  components/
    ui/                  # Radix UI components
      button.tsx         # Button with variants
      card.tsx           # Card components
  lib/
    utils.ts             # cn() helper for className merging

.github/
  workflows/
    ci.yml               # Runs on every push/PR
    update-deps.yml      # Weekly dependency updates
  COMMIT_CONVENTION.md   # Commit message guide

.husky/
  pre-commit            # Runs lint-staged on commit
```

### Key Configs

**package.json** - All scripts and dependencies
**tsconfig.json** - Strict TypeScript config
**tailwind.config.ts** - Tailwind customization
**.lintstagedrc.json** - Pre-commit file checks
**.prettierrc** - Code formatting rules
**vercel.json** - Vercel deployment config

## What Each Automation Does

### Pre-commit Hook (Husky + Lint-Staged)

When you `git commit`:

1. Prettier formats changed files
2. ESLint fixes issues automatically
3. Commit only proceeds if no errors

### CI Workflow (GitHub Actions)

On every push/PR:

1. Install dependencies
2. Type check with TypeScript
3. Lint with ESLint
4. Check Prettier formatting
5. Build for production

### Dependency Updates (GitHub Actions)

Every Monday:

1. Check for package updates
2. Install and test updates
3. Create PR if successful
4. You review and merge

### Vercel Deployment

On push to main:

1. Auto-detects Next.js
2. Builds with `npm run build`
3. Deploys to production
4. Preview URLs for PRs

## Design Decisions

### Why These Tools?

- **Husky**: Git hooks without manual setup
- **Lint-Staged**: Only check changed files (fast!)
- **Prettier**: No formatting arguments, ever
- **ESLint**: Catches bugs before runtime
- **TypeScript**: Catch errors as you code
- **Radix UI**: Accessible, unstyled components
- **Tailwind**: No CSS files, utility-first

### Why This Workflow?

1. **Automatic formatting** - Never think about it
2. **Pre-commit checks** - Catch issues early
3. **CI validation** - Nothing broken reaches main
4. **Auto-updates** - Stay current effortlessly
5. **One-command deploy** - Just push

## Extending the Template

### Add a New Page

```typescript
// src/app/about/page.tsx
export default function About() {
  return <div>About page</div>
}
```

Automatic route: `/about`

### Add a New Component

```typescript
// src/components/ui/badge.tsx
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="...">{children}</span>
}
```

### Add API Route

```typescript
// src/app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello" });
}
```

### Add Environment Variables

```bash
# .env.local (git-ignored)
DATABASE_URL=your-url
NEXT_PUBLIC_API_KEY=your-key
```

Access with `process.env.DATABASE_URL`

## Customization Tips

### Change Tailwind Theme

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: '#FF6B6B',
    },
  },
}
```

### Add More Prettier Rules

```json
// .prettierrc
{
  "semi": false, // No semicolons
  "singleQuote": true // Single quotes
}
```

### Skip Pre-commit for Hotfix

```bash
git commit -m "fix: urgent" --no-verify
```

## Performance Optimizations

### Already Included

- ✅ Turbopack for fast dev builds
- ✅ Next.js 15 compiler optimizations
- ✅ TypeScript incremental builds
- ✅ Lint-staged (only checks changed files)

### When Needed

- Add `loading.tsx` for instant loading states
- Use `<Image>` for automatic optimization
- Add `metadata` export for SEO
- Use React Server Components by default

## Troubleshooting

### Hooks not running?

```bash
npx husky install
chmod +x .husky/pre-commit
```

### Type errors in IDE?

```bash
npm run type-check
```

Fix or add `// @ts-ignore` if needed

### Lint errors?

```bash
npm run lint
```

Most auto-fix with `eslint --fix`

### Prettier conflicts with ESLint?

The config already handles this - Prettier runs first

### Build fails on Vercel?

Check build output locally:

```bash
npm run build
```

Fix errors before pushing

## Best Practices

### Component Organization

```
components/
  ui/           # Generic, reusable (Button, Card)
  features/     # Feature-specific (LoginForm)
  layout/       # Layout pieces (Header, Footer)
```

### Import Order

1. React/Next imports
2. External libraries
3. Internal components
4. Utils/helpers
5. Types
6. Styles

### File Naming

- Components: `PascalCase.tsx`
- Utils: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`

### Commit Frequency

Commit often! Hooks are fast:

- After each feature/fix
- Before switching tasks
- At end of day

## Next Steps

1. ✅ Template is ready
2. Customize home page
3. Add your features
4. Push to GitHub
5. Deploy to Vercel
6. Start building!

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Conventional Commits](https://www.conventionalcommits.org)
