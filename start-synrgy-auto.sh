#!/bin/bash

# Script de démarrage automatique Synrgy avec Ollama
# Auteur: Auto-generated

set -e

echo "🚀 Démarrage de Synrgy avec Ollama..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1️⃣ Vérifier le .env
echo "1️⃣ Vérification du fichier .env..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Fichier .env manquant, création...${NC}"
    cat > .env << EOF
TEST_MODE=false
NODE_ENV=development
PORT=5000
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
MODEL_NAME=llama3.2:1b
SESSION_SECRET=synrgy-secret-key-dev-2024
DATABASE_URL=file:./dev.db
EOF
    echo -e "${GREEN}✅ Fichier .env créé${NC}"
else
    echo -e "${GREEN}✅ Fichier .env trouvé${NC}"
fi

# Vérifier les valeurs critiques dans .env
if ! grep -q "AI_PROVIDER=ollama" .env; then
    echo -e "${YELLOW}⚠️  AI_PROVIDER n'est pas 'ollama' dans .env${NC}"
fi

if ! grep -q "OLLAMA_API_URL=http://localhost:11434" .env; then
    echo -e "${YELLOW}⚠️  OLLAMA_API_URL ne pointe pas vers localhost:11434${NC}"
fi

echo ""

# 2️⃣ Vérifier qu'Ollama est actif sur le port 11434
echo "2️⃣ Vérification d'Ollama sur le port 11434..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama est actif sur le port 11434${NC}"
else
    echo -e "${RED}❌ Ollama n'est pas accessible sur le port 11434${NC}"
    echo -e "${YELLOW}💡 Démarrez Ollama avec: ollama serve${NC}"
    exit 1
fi
echo ""

# Fonction pour vérifier si un port est libre
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port occupé
    else
        return 0  # Port libre
    fi
}

# Fonction pour trouver un port libre
find_free_port() {
    local start_port=$1
    local port=$start_port
    while ! check_port $port; do
        port=$((port + 1))
    done
    echo $port
}

# 3️⃣ Vérifier les ports et démarrer les serveurs
BACKEND_PORT=5000
FRONTEND_PORT=5173

# Vérifier le port backend
if ! check_port $BACKEND_PORT; then
    echo -e "${YELLOW}⚠️  Le port $BACKEND_PORT est occupé, recherche d'un port libre...${NC}"
    BACKEND_PORT=$(find_free_port 5001)
    echo -e "${BLUE}🔧 Utilisation du port $BACKEND_PORT pour le backend${NC}"
    # Modifier le .env temporairement
    sed -i.bak "s/^PORT=.*/PORT=$BACKEND_PORT/" .env
fi

# Vérifier le port frontend
if ! check_port $FRONTEND_PORT; then
    echo -e "${YELLOW}⚠️  Le port $FRONTEND_PORT est occupé, recherche d'un port libre...${NC}"
    FRONTEND_PORT=$(find_free_port 5174)
    echo -e "${BLUE}🔧 Utilisation du port $FRONTEND_PORT pour le frontend${NC}"
fi

echo ""
echo "3️⃣ Démarrage des serveurs..."
echo -e "${BLUE}⚙️  Backend sur le port $BACKEND_PORT...${NC}"
echo -e "${BLUE}🌐 Frontend sur le port $FRONTEND_PORT...${NC}"
echo ""

# Démarrer le backend en arrière-plan
npm run dev:server > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Démarrer le frontend en arrière-plan avec le port spécifié
PORT=$FRONTEND_PORT npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Fonction de nettoyage en cas d'arrêt
cleanup() {
    echo ""
    echo -e "${YELLOW}Arrêt des serveurs...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

# Attendre que les serveurs démarrent
echo "⏳ Attente du démarrage des serveurs..."
sleep 5

# Vérifier que le backend répond
BACKEND_READY=false
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/config > /dev/null 2>&1; then
        BACKEND_READY=true
        break
    fi
    sleep 1
done

if [ "$BACKEND_READY" = false ]; then
    echo -e "${RED}❌ Le backend n'a pas démarré correctement${NC}"
    echo -e "${YELLOW}Logs backend:${NC}"
    tail -20 backend.log
    cleanup
    exit 1
fi

echo -e "${GREEN}✅ Backend démarré sur http://localhost:$BACKEND_PORT${NC}"

# Vérifier que le frontend répond
FRONTEND_READY=false
for i in {1..30}; do
    if curl -s http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        FRONTEND_READY=true
        break
    fi
    sleep 1
done

if [ "$FRONTEND_READY" = false ]; then
    echo -e "${RED}❌ Le frontend n'a pas démarré correctement${NC}"
    echo -e "${YELLOW}Logs frontend:${NC}"
    tail -20 frontend.log
    cleanup
    exit 1
fi

echo -e "${GREEN}✅ Frontend démarré sur http://localhost:$FRONTEND_PORT${NC}"
echo ""

# 4️⃣ Tester la connexion IA
echo "4️⃣ Test de la connexion IA..."
echo -e "${BLUE}🧠 Envoi du prompt de test à /api/ask...${NC}"

TEST_PROMPT="Génère un plan d'entraînement pour débutant"
RESPONSE=$(curl -s -X POST http://localhost:$BACKEND_PORT/api/ask \
    -H "Content-Type: application/json" \
    -d "{\"content\": \"$TEST_PROMPT\"}")

if echo "$RESPONSE" | grep -q "reply"; then
    echo -e "${GREEN}✅ Synrgy connecté à Ollama et opérationnel${NC}"
    echo ""
    echo -e "${BLUE}Réponse IA:${NC}"
    echo "$RESPONSE" | head -3
    echo ""
else
    echo -e "${RED}❌ Erreur lors du test IA${NC}"
    echo "Réponse: $RESPONSE"
    echo ""
    echo -e "${YELLOW}💡 Vérifiez qu'Ollama est bien démarré sur le port 11434${NC}"
fi
echo ""

# 5️⃣ Ouvrir le navigateur et afficher le résumé
echo "5️⃣ Ouverture du navigateur..."
sleep 2

# Ouvrir le navigateur (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:$FRONTEND_PORT"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:$FRONTEND_PORT" 2>/dev/null || true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Synrgy relancé avec succès !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🌐 Frontend : http://localhost:$FRONTEND_PORT${NC}"
echo -e "${BLUE}⚙️  Backend  : http://localhost:$BACKEND_PORT${NC}"
echo -e "${BLUE}🧠 IA Locale : http://localhost:11434${NC}"
echo ""
echo -e "${YELLOW}💡 Pour arrêter les serveurs, appuyez sur Ctrl+C${NC}"
echo ""

# Garder le script actif pour maintenir les processus en vie
wait


