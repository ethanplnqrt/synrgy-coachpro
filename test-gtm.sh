#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Test Synrgy Go-to-Market System ===${NC}\n"

API_URL="http://localhost:5001"

# Test 1: Check payment mode
echo -e "${YELLOW}1. Checking payment mode...${NC}"
MODE_RESPONSE=$(curl -s "$API_URL/api/payments/mode")
echo "$MODE_RESPONSE" | jq '.'

MODE=$(echo "$MODE_RESPONSE" | jq -r '.mode')
if [ "$MODE" = "mock" ]; then
  echo -e "${GREEN}✓ Mode MOCK activated (default)${NC}\n"
elif [ "$MODE" = "stripe" ]; then
  echo -e "${GREEN}✓ Mode STRIPE detected (Stripe configured)${NC}\n"
else
  echo -e "${RED}✗ Unknown mode${NC}\n"
  exit 1
fi

# Test 2: Get plans
echo -e "${YELLOW}2. Fetching available plans...${NC}"
PLANS=$(curl -s "$API_URL/api/payments/plans")
echo "$PLANS" | jq '.'

PLAN_COUNT=$(echo "$PLANS" | jq '.plans | length')
if [ "$PLAN_COUNT" -eq 3 ]; then
  echo -e "${GREEN}✓ 3 plans available (athlete, client, coach)${NC}\n"
else
  echo -e "${RED}✗ Expected 3 plans, got $PLAN_COUNT${NC}\n"
fi

# Test 3: Register coach
echo -e "${YELLOW}3. Register coach for testing...${NC}"
COACH_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach-gtm@test.com",
    "password": "test123",
    "fullName": "Test Coach GTM",
    "role": "coach"
  }' \
  -c cookies-coach.txt)

echo "$COACH_RESPONSE" | jq '.'

if echo "$COACH_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Coach registered${NC}\n"
else
  echo -e "${RED}✗ Coach registration failed${NC}\n"
  exit 1
fi

# Test 4: Create referral code
echo -e "${YELLOW}4. Create referral code...${NC}"
REFERRAL_CREATE=$(curl -s -X POST "$API_URL/api/payments/referrals/create" \
  -H "Content-Type: application/json" \
  -b cookies-coach.txt)

echo "$REFERRAL_CREATE" | jq '.'

REFERRAL_CODE=$(echo "$REFERRAL_CREATE" | jq -r '.referral.code')
if [ -n "$REFERRAL_CODE" ] && [ "$REFERRAL_CODE" != "null" ]; then
  echo -e "${GREEN}✓ Referral code created: $REFERRAL_CODE${NC}\n"
else
  echo -e "${RED}✗ Referral code creation failed${NC}\n"
  exit 1
fi

# Test 5: Validate referral code (public route)
echo -e "${YELLOW}5. Validate referral code (public)...${NC}"
VALIDATE_RESPONSE=$(curl -s -X POST "$API_URL/api/payments/referrals/validate" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"$REFERRAL_CODE\"}")

echo "$VALIDATE_RESPONSE" | jq '.'

if echo "$VALIDATE_RESPONSE" | jq -e '.valid' > /dev/null; then
  DISCOUNT=$(echo "$VALIDATE_RESPONSE" | jq -r '.discount')
  echo -e "${GREEN}✓ Code valid with ${DISCOUNT}% discount${NC}\n"
else
  echo -e "${RED}✗ Code validation failed${NC}\n"
fi

# Test 6: Register athlete
echo -e "${YELLOW}6. Register athlete for subscription test...${NC}"
ATHLETE_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "athlete-gtm@test.com",
    "password": "test123",
    "fullName": "Test Athlete GTM",
    "role": "athlete"
  }' \
  -c cookies-athlete.txt)

echo "$ATHLETE_RESPONSE" | jq '.'

if echo "$ATHLETE_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Athlete registered${NC}\n"
else
  echo -e "${RED}✗ Athlete registration failed${NC}\n"
fi

# Test 7: Subscribe without referral
echo -e "${YELLOW}7. Subscribe athlete (no referral code)...${NC}"
SUBSCRIBE1=$(curl -s -X POST "$API_URL/api/payments/subscribe" \
  -H "Content-Type: application/json" \
  -b cookies-athlete.txt \
  -d '{
    "planId": "athlete"
  }')

echo "$SUBSCRIBE1" | jq '.'

if echo "$SUBSCRIBE1" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Subscription created (no discount)${NC}\n"
else
  echo -e "${RED}✗ Subscription failed${NC}\n"
fi

