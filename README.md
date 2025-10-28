# 🏋️ Synrgy - Plateforme de Coaching Sportif avec IA Ollama

## 🎯 Description

Synrgy est une plateforme complète de coaching sportif qui utilise l'IA Ollama local pour générer des plans d'entraînement et nutritionnels personnalisés.

## ✨ Fonctionnalités

- 🤖 **IA Ollama intégrée** : Génération de plans avec llama3.2:1b
- 🏃 **Plans d'entraînement** : Programmes personnalisés selon objectifs
- 🥗 **Plans nutritionnels** : Régimes adaptés aux besoins
- 👥 **Multi-rôles** : Coach et athlète avec dashboards dédiés
- 📊 **Analytics** : Suivi des performances et progression
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Ollama installé
- Modèle llama3.2:1b téléchargé

### Installation
```bash
# Cloner le projet
git clone https://github.com/ethan-plnqrt/synrgy-coachpro.git
cd synrgy-coachpro

# Installer les dépendances
npm install

# Démarrer Ollama
ollama serve

# Installer le modèle IA
ollama pull llama3.2:1b

# Démarrer le serveur
npm run dev:server
```

### Démarrage automatique
```bash
# Script de démarrage complet
./start-synrgy-ollama.sh
```

## 🔧 Configuration

### Variables d'environnement (.env)
```env
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
MODEL_NAME=llama3.2:1b
DATABASE_URL=file:./dev.db
SESSION_SECRET=your-secret-key
TEST_MODE=false
```

## 📡 API Endpoints

### IA et Coaching
- `POST /api/ask` - Chat général avec l'IA
- `POST /api/nutrition/generate` - Génération de plans nutritionnels
- `POST /api/trainingPlan/generate` - Génération de programmes d'entraînement

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Gestion des programmes
- `GET /api/programs` - Liste des programmes
- `POST /api/programs` - Créer un programme
- `DELETE /api/programs/:id` - Supprimer un programme

## 🧪 Tests

### Test de l'intégration Ollama
```bash
npx tsx test-ollama-complete.js
```

### Test des endpoints
```bash
# Chat IA
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"content":"Bonjour, aide-moi avec mon entraînement"}'

# Plan nutrition
curl -X POST http://localhost:5000/api/nutrition/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"perte de poids","level":"débutant","weight":70,"height":175,"activity":"modérée","preferences":"végétarien"}'
```

## 🏗️ Architecture

### Backend
- **Express.js** : Serveur API
- **TypeScript** : Langage principal
- **SQLite** : Base de données locale
- **Ollama** : IA locale

### Frontend
- **React 18** : Interface utilisateur
- **Tailwind CSS** : Styling
- **Radix UI** : Composants
- **React Query** : Gestion d'état

## 📁 Structure du Projet

```
synrgy-coachpro/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   └── lib/            # Utilitaires
├── server/                 # Backend Express
│   ├── ai/                 # Intégration Ollama
│   ├── routes/             # Routes API
│   └── storage.ts          # Gestion base de données
├── shared/                 # Schémas partagés
└── docs/                   # Documentation
```

## 🔄 Migration depuis OpenAI

Le projet a été migré d'OpenAI vers Ollama local :

- ✅ Dépendance OpenAI supprimée
- ✅ Module Ollama créé (`/server/ai/ollama.ts`)
- ✅ Routes adaptées pour Ollama
- ✅ Configuration mise à jour
- ✅ Tests validés

## 🚨 Dépannage

### Ollama non disponible
```bash
# Vérifier le service
ollama serve

# Vérifier les modèles
ollama list

# Installer le modèle
ollama pull llama3.2:1b
```

### Port occupé
```bash
# Trouver le processus
lsof -i :5000

# Arrêter le processus
kill -9 <PID>
```

## 📊 Performance

- **Modèle IA** : llama3.2:1b (~1-2GB RAM)
- **Temps de réponse** : 2-8 secondes
- **Base de données** : SQLite local
- **Ports** : 5000 (serveur), 11434 (Ollama)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs`
- Vérifier les logs du serveur

---

**Développé avec ❤️ pour la communauté sportive**