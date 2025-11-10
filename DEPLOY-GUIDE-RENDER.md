# 🚀 DEPLOY BACKEND TO RENDER — GUIDE COMPLET

**Platform:** Render.com  
**Service:** Express Backend + PostgreSQL  
**Date:** November 9, 2025

---

## 📋 PRÉ-REQUIS

- [x] Compte Render.com (gratuit ou payant)
- [x] Repository GitHub avec code Synrgy
- [x] Stripe account (test & live keys)
- [x] Backend fonctionnel localement

---

## 🗄️ ÉTAPE 1: CRÉER DATABASE POSTGRESQL

### Sur Render Dashboard

1. Cliquer "**New +**" → "**PostgreSQL**"
2. Configurer:
   - **Name:** `synrgy-db`
   - **Database:** `synrgydb`
   - **User:** `synrgy_user`
   - **Region:** Frankfurt (ou proche de vous)
   - **Plan:** Starter ($7/month) ou Free
3. Cliquer "**Create Database**"

### Récupérer Connection String

4. Une fois créée, aller dans l'onglet "**Info**"
5. Copier "**External Database URL**":
   ```
   postgresql://synrgy_user:xxx@xxx.frankfurt-postgres.render.com/synrgydb
   ```
6. **Sauvegarder** ce URL (nécessaire pour le backend)

---

## 🖥️ ÉTAPE 2: CRÉER WEB SERVICE

### Sur Render Dashboard

1. Cliquer "**New +**" → "**Web Service**"
2. Connecter repository GitHub
3. Sélectionner le repo `CoachPro-Saas-main`

### Configuration

**Basic:**
- **Name:** `synrgy-api`
- **Region:** Frankfurt (même que DB)
- **Branch:** `main`
- **Root Directory:** *(laisser vide ou `./`)*
- **Runtime:** Node
- **Build Command:**
  ```bash
  npm ci && npx prisma generate && npm run build:server
  ```
- **Start Command:**
  ```bash
  npx prisma migrate deploy && node dist/server/index.js
  ```

**Plan:** Starter ($7/month) ou Free

---

## 🔧 ÉTAPE 3: VARIABLES D'ENVIRONNEMENT

### Dans Render Dashboard → Environment

Ajouter ces variables une par une:

```env
NODE_ENV=production

# Database (copié depuis synrgy-db)
DATABASE_URL=postgresql://synrgy_user:xxx@xxx.frankfurt-postgres.render.com/synrgydb

# JWT Secret (générer random 32+ chars)
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_ici

# Frontend URL (Vercel URL après deploy frontend)
FRONTEND_URL=https://synrgy.vercel.app

# Stripe LIVE Keys (depuis Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Product Prices (LIVE mode)
STRIPE_PRICE_CLIENT=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_COACH=price_xxxxxxxxxxxxxxxx

# Ollama (optionnel, pour AI features)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

**Important:**
- Utiliser les clés **LIVE** (pas TEST) en production
- `JWT_SECRET` doit être unique et fort (32+ caractères)
- `DATABASE_URL` doit pointer vers la DB Render
- `FRONTEND_URL` sera l'URL Vercel (à mettre à jour après deploy frontend)

---

## 📦 ÉTAPE 4: OBTENIR STRIPE LIVE KEYS

### Dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com
2. **Activer Live Mode** (switch en haut à droite)
3. Aller dans "**Developers**" → "**API Keys**"
4. Copier:
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...` (révéler + copier)

### Créer Products Live

5. Aller dans "**Products**"
6. Créer "**Client Synrgy**":
   - Name: Client Synrgy
   - Price: €9.90/month
   - Recurring
   - Copier Price ID: `price_xxx`
7. Créer "**Coach Synrgy Pro**":
   - Name: Coach Synrgy Pro
   - Price: €29.90/month
   - Recurring
   - Copier Price ID: `price_xxx`

### Webhook Secret

8. Aller dans "**Developers**" → "**Webhooks**"
9. Cliquer "**Add endpoint**"
10. URL: `https://synrgy-api.onrender.com/api/stripe/webhook`
11. Events: Sélectionner:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
12. Créer endpoint
13. Copier "**Signing secret**": `whsec_...`

---

## 🚀 ÉTAPE 5: DÉPLOYER

1. Cliquer "**Create Web Service**"
2. Render va:
   - Cloner le repo
   - Installer dépendances (`npm ci`)
   - Générer Prisma Client
   - Build TypeScript (`tsc`)
   - Lancer migrations Prisma
   - Démarrer serveur
3. Attendre 5-10 minutes
4. Service disponible sur: `https://synrgy-api.onrender.com`

