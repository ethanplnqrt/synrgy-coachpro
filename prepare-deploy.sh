#!/bin/bash
# 🚀 SYNRGY PRE-DEPLOYMENT PREPARATION SCRIPT
# Prepares the codebase for production deployment to Render + Vercel

echo "🚀 Synrgy Pre-Deployment Preparation"
echo "======================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

# Function to check command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking Prerequisites..."
echo ""

# Git
if command_exists git; then
  echo -e "${GREEN}✅${NC} Git installed"
else
  echo -e "${RED}❌${NC} Git not found"
  ((ERRORS++))
fi

# Node.js
if command_exists node; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✅${NC} Node.js $NODE_VERSION"
else
  echo -e "${RED}❌${NC} Node.js not found"
  ((ERRORS++))
fi

# npm
if command_exists npm; then
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✅${NC} npm $NPM_VERSION"
else
  echo -e "${RED}❌${NC} npm not found"
  ((ERRORS++))
fi

# PostgreSQL
if command_exists psql; then
  PSQL_VERSION=$(psql --version | awk '{print $3}')
  echo -e "${GREEN}✅${NC} PostgreSQL $PSQL_VERSION"
else
  echo -e "${YELLOW}⚠️${NC}  PostgreSQL not found (local only)"
fi

echo ""

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}❌ Prerequisites check failed. Install missing tools.${NC}"
  exit 1
fi

# Check git repository
echo "🔍 Checking Git Repository..."
echo ""

if [ -d .git ]; then
  echo -e "${GREEN}✅${NC} Git repository initialized"
  
  # Check remote
  if git remote -v | grep -q origin; then
    ORIGIN=$(git remote get-url origin)
    echo -e "${GREEN}✅${NC} Remote origin: $ORIGIN"
  else
    echo -e "${RED}❌${NC} No git remote 'origin' configured"
    echo -e "   Run: ${BLUE}git remote add origin <your-repo-url>${NC}"
    ((ERRORS++))
  fi
  
  # Check branch
  BRANCH=$(git branch --show-current)
  echo -e "${GREEN}✅${NC} Current branch: $BRANCH"
  
  # Check uncommitted changes
  if git diff --quiet && git diff --staged --quiet; then
    echo -e "${GREEN}✅${NC} No uncommitted changes"
  else
    echo -e "${YELLOW}⚠️${NC}  You have uncommitted changes"
    echo -e "   These will NOT be deployed unless committed and pushed"
  fi
else
  echo -e "${RED}❌${NC} Not a git repository"
  echo -e "   Run: ${BLUE}git init${NC}"
  ((ERRORS++))
fi

echo ""

# Check required files
echo "📁 Checking Required Files..."
echo ""

