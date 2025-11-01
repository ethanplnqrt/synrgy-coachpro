#!/bin/bash

# Synrgy Pro - Script de démarrage
echo "🚀 Démarrage de Synrgy Pro - Plateforme complète de coaching"
echo "=============================================================="

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Initialiser les données seed
echo "🌱 Initialisation des données seed..."
node -e "
const { initializeSeedData } = require('./client/src/lib/seedData.ts');
initializeSeedData();
"

# Démarrer le serveur backend
echo "⚙️ Démarrage du serveur backend..."
npm run dev:server &
BACKEND_PID=$!

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
sleep 5

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
npm run dev:client &
FRONTEND_PID=$!

# Attendre que le frontend soit prêt
echo "⏳ Attente du démarrage du frontend..."
sleep 10

# Afficher les URLs
echo ""
echo "✅ Synrgy Pro est maintenant en ligne !"
echo "=============================================================="
echo "🌐 Frontend: http://localhost:5173"
echo "⚙️ Backend: http://localhost:5000"
echo "📊 Base de données: SQLite (dev.db)"
echo ""
echo "🎯 Fonctionnalités disponibles:"
echo "   • Cal - Planning & Rendez-vous"
echo "   • Macros - Nutrition & Suivi"
echo "   • Heavy/Strong - Log d'entraînement"
echo "   • TrueCoach - Relation coach-athlète"
echo "   • Check-ins - Suivi quotidien"
echo ""
echo "🔑 Comptes de test:"
echo "   Coach: coach@synrgy.app / password123"
echo "   Athlète: athlete1@synrgy.app / password123"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait
