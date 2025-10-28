#!/bin/bash

echo "🧹 Nettoyage des anciens processus Vite et Node..."
# Ferme proprement tous les serveurs Vite et Node déjà ouverts
pkill -f "vite" 2>/dev/null
pkill -f "tsx" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 1

echo "🧽 Suppression du cache Vite..."
rm -rf node_modules/.vite 2>/dev/null

echo "🚀 Démarrage du backend (port 5000)..."
npm run dev:server &

echo "🌐 Démarrage du frontend (Vite)..."
npm run dev &

sleep 2
echo "✅ Serveurs en cours d'exécution !"
echo "--------------------------------------------"
echo "Frontend : http://localhost:5173"
echo "Backend  : http://localhost:5000"
echo "--------------------------------------------"
echo "💡 Appuie sur Ctrl + C pour tout arrêter proprement."
