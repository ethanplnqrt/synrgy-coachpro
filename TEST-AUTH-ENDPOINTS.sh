#!/bin/bash
# 🧪 TEST SYNRGY AUTH ENDPOINTS
# Tests all authentication endpoints

echo "🧪 Testing Synrgy Auth Endpoints..."
echo ""

BASE_URL="http://localhost:5001/api/auth"

# 1. Test Signup
echo "1️⃣ Testing POST /signup (creating coach account)..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"coach@test.com",
    "password":"test123",
    "role":"COACH",
    "fullName":"Test Coach"
  }')

echo "Response:"
echo "$SIGNUP_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
    echo "✅ Signup successful - Token received"
else
    echo "❌ Signup failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 2. Test Login
echo "2️⃣ Testing POST /login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"coach@test.com",
    "password":"test123"
  }' \
  -c cookies.txt)

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

if echo "$LOGIN_RESPONSE" | grep -q "Connexion réussie"; then
    echo "✅ Login successful - Cookie saved to cookies.txt"
else
    echo "❌ Login failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 3. Test Get Me
echo "3️⃣ Testing GET /me (with cookie)..."
ME_RESPONSE=$(curl -s $BASE_URL/me -b cookies.txt)

echo "Response:"
echo "$ME_RESPONSE" | jq '.'
echo ""

if echo "$ME_RESPONSE" | grep -q "coach@test.com"; then
    echo "✅ Get Me successful - User data retrieved"
else
    echo "❌ Get Me failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 4. Test Logout
echo "4️⃣ Testing POST /logout..."
LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/logout -b cookies.txt)

echo "Response:"
echo "$LOGOUT_RESPONSE" | jq '.'
echo ""

if echo "$LOGOUT_RESPONSE" | grep -q "Déconnexion réussie"; then
    echo "✅ Logout successful"
else
    echo "❌ Logout failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. Test Get Me after logout (should fail)
echo "5️⃣ Testing GET /me (after logout, should fail)..."
ME_AFTER_LOGOUT=$(curl -s $BASE_URL/me -b cookies.txt)

echo "Response:"
echo "$ME_AFTER_LOGOUT" | jq '.'
echo ""

if echo "$ME_AFTER_LOGOUT" | grep -q "error"; then
    echo "✅ Correctly denied access after logout"
else
    echo "❌ Still authenticated after logout (problem!)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 All tests complete!"
echo ""
echo "📝 Summary:"
echo "   1. Signup: Check response above"
echo "   2. Login: Check response above"
echo "   3. Get Me: Check response above"
echo "   4. Logout: Check response above"
echo "   5. Auth denied after logout: Check response above"
echo ""
echo "🔍 To view users in database:"
echo "   npx prisma studio"
echo ""
echo "🧹 Cleanup (optional):"
echo "   rm cookies.txt"

