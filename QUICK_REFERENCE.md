# Quick Reference

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Code Quality
npm run check            # Format + Lint + Type-check all at once
npm run format           # Auto-format all files
npm run lint             # Check for code issues
npm run type-check       # Check TypeScript

# Build & Deploy
npm run build            # Build for production
npm start                # Run production build locally

# Maintenance
npm run update           # Update all dependencies
```

## 🔄 Git Workflow

```bash
# Start feature
git checkout -b feature/new-feature

# Work and commit (auto-formatted!)
git add .
git commit -m "feat: add new feature"

# Push (auto-deploys to Vercel)
git push
```

## 📝 Commit Types

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code improvement
- `docs:` Documentation
- `chore:` Maintenance
- `style:` Formatting
- `perf:` Performance
- `test:` Tests

## 📁 File Locations

```
src/app/page.tsx           # Home page
src/app/layout.tsx         # Root layout
src/components/ui/         # UI components
src/lib/utils.ts           # Utilities
.github/workflows/         # GitHub Actions
.husky/pre-commit          # Git hooks
```

## 🎨 Tailwind Classes

```tsx
// Responsive
className="text-sm md:text-lg"

// Dark mode
className="bg-white dark:bg-black"

// Hover states
className="hover:bg-blue-500"

// Merge classes with cn()
import { cn } from "@/lib/utils"
className={cn("base-class", conditional && "extra-class")}
```

## 🧩 Component Template

```tsx
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function MyComponent({ children, className }: Props) {
  return <div className={cn("base-styles", className)}>{children}</div>;
}
```

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)

## 💡 Tips

- Use `npm run check` before pushing
- VS Code auto-formats on save
- Pre-commit hooks auto-fix issues
- Vercel creates preview URLs for PRs
- Dependencies auto-update weekly
