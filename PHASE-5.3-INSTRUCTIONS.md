# 🚀 PHASE 5.3 — INSTRUCTIONS COMPLÈTES

**Migration Auth Réelle : SQLite → PostgreSQL + Prisma + JWT**

---

## ✅ DÉJÀ FAIT

- ✅ Prisma installé (`npm install prisma @prisma/client bcrypt jsonwebtoken`)
- ✅ Schéma Prisma créé (`prisma/schema.prisma`)
- ✅ Routes auth Prisma créées (`server/routes/auth.ts`)
- ✅ Server mis à jour (importe auth Prisma)
- ✅ Client Prisma généré (`npx prisma generate`)
- ✅ `.env` configuré avec DATABASE_URL
- ✅ Scripts de setup/test créés

---

## 🎯 À FAIRE MAINTENANT

### **OPTION 1: Setup Automatique (Recommandé)** ⚡

```bash
./SETUP-POSTGRESQL.sh
```

**Ce script:**
1. Détecte Docker ou Homebrew
2. Installe/démarre PostgreSQL
3. Crée la base `synrgydb`
4. Lance la migration Prisma
5. Configure tout automatiquement

**Attendu:**
```
✅ PostgreSQL setup complete!
   Database: synrgydb
   User: synrgy_user
   Password: password
   Port: 5432
```

---

### **OPTION 2: Setup Manuel** 🛠️

#### Étape 1: Démarrer PostgreSQL

**Docker (recommandé):**
```bash
docker run --name synrgy-postgres \
  -e POSTGRES_USER=synrgy_user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=synrgydb \
  -p 5432:5432 \
  -d postgres:15
```

**OU Homebrew:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb synrgydb
```

#### Étape 2: Vérifier connexion PostgreSQL

```bash
psql "postgresql://synrgy_user:password@localhost:5432/synrgydb" -c "SELECT version();"
```

**Attendu:** Version PostgreSQL s'affiche

#### Étape 3: Migration Prisma

```bash
npx prisma migrate dev --name init_auth_system
```

**Attendu:**
```
✔ Generated Prisma Client
✔ The migration has been created and applied
```

---

## 🧪 TESTS

### Test 1: Lancer le serveur

```bash
npm run dev:server
```

**Attendu:**
```
✅ Fichier .env chargé
✅ Synrgy DEV live on http://localhost:5001
```

---

### Test 2: Tests automatiques

**Terminal 2 (garder serveur actif dans Terminal 1):**

```bash
./TEST-AUTH-ENDPOINTS.sh
```

**Ce script teste:**
1. POST /signup (créer compte coach)
2. POST /login (se connecter)
3. GET /me (récupérer user)
4. POST /logout (se déconnecter)
5. GET /me après logout (doit échouer)

**Attendu:**
```
✅ Signup successful - Token received
✅ Login successful - Cookie saved
✅ Get Me successful - User data retrieved
✅ Logout successful
✅ Correctly denied access after logout
```

---

### Test 3: Tests manuels (curl)

**Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"client@test.com",
    "password":"test123",
    "role":"CLIENT",
    "fullName":"Test Client"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"client@test.com",
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

---

### Test 4: Prisma Studio (visualiser DB)

```bash
npx prisma studio
```

→ Ouvre `http://localhost:5555`  
→ Tu peux voir/éditer les users créés

---

## ✅ VALIDATION

**Pour considérer Phase 5.3 réussie:**

- [ ] PostgreSQL démarre sans erreur
- [ ] Migration Prisma réussie (`prisma migrate dev`)
- [ ] Tables créées dans PostgreSQL
- [ ] POST /signup crée user dans DB
- [ ] POST /login retourne JWT + cookie
- [ ] GET /me retourne user data avec cookie
- [ ] POST /logout clear cookie
- [ ] Prisma Studio affiche users
- [ ] Tests automatiques passent (5/5 ✅)

---

## 🐛 TROUBLESHOOTING

### Erreur "Port 5432 already in use"

**Solution:**
```bash
lsof -ti:5432 | xargs kill -9
docker stop synrgy-postgres
./SETUP-POSTGRESQL.sh
```