---

## ✅ ÉTAPE 6: VÉRIFICATION

### Test 1: Health Check

```bash
curl https://synrgy-api.onrender.com/api/health
```

**Attendu:**
```json
{
  "ok": true,
  "status": "ok",
  "mode": "production",
  "version": "4.4.4",
  "timestamp": "2025-11-09T..."
}
```

---

### Test 2: Stripe Config

```bash
curl https://synrgy-api.onrender.com/api/stripe/config
```

**Attendu:**
```json
{
  "publishableKey": "pk_live_...",
  "priceClient": "price_...",
  "priceCoach": "price_...",
  "environment": "production"
}
```

**Vérifier:** Les clés commencent par `pk_live_` (pas `pk_test_`)

---

### Test 3: Signup (Production)

```bash
curl -X POST https://synrgy-api.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@synrgy.com",
    "password":"SecurePass123!",
    "role":"CLIENT",
    "fullName":"Test User"
  }'
```

**Attendu:**
```json
{
  "message": "Account created successfully",
  "user": {...},
  "token": "eyJ..."
}
```

---

## 📊 LOGS & MONITORING

### Voir les Logs

1. Dans Render Dashboard → Service `synrgy-api`
2. Onglet "**Logs**"
3. Vérifier:
   - ✅ "Connected to PostgreSQL via Prisma"
   - ✅ "Synrgy backend démarré - routes chargées avec succès"
   - ✅ Aucune erreur critique

### Metrics

1. Onglet "**Metrics**"
2. Vérifier:
   - CPU usage < 50%
   - Memory < 512MB
   - Response times < 500ms

---

## 🔒 SÉCURITÉ PRODUCTION

### Checklist

- [x] NODE_ENV=production
- [x] JWT_SECRET fort (32+ chars random)
- [x] Stripe LIVE keys (pas TEST)
- [x] DATABASE_URL PostgreSQL (pas SQLite)
- [x] HTTPS activé (auto par Render)
- [x] CORS origin = FRONTEND_URL exact
- [x] Cookies secure=true en production
- [x] Webhook signature verification

---

## 🐛 TROUBLESHOOTING

### Erreur: Build Failed

**Vérifier:**
- `npm ci` command correct
- `package.json` scripts présents
- `tsconfig.server.json` existe

**Solution:**
```bash
# Local test
npm ci
npx prisma generate
npm run build:server
node dist/server/index.js
```

---

### Erreur: Prisma Migration Failed

**Cause:** DATABASE_URL invalide ou DB inaccessible

**Solution:**
1. Vérifier DATABASE_URL dans Render env vars
2. Vérifier DB est "Available"
3. Relancer deploy

---

### Erreur: Cannot connect to database

**Cause:** IP whitelist ou network issue

**Solution:**
1. Render Dashboard → synrgy-db → Connections
2. Vérifier "Allow external connections" = ON
3. Vérifier Security Group permet connections

---

### Erreur 500: Internal Server Error

**Debug:**
1. Render Logs → chercher stack trace
2. Vérifier toutes les env vars sont set
3. Tester health endpoint

---

## 📝 COMMANDES UTILES

| Action | Commande |
|--------|----------|
| Redeploy manuel | Render Dashboard → Manual Deploy |
| Voir logs live | Render Dashboard → Logs (tail) |
| Shell access | Render Dashboard → Shell |
| Restart service | Render Dashboard → Suspend → Resume |

---

## ✅ VALIDATION DÉPLOIEMENT

**Le backend est correctement déployé si:**

- [x] Service status = "Live" (vert)
- [x] Health check répond 200
- [x] Stripe config retourne live keys
- [x] Signup fonctionne
- [x] Login fonctionne
- [x] Logs: pas d'erreur critique
- [x] Response times < 1s

---

## 🎯 APRÈS DÉPLOIEMENT

### 1. Noter l'URL

```
https://synrgy-api.onrender.com
```

### 2. Mettre à jour Frontend

Dans le déploiement frontend (Vercel), ajouter:
```env
VITE_API_URL=https://synrgy-api.onrender.com
```

### 3. Tester depuis Frontend

Une fois frontend déployé:
```
https://synrgy.vercel.app → signup → checkout → Stripe
```

---

## 📚 RESSOURCES

- [Render Node Docs](https://render.com/docs/deploy-node-express-app)
- [Render PostgreSQL Docs](https://render.com/docs/databases)
- [Prisma Deploy Docs](https://www.prisma.io/docs/guides/deployment)

---

**✅ Guide Render Complet — Backend Ready to Deploy** 🚀

