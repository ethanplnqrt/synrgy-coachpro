# ✅ AUTH PRISMA + JWT + COOKIES — FIX COMPLET

**Date:** November 9, 2025  
**Status:** 🟢 **FIXÉ**

---

## 🎯 PROBLÈME

L'authentification Prisma + JWT + cookies ne fonctionnait pas correctement:
- ❌ Cookies non envoyés avec credentials
- ❌ sameSite non configuré
- ❌ clearCookie sans options
- ❌ CORS n'autorisait pas credentials

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. Cookie Configuration (`server/routes/auth.ts`)

**Avant:**
```typescript
res.cookie("synrgy_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**Après:**
```typescript
res.cookie("synrgy_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // ✅ Ajouté
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

**Appliqué dans:**
- ✅ POST /api/auth/signup
- ✅ POST /api/auth/login

---

### 2. Logout Cookie Clear (`server/routes/auth.ts`)

**Avant:**
```typescript
router.post("/logout", (req, res) => {
  res.clearCookie("synrgy_token");
  res.json({ message: "Déconnexion réussie" });
});
```

**Après:**
```typescript
router.post("/logout", (req, res) => {
  res.clearCookie("synrgy_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ Ajouté (doit matcher cookie options)
  });
  res.json({ message: "Déconnexion réussie" });
});
```

---

### 3. CORS Credentials (`server/middleware/security.ts`)

**Avant:**
```typescript
export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

**Après:**
```typescript
export const corsConfig = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ CRITICAL: Enable cookies
});
```

---

### 4. Nouveau Middleware Prisma (`server/middleware/authPrisma.ts`)

**Créé fichier complet:**

```typescript
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "synrgy_secret_key_change_in_production";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    fullName: string | null;
  };
}

