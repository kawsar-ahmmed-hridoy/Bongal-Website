@echo off
echo 🚀 Starting Bongal E-Commerce Setup...
echo.

REM Backend setup
echo 🔧 Step 1: Setting up Backend...
cd bongal-server

if not exist ".env" (
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ⚠️  IMPORTANT: Edit bongal-server\.env with your credentials!
) else (
    echo ✅ .env file already exists
)

echo 📥 Installing backend dependencies...
call npm install

echo 🔨 Building backend...
call npm run build

REM Frontend setup
echo.
echo 🎨 Step 2: Setting up Frontend...
cd ..\bongal-client

if not exist ".env" (
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ⚠️  IMPORTANT: Edit bongal-client\.env with your backend URL!
) else (
    echo ✅ .env file already exists
)

echo 📥 Installing frontend dependencies...
call npm install

echo 🔨 Building frontend...
call npm run build

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit bongal-server\.env with your credentials
echo 2. Edit bongal-client\.env with your backend URL
echo 3. Start backend: cd bongal-server ^&^& npm run dev
echo 4. Start frontend: cd bongal-client ^&^& npm run dev
echo.
echo 🌐 Visit: http://localhost:3000
echo.
pause
