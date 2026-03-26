#!/bin/bash
# Database initialization helper script

echo "🗄️  Brain Capture - Database Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your database password!"
    echo "   Replace 'YOUR_PASSWORD_HERE' with your actual password"
    exit 1
fi

# Check if POSTGRES_URL has placeholder
if grep -q "YOUR_PASSWORD_HERE" .env.local; then
    echo "⚠️  Warning: POSTGRES_URL still contains placeholder 'YOUR_PASSWORD_HERE'"
    echo ""
    echo "Please edit .env.local and replace YOUR_PASSWORD_HERE with your actual password"
    echo "File location: $(pwd)/.env.local"
    exit 1
fi

echo "✅ Environment file configured"
echo ""
echo "🔌 Testing database connection..."
echo ""

# Load environment variables
source .env.local

# Test connection
if psql "$POSTGRES_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
    echo ""
    echo "📊 Initializing database schema..."
    echo ""
    psql "$POSTGRES_URL" -f scripts/init-db.sql

    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Database initialized successfully!"
        echo ""
        echo "✅ Tables created:"
        echo "   - projects"
        echo "   - ideas (with time tracking)"
        echo "   - tags"
        echo "   - idea_tags"
        echo ""
        echo "✅ Sample data inserted"
        echo ""
        echo "🚀 Ready to start! Run: npm run dev"
    else
        echo ""
        echo "❌ Database initialization failed"
        exit 1
    fi
else
    echo "❌ Database connection failed!"
    echo ""
    echo "Please check:"
    echo "1. Is your password correct in .env.local?"
    echo "2. Is the database host reachable?"
    echo "3. Are your AWS credentials valid?"
    echo ""
    echo "Connection string: $POSTGRES_URL"
    exit 1
fi
