# Synrgy - Intégration Ollama

## 🎯 Configuration Ollama

Synrgy a été adapté pour fonctionner avec Ollama local au lieu d'OpenAI.

### Variables d'environnement (.env)

```env
# Configuration Ollama
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
MODEL_NAME=llama3.2:1b

# Configuration serveur
SESSION_SECRET=your-secret-key-here
TEST_MODE=false
DATABASE_URL=file:./dev.db

# Configuration Stripe (optionnel)
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Installation et démarrage

1. **Installer Ollama** (si pas déjà fait) :
   ```bash
   # macOS
   brew install ollama
   
   # Ou télécharger depuis https://ollama.ai
   ```

2. **Démarrer le service Ollama** :
   ```bash
   ollama serve
   ```

3. **Installer le modèle** :
   ```bash
   ollama pull llama3.2:1b
   ```

4. **Installer les dépendances** :
   ```bash
   npm install
   ```

5. **Démarrer le serveur Synrgy** :
   ```bash
   npm run dev:server
   ```

## 🔧 Architecture

### Fichiers modifiés

- **`/server/ai/ollama.ts`** : Nouveau module d'intégration Ollama
- **`/server/openai.ts`** : Modifié pour utiliser Ollama au lieu d'OpenAI
- **`/server/routes.ts`** : Endpoints IA adaptés pour Ollama
- **`/server/routes/nutrition.ts`** : Route nutrition avec Ollama
- **`/server/routes/trainingPlan.ts`** : Route training plan avec Ollama
- **`package.json`** : Dépendance OpenAI supprimée, node-fetch ajoutée

### Endpoints IA disponibles

- **`POST /api/ask`** : Chat général avec l'IA
- **`POST /api/nutrition/generate`** : Génération de plans nutritionnels
- **`POST /api/trainingPlan/generate`** : Génération de programmes d'entraînement

## 🧪 Tests

### Test automatique

```bash
node test-ollama-complete.js
```

### Test manuel des endpoints

```bash
# Test chat général
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"content":"Bonjour, peux-tu m'aider avec mon entraînement ?"}'

# Test nutrition
curl -X POST http://localhost:5000/api/nutrition/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"perte de poids","level":"débutant","weight":70,"height":175,"activity":"modérée","preferences":"végétarien"}'

# Test training plan
curl -X POST http://localhost:5000/api/trainingPlan/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"prise de muscle","level":"intermédiaire","lastPlan":"aucun"}'
```

## 🚨 Dépannage

### Ollama non disponible

Si vous voyez le message :
```
⚠️ Service IA temporairement indisponible. Relance Ollama.
```

**Solutions :**
1. Vérifiez que Ollama est démarré : `ollama serve`
2. Vérifiez que le modèle est installé : `ollama list`
3. Installez le modèle si nécessaire : `ollama pull llama3.2:1b`

### Port déjà utilisé

Si le port 5000 est occupé :
```bash
# Trouver le processus
lsof -i :5000

# Arrêter le processus
kill -9 <PID>
```

## 📊 Performance

- **Modèle utilisé** : llama3.2:1b (léger et rapide)
- **Temps de réponse** : ~2-8 secondes selon la complexité
- **Ressources** : ~1-2GB RAM pour le modèle

## 🔄 Migration depuis OpenAI

L'intégration est rétrocompatible. Pour revenir à OpenAI :

1. Remplacez `AI_PROVIDER=ollama` par `AI_PROVIDER=openai`
2. Ajoutez `OPENAI_API_KEY=your-key`
3. Réinstallez OpenAI : `npm install openai`

## 📝 Notes

- Le modèle `llama3.2:1b` est optimisé pour les réponses rapides
- Les réponses JSON peuvent nécessiter un parsing côté client
- Le fallback vers des plans par défaut est implémenté en cas d'erreur
- Tous les logs sont affichés dans la console du serveur