---

### Erreur "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
npm run dev:server
```

---

### Erreur "Database synrgydb does not exist"

**Solution:**
```bash
# Docker
docker exec -it synrgy-postgres createdb -U synrgy_user synrgydb

# Homebrew
createdb synrgydb
```

---

### Migration échoue "relation already exists"

**Solution:**
```bash
npx prisma migrate reset
npx prisma migrate dev --name init_auth_system
```

---

### Erreur CORS frontend

**Solution:** Vérifier `FRONTEND_URL` dans `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 📊 ARCHITECTURE FINALE

```
┌─────────────────────────────────────────┐
│         CLIENT (React)                  │
│  - AuthContext uses /api/auth/*        │
│  - Stores JWT in httpOnly cookie       │
└──────────────┬──────────────────────────┘
               │
               │ HTTP (cookies auto-sent)
               │
┌──────────────▼──────────────────────────┐
│      SERVER (Express)                   │
│  server/index.ts                        │
│  - app.use("/api/auth", authPrisma)    │
└──────────────┬──────────────────────────┘
               │
               │ Import
               │
┌──────────────▼──────────────────────────┐
│      AUTH ROUTES                        │
│  server/routes/auth.ts                  │
│  - signup / login / me / logout         │
│  - bcrypt, JWT, cookies                 │
└──────────────┬──────────────────────────┘
               │
               │ Prisma Client
               │
┌──────────────▼──────────────────────────┐
│      PRISMA ORM                         │
│  node_modules/@prisma/client            │
│  - Type-safe queries                    │
│  - Auto-generated from schema           │
└──────────────┬──────────────────────────┘
               │
               │ SQL queries
               │
┌──────────────▼──────────────────────────┐
│      POSTGRESQL                         │
│  Docker or Homebrew                     │
│  - Tables: User, Client, Program, etc.  │
│  - Port: 5432                           │
└─────────────────────────────────────────┘
```

---

## 🎯 APRÈS PHASE 5.3

### Prochaines étapes:

1. **Frontend AuthContext**
   - Adapter pour utiliser nouvelles routes
   - Gérer format response Prisma
   - Tester login/signup dans UI

2. **Middleware Auth**
   - Créer `server/middleware/auth.ts`
   - Utiliser JWT decode + Prisma
   - Protéger routes API

3. **Cleanup Legacy**
   - Supprimer `dev.db` (SQLite)
   - Supprimer test users hardcodés
   - Supprimer anciennes routes auth

4. **Production Setup**
   - Render PostgreSQL database
   - Environment variables production
   - Secure cookies (HTTPS)

---

## 📝 COMMANDES UTILES

| Commande | Description |
|----------|-------------|
| `./SETUP-POSTGRESQL.sh` | Setup auto PostgreSQL + migration |
| `./TEST-AUTH-ENDPOINTS.sh` | Tests auto tous les endpoints |
| `npx prisma studio` | UI pour voir/éditer DB |
| `npx prisma migrate dev` | Créer nouvelle migration |
| `npx prisma migrate reset` | Reset DB (⚠️ supprime data) |
| `npx prisma generate` | Régénérer client Prisma |
| `docker logs synrgy-postgres` | Voir logs PostgreSQL (Docker) |
| `docker stop synrgy-postgres` | Arrêter PostgreSQL (Docker) |

---

## 🎉 RÉSULTAT ATTENDU

**Après Phase 5.3 complète:**

✅ **PostgreSQL** actif localement  
✅ **4 tables** créées (User, Client, Program, NutritionPlan)  
✅ **Comptes réels** créables via signup  
✅ **Login persistant** (JWT + cookie 7 jours)  
✅ **Passwords sécurisés** (bcrypt hashed)  
✅ **Type-safe** queries (Prisma Client)  
✅ **Prisma Studio** pour visualiser data  
✅ **Tests passent** (5/5)  

**Status:** 🟢 **Auth Production-Ready**

---

**🚀 Lance `./SETUP-POSTGRESQL.sh` pour démarrer !**

