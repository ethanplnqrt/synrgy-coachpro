# 🧪 PRISMA AUTH — TEST LOG

**Date:** November 9, 2025  
**Phase:** 5.3 - Auth Fix  
**Status:** 🟡 En attente de tests

---

## ✅ PRÉPARATION COMPLÈTE

### Corrections Appliquées

**1. Cookies Configuration**
- ✅ `sameSite: "lax"` ajouté (signup + login)
- ✅ `clearCookie` avec options complètes (logout)
- ✅ `httpOnly: true` (déjà présent)
- ✅ `secure:` basé sur NODE_ENV (déjà présent)

**2. CORS Credentials**
- ✅ `credentials: true` dans corsConfig
- ✅ `origin:` depuis FRONTEND_URL

**3. JWT Secret**
- ✅ `JWT_SECRET` dans .env
- ✅ Utilisé dans auth.ts (ligne 14)
- ✅ Utilisé dans authPrisma.ts (ligne 7)

**4. Middleware Prisma**
- ✅ `server/middleware/authPrisma.ts` créé
- ✅ `authenticatePrisma()` fonction
- ✅ JWT verification
- ✅ Prisma user lookup

**5. Prisma Client**
- ✅ Régénéré (v6.19.0)

---

## 🧪 TESTS À EXÉCUTER

### Commande Automatique

```bash
# Terminal 1
npm run dev:server

# Terminal 2
./TEST-AUTH-ENDPOINTS.sh
```

---

### Tests Manuels (curl)

#### Test 1: Signup
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test1@synrgy.com",
    "password":"test123",
    "role":"COACH",
    "fullName":"Test Coach 1"
  }' \
  -c cookies.txt -v
```

**Attendu:**
- Status: 200
- Response: `{"message": "Compte créé avec succès", "user": {...}, "token": "..."}`
- Header: `Set-Cookie: synrgy_token=...`

---

#### Test 2: Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test1@synrgy.com",
    "password":"test123"
  }' \
  -c cookies.txt -v
```

**Attendu:**
- Status: 200
- Response: `{"message": "Connexion réussie", "user": {...}, "token": "..."}`
- Cookie: `synrgy_token` dans cookies.txt

---

#### Test 3: Get Me (avec cookie)
```bash
curl http://localhost:5001/api/auth/me -b cookies.txt
```

**Attendu:**
- Status: 200
- Response: `{"user": {"id": 1, "email": "...", "role": "COACH", "fullName": "..."}}`
- Pas de password dans response

---

#### Test 4: Logout
```bash
curl -X POST http://localhost:5001/api/auth/logout -b cookies.txt -v
```

**Attendu:**
- Status: 200
- Response: `{"message": "Déconnexion réussie"}`
- Header: `Set-Cookie: synrgy_token=; Max-Age=0` (cookie cleared)

---

#### Test 5: Get Me (après logout, doit échouer)
```bash
curl http://localhost:5001/api/auth/me -b cookies.txt
```

**Attendu:**
- Status: 401
- Response: `{"error": "Non autorisé"}` ou `{"error": "Token invalide"}`

---

## 📊 CHECKLIST VALIDATION

### Avant Tests
- [x] PostgreSQL actif (Docker)
- [x] Migration Prisma appliquée
- [x] server/routes/auth.ts corrigé
- [x] server/middleware/security.ts corrigé
- [x] server/middleware/authPrisma.ts créé
- [x] JWT_SECRET dans .env
- [x] Prisma Client généré

### Pendant Tests
- [ ] Serveur démarre sans erreur
- [ ] POST /signup retourne 200
- [ ] Cookie synrgy_token set
- [ ] POST /login retourne 200
- [ ] Cookie accessible dans cookies.txt
- [ ] GET /me retourne user data
- [ ] POST /logout clear cookie
- [ ] GET /me après logout retourne 401

---

## 🐛 PROBLÈMES POTENTIELS

### 1. Cookie non envoyé

**Symptôme:** GET /me retourne 401 même après login