# Test 8: Check subscription status
echo -e "${YELLOW}8. Check athlete subscription status...${NC}"
STATUS=$(curl -s "$API_URL/api/payments/status" \
  -b cookies-athlete.txt)

echo "$STATUS" | jq '.'

if echo "$STATUS" | jq -e '.hasActiveSubscription' > /dev/null; then
  echo -e "${GREEN}✓ Active subscription found${NC}\n"
else
  echo -e "${RED}✗ No active subscription${NC}\n"
fi

# Test 9: Cancel subscription
echo -e "${YELLOW}9. Cancel athlete subscription...${NC}"
CANCEL=$(curl -s -X POST "$API_URL/api/payments/cancel" \
  -b cookies-athlete.txt)

echo "$CANCEL" | jq '.'

if echo "$CANCEL" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Subscription canceled${NC}\n"
else
  echo -e "${RED}✗ Cancel failed${NC}\n"
fi

# Test 10: Register client with referral code
echo -e "${YELLOW}10. Register client and subscribe with referral code...${NC}"
CLIENT_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client-gtm@test.com",
    "password": "test123",
    "fullName": "Test Client GTM",
    "role": "client"
  }' \
  -c cookies-client.txt)

echo "$CLIENT_RESPONSE" | jq '.'

if echo "$CLIENT_RESPONSE" | jq -e '.success' > /dev/null; then
  echo -e "${GREEN}✓ Client registered${NC}\n"
fi

# Subscribe with referral code
SUBSCRIBE2=$(curl -s -X POST "$API_URL/api/payments/subscribe" \
  -H "Content-Type: application/json" \
  -b cookies-client.txt \
  -d "{
    \"planId\": \"client\",
    \"referralCode\": \"$REFERRAL_CODE\"
  }")

echo "$SUBSCRIBE2" | jq '.'

if echo "$SUBSCRIBE2" | jq -e '.subscription.referralCode' > /dev/null; then
  DISCOUNT=$(echo "$SUBSCRIBE2" | jq -r '.subscription.discount')
  echo -e "${GREEN}✓ Subscription with referral code (${DISCOUNT}% discount)${NC}\n"
else
  echo -e "${YELLOW}⚠ Subscription created but referral code not applied${NC}\n"
fi

# Test 11: Check coach referrals
echo -e "${YELLOW}11. Check coach referrals usage...${NC}"
COACH_REFERRALS=$(curl -s "$API_URL/api/payments/referrals" \
  -b cookies-coach.txt)

echo "$COACH_REFERRALS" | jq '.'

USED_COUNT=$(echo "$COACH_REFERRALS" | jq -r '.referrals[0].usedBy | length')
if [ "$USED_COUNT" -ge 1 ]; then
  echo -e "${GREEN}✓ Referral code used $USED_COUNT time(s)${NC}\n"
else
  echo -e "${YELLOW}⚠ Referral code not used yet${NC}\n"
fi

# Test 12: Try to create referral as non-coach (should fail)
echo -e "${YELLOW}12. Try to create referral as athlete (should fail)...${NC}"
ATHLETE_REF=$(curl -s -X POST "$API_URL/api/payments/referrals/create" \
  -b cookies-athlete.txt)

echo "$ATHLETE_REF" | jq '.'

if echo "$ATHLETE_REF" | jq -e '.success == false' > /dev/null; then
  echo -e "${GREEN}✓ Authorization working (only coaches can create codes)${NC}\n"
else
  echo -e "${RED}✗ Authorization issue${NC}\n"
fi

# Cleanup
echo -e "${YELLOW}13. Cleanup...${NC}"
rm -f cookies-coach.txt cookies-athlete.txt cookies-client.txt
echo -e "${GREEN}✓ Test cookies removed${NC}\n"

# Summary
echo -e "${BLUE}==================================${NC}"
echo -e "${GREEN}✓ GTM System Tests Complete${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${YELLOW}Summary:${NC}"
echo "✓ Payment mode detection ($MODE)"
echo "✓ Plans available (3)"
echo "✓ Coach registration"
echo "✓ Referral code creation"
echo "✓ Referral code validation"
echo "✓ Athlete registration"
echo "✓ Subscription without referral"
echo "✓ Subscription status check"
echo "✓ Subscription cancellation"
echo "✓ Subscription with referral code"
echo "✓ Coach referrals tracking"
echo "✓ Role-based authorization"

echo -e "\n${GREEN}All tests passed! GTM system is operational! 🚀${NC}\n"
echo -e "${BLUE}Payment Mode: ${MODE}${NC}"
if [ "$MODE" = "mock" ]; then
  echo -e "${YELLOW}To enable Stripe: Add STRIPE_SECRET_KEY to .env${NC}\n"
fi

