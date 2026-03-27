#!/bin/bash

# Brain Capture Setup Script
# Verifies and initializes the development environment

set -e

echo "🧠 Brain Capture Development Setup"
echo "=================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Node.js $NODE_VERSION"

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "  npm $NPM_VERSION"

# Check Docker
echo "✓ Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop"
    exit 1
fi
DOCKER_VERSION=$(docker -v)
echo "  $DOCKER_VERSION"

# Check Docker Compose
echo "✓ Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose not found"
    exit 1
fi
COMPOSE_VERSION=$(docker compose version)
echo "  $COMPOSE_VERSION"

echo ""
echo "✅ All prerequisites satisfied!"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Start database:    npm run docker:up"
echo "2. Push schema:       npm run db:push"
echo "3. Seed data:         npm run db:seed"
echo "4. Start dev server:  npm run dev"
echo ""
echo "Or run all at once:   npm run db:reset && npm run dev"
echo ""