export async function authenticatePrisma(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.synrgy_token;

  if (!token) {
    return res.status(401).json({ error: "Non autorisé - Token manquant" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, fullName: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}
```

**Usage:**
```typescript
import { authenticatePrisma } from "./middleware/authPrisma.js";

app.get("/api/protected-route", authenticatePrisma, (req, res) => {
  res.json({ user: req.user });
});
```

---

### 5. Environment Variables (`.env`)

**JWT_SECRET déjà présent:**
```env
JWT_SECRET=synrgy_secret_key_change_in_production_please
```

✅ Utilisé dans:
- `server/routes/auth.ts` (ligne 14)
- `server/middleware/authPrisma.ts` (ligne 7)

---

## 🔐 FLOW D'AUTHENTIFICATION

### 1. Signup / Login

```
Client
  ↓ POST /api/auth/signup or /login
  ↓ {email, password, role}
  ↓
Server (auth.ts)
  ↓ bcrypt.compare(password, hashedPassword)
  ↓ jwt.sign({id, email, role}, JWT_SECRET, {expiresIn: "7d"})
  ↓ res.cookie("synrgy_token", token, {httpOnly, secure, sameSite: "lax"})
  ↓
Client
  ↓ Cookie stored automatically (httpOnly)
  ↓ All subsequent requests include cookie
```

---

### 2. Protected Routes

```
Client
  ↓ GET /api/auth/me (cookie auto-sent)
  ↓
Server (auth.ts /me endpoint)
  ↓ const token = req.cookies.synrgy_token
  ↓ jwt.verify(token, JWT_SECRET)
  ↓ prisma.user.findUnique({where: {id}})
  ↓ res.json({user})
  ↓
Client
  ↓ Receives user data
```

---

### 3. Logout

```
Client
  ↓ POST /api/auth/logout
  ↓
Server (auth.ts)
  ↓ res.clearCookie("synrgy_token", {options})
  ↓
Client
  ↓ Cookie cleared
  ↓ Next /me request → 401 Unauthorized
```

---

## 🧪 TESTS

### Commande rapide:
```bash
./TEST-AUTH-ENDPOINTS.sh
```

### Tests manuels:

**1. Signup**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@synrgy.com",
    "password":"test123",
    "role":"COACH",
    "fullName":"Test User"
  }' \
  -c cookies.txt -v
```

**Vérifier:**
- ✅ Status 200
- ✅ Response contient `user` et `token`
- ✅ Header `Set-Cookie: synrgy_token=...`

---

**2. Login**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@synrgy.com",
    "password":"test123"
  }' \
  -c cookies.txt -v
```

**Vérifier:**
- ✅ Status 200
- ✅ Response: `"message": "Connexion réussie"`
- ✅ Cookie `synrgy_token` dans `cookies.txt`

---

**3. Get Me**
```bash
curl http://localhost:5001/api/auth/me -b cookies.txt
```

**Vérifier:**
- ✅ Status 200
- ✅ Response contient user data
- ✅ Pas de password dans response

---

**4. Logout**
```bash
curl -X POST http://localhost:5001/api/auth/logout -b cookies.txt -v
```

**Vérifier:**
- ✅ Status 200
- ✅ Header `Set-Cookie` avec `Max-Age=0` (cookie cleared)

---

**5. Get Me après logout (doit échouer)**
```bash
curl http://localhost:5001/api/auth/me -b cookies.txt
```

**Vérifier:**
- ✅ Status 401
- ✅ Response: `"error": "Non autorisé"` ou `"Token invalide"`

---

## 📊 RÉSULTAT ATTENDU

```bash
./TEST-AUTH-ENDPOINTS.sh
```

**Output:**
```
🧪 Testing Synrgy Auth Endpoints...

1️⃣ Testing POST /signup (creating coach account)...
✅ Signup successful - Token received

2️⃣ Testing POST /login...
✅ Login successful - Cookie saved to cookies.txt

3️⃣ Testing GET /me (with cookie)...
✅ Get Me successful - User data retrieved

4️⃣ Testing POST /logout...
✅ Logout successful

5️⃣ Testing GET /me (after logout, should fail)...
✅ Correctly denied access after logout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 All tests complete!
```

---

## 🔒 SÉCURITÉ

**Implémenté:**
- ✅ **httpOnly cookies** → Protège contre XSS
- ✅ **secure flag** → HTTPS en production
- ✅ **sameSite: "lax"** → Protège contre CSRF
- ✅ **Password hashing** → bcrypt (10 rounds)
- ✅ **JWT tokens** → Signés avec secret
- ✅ **7 days expiry** → Auto-expire
- ✅ **CORS credentials** → Autorise cookies cross-origin
- ✅ **Password exclusion** → Jamais retourné dans responses

**Pour production:**
- [ ] HTTPS obligatoire (secure: true)
- [ ] JWT_SECRET strong (32+ chars random)
- [ ] Rate limiting sur auth endpoints
- [ ] CSRF tokens (optionnel avec sameSite: "lax")
- [ ] Refresh tokens (pour sessions longues)

---

## 🛠️ FICHIERS MODIFIÉS

| Fichier | Changement |
|---------|------------|
| `server/routes/auth.ts` | ✅ sameSite ajouté (signup, login, logout) |
| `server/middleware/security.ts` | ✅ credentials: true dans CORS |
| `server/middleware/authPrisma.ts` | ✅ Créé (nouveau middleware) |
| `.env` | ✅ JWT_SECRET déjà présent |

---

## 📝 COMMANDES

```bash
# Lancer serveur
npm run dev:server

# Tests auth
./TEST-AUTH-ENDPOINTS.sh

# Voir database
npx prisma studio

# Régénérer client Prisma
npx prisma generate

# Voir logs PostgreSQL
docker logs synrgy-postgres
```

---

## ✅ VALIDATION

**Auth est fixée si:**

- [x] Cookies configurés avec sameSite
- [x] CORS autorise credentials
- [x] JWT_SECRET dans .env
- [x] Middleware Prisma créé
- [x] clearCookie avec options
- [ ] **Tests passent (5/5)** ← À VÉRIFIER MAINTENANT

---

## 🚀 PROCHAINE ÉTAPE

**Terminal 1:**
```bash
npm run dev:server
```

**Terminal 2:**
```bash
./TEST-AUTH-ENDPOINTS.sh
```

**Si tous les tests passent → Phase 5.4 (Déploiement)**

---

**✅ AUTH FIX COMPLET — PRÊT À TESTER** 🔐

