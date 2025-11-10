#!/bin/bash
# 🚀 LAUNCH AUTH TESTS - Synrgy v4.4.0

echo "🚀 Synrgy v4.4.0 - Auth Tests Launch"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check PostgreSQL
echo "1️⃣ Checking PostgreSQL..."
if docker ps | grep -q synrgy-postgres; then
  echo "   ✅ PostgreSQL container running"
else
  echo "   ⚠️  PostgreSQL not running, starting..."
  docker start synrgy-postgres 2>/dev/null || docker run --name synrgy-postgres -e POSTGRES_USER=synrgy_user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=synrgydb -p 5432:5432 -d postgres:15
  sleep 3
fi

echo ""

# Check .env
echo "2️⃣ Checking .env configuration..."
if grep -q "JWT_SECRET" .env; then
  echo "   ✅ JWT_SECRET present"
else
  echo "   ❌ JWT_SECRET missing"
  exit 1
fi

if grep -q "DATABASE_URL.*postgresql" .env; then
  echo "   ✅ DATABASE_URL configured (PostgreSQL)"
else
  echo "   ❌ DATABASE_URL not configured correctly"
  exit 1
fi

echo ""

# Check Prisma Client
echo "3️⃣ Checking Prisma Client..."
if [ -d "node_modules/@prisma/client" ]; then
  echo "   ✅ Prisma Client generated"
else
  echo "   ⚠️  Prisma Client not found, generating..."
  npx prisma generate
fi

echo ""

# Check server files
echo "4️⃣ Checking server files..."
if [ -f "server/routes/auth.ts" ]; then
  echo "   ✅ server/routes/auth.ts exists"
else
  echo "   ❌ server/routes/auth.ts missing"
  exit 1
fi

if [ -f "server/middleware/authPrisma.ts" ]; then
  echo "   ✅ server/middleware/authPrisma.ts exists"
else
  echo "   ❌ server/middleware/authPrisma.ts missing"
  exit 1
fi

if [ -f "server/middleware/security.ts" ]; then
  echo "   ✅ server/middleware/security.ts exists"
else
  echo "   ❌ server/middleware/security.ts missing"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL CHECKS PASSED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Ready to test!"
echo ""
echo "Next steps:"
echo "  Terminal 1: npm run dev:server"
echo "  Terminal 2: ./TEST-AUTH-ENDPOINTS.sh"
echo ""
