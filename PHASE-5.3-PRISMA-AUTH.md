# 🔐 PHASE 5.3 — AUTH RÉELLE + PRISMA + POSTGRESQL

**Status:** 🟡 En cours  
**Date:** November 9, 2025

---

## 🎯 OBJECTIF

Migrer l'authentification de Synrgy de SQLite + test users vers **PostgreSQL + Prisma + JWT réels**.

---

## ✅ FAIT

### 1. Installation Dépendances ✅

```bash
npm install prisma @prisma/client bcrypt jsonwebtoken cookie-parser
```

**Installé:**
- ✅ prisma (ORM)
- ✅ @prisma/client (client)
- ✅ bcrypt (hashing passwords)
- ✅ jsonwebtoken (JWT auth)
- ✅ cookie-parser (cookies)

### 2. Schéma Prisma Créé ✅

**Fichier:** `prisma/schema.prisma`

**Models:**
- `User` (id, email, password, role, fullName, createdAt, updatedAt)
- `Client` (id, name, email, coachId, programs, nutrition)
- `Program` (id, title, description, clientId)
- `NutritionPlan` (id, clientId, calories, protein, carbs, fat, meals)

**Enum:**
- `Role` (COACH, CLIENT)

### 3. Routes Auth Créées ✅

**Fichier:** `server/routes/auth.ts`

**Endpoints:**
- `POST /api/auth/signup` → Créer compte
- `POST /api/auth/login` → Se connecter
- `GET /api/auth/me` → Obtenir user actuel
- `POST /api/auth/logout` → Se déconnecter

**Features:**
- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT tokens (7 days expiry)
- ✅ httpOnly cookies (`synrgy_token`)
- ✅ Validation input
- ✅ Error handling
- ✅ Password exclusion dans responses

### 4. Server.ts Mis à Jour ✅

**Changements:**
- Importé `authPrismaRouter`
- Remplacé route `/api/auth` → utilise Prisma auth
- Garde l'ancienne route commentée (backup)

### 5. .env Configuré ✅

**Variables ajoutées:**
```env
JWT_SECRET=synrgy_secret_key_change_in_production_please
DATABASE_URL="postgresql://synrgy_user:password@localhost:5432/synrgydb?schema=public"
```

### 6. Client Prisma Généré ✅

```bash
npx prisma generate
```

---

## 🔄 À FAIRE

### 1. Setup PostgreSQL Local

**Option A: Docker (recommandé)**
```bash
docker run --name synrgy-postgres \
  -e POSTGRES_USER=synrgy_user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=synrgydb \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Homebrew**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb synrgydb
```

### 2. Migration Prisma

```bash
npx prisma migrate dev --name init_auth_system
```

**Crée:**
- Tables dans PostgreSQL
- Migration files dans `prisma/migrations/`

### 3. Tests Manuels

**Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"coach@synrgy.com",
    "password":"test123",
    "role":"COACH",
    "fullName":"Coach Test"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"coach@synrgy.com",
    "password":"test123"
  }' \
  -c cookies.txt
```

**Get Me:**
```bash
curl http://localhost:5001/api/auth/me -b cookies.txt
```

**Logout:**
```bash
curl -X POST http://localhost:5001/api/auth/logout -b cookies.txt
```

### 4. Prisma Studio (optionnel)

```bash
npx prisma studio
```

→ Ouvre interface web sur `http://localhost:5555`  
→ Visualise et édite données DB

---

## 📊 ARCHITECTURE

```
Client (React)
    ↓
POST /api/auth/signup
    ↓
server/routes/auth.ts
    ↓
Prisma Client
    ↓
PostgreSQL Database
    ↓
Return JWT + Cookie
    ↓
Client stores cookie
    ↓
Authenticated requests include cookie
```

---

## 🔐 SÉCURITÉ

**Implémenté:**
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ httpOnly cookies (protection XSS)
- ✅ JWT avec expiry (7 jours)
- ✅ Password jamais retourné dans responses
- ✅ Validation input
- ✅ Error messages génériques (pas de leak info)

**À ajouter (production):**
- [ ] HTTPS (secure cookies)
- [ ] Rate limiting sur auth endpoints
- [ ] CSRF protection
- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA (optionnel)

---

## 🧪 TESTS

### Test Flow Complet

1. **Signup nouveau coach**
   - Envoyer POST `/signup`
   - Vérifier status 200
   - Vérifier token dans response
   - Vérifier cookie `synrgy_token` set

2. **Login même coach**
   - Envoyer POST `/login`
   - Vérifier status 200
   - Vérifier cookie set

3. **Get current user**
   - Envoyer GET `/me` avec cookie
   - Vérifier user data retournée
   - Vérifier pas de password dans response

4. **Logout**
   - Envoyer POST `/logout`
   - Vérifier cookie cleared

5. **Accès sans auth**
   - Envoyer GET `/me` sans cookie
   - Vérifier status 401

---

## 🚨 PROBLÈMES POTENTIELS

### 1. PostgreSQL pas installé
**Solution:** Installer via Docker ou Homebrew

### 2. Port 5432 déjà utilisé
**Solution:**
```bash
lsof -ti:5432 | xargs kill -9
```

### 3. Migration échoue
**Solution:** Vérifier DATABASE_URL et Postgres actif

### 4. Import errors (Prisma Client)
**Solution:**
```bash
npx prisma generate
npm run dev:server
```

---

## 📝 NOTES

**Différences vs ancienne auth:**

| Feature | OLD (SQLite) | NEW (Prisma) |
|---------|--------------|--------------|
| Database | SQLite (dev.db) | PostgreSQL |
| ORM | better-sqlite3 | Prisma |
| Tokens | Test users hardcodés | JWT réels |
| Cookies | `synrgy_session` | `synrgy_token` |
| Password | Test (test123) | Bcrypt hashed |
| Users | 2 test users | Comptes réels |

**Avantages Prisma:**
- ✅ Type-safe queries
- ✅ Auto-completion
- ✅ Migrations gérées
- ✅ Prisma Studio (UI)
- ✅ Scalable (PostgreSQL)
- ✅ Production-ready

---

## 🎯 PROCHAINES ÉTAPES

### Après migration réussie:

1. **Adapter frontend AuthContext**
   - Utiliser nouvelles routes `/api/auth/*`
   - Gérer nouveaux formats response
   - Vérifier localStorage vs cookies

2. **Créer middleware Prisma auth**
   - Remplacer `authenticate` dans routes
   - Utiliser JWT decode + Prisma queries

3. **Supprimer ancienne auth SQLite**
   - Supprimer `server/auth/authController.ts`
   - Supprimer `server/auth/userStore.ts`
   - Supprimer test users logic
   - Supprimer `dev.db`

4. **Tests e2e**
   - Signup → Login → Dashboard flow
   - Client vs Coach redirection
   - Logout → Re-login
   - Protected routes

---

## ✅ VALIDATION

**Pour considérer Phase 5.3 complète:**

- [ ] PostgreSQL actif localement
- [ ] Migration Prisma réussie
- [ ] POST /signup crée user dans DB
- [ ] POST /login retourne JWT + cookie
- [ ] GET /me retourne user data
- [ ] POST /logout clear cookie
- [ ] Frontend peut se connecter
- [ ] Tests manuels passent
- [ ] Documentation à jour

---

**🚀 Phase 5.3 — Real Auth Ready**

