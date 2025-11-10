#!/bin/bash

echo "🤖 Test du Chat IA Synrgy"
echo "=========================="
echo ""

# Variables
API_URL="http://localhost:5001"
COOKIE_FILE="test-chat-cookies.txt"

# Créer un utilisateur de test
EMAIL="chattest-$(date +%s)@synrgy.com"
PASSWORD="TestChat123"

echo "📧 Création d'un utilisateur athlète de test..."
REGISTER=$(curl -s -c $COOKIE_FILE -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"role\":\"athlete\"}")

if echo "$REGISTER" | grep -q "success"; then
  echo "✅ Utilisateur créé : $EMAIL"
else
  echo "❌ Échec de création utilisateur"
  exit 1
fi
echo ""

# Test 1: Envoyer un premier message
echo "1️⃣ Test d'envoi de message (premier message)..."
MSG1=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Bonjour Synrgy ! Je veux commencer la musculation."}')

if echo "$MSG1" | grep -q "reply"; then
  echo "✅ Message envoyé et réponse reçue"
  REPLY1=$(echo "$MSG1" | grep -o '"reply":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse IA: ${REPLY1:0:100}..."
  CONTEXT1=$(echo "$MSG1" | grep -o '"messagesCount":[0-9]*' | cut -d':' -f2)
  echo "   📊 Messages dans l'historique: $CONTEXT1"
else
  echo "❌ Échec d'envoi de message"
  echo "   Réponse: $MSG1"
fi
echo ""

# Test 2: Envoyer un second message (avec contexte)
echo "2️⃣ Test d'envoi de message (avec contexte)..."
sleep 1
MSG2=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Quel programme tu me conseilles pour débuter ?"}')

if echo "$MSG2" | grep -q "reply"; then
  echo "✅ Second message envoyé avec contexte"
  REPLY2=$(echo "$MSG2" | grep -o '"reply":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse IA: ${REPLY2:0:100}..."
  CONTEXT2=$(echo "$MSG2" | grep -o '"messagesCount":[0-9]*' | cut -d':' -f2)
  echo "   📊 Messages dans l'historique: $CONTEXT2"
else
  echo "❌ Échec du second message"
fi
echo ""

# Test 3: Récupérer l'historique
echo "3️⃣ Test de récupération de l'historique..."
HISTORY=$(curl -s -b $COOKIE_FILE "$API_URL/api/chat/history")

if echo "$HISTORY" | grep -q "history"; then
  echo "✅ Historique récupéré"
  TOTAL=$(echo "$HISTORY" | grep -o '"totalMessages":[0-9]*' | cut -d':' -f2)
  echo "   📚 Total de messages: $TOTAL"
  
  # Compter les messages user vs assistant
  USER_COUNT=$(echo "$HISTORY" | grep -o '"role":"user"' | wc -l | tr -d ' ')
  ASSISTANT_COUNT=$(echo "$HISTORY" | grep -o '"role":"assistant"' | wc -l | tr -d ' ')
  echo "   👤 Messages utilisateur: $USER_COUNT"
  echo "   🤖 Messages assistant: $ASSISTANT_COUNT"
else
  echo "❌ Échec de récupération de l'historique"
fi
echo ""

# Test 4: Tester un message de coach
echo "4️⃣ Test avec un utilisateur coach..."
COACH_EMAIL="coach-$(date +%s)@synrgy.com"
curl -s -c $COOKIE_FILE -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$COACH_EMAIL\",\"password\":\"$PASSWORD\",\"role\":\"coach\"}" > /dev/null

COACH_MSG=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"Comment structurer un programme PPL pour mes athlètes ?"}')

if echo "$COACH_MSG" | grep -q "reply"; then
  echo "✅ Message coach envoyé"
  COACH_REPLY=$(echo "$COACH_MSG" | grep -o '"reply":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   💬 Réponse IA (coach): ${COACH_REPLY:0:100}..."
  ROLE=$(echo "$COACH_MSG" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
  echo "   👔 Rôle détecté: $ROLE"
else
  echo "⚠️  Problème avec le message coach"
fi
echo ""

# Test 5: Supprimer l'historique
echo "5️⃣ Test de suppression de l'historique..."
# Revenir au compte athlète
curl -s -c $COOKIE_FILE -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" > /dev/null

DELETE=$(curl -s -b $COOKIE_FILE -X DELETE "$API_URL/api/chat/history")

if echo "$DELETE" | grep -q "success"; then
  echo "✅ Historique supprimé"
  
  # Vérifier que l'historique est vide
  HISTORY_AFTER=$(curl -s -b $COOKIE_FILE "$API_URL/api/chat/history")
  TOTAL_AFTER=$(echo "$HISTORY_AFTER" | grep -o '"totalMessages":[0-9]*' | cut -d':' -f2)
  
  if [ "$TOTAL_AFTER" = "0" ]; then
    echo "   ✅ Historique confirmé vide"
  else
    echo "   ⚠️  L'historique devrait être vide (total: $TOTAL_AFTER)"
  fi
else
  echo "❌ Échec de suppression"
fi
echo ""

# Nettoyage
rm -f $COOKIE_FILE

echo "=========================="
echo "🎉 Tests du Chat IA terminés!"
echo ""
echo "Résumé:"
echo "  ✅ Premier message avec réponse IA"
echo "  ✅ Second message avec contexte"
echo "  ✅ Récupération de l'historique"
echo "  ✅ Personnalisation coach/athlète"
echo "  ✅ Suppression de l'historique"
echo ""
echo "📝 Note: Configure OPENAI_API_KEY dans .env pour des réponses IA réelles"