**Debug:**
```bash
# Vérifier cookie dans response
curl -X POST http://localhost:5001/api/auth/login -d '...' -c cookies.txt -v | grep Set-Cookie

# Vérifier cookie dans fichier
cat cookies.txt
```

**Solution:** Vérifier `credentials: true` dans CORS

---

### 2. CORS Error

**Symptôme:** Browser console: "Access to fetch... has been blocked by CORS"

**Debug:**
```bash
# Vérifier header CORS
curl -X OPTIONS http://localhost:5001/api/auth/me -H "Origin: http://localhost:5173" -v
```

**Solution:** Vérifier `FRONTEND_URL` dans .env et `credentials: true` dans CORS

---

### 3. JWT Verification Failed

**Symptôme:** GET /me retourne "Token invalide"

**Debug:**
```bash
# Vérifier JWT_SECRET utilisé
grep JWT_SECRET server/routes/auth.ts
grep JWT_SECRET server/middleware/authPrisma.ts
grep JWT_SECRET .env
```

**Solution:** S'assurer que même JWT_SECRET partout

---

### 4. User Not Found in Database

**Symptôme:** Login retourne "Email ou mot de passe incorrect" alors que l'email existe

**Debug:**
```bash
npx prisma studio
# Ouvrir User table
# Vérifier que l'email existe
```

**Solution:** Recréer user avec signup

---

## ✅ RÉSULTAT ATTENDU

```
./TEST-AUTH-ENDPOINTS.sh

🧪 Testing Synrgy Auth Endpoints...

1️⃣ Testing POST /signup (creating coach account)...
Response:
{
  "message": "Compte créé avec succès",
  "user": {
    "id": 2,
    "email": "coach@test.com",
    "role": "COACH",
    "fullName": "Test Coach",
    "createdAt": "2025-11-09T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
✅ Signup successful - Token received

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2️⃣ Testing POST /login...
Response:
{
  "message": "Connexion réussie",
  "user": {...},
  "token": "..."
}
✅ Login successful - Cookie saved to cookies.txt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3️⃣ Testing GET /me (with cookie)...
Response:
{
  "user": {
    "id": 2,
    "email": "coach@test.com",
    "role": "COACH",
    "fullName": "Test Coach"
  }
}
✅ Get Me successful - User data retrieved

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4️⃣ Testing POST /logout...
Response:
{
  "message": "Déconnexion réussie"
}
✅ Logout successful

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5️⃣ Testing GET /me (after logout, should fail)...
Response:
{
  "error": "Non autorisé"
}
✅ Correctly denied access after logout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 All tests complete!

🎉 ALL TESTS PASSED (5/5)
```

---

## 📝 COMMANDES POST-TESTS

### Si tests passent:

```bash
# Voir users créés
npx prisma studio

# Commit changements
git add -A
git commit -m "✅ Phase 5.3: Auth Prisma + JWT + Cookies fixed"

# Préparer Phase 5.4 (Déploiement)
```

### Si tests échouent:

```bash
# Voir logs serveur
npm run dev:server

# Voir logs PostgreSQL
docker logs synrgy-postgres

# Tester connexion DB
npx prisma studio
```

---

## 🎯 PROCHAINES ÉTAPES

**Après validation:**

1. **Frontend AuthContext**
   - Adapter pour utiliser `/api/auth/*`
   - Ajouter `credentials: 'include'` dans fetch
   - Tester login UI → Dashboard flow

2. **Tests E2E**
   - Login frontend → Cookie set
   - Navigation → Cookie envoyé
   - Logout → Cookie cleared

3. **Déploiement (Phase 5.4)**
   - Render (PostgreSQL + Backend)
   - Vercel (Frontend)
   - Variables d'environnement production

---

**🚀 LANCE LES TESTS MAINTENANT:**

```bash
# Terminal 1
npm run dev:server

# Terminal 2
./TEST-AUTH-ENDPOINTS.sh
```

**Puis partage le résultat !** 🎯

