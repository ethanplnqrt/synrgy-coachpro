# Architecture Centralisée Synrgy SaaS

## 🎯 Vue d'ensemble

Synrgy est une plateforme SaaS de coaching avec **3 rôles utilisateurs distincts** :

1. **Coach** - Professionnel qui gère des clients
2. **Client** - Athlète accompagné par un coach
3. **Athlete** - Athlète indépendant (solo)

## 👥 Rôles utilisateurs

### 🏋️ Coach Professionnel
**Profil** :
- Gère plusieurs clients
- Crée des programmes personnalisés
- Accède aux analytics
- Invite de nouveaux clients

**Navigation** :
- Dashboard (vue d'ensemble clients)
- Mes clients (liste + détails)
- Programmes (création/gestion)
- Analytics (performances)
- Invitations (gestion clients)
- Abonnement
- Paramètres

**Route base** : `/coach/*`

### 🤝 Client (Athlète accompagné)
**Profil** :
- A un coach assigné (coachId)
- Suit un programme créé par son coach
- Communique avec son coach
- Suit sa progression

**Navigation** :
- Dashboard (vue d'ensemble)
- Chat Coach (communication directe)
- Entraînement (programme assigné)
- Nutrition (plan assigné)
- Progression (stats + photos)
- Parrainer (inviter des amis)
- Paramètres

**Route base** : `/client/*`

### 💪 Athlète Indépendant
**Profil** :
- Autonome (coachId = null)
- Crée ses propres programmes
- Utilise l'IA comme coach virtuel
- Gère tout en solo

**Navigation** :
- Dashboard (vue d'ensemble)
- Créer programme (auto-création)
- Créer nutrition (auto-création)
- Assistant IA (coach virtuel)
- Chat IA (conversation)
- Abonnement
- Paramètres

**Route base** : `/athlete/*`

## 📁 Structure des pages

```
client/src/pages/
├── auth.tsx                    # Login/Register (public)
├── not-found.tsx              # 404 (public)
│
├── coach/                     # Pages COACH
│   ├── dashboard.tsx         # Vue d'ensemble clients
│   ├── clients.tsx           # Liste clients
│   ├── client-detail.tsx     # Détail d'un client
│   ├── programs.tsx          # Gestion programmes
│   ├── analytics.tsx         # Analytics coach
│   └── referrals.tsx         # Invitations
│
├── client/                    # Pages CLIENT
│   ├── dashboard.tsx         # Dashboard client
│   ├── chat.tsx              # Chat avec le coach
│   ├── training.tsx          # Programme d'entraînement
│   ├── nutrition.tsx         # Plan nutrition
│   ├── progress.tsx          # Progression
│   └── referrals.tsx         # Parrainages
│
├── athlete/                   # Pages ATHLETE
│   ├── dashboard.tsx         # Dashboard athlète
│   ├── training-create.tsx   # Créer programme
│   └── nutrition-create.tsx  # Créer plan nutrition
│
└── [shared pages]            # Pages partagées
    ├── settings.tsx          # Paramètres (tous)
    ├── subscription.tsx      # Abonnement (tous)
    ├── program-builder.tsx   # Builder programmes
    ├── chat-ia.tsx          # Chat IA
    └── ai-coach.tsx         # Assistant IA
```

## 🔐 Authentification

### Types utilisateur

```typescript
type UserRole = "coach" | "client" | "athlete";

interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  coachId?: string | null;  // null pour coach/athlete, UUID pour client
  isPro?: boolean;          // true pour coach
  isClient?: boolean;       // true pour client
}
```

### Inscription

```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "coach" | "client" | "athlete"
}
```

**Génération automatique de profil** :
- `coach` → `isPro: true`, `coachId: undefined`
- `client` → `isClient: true`, `coachId: null` (assigné plus tard)
- `athlete` → `isPro: false`, `coachId: undefined`

### Redirection intelligente après login

```typescript
const getDashboardPath = (role: UserRole) => {
  if (role === "coach") return "/coach/dashboard";
  if (role === "client") return "/client/dashboard";
  return "/athlete/dashboard";
};
```

## 🛣️ Routage

### Protection des routes

```typescript
function ProtectedRoute({ component, allowedRole }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Redirect to="/login" />;
  
  if (allowedRole && user.role !== allowedRole) {
    return <Redirect to={getDashboardPath(user.role)} />;
  }

  return <Component />;
}
```

### Routes par rôle

**Coach** : `/coach/*`
```
/coach/dashboard
/coach/clients
/coach/client/:id
/coach/programs
/coach/programs/create
/coach/analytics
/coach/referrals
/coach/settings
/coach/subscription
```

**Client** : `/client/*`
```
/client/dashboard
/client/chat
/client/training
/client/nutrition
/client/progress
/client/referrals
/client/settings
```

**Athlete** : `/athlete/*`
```
/athlete/dashboard
/athlete/training/create
/athlete/nutrition/create
/athlete/ai
/athlete/chat
/athlete/settings
/athlete/subscription
```

## 🎨 Navigation contextuelle

### Sidebar adaptative

Chaque rôle a sa propre navigation dans la sidebar :

```typescript
const coachMenuItems = [
  { title: "Dashboard", url: "/coach/dashboard", icon: Home },
  { title: "Mes clients", url: "/coach/clients", icon: Users },
  { title: "Programmes", url: "/coach/programs", icon: Dumbbell },
  // ...
];

const clientMenuItems = [
  { title: "Dashboard", url: "/client/dashboard", icon: Home },
  { title: "Chat Coach", url: "/client/chat", icon: MessageSquare },
  // ...
];

const athleteMenuItems = [
  { title: "Dashboard", url: "/athlete/dashboard", icon: Home },
  { title: "Assistant IA", url: "/athlete/ai", icon: Brain },
  // ...
];
```

La sidebar affiche automatiquement le menu approprié selon `user.role`.

### Header adaptatif

Le header affiche :
- Avatar + nom utilisateur
- Rôle (Coach professionnel / Client / Athlète indépendant)
- Menu dropdown avec :
  - Profil → route selon rôle
  - Déconnexion

## 🔄 Flux utilisateur

### 1. Inscription
```
User → /login (onglet Inscription)
     → Choix du rôle : Coach / Client / Athlète
     → POST /api/auth/register
     → Création profil avec rôle
     → Cookie JWT défini
     → Redirection automatique :
        - coach → /coach/dashboard
        - client → /client/dashboard
        - athlete → /athlete/dashboard
```

### 2. Connexion
```
User → /login
     → POST /api/auth/login
     → Cookie JWT défini
     → Redirection selon user.role
```

### 3. Navigation
```
User authentifié → Sidebar affiche menu selon rôle
                 → Click sur lien
                 → ProtectedRoute vérifie le rôle
                 → Si OK : affiche page
                 → Si KO : redirige vers dashboard approprié
```

## 🗄️ Base de données

### Utilisateurs (server/data/users.json)

```json
[
  {
    "id": "uuid-1",
    "email": "coach@example.com",
    "passwordHash": "$2b$10$...",
    "role": "coach",
    "createdAt": 1234567890
  },
  {
    "id": "uuid-2",
    "email": "client@example.com",
    "passwordHash": "$2b$10$...",
    "role": "client",
    "coachId": null,
    "createdAt": 1234567891
  },
  {
    "id": "uuid-3",
    "email": "athlete@example.com",
    "passwordHash": "$2b$10$...",
    "role": "athlete",
    "createdAt": 1234567892
  }
]
```

### Données app (server/db.json)

```json
{
  "messages": [
    { "userId": "uuid", "role": "user", "content": "...", "timestamp": 123 }
  ],
  "nutrition": [
    { "userId": "uuid", "calories": 2000, "timestamp": 123 }
  ],
  "goals": [
    { "userId": "uuid", "title": "Prendre 5kg", "status": "active" }
  ]
}
```

## 🔒 Sécurité

✅ **Isolation par rôle** : Chaque rôle voit uniquement ses pages
✅ **Protection routes** : Middleware vérifie le rôle avant accès
✅ **JWT cookies** : httpOnly, secure en production
✅ **Redirection auto** : Utilisateur redirigé vers son espace
✅ **CORS** : Configuré pour localhost:5173

## 🧪 Tests

### Test des 3 rôles

```bash
# Coach
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"coach@test.com","password":"pass123","role":"coach"}'

# Client
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client@test.com","password":"pass123","role":"client"}'

# Athlete
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@test.com","password":"pass123","role":"athlete"}'
```

## 🚀 Démarrage

```bash
# Développement
npm run dev:server  # Backend :5001
npm run dev:client  # Frontend :5173

# Production
npm run build       # Compile React + Server
npm start          # Lance sur :5001
```

## ✅ Checklist d'implémentation

- [x] Types utilisateur avec 3 rôles
- [x] Backend auth supportant coach/client/athlete
- [x] Frontend AuthContext avec 3 rôles
- [x] Pages organisées par rôle (/coach, /client, /athlete)
- [x] Routage intelligent avec redirections
- [x] Navigation contextuelle (sidebar + header)
- [x] Protection des routes par rôle
- [x] Redirection automatique après login
- [x] Tests des 3 rôles

**Architecture centralisée et cohérente pour les 3 types d'utilisateurs ! 🎉**

