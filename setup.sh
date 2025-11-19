#!/bin/bash

echo "🚀 Starting Bongal E-Commerce Setup..."
echo ""

# Check if MongoDB is running
echo "📦 Step 1: Checking MongoDB connection..."
if ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB shell not found. Make sure MongoDB Atlas is configured."
fi

# Backend setup
echo ""
echo "🔧 Step 2: Setting up Backend..."
cd bongal-server

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit bongal-server/.env with your credentials!"
else
    echo "✅ .env file already exists"
fi

echo "📥 Installing backend dependencies..."
npm install

echo "🔨 Building backend..."
npm run build

# Frontend setup
echo ""
echo "🎨 Step 3: Setting up Frontend..."
cd ../bongal-client

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit bongal-client/.env with your backend URL!"
else
    echo "✅ .env file already exists"
fi

echo "📥 Installing frontend dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit bongal-server/.env with your credentials"
echo "2. Edit bongal-client/.env with your backend URL"
echo "3. Start backend: cd bongal-server && npm run dev"
echo "4. Start frontend: cd bongal-client && npm run dev"
echo ""
echo "🌐 Visit: http://localhost:3000"
echo ""
