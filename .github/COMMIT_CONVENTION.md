# Commit Message Format

Use conventional commits for automated changelog generation:

## Format

```
<type>: <description>

[optional body]
```

## Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, semicolons, etc)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

## Examples

```bash
feat: add user authentication
fix: resolve navigation bug on mobile
docs: update API documentation
refactor: simplify button component
chore: update dependencies
```

## Quick Commit

```bash
git add .
git commit -m "feat: your feature description"
git push
```

Pre-commit hooks will automatically:

- Format your code
- Fix linting issues
- Run type checking
