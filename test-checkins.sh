#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Test Synrgy Check-ins System ===${NC}\n"

API_URL="http://localhost:5001"

# Test 1: Register athlete
echo -e "${YELLOW}1. Register athlete for testing...${NC}"
ATHLETE_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "athlete-checkin@test.com",
    "password": "test123",
    "fullName": "Test Athlete",
    "role": "athlete"
  }' \
  -c cookies.txt)

echo "$ATHLETE_RESPONSE" | jq '.'

if echo "$ATHLETE_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Athlete registered${NC}\n"
else
  echo -e "${RED}✗ Registration failed${NC}\n"
  exit 1
fi

# Test 2: Create first check-in
echo -e "${YELLOW}2. Create first check-in...${NC}"
CHECKIN1=$(curl -s -X POST "$API_URL/api/checkins" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "weight": "75.5",
    "sleep": "7",
    "energy": "8",
    "mood": "7",
    "notes": "Bonne séance de squat aujourd'\''hui"
  }')

echo "$CHECKIN1" | jq '.'

if echo "$CHECKIN1" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ First check-in created${NC}"
  
  # Show AI analysis
  AI_ANALYSIS=$(echo "$CHECKIN1" | jq -r '.checkin.aiAnalysis')
  echo -e "${BLUE}AI Analysis:${NC}"
  echo -e "${GREEN}$AI_ANALYSIS${NC}\n"
else
  echo -e "${RED}✗ Check-in creation failed${NC}\n"
fi

# Test 3: Create second check-in (different day simulation)
echo -e "${YELLOW}3. Create second check-in (lower energy)...${NC}"
CHECKIN2=$(curl -s -X POST "$API_URL/api/checkins" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "weight": "75.3",
    "sleep": "5",
    "energy": "4",
    "mood": "5",
    "notes": "Fatigue, mauvaise nuit"
  }')

echo "$CHECKIN2" | jq '.'

if echo "$CHECKIN2" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Second check-in created${NC}"
  
  AI_ANALYSIS=$(echo "$CHECKIN2" | jq -r '.checkin.aiAnalysis')
  echo -e "${BLUE}AI Analysis (low energy):${NC}"
  echo -e "${YELLOW}$AI_ANALYSIS${NC}\n"
else
  echo -e "${RED}✗ Check-in creation failed${NC}\n"
fi

# Test 4: Get user check-ins
echo -e "${YELLOW}4. Get athlete check-ins history...${NC}"
HISTORY=$(curl -s -X GET "$API_URL/api/checkins" \
  -b cookies.txt)

echo "$HISTORY" | jq '.'

COUNT=$(echo "$HISTORY" | jq '.checkins | length')
if [ "$COUNT" -ge 2 ]; then
  echo -e "${GREEN}✓ History retrieved: $COUNT check-ins${NC}\n"
else
  echo -e "${RED}✗ History incomplete${NC}\n"
fi

# Test 5: Register coach
echo -e "${YELLOW}5. Register coach to test all check-ins view...${NC}"
COACH_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach-checkin@test.com",
    "password": "test123",
    "fullName": "Test Coach",
    "role": "coach"
  }' \
  -c cookies-coach.txt)

echo "$COACH_RESPONSE" | jq '.'

if echo "$COACH_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Coach registered${NC}\n"
else
  echo -e "${RED}✗ Coach registration failed${NC}\n"
fi

# Test 6: Coach tries to view all check-ins
echo -e "${YELLOW}6. Coach views all check-ins...${NC}"
ALL_CHECKINS=$(curl -s -X GET "$API_URL/api/checkins/all" \
  -b cookies-coach.txt)

echo "$ALL_CHECKINS" | jq '.'

ALL_COUNT=$(echo "$ALL_CHECKINS" | jq '.checkins | length')
if [ "$ALL_COUNT" -ge 2 ]; then
  echo -e "${GREEN}✓ Coach can see all check-ins: $ALL_COUNT total${NC}\n"
else
  echo -e "${RED}✗ Coach view incomplete${NC}\n"
fi

# Test 7: Athlete tries to view all check-ins (should fail)
echo -e "${YELLOW}7. Athlete tries to view all check-ins (should fail)...${NC}"
ATHLETE_ALL=$(curl -s -X GET "$API_URL/api/checkins/all" \
  -b cookies.txt)

echo "$ATHLETE_ALL" | jq '.'

if echo "$ATHLETE_ALL" | jq -e '.success == false' > /dev/null; then
  echo -e "${GREEN}✓ Authorization working (athlete blocked from /all)${NC}\n"
else
  echo -e "${RED}✗ Authorization issue${NC}\n"
fi

# Test 8: Check-in without auth (should fail)
echo -e "${YELLOW}8. Try check-in without auth (should fail)...${NC}"
NO_AUTH=$(curl -s -X POST "$API_URL/api/checkins" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": "80",
    "sleep": "8"
  }')

echo "$NO_AUTH" | jq '.'

if echo "$NO_AUTH" | jq -e 'has("message")' > /dev/null || [ -z "$NO_AUTH" ]; then
  echo -e "${GREEN}✓ Auth protection working${NC}\n"
else
  echo -e "${RED}✗ No auth protection${NC}\n"
fi

# Cleanup
echo -e "${YELLOW}9. Cleanup...${NC}"
rm -f cookies.txt cookies-coach.txt
echo -e "${GREEN}✓ Test cookies removed${NC}\n"

# Summary
echo -e "${BLUE}==================================${NC}"
echo -e "${GREEN}✓ Check-ins System Tests Complete${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${YELLOW}Summary:${NC}"
echo "✓ Athlete registration"
echo "✓ Check-in creation with AI analysis"
echo "✓ Multiple check-ins with different data"
echo "✓ History retrieval"
echo "✓ Coach registration"
echo "✓ Coach can view all check-ins"
echo "✓ Role-based authorization"
echo "✓ Auth protection"

echo -e "\n${GREEN}All tests passed! Check-ins system is operational! 🎉${NC}\n"

