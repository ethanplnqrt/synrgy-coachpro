# 🎯 SYNRGY v4.4.4 — GUIDE DE TEST COMPLET

**Date:** November 9, 2025  
**Version:** 4.4.4  
**Status:** 🟢 **PRÊT À TESTER**

---

## ✅ RÉCAPITULATIF COMPLET

### Versions Précédentes

**v4.4.0** → TrueCoach parity + features uniques  
**v4.4.1** → Backend imports fixés  
**v4.4.2** → Pricing update (9,90€ / 29,90€)  
**v4.4.3** → Auth safe (handleSelectPlan)  
**v4.4.4** → Stripe integration complète ✅

---

## 🏗️ ARCHITECTURE ACTUELLE

```
Synrgy v4.4.4
├── Backend (Express + Prisma + Stripe)
│   ├── PostgreSQL (Docker)              ✅
│   ├── 11 Routes API                    ✅
│   ├── Auth Prisma + JWT                ✅
│   ├── Stripe Checkout + Webhook        ✅ NEW
│   ├── 6 Services                       ✅
│   └── 4 Middleware                     ✅
└── Frontend (React + Vite)
    ├── Landing (2 plans pricing)        ✅
    ├── Auth (signup/login)              ✅
    ├── Checkout (Stripe redirect)       ✅ NEW
    ├── Dashboard Coach                  ✅
    └── Dashboard Client                 ✅
```

---

## 💰 PRICING FINAL

| Plan | Prix | Stripe Product | Couleur |
|------|------|----------------|---------|
| **Client Synrgy** | **9,90€/mois** | prod_TLfZ1muRLwGmQC | Menthe #8AFFC1 |
| **Coach Synrgy Pro** | **29,90€/mois** | prod_TLfYI0nWTUy543 | Or #FFD66B |

**Plan "Athlète" (19€):** ❌ **SUPPRIMÉ**

---

## 🚀 DÉMARRAGE

### Terminal 1: PostgreSQL (si pas déjà actif)

```bash
docker start synrgy-postgres
# ou
docker run --name synrgy-postgres \
  -e POSTGRES_USER=synrgy_user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=synrgydb \
  -p 5432:5432 \
  -d postgres:15
```

---

### Terminal 2: Backend

```bash
npm run dev:server
```

**Attendu:**
```
✅ Fichier .env chargé
🚀 Mode: DEVELOPMENT
✅ Connected to PostgreSQL via Prisma
✅ Stripe service loaded
⚠️  Rate limiting disabled (development mode)
✅ Synrgy backend démarré - routes chargées avec succès
🚀 Synrgy DEV live on http://localhost:5001
```

---

### Terminal 3: Frontend

```bash
npm run dev:client
```

**Attendu:**
```
VITE v5.x.x ready in xxx ms
➜  Local: http://localhost:5173/
```

---

## 🧪 TESTS COMPLETS

### TEST 1: Backend Health ✅

```bash
curl http://localhost:5001/api/health
```

**Attendu:**
```json
{
  "status": "ok",
  "mode": "development",
  "version": "4.0.0",
  "timestamp": "2025-11-09T..."
}
```

---

### TEST 2: Auth Endpoints ✅

```bash
./TEST-AUTH-ENDPOINTS.sh
```

**Attendu:**
```
✅ Signup successful - Token received
✅ Login successful - Cookie saved
✅ Get Me successful - User data retrieved
✅ Logout successful
✅ Correctly denied access after logout

🎉 ALL TESTS PASSED (5/5)
```

---

### TEST 3: Landing Page Pricing ✅

**Browser:**
```
http://localhost:5173
```

**Vérifier:**
1. ✅ Landing page s'affiche
2. ✅ Scroll to "Choisis ta formule Synrgy"
3. ✅ 2 cards visibles:
   - Client Synrgy: 9,90€/mois (vert menthe)
   - Coach Synrgy Pro: 29,90€/mois (or)
4. ✅ Design glassmorphism (blur visible)
5. ✅ Hover animation (scale 1.02)
6. ✅ Pas de plan "Athlète Indépendant"
7. ✅ Console: aucune erreur 401

---

### TEST 4: Signup Flow (Non connecté)

**Actions:**
1. Sur landing, cliquer "Choisir cette formule" (Client)
2. ✅ Redirect → `/signup?role=client`
3. Remplir formulaire:
   - Email: `testclient@synrgy.com`
   - Password: `test123`
   - Full Name: `Test Client`
4. Submit
5. ✅ Compte créé
6. ✅ Redirect → `/client/home`

---

### TEST 5: Checkout Flow (Connecté)

