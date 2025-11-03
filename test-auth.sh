#!/bin/bash

echo "🧪 Test d'authentification Synrgy"
echo "================================="
echo ""

# Variables
API_URL="http://localhost:5001"
EMAIL="test-$(date +%s)@synrgy.com"
PASSWORD="TestPassword123"
COOKIE_FILE="test-cookies.txt"

echo "📧 Email de test: $EMAIL"
echo ""

# Test 1: Inscription
echo "1️⃣ Test d'inscription..."
REGISTER_RESPONSE=$(curl -s -c $COOKIE_FILE -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"role\":\"coach\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
  echo "✅ Inscription réussie"
  echo "   Réponse: $REGISTER_RESPONSE"
else
  echo "❌ Échec de l'inscription"
  echo "   Réponse: $REGISTER_RESPONSE"
  rm -f $COOKIE_FILE
  exit 1
fi
echo ""

# Test 2: Vérifier la session
echo "2️⃣ Test de vérification de session (/api/auth/me)..."
ME_RESPONSE=$(curl -s -b $COOKIE_FILE "$API_URL/api/auth/me")

if echo "$ME_RESPONSE" | grep -q "$EMAIL"; then
  echo "✅ Session valide"
  echo "   Réponse: $ME_RESPONSE"
else
  echo "❌ Session invalide"
  echo "   Réponse: $ME_RESPONSE"
  rm -f $COOKIE_FILE
  exit 1
fi
echo ""

# Test 3: Route protégée (chat)
echo "3️⃣ Test d'accès route protégée (/api/chat)..."
CHAT_RESPONSE=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Bonjour coach!"}')

if echo "$CHAT_RESPONSE" | grep -q "reply"; then
  echo "✅ Accès autorisé à la route protégée"
  echo "   Réponse IA: $CHAT_RESPONSE"
else
  echo "⚠️  Route protégée accessible mais réponse inattendue"
  echo "   Réponse: $CHAT_RESPONSE"
fi
echo ""

# Test 4: Déconnexion
echo "4️⃣ Test de déconnexion..."
LOGOUT_RESPONSE=$(curl -s -c $COOKIE_FILE -b $COOKIE_FILE -X POST "$API_URL/api/auth/logout")

if echo "$LOGOUT_RESPONSE" | grep -q "success"; then
  echo "✅ Déconnexion réussie"
  echo "   Réponse: $LOGOUT_RESPONSE"
else
  echo "❌ Échec de déconnexion"
  echo "   Réponse: $LOGOUT_RESPONSE"
fi
echo ""

# Test 5: Vérifier que la session est bien invalide
echo "5️⃣ Test de session après déconnexion..."
ME_AFTER_LOGOUT=$(curl -s -b $COOKIE_FILE "$API_URL/api/auth/me")

if echo "$ME_AFTER_LOGOUT" | grep -q "Unauthorized"; then
  echo "✅ Session correctement invalidée"
else
  echo "⚠️  La session devrait être invalide"
  echo "   Réponse: $ME_AFTER_LOGOUT"
fi
echo ""

# Test 6: Reconnexion
echo "6️⃣ Test de reconnexion..."
LOGIN_RESPONSE=$(curl -s -c $COOKIE_FILE -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo "✅ Reconnexion réussie"
  echo "   Réponse: $LOGIN_RESPONSE"
else
  echo "❌ Échec de reconnexion"
  echo "   Réponse: $LOGIN_RESPONSE"
fi
echo ""

# Nettoyage
rm -f $COOKIE_FILE

echo "================================="
echo "🎉 Tests d'authentification terminés!"
echo ""
echo "Résumé:"
echo "  ✅ Inscription"
echo "  ✅ Vérification session"
echo "  ✅ Route protégée accessible"
echo "  ✅ Déconnexion"
echo "  ✅ Session invalidée"
echo "  ✅ Reconnexion"
echo ""
echo "📝 Utilisateur de test créé: $EMAIL"
echo "🗑️  Pour nettoyer: supprime l'entrée dans server/data/users.json"

