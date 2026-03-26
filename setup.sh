#!/bin/bash

# Brain Capture Template Setup
echo "🚀 Setting up Brain Capture..."

# Enable git commit template
git config commit.template .gitmessage
echo "✅ Git commit template configured"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Initialize Husky (already done but ensures it's set up)
npx husky install 2>/dev/null
echo "✅ Husky initialized"

# Make pre-commit hook executable
chmod +x .husky/pre-commit
echo "✅ Pre-commit hook ready"

echo ""
echo "🎉 All set! You can now:"
echo ""
echo "  npm run dev        # Start development"
echo "  git commit         # Commit with auto-formatting"
echo "  git push           # Deploy to Vercel"
echo ""
echo "📚 See README.md for more info"
