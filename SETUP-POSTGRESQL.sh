#!/bin/bash
# 🐘 SETUP POSTGRESQL FOR SYNRGY
# Run this script to setup local PostgreSQL database

echo "🐘 Setting up PostgreSQL for Synrgy..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing PostgreSQL via Homebrew..."
    brew install postgresql@15
    brew services start postgresql@15
    sleep 3
    
    # Create database
    createdb synrgydb
    
    # Create user
    psql postgres -c "CREATE USER synrgy_user WITH PASSWORD 'password';"
    psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE synrgydb TO synrgy_user;"
    
    echo "✅ PostgreSQL installed via Homebrew"
    echo "   Database: synrgydb"
    echo "   User: synrgy_user"
    echo "   Password: password"
    echo "   Port: 5432"
else
    echo "✅ Docker found, using Docker..."
    
    # Stop existing container if exists
    docker stop synrgy-postgres 2>/dev/null || true
    docker rm synrgy-postgres 2>/dev/null || true
    
    # Run PostgreSQL container
    docker run --name synrgy-postgres \
      -e POSTGRES_USER=synrgy_user \
      -e POSTGRES_PASSWORD=password \
      -e POSTGRES_DB=synrgydb \
      -p 5432:5432 \
      -d postgres:15
    
    echo "✅ PostgreSQL container started"
    echo "   Container: synrgy-postgres"
    echo "   Database: synrgydb"
    echo "   User: synrgy_user"
    echo "   Password: password"
    echo "   Port: 5432"
    
    sleep 3
fi

echo ""
echo "🔄 Running Prisma migration..."
npx prisma migrate dev --name init_auth_system

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "📊 To view your database:"
echo "   npx prisma studio"
echo ""
echo "🧪 To test auth endpoints:"
echo "   npm run dev:server"
echo "   curl -X POST http://localhost:5001/api/auth/signup -H \"Content-Type: application/json\" -d '{\"email\":\"coach@test.com\",\"password\":\"test123\",\"role\":\"COACH\",\"fullName\":\"Test Coach\"}'"

