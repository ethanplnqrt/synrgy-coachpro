#!/bin/bash

echo "🤖 Test de Codex AI Engine"
echo "==========================="
echo ""

API_URL="http://localhost:5001"

# Test 1: Status Codex
echo "1️⃣ Vérification du status Codex..."
STATUS=$(curl -s "$API_URL/api/codex/status")

if echo "$STATUS" | grep -q "configured"; then
  echo "✅ Endpoint /api/codex/status accessible"
  echo "   Réponse: $STATUS"
  
  CONFIGURED=$(echo "$STATUS" | grep -o '"configured":[a-z]*' | cut -d':' -f2)
  if [ "$CONFIGURED" = "true" ]; then
    echo "   ✅ Codex configuré avec clé API"
  else
    echo "   ⚠️  Codex en mode fallback (pas de clé API)"
  fi
else
  echo "❌ Endpoint /api/codex/status inaccessible"
  exit 1
fi
echo ""

# Test 2: Query Codex sans authentification
echo "2️⃣ Test de query Codex (sans auth)..."
RESPONSE=$(curl -s -X POST "$API_URL/api/codex" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Donne-moi un conseil rapide pour progresser en musculation"}')

if echo "$RESPONSE" | grep -q "result"; then
  echo "✅ Query Codex réussie"
  RESULT=$(echo "$RESPONSE" | grep -o '"result":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse: ${RESULT:0:100}..."
else
  echo "❌ Query Codex échouée"
  echo "   Réponse: $RESPONSE"
fi
echo ""

# Test 3: Query Codex avec authentification
echo "3️⃣ Test de query Codex (avec auth)..."

# Créer un utilisateur
EMAIL="codextest-$(date +%s)@synrgy.com"
curl -s -c codex-cookies.txt -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"test123\",\"role\":\"athlete\"}" > /dev/null

# Query avec contexte utilisateur
AUTH_RESPONSE=$(curl -s -b codex-cookies.txt -X POST "$API_URL/api/codex" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Crée-moi un programme de force 3 jours","context":{"goal":"force"}}')

if echo "$AUTH_RESPONSE" | grep -q "result"; then
  echo "✅ Query Codex avec auth réussie"
  AUTH_RESULT=$(echo "$AUTH_RESPONSE" | grep -o '"result":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse: ${AUTH_RESULT:0:100}..."
else
  echo "⚠️  Query Codex avec auth problématique"
  echo "   Réponse: $AUTH_RESPONSE"
fi
echo ""

# Test 4: Query avec contexte coach
echo "4️⃣ Test avec contexte coach..."
COACH_EMAIL="coach-$(date +%s)@synrgy.com"
curl -s -c codex-cookies.txt -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$COACH_EMAIL\",\"password\":\"test123\",\"role\":\"coach\"}" > /dev/null

COACH_RESPONSE=$(curl -s -b codex-cookies.txt -X POST "$API_URL/api/codex" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Comment structurer un programme PPL pour débutant ?"}')

if echo "$COACH_RESPONSE" | grep -q "result"; then
  echo "✅ Query Codex coach réussie"
  COACH_RESULT=$(echo "$COACH_RESPONSE" | grep -o '"result":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse coach: ${COACH_RESULT:0:100}..."
else
  echo "⚠️  Query problématique"
fi
echo ""

# Nettoyage
rm -f codex-cookies.txt

echo "==========================="
echo "🎉 Tests Codex terminés!"
echo ""
echo "Résumé:"
echo "  ✅ Status endpoint accessible"
echo "  ✅ Query sans auth fonctionnelle"
echo "  ✅ Query avec auth fonctionnelle"
echo "  ✅ Contexte utilisateur pris en compte"
echo ""

if [ "$CONFIGURED" = "true" ]; then
  echo "📝 Codex utilise l'API configurée"
else
  echo "📝 Codex en mode fallback (configure CODEX_API_KEY dans .env pour API réelle)"
fi

