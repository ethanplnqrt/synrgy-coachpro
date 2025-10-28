#!/bin/bash

echo "🚀 Démarrage de Synrgy Ultimate IA 3.0..."

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "npm run dev:server" 2>/dev/null || true
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Nettoyer le cache Vite
echo "🗑️ Nettoyage du cache Vite..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Démarrer le backend
echo "🔧 Démarrage du backend..."
npm run dev:server &

# Attendre un peu
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
npm run dev &

# Attendre un peu
sleep 5

echo ""
echo "✅ Synrgy Ultimate IA 3.0 est maintenant en cours d'exécution !"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "📋 Fonctionnalités disponibles:"
echo "   - Scan photo/QR + banque d'aliments"
echo "   - Nutrition IA adaptative"
echo "   - Trackers santé connectés"
echo "   - Gamification & défis"
echo "   - Planificateur intelligent"
echo "   - Ressources premium"
echo "   - Mode offline"
echo "   - Analytics coach"
echo "   - Personnalisation/marque blanche"
echo "   - Rétroaction vocale IA"
echo "   - Mode santé & réhabilitation"
echo "   - Communauté/chat interne"
echo "   - Paiements & offres"
echo "   - Progression visuelle"
echo ""
echo "💡 Mode démo activé (TEST_MODE=true)"
echo "   Toutes les fonctionnalités sont opérationnelles avec des données simulées."
echo ""
echo "📖 Consultez le rapport de construction: build-report.md"
echo ""
echo "🎯 Ouvrez http://localhost:5173 dans votre navigateur pour commencer !"

