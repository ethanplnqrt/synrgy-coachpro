#!/bin/bash

# Script de démarrage pour Synrgy avec Ollama
echo "🚀 Démarrage de Synrgy avec Ollama..."

# Vérifier si Ollama est installé
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama n'est pas installé. Veuillez l'installer depuis https://ollama.ai"
    exit 1
fi

# Vérifier si Ollama est démarré
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️ Ollama n'est pas démarré. Démarrage du service..."
    ollama serve &
    sleep 3
fi

# Vérifier si le modèle est installé
if ! ollama list | grep -q "llama3.2:1b"; then
    echo "📥 Installation du modèle llama3.2:1b..."
    ollama pull llama3.2:1b
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur
echo "✅ Démarrage du serveur Synrgy..."
echo "🌐 Serveur disponible sur: http://localhost:5000"
echo "🤖 IA: Ollama (llama3.2:1b)"
echo ""

npm run dev:server
