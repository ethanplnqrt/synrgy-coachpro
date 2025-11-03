
# Synrgy - AI-Powered Coaching Platform

Plateforme complète de coaching avec intelligence artificielle pour coaches et athlètes.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Configuration

Crée un fichier `.env` à la racine :
```bash
# Database
DATABASE_URL=./dev.db

# Server
PORT=5001
NODE_ENV=development

# JWT Secret (change en production)
JWT_SECRET=your-secret-key-change-in-production

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Développement

```bash
# Terminal 1 - Serveur backend
npm run dev:server

# Terminal 2 - Client frontend (dans un autre terminal)
npm run dev:client
```

- **Backend** : http://localhost:5001
- **Frontend** : http://localhost:5173

### Production

```bash
# Build complet (React + Serveur)
npm run build

# Démarrer l'application
npm start
```

**L'application complète sera accessible sur http://localhost:5001**

### Parcours utilisateur

1. **Visite** http://localhost:5001 → Landing page
2. **Pricing** → Voir les formules
3. **S'inscrire** → Choisir son rôle (Coach/Client/Athlète)
4. **Dashboard** → Interface personnalisée selon le rôle

## 📁 Structure

```
synrgy/
├── client/          # Application React (Vite)
│   ├── src/
│   │   ├── components/  # Composants UI
│   │   ├── contexts/    # AuthContext
│   │   ├── hooks/       # useAuth
│   │   ├── pages/
│   │   │   ├── coach/     # Pages COACH
│   │   │   ├── client/    # Pages CLIENT
│   │   │   ├── athlete/   # Pages ATHLETE
│   │   │   └── [shared]   # Pages partagées
│   │   └── lib/         # API, queryClient
│   └── index.html
│
├── server/          # Express API
│   ├── auth/        # Authentification (JWT)
│   │   ├── authController.ts
│   │   ├── authMiddleware.ts
│   │   ├── authRoutes.ts
│   │   ├── authToken.ts
│   │   └── userStore.ts
│   ├── ai/          # Système de prompts IA
│   │   └── promptBuilder.ts
│   ├── routes/      # API routes
│   ├── data/        # Stockage JSON
│   │   └── users.json
│   ├── utils/       # Utilitaires
│   ├── db.json      # Messages, nutrition, goals
│   ├── openai.ts    # Interface OpenAI
│   └── index.ts     # Server principal
│
├── coreAI/          # Logique IA (advisors, doctrine)
├── shared/          # Schémas et types partagés
└── migrations/      # Migrations DB
```

## 🔐 Authentification

Le système utilise JWT avec cookies httpOnly pour une sécurité maximale.

### 3 rôles utilisateurs

1. **Coach professionnel** - Gère des clients et crée des programmes
2. **Client** - Athlète accompagné par un coach
3. **Athlète indépendant** - Utilise l'IA comme coach virtuel

### Routes d'authentification
- `POST /api/auth/register` - Inscription (coach, client ou athlete)
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Vérifier la session

### Exemple d'inscription
```bash
# Coach
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"coach@example.com","password":"password123","role":"coach"}'

# Client
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123","role":"client"}'

# Athlète
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@example.com","password":"password123","role":"athlete"}'
```

### Redirection automatique
Après connexion, l'utilisateur est redirigé vers son espace :
- Coach → `/coach/dashboard`
- Client → `/client/dashboard`
- Athlète → `/athlete/dashboard`

### Routes protégées
Toutes les routes suivantes nécessitent une authentification :
- `/api/chat` - Chat avec l'IA
- `/api/nutrition` - Gestion nutrition
- `/api/goals` - Gestion objectifs

## 🗄️ Base de données

Les utilisateurs sont stockés dans `server/data/users.json` avec bcrypt pour les mots de passe.

Structure d'un utilisateur :
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "passwordHash": "bcrypt-hash",
  "role": "coach|athlete",
  "createdAt": 1234567890
}
```

## 🤖 Intelligence Artificielle

### Chat IA personnalisé

Synrgy utilise OpenAI GPT-4o-mini avec des prompts intelligents personnalisés selon le rôle :

**Pour les coaches** : Assistant expert en programmation, gestion d'athlètes et performance
**Pour les athlètes** : Coach personnel motivant, empathique et pédagogue

Le système :
- Maintient un historique de conversation par utilisateur
- Adapte le ton et le contenu selon le profil
- Garde le contexte des 10 derniers messages
- Stocke toutes les conversations de manière persistante

Configure ta clé API dans `.env` :
```
OPENAI_API_KEY=sk-your-key-here
```

### Routes Chat & IA
- `POST /api/chat` - Chat conversationnel avec historique
- `GET /api/chat/history` - Récupérer l'historique complet
- `DELETE /api/chat/history` - Supprimer l'historique
- `POST /api/codex` - Query Codex pour génération (plans, conseils, analyses)
- `GET /api/codex/status` - Status de configuration Codex

## 🛠️ Technologies

- **Frontend**: React 18, Vite, TanStack Query, Wouter, Tailwind CSS
- **Backend**: Express, TypeScript, JWT, bcrypt
- **Database**: JSON file storage
- **Auth**: JWT + httpOnly cookies (7 jours)
- **AI**: OpenAI GPT-4o-mini
- **UI**: Radix UI + shadcn/ui

## 📝 Scripts

- `npm run dev:server` - Lancer le serveur de développement (port 5001)
- `npm run dev:client` - Lancer le client de développement (port 5173)
- `npm run build` - Build pour production ✅ TESTÉ ET FONCTIONNEL
- `npm start` - Lancer l'application en production (port 5001)

## 🧪 Tester l'authentification

1. Inscris-toi via le frontend : http://localhost:5173/login
2. Choisis ton rôle :
   - **Coach professionnel** → Gestion de clients
   - **Client (avec coach)** → Programme assigné par coach
   - **Athlète indépendant** → Autonome avec IA
3. Tu es automatiquement redirigé vers ton dashboard
4. Navigation adaptée à ton rôle dans la sidebar

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- JWT stockés dans des cookies httpOnly
- CORS configuré pour localhost:5173
- Tokens expiration : 7 jours
- Middleware d'authentification sur toutes les routes protégées