REQUIRED_FILES=(
  "package.json"
  "render.yaml"
  "vercel.json"
  "prisma/schema.prisma"
  "server/index.ts"
  "client/src/App.tsx"
  ".gitignore"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${RED}❌${NC} $file (MISSING)"
    ((ERRORS++))
  fi
done

echo ""

# Check package.json scripts
echo "📦 Checking package.json scripts..."
echo ""

if grep -q '"build:client"' package.json; then
  echo -e "${GREEN}✅${NC} build:client script"
else
  echo -e "${RED}❌${NC} Missing build:client script"
  ((ERRORS++))
fi

if grep -q '"build:server"' package.json; then
  echo -e "${GREEN}✅${NC} build:server script"
else
  echo -e "${RED}❌${NC} Missing build:server script"
  ((ERRORS++))
fi

if grep -q '"start"' package.json; then
  echo -e "${GREEN}✅${NC} start script"
else
  echo -e "${RED}❌${NC} Missing start script"
  ((ERRORS++))
fi

echo ""

# Check .env file
echo "🔐 Checking Environment Variables..."
echo ""

if [ -f .env ]; then
  echo -e "${GREEN}✅${NC} .env file exists"
  
  # Check critical vars
  CRITICAL_VARS=(
    "DATABASE_URL"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLIC_KEY"
    "JWT_SECRET"
  )
  
  for var in "${CRITICAL_VARS[@]}"; do
    if grep -q "^${var}=" .env; then
      echo -e "${GREEN}✅${NC} $var defined"
    else
      echo -e "${RED}❌${NC} $var missing in .env"
      ((ERRORS++))
    fi
  done
  
  echo ""
  echo -e "${YELLOW}⚠️${NC}  Remember: .env is for local development only"
  echo -e "   You'll configure production vars in Render & Vercel dashboards"
else
  echo -e "${YELLOW}⚠️${NC}  No .env file (OK if deploying fresh)"
fi

echo ""

# Check dependencies
echo "📚 Checking Dependencies..."
echo ""

if [ -d node_modules ]; then
  echo -e "${GREEN}✅${NC} node_modules exists"
else
  echo -e "${YELLOW}⚠️${NC}  node_modules not found"
  echo -e "   Running npm install..."
  npm install
fi

echo ""

# Check Prisma
echo "🗄️ Checking Prisma Setup..."
echo ""

if [ -f prisma/schema.prisma ]; then
  echo -e "${GREEN}✅${NC} Prisma schema exists"
  
  if [ -d prisma/migrations ]; then
    MIGRATION_COUNT=$(ls -1 prisma/migrations | wc -l | xargs)
    echo -e "${GREEN}✅${NC} $MIGRATION_COUNT migration(s) found"
  else
    echo -e "${YELLOW}⚠️${NC}  No migrations folder"
  fi
  
  # Try to generate Prisma client
  echo -e "${BLUE}🔧${NC} Generating Prisma client..."
  if npx prisma generate >/dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Prisma client generated"
  else
    echo -e "${RED}❌${NC} Prisma client generation failed"
    ((ERRORS++))
  fi
else
  echo -e "${RED}❌${NC} prisma/schema.prisma not found"
  ((ERRORS++))
fi

echo ""

# Try to build
echo "🔨 Testing Build Process..."
echo ""

echo -e "${BLUE}🔧${NC} Building client..."
if npm run build:client >/dev/null 2>&1; then
  echo -e "${GREEN}✅${NC} Client build successful"
  
  if [ -d dist ]; then
    DIST_SIZE=$(du -sh dist | awk '{print $1}')
    echo -e "   Build size: $DIST_SIZE"
  fi
else
  echo -e "${RED}❌${NC} Client build failed"
  echo -e "   Run: ${BLUE}npm run build:client${NC} to see errors"
  ((ERRORS++))
fi

echo ""

echo -e "${BLUE}🔧${NC} Building server..."
if npm run build:server >/dev/null 2>&1; then
  echo -e "${GREEN}✅${NC} Server build successful"
  
  if [ -d dist/server ]; then
    echo -e "   Output: dist/server/"
  fi
else
  echo -e "${RED}❌${NC} Server build failed"
  echo -e "   Run: ${BLUE}npm run build:server${NC} to see errors"
  ((ERRORS++))
fi

echo ""

# Check render.yaml
echo "🎨 Validating render.yaml..."
echo ""

if [ -f render.yaml ]; then
  if grep -q "type: web" render.yaml; then
    echo -e "${GREEN}✅${NC} Web service defined"
  else
    echo -e "${RED}❌${NC} No web service in render.yaml"
    ((ERRORS++))
  fi
  
  if grep -q "type: pserv" render.yaml; then
    echo -e "${GREEN}✅${NC} PostgreSQL service defined"
  else
    echo -e "${YELLOW}⚠️${NC}  No PostgreSQL service (you'll need external DB)"
  fi
  
  if grep -q "healthCheckPath" render.yaml; then
    echo -e "${GREEN}✅${NC} Health check configured"
  else
    echo -e "${YELLOW}⚠️${NC}  No health check path"
  fi
fi

echo ""

# Check vercel.json
echo "💎 Validating vercel.json..."
echo ""

if [ -f vercel.json ]; then
  if grep -q '"buildCommand"' vercel.json; then
    BUILD_CMD=$(grep '"buildCommand"' vercel.json | sed 's/.*: "\(.*\)".*/\1/')
    echo -e "${GREEN}✅${NC} Build command: $BUILD_CMD"
  else
    echo -e "${YELLOW}⚠️${NC}  No buildCommand specified"
  fi
  
  if grep -q '"outputDirectory"' vercel.json; then
    OUTPUT_DIR=$(grep '"outputDirectory"' vercel.json | sed 's/.*: "\(.*\)".*/\1/')
    echo -e "${GREEN}✅${NC} Output directory: $OUTPUT_DIR"
  else
    echo -e "${YELLOW}⚠️${NC}  No outputDirectory specified"
  fi
  
  if grep -q '"rewrites"' vercel.json; then
    echo -e "${GREEN}✅${NC} API rewrites configured"
  else
    echo -e "${YELLOW}⚠️${NC}  No API rewrites"
  fi
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${BLUE}🚀 Ready to Deploy!${NC}"
  echo ""
  echo "Next steps:"
  echo ""
  echo -e "1. ${YELLOW}Review deployment guide:${NC}"
  echo -e "   ${BLUE}cat DEPLOY-TO-PRODUCTION.md${NC}"
  echo ""
  echo -e "2. ${YELLOW}Commit your changes:${NC}"
  echo -e "   ${BLUE}git add .${NC}"
  echo -e "   ${BLUE}git commit -m '🚀 Prepare for production deployment'${NC}"
  echo -e "   ${BLUE}git push origin main${NC}"
  echo ""
  echo -e "3. ${YELLOW}Deploy Backend (Render):${NC}"
  echo -e "   • Go to ${BLUE}https://render.com${NC}"
  echo -e "   • Create PostgreSQL database"
  echo -e "   • Create Web Service from GitHub repo"
  echo -e "   • Configure environment variables (see ENV-VARIABLES-REFERENCE.md)"
  echo ""
  echo -e "4. ${YELLOW}Deploy Frontend (Vercel):${NC}"
  echo -e "   • Go to ${BLUE}https://vercel.com${NC}"
  echo -e "   • Import your GitHub repository"
  echo -e "   • Configure environment variables"
  echo ""
  echo -e "5. ${YELLOW}Test Deployment:${NC}"
  echo -e "   ${BLUE}curl https://synrgy-api.onrender.com/api/health${NC}"
  echo -e "   ${BLUE}open https://synrgy.vercel.app${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ $ERRORS ERROR(S) FOUND${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Please fix the errors above before deploying."
  echo ""
  echo "For help, see:"
  echo "  • DEPLOY-TO-PRODUCTION.md"
  echo "  • ENV-VARIABLES-REFERENCE.md"
  echo ""
  exit 1
fi