**Prérequis:** Être connecté (signup/login d'abord)

**Actions:**
1. Aller sur landing: `http://localhost:5173`
2. Cliquer "Choisir cette formule" (Client ou Coach)
3. ✅ Redirect → `/checkout?plan=client`
4. ✅ Page checkout s'affiche (loading spinner)
5. ✅ Auto-redirect → Stripe checkout page
6. Remplir carte test:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
7. Complete payment
8. ✅ Redirect → `/subscription/success`

---

### TEST 6: Stripe Config API

```bash
curl http://localhost:5001/api/stripe/config
```

**Attendu:**
```json
{
  "publicKey": "pk_test_51SOw9eJlyCE49zWsWQzcVIsHXiBzTpAeMU5XPbQXLQknrFAsW54PJ4A20FMRU7sceBsPawp9k1NwOaUjyeq6Y0w300uFUu3fzI"
}
```

---

### TEST 7: Webhook (Local avec Stripe CLI)

**Install Stripe CLI:**
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

**Forward webhooks:**
```bash
stripe listen --forward-to localhost:5001/api/stripe/webhook
```

**Note le webhook secret affiché et mets-le dans .env:**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxx...
```

**Trigger test event:**
```bash
stripe trigger checkout.session.completed
```

**Check server logs:**
```
✅ Payment successful for user undefined (undefined)
```

---

## 📋 CHECKLIST FINALE

### Infrastructure
- [ ] PostgreSQL actif
- [ ] Backend démarré (:5001)
- [ ] Frontend démarré (:5173)
- [ ] Prisma connecté

### Tests Backend
- [ ] Health check répond
- [ ] Auth endpoints passent (5/5)
- [ ] Stripe config accessible

### Tests Frontend
- [ ] Landing visible
- [ ] Pricing 2 plans (9,90€ / 29,90€)
- [ ] Signup fonctionne
- [ ] Login fonctionne

### Tests Integration
- [ ] handleSelectPlan (non connecté → signup)
- [ ] handleSelectPlan (connecté → checkout)
- [ ] Checkout redirect Stripe
- [ ] Payment test réussi
- [ ] Webhook received

---

## 🐛 TROUBLESHOOTING

### Erreur "Cannot find module stripe"

**Solution:**
```bash
npm install stripe
```

---

### Erreur Stripe API "Invalid API Key"

**Solution:**
Vérifier `.env`:
```env
STRIPE_SECRET_KEY=sk_test_51...  # Doit commencer par sk_test
```

---

### Checkout ne redirect pas vers Stripe

**Debug:**
1. Check console browser (erreurs?)
2. Check server logs (checkout session created?)
3. Vérifier user est connecté (cookie synrgy_token)
4. Vérifier STRIPE_PRICE_CLIENT/COACH dans .env

---

### Webhook signature failed

**Solution:**
```bash
# Get webhook secret from Stripe CLI
stripe listen --forward-to localhost:5001/api/stripe/webhook
# Copy whsec_xxx to .env STRIPE_WEBHOOK_SECRET
```

---

## 📊 ENDPOINTS DISPONIBLES

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/health` | GET | Health check | Public |
| `/api/auth/signup` | POST | Create account | Public |
| `/api/auth/login` | POST | Login | Public |
| `/api/auth/me` | GET | Current user | Cookie |
| `/api/auth/logout` | POST | Logout | Cookie |
| `/api/stripe/checkout` | POST | Create session | Public |
| `/api/stripe/webhook` | POST | Stripe events | Stripe |
| `/api/stripe/config` | GET | Public key | Public |
| `/api/chat/*` | * | Chat | Auth |
| `/api/nutrition/*` | * | Nutrition | Auth |
| `/api/codex/*` | * | AI Codex | Auth |

**Total:** 11+ endpoints

---

## 🎉 RÉSUMÉ GLOBAL

**Synrgy v4.4.4:**

**COMPLET:**
- ✅ Backend Prisma + PostgreSQL
- ✅ Auth JWT + Cookies
- ✅ Stripe Checkout + Webhook
- ✅ Landing 2 plans (9,90€ / 29,90€)
- ✅ Checkout page
- ✅ Auth safe (pas de 401)
- ✅ 10 routes backend
- ✅ 3 routes Stripe
- ✅ Design glassmorphism premium

**FICHIERS:**
- Créés: 15+ fichiers
- Modifiés: 10+ fichiers
- Services: 6
- Middleware: 4
- Routes: 11
- Pages: 30+

**TESTS:**
- [ ] Backend health
- [ ] Auth endpoints (5)
- [ ] Landing pricing
- [ ] Signup flow
- [ ] Checkout flow
- [ ] Stripe webhook

**STATUS:** 🟢 **100% PRÊT À TESTER**

---

## 🚀 LANCER MAINTENANT

**3 Terminaux:**

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client

# Terminal 3: Tests Auth
./TEST-AUTH-ENDPOINTS.sh
```

**Browser:**
```bash
open http://localhost:5173
```

**Flow complet à tester:**
1. Landing → Pricing (2 plans)
2. Click plan (non connecté) → Signup
3. Create account → Login
4. Landing → Click plan (connecté) → Checkout
5. Stripe payment → Success

---

**✅ v4.4.4 Complete — Stripe Integration — Ready for Full Testing** 💳🔐🚀✨

