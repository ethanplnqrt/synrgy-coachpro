# Phase 1 — Authentification complète ✅

## 🎯 Objectif atteint

L'authentification complète est implémentée avec sessions utilisateur persistantes via JWT.

## 📁 Structure Backend

```
server/
├── auth/                    # Module d'authentification
│   ├── authController.ts   # Logique métier (register, login, logout)
│   ├── authMiddleware.ts   # Middleware JWT (authenticate)
│   ├── authRoutes.ts       # Routes publiques /api/auth/*
│   ├── authToken.ts        # Gestion JWT (sign, verify)
│   └── userStore.ts        # Persistance utilisateurs (JSON)
├── data/
│   └── users.json          # Stockage des utilisateurs
├── routes/
│   ├── chat.ts            # ✅ Protégé par authenticate
│   ├── nutrition.ts       # ✅ Protégé par authenticate
│   ├── goals.ts           # ✅ Protégé par authenticate
│   └── payments.ts        # Public
├── openai.ts              # Interface OpenAI
└── index.ts               # Server principal
```

## 🔐 Routes d'authentification

### Publiques
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Protégées (nécessitent JWT)
- `GET /api/auth/me` - Informations utilisateur
- `POST /api/chat` - Chat avec l'IA
- `GET /api/nutrition` - Gestion nutrition
- `GET /api/goals` - Gestion objectifs

## 💾 Stockage persistant

**Fichier** : `server/data/users.json`

**Structure** :
```json
[
  {
    "id": "uuid-v4",
    "email": "user@example.com",
    "passwordHash": "$2b$10$...",
    "role": "coach",
    "createdAt": 1234567890
  }
]
```

**Sécurité** :
- Mots de passe hashés avec bcrypt (10 rounds)
- Le fichier est créé automatiquement si inexistant
- Lecture/écriture synchrone pour cohérence

## 🔑 JWT Configuration

**Secret** : `process.env.JWT_SECRET` (fallback: `synrgy-dev-secret`)

**Expiration** : 7 jours

**Cookie** :
- Nom : `synrgy_token`
- httpOnly : `true`
- sameSite : `lax`
- secure : `true` en production
- maxAge : 7 jours (604800000ms)

## 📱 Frontend

### AuthContext
**Fichier** : `client/src/contexts/AuthContext.tsx`

Fournit :
- `user` : Utilisateur connecté
- `isAuthenticated` : Boolean
- `isLoading` : État de chargement
- `login(email, password)` : Fonction de connexion
- `register(email, password, role)` : Fonction d'inscription
- `logout()` : Fonction de déconnexion
- `getCurrentUser()` : Récupère l'utilisateur depuis le backend

### Pages
- `client/src/pages/auth.tsx` - Page de connexion/inscription unique
- Formulaire avec onglets (Login / Register)
- Validation côté client
- Redirection automatique vers dashboard après connexion

### Hook
**Fichier** : `client/src/hooks/useAuth.ts`

Simple wrapper autour de `AuthContext` :
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

## 🔄 Flux d'authentification

### 1. Inscription
```
User → POST /api/auth/register
     → authController.registerUser()
     → Bcrypt hash password
     → Save to users.json
     → Generate JWT
     → Set cookie
     → Return user
Frontend → Update AuthContext
        → Redirect to dashboard
```

### 2. Connexion
```
User → POST /api/auth/login
     → authController.loginUser()
     → Find user by email
     → Bcrypt compare password
     → Generate JWT
     → Set cookie
     → Return user
Frontend → Update AuthContext
        → Redirect to dashboard
```

### 3. Vérification session
```
Frontend → GET /api/auth/me (with cookie)
         → authMiddleware.authenticate()
         → Verify JWT from cookie
         → Find user by ID
         → Return public user
Frontend → Update AuthContext state
```

### 4. Déconnexion
```
User → POST /api/auth/logout
     → Clear cookie
     → Return success
Frontend → Clear AuthContext
        → Redirect to /login
```

### 5. Accès route protégée
```
Request → /api/chat (with cookie)
        → authMiddleware.authenticate()
        → Verify JWT
        → Attach req.user
        → Next()
Handler → Use req.user.id
```

## ✅ Vérifications

### Backend
```bash
# Inscription
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"password123","role":"coach"}'

# Connexion
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"password123"}' \
  -c cookies.txt

# Vérifier session
curl http://localhost:5001/api/auth/me -b cookies.txt

# Route protégée (chat)
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Bonjour"}' \
  -b cookies.txt
```

### Frontend
1. Ouvre http://localhost:5173/login
2. Clique sur "Inscription"
3. Remplis : email, password, rôle (Coach/Athlète)
4. Soumets → redirection automatique vers dashboard
5. Actualise la page → toujours connecté (cookie persistant)
6. Clique sur ton avatar → "Déconnexion" → retour à /login

## 🛡️ Sécurité implémentée

✅ Mots de passe hashés (bcrypt 10 rounds)
✅ JWT stockés en cookies httpOnly (pas accessible via JS)
✅ Credentials: "include" sur tous les fetch
✅ CORS configuré pour localhost:5173
✅ Tokens avec expiration (7 jours)
✅ Middleware sur toutes les routes protégées
✅ Validation des rôles (coach/athlete uniquement)
✅ Email unique (vérification lors de l'inscription)

## 🚀 Résultat final

Tu peux maintenant :
- ✅ Créer un compte (coach ou athlète)
- ✅ Te connecter avec email/password
- ✅ Accéder aux routes protégées (/api/chat, /api/nutrition, /api/goals)
- ✅ Voir tes infos utilisateur
- ✅ Le backend répond avec les vraies données
- ✅ L'IA OpenAI est active sur /api/chat
- ✅ Te déconnecter proprement

**Phase 1 terminée ! L'authentification est complète et fonctionnelle.** 🎉

