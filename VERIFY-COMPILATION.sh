#!/bin/bash
# ✅ SYNRGY COMPILATION VERIFICATION
# Verifies all critical pages and components exist for clean Vite build

echo "🔍 Verifying Synrgy Frontend Compilation Readiness..."
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Critical files check
echo "📁 Checking critical files..."

CRITICAL_FILES=(
  "client/src/i18n.ts"
  "client/src/contexts/LanguageContext.tsx"
  "client/src/contexts/ThemeContext.tsx"
  "client/src/contexts/AuthContext.tsx"
  "client/src/components/GlowButton.tsx"
  "client/src/components/ProButton.tsx"
  "client/src/components/ProCard.tsx"
  "client/src/components/AnimatedCard.tsx"
  "client/src/components/LanguageSelector.tsx"
  "client/src/pages/coach/dashboard.tsx"
  "client/src/pages/coach/clients.tsx"
  "client/src/pages/coach/client-profile.tsx"
  "client/src/pages/coach/program-builder.tsx"
  "client/src/pages/landing.tsx"
  "client/src/App.tsx"
)

MISSING_COUNT=0
for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${RED}❌${NC} $file (MISSING)"
    ((MISSING_COUNT++))
  fi
done

echo ""
if [ $MISSING_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ All critical files present (${#CRITICAL_FILES[@]}/${#CRITICAL_FILES[@]})${NC}"
else
  echo -e "${RED}❌ Missing $MISSING_COUNT files${NC}"
  exit 1
fi

echo ""
echo "📦 Checking component exports..."

# Check exports
EXPORTS_OK=true

if ! grep -q "export const GlowButton" client/src/components/GlowButton.tsx; then
  echo -e "${RED}❌${NC} GlowButton missing named export"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} GlowButton exports correctly"
fi

if ! grep -q "export default function ProButton" client/src/components/ProButton.tsx; then
  echo -e "${RED}❌${NC} ProButton missing default export"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} ProButton exports correctly"
fi

if ! grep -q "export const ProCardHeader" client/src/components/ProCard.tsx; then
  echo -e "${RED}❌${NC} ProCard missing composable exports"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} ProCard exports correctly"
fi

if ! grep -q "export const LanguageProvider" client/src/contexts/LanguageContext.tsx; then
  echo -e "${RED}❌${NC} LanguageContext missing exports"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} LanguageContext exports correctly"
fi

echo ""
echo "🎨 Checking page components..."

# Check pages
if ! grep -q "export default function ClientProfile" client/src/pages/coach/client-profile.tsx; then
  echo -e "${RED}❌${NC} ClientProfile missing default export"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} ClientProfile exports correctly"
fi

if ! grep -q "export default function ProgramBuilder" client/src/pages/coach/program-builder.tsx; then
  echo -e "${RED}❌${NC} ProgramBuilder missing default export"
  EXPORTS_OK=false
else
  echo -e "${GREEN}✅${NC} ProgramBuilder exports correctly"
fi

echo ""
echo "🔗 Checking App.tsx imports..."

# Check App.tsx imports
if grep -q "import ClientProfile from.*client-profile" client/src/App.tsx; then
  echo -e "${GREEN}✅${NC} ClientProfile imported in App.tsx"
else
  echo -e "${RED}❌${NC} ClientProfile NOT imported in App.tsx"
  EXPORTS_OK=false
fi

if grep -q "import ProgramBuilder from.*program-builder" client/src/App.tsx; then
  echo -e "${GREEN}✅${NC} ProgramBuilder imported in App.tsx"
else
  echo -e "${RED}❌${NC} ProgramBuilder NOT imported in App.tsx"
  EXPORTS_OK=false
fi

echo ""
echo "📊 Component usage statistics..."
echo -n "   GlowButton used in: "
grep -r "import.*GlowButton" client/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs
echo -n "   ProButton used in: "
grep -r "import.*ProButton" client/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs
echo -n "   ProCard used in: "
grep -r "import.*ProCard" client/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs

echo ""
echo "🧪 Console log checks..."

# Check console logs
if grep -q 'console.log.*ClientProfile page loaded' client/src/pages/coach/client-profile.tsx; then
  echo -e "${GREEN}✅${NC} ClientProfile has console log"
else
  echo -e "${YELLOW}⚠️${NC}  ClientProfile missing console log"
fi

if grep -q 'console.log.*ProgramBuilder page loaded' client/src/pages/coach/program-builder.tsx; then
  echo -e "${GREEN}✅${NC} ProgramBuilder has console log"
else
  echo -e "${YELLOW}⚠️${NC}  ProgramBuilder missing console log"
fi

if grep -q 'console.log.*i18n initialized' client/src/i18n.ts; then
  echo -e "${GREEN}✅${NC} i18n has initialization log"
else
  echo -e "${YELLOW}⚠️${NC}  i18n missing initialization log"
fi

if grep -q 'console.log.*LanguageContext' client/src/contexts/LanguageContext.tsx; then
  echo -e "${GREEN}✅${NC} LanguageContext has console log"
else
  echo -e "${YELLOW}⚠️${NC}  LanguageContext missing console log"
fi

echo ""
if [ "$EXPORTS_OK" = true ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${BLUE}🚀 Frontend is ready to compile!${NC}"
  echo ""
  echo -e "Next steps:"
  echo -e "  ${YELLOW}1.${NC} Run: ${BLUE}npm run dev:client${NC}"
  echo -e "  ${YELLOW}2.${NC} Open: ${BLUE}http://localhost:5173${NC}"
  echo -e "  ${YELLOW}3.${NC} Check console for:"
  echo -e "     • ${GREEN}🌍 i18n initialized${NC}"
  echo -e "     • ${GREEN}🈳 LanguageContext loaded: fr${NC}"
  echo -e "     • ${GREEN}📄 ClientProfile page loaded${NC} (when visiting)"
  echo -e "     • ${GREEN}🧩 ProgramBuilder page loaded${NC} (when visiting)"
  echo ""
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Please fix the issues above before compiling."
  exit 1
fi

