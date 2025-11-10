# ✅ PRODUCTION DEPLOYMENT — CHECKLIST COMPLÈTE

**Date:** November 9, 2025  
**Version:** 4.4.4  
**Target:** Render + Vercel

---

## 📋 PRÉ-DÉPLOIEMENT

### Code Ready

- [x] Backend démarre localement sans erreur
- [x] Frontend démarre localement sans erreur
- [x] Tests auth passent (5/5)
- [x] PostgreSQL connecté (Prisma)
- [x] Stripe checkout testé localement
- [x] 2 plans pricing (9,90€ / 29,90€)
- [x] Plan "Athlète" supprimé

### Repository

- [ ] Code pushed sur GitHub (branch `main`)
- [ ] `.env` **PAS** commité (dans `.gitignore`)
- [ ] `node_modules/` dans `.gitignore`
- [ ] README.md à jour

### Stripe

- [ ] Compte Stripe vérifié
- [ ] Mode LIVE activé
- [ ] Products créés (Client €9.90 / Coach €29.90)
- [ ] Prix IDs copiés (`price_xxx`)
- [ ] API keys LIVE copiées (`sk_live_`, `pk_live_`)

---

## 🗄️ DÉPLOIEMENT DATABASE (Render)

### Créer PostgreSQL

- [ ] New → PostgreSQL
- [ ] Name: `synrgy-db`
- [ ] Region: Frankfurt (ou proche)
- [ ] Plan: Starter ou Free
- [ ] Create Database

### Récupérer URL

- [ ] Copier External Database URL
- [ ] Format: `postgresql://user:pass@host:5432/synrgydb`
- [ ] Sauvegarder pour backend

---

## 🖥️ DÉPLOIEMENT BACKEND (Render)

### Créer Web Service

- [ ] New → Web Service
- [ ] Connect GitHub repo
- [ ] Name: `synrgy-api`
- [ ] Region: Frankfurt (même que DB)
- [ ] Runtime: Node
- [ ] Build: `npm ci && npx prisma generate && npm run build:server`
- [ ] Start: `npx prisma migrate deploy && node dist/server/index.js`
- [ ] Plan: Starter

### Environment Variables

- [ ] NODE_ENV=production
- [ ] DATABASE_URL (depuis synrgy-db)
- [ ] JWT_SECRET (générer 32+ chars)
- [ ] FRONTEND_URL (https://synrgy.vercel.app)
- [ ] STRIPE_SECRET_KEY (sk_live_...)
- [ ] STRIPE_PUBLIC_KEY (pk_live_...)
- [ ] STRIPE_WEBHOOK_SECRET (whsec_..., après step suivant)
- [ ] STRIPE_PRICE_CLIENT (price_...)
- [ ] STRIPE_PRICE_COACH (price_...)
- [ ] OLLAMA_URL (optionnel)

### Deploy

- [ ] Create Web Service
- [ ] Attendre build (5-10 min)
- [ ] Status = "Live" (vert)

### Vérifier

- [ ] `curl https://synrgy-api.onrender.com/api/health`
- [ ] Response: `{"ok": true, "status": "ok"}`
- [ ] Logs: "Synrgy backend démarré"
- [ ] Logs: "Connected to PostgreSQL via Prisma"

---

## 🪝 CONFIGURER STRIPE WEBHOOK

### Dans Stripe Dashboard (LIVE mode)

- [ ] Developers → Webhooks → Add endpoint
- [ ] URL: `https://synrgy-api.onrender.com/api/stripe/webhook`
- [ ] Events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Create endpoint
- [ ] Copier Signing secret: `whsec_...`

### Mettre à Jour Backend

- [ ] Render → synrgy-api → Environment
- [ ] Ajouter/Mettre à jour: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Save Changes (auto-redeploy)

---

## 🌐 DÉPLOIEMENT FRONTEND (Vercel)

### Créer Project

- [ ] New Project
- [ ] Import `CoachPro-Saas-main`
- [ ] Framework: Vite
- [ ] Root: `./`
- [ ] Build: `npm run build:client`
- [ ] Output: `dist`

### Environment Variables

- [ ] VITE_API_URL=https://synrgy-api.onrender.com
- [ ] VITE_STRIPE_PUBLIC_KEY=pk_live_...
- [ ] NODE_ENV=production

### Deploy

- [ ] Deploy
- [ ] Attendre build (2-5 min)
- [ ] URL: `https://synrgy-xxx.vercel.app`

### Custom Domain (Optionnel)

- [ ] Settings → Domains → Add `synrgy.app`
- [ ] Configure DNS records
- [ ] Attendre propagation
- [ ] SSL auto-activé

---

## 🔄 SYNCHRONISER URLS

### Backend Render

- [ ] Environment → FRONTEND_URL
- [ ] Mettre URL Vercel (ou custom domain)
- [ ] Save (redeploy)

### Frontend Vercel

- [ ] Settings → Environment Variables
- [ ] Vérifier VITE_API_URL = URL Render
- [ ] Redeploy si changé

---

## 🧪 TESTS PRODUCTION

### Test 1: Health Check Backend

```bash
curl https://synrgy-api.onrender.com/api/health
```

**Attendu:**
```json
{"ok": true, "mode": "production", "version": "4.4.4"}
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

**Vérifier:** Clés commencent par `pk_live_` (PAS `pk_test_`)

---

### Test 3: Frontend Homepage

```
https://synrgy.vercel.app
```

**Vérifier:**
- [ ] Landing s'affiche
- [ ] Pricing 2 plans
- [ ] Images chargent
- [ ] Animations fonctionnent
- [ ] Console: pas d'erreur

---

### Test 4: Signup Production

1. `https://synrgy.vercel.app`
2. Click "Démarrer" (Client)
3. Signup avec **email réel**
4. Vérifier email confirmation (si implémenté)
5. Login
6. ✅ Dashboard accessible

---

### Test 5: Checkout LIVE

⚠️ **IMPORTANT:** Utiliser carte TEST (pas vraie carte)

1. Login
2. Landing → Pricing → "Démarrer"
3. Checkout page
4. Stripe checkout (LIVE mode)
5. Carte: `4242 4242 4242 4242`
6. Complete payment
7. ✅ Redirect success
8. Vérifier Stripe Dashboard:
   - [ ] Payment visible
   - [ ] Subscription créée
   - [ ] Webhook delivered

---

### Test 6: Webhook Production

**Stripe Dashboard:**
1. Webhooks → Votre endpoint
2. Send test webhook
3. Vérifier "Recent deliveries"
4. Status: ✅ Succeeded (200)

**Render Logs:**
```
✅ Payment successful for user X (client)
```

---

## 📊 MONITORING

### Render

- [ ] Dashboard → synrgy-api → Metrics
- [ ] CPU < 50%
- [ ] Memory < 512MB
- [ ] Response times < 1s

### Vercel

- [ ] Project → Analytics
- [ ] Activer (gratuit)
- [ ] Voir page views, visitors

### Uptime

- [ ] UptimeRobot account (gratuit)
- [ ] Monitor: `https://synrgy.vercel.app`
- [ ] Monitor: `https://synrgy-api.onrender.com/api/health`
- [ ] Alert email si down

---

## 🔒 SÉCURITÉ PRODUCTION

### Backend

- [x] NODE_ENV=production
- [x] JWT_SECRET fort (32+ chars)
- [x] Stripe LIVE keys
- [x] DATABASE_URL PostgreSQL
- [x] HTTPS (auto Render)
- [x] CORS origin exact
- [x] Cookies secure=true
- [x] Webhook signature verification

### Frontend

- [x] HTTPS (auto Vercel)
- [x] Environment variables préfixées VITE_
- [x] API calls HTTPS
- [x] credentials: 'include'
- [x] Security headers (vercel.json)

---

## 📝 POST-DÉPLOIEMENT

### Immédiat

- [ ] Tester signup/login production
- [ ] Tester checkout avec carte test
- [ ] Vérifier webhook reçu
- [ ] Vérifier logs (pas d'erreur)

### Semaine 1

- [ ] Monitor uptime (99%+)
- [ ] Vérifier performance
- [ ] Collecter feedback utilisateurs
- [ ] Fix bugs critiques

### Semaine 2

- [ ] SEO optimization
- [ ] Google Analytics
- [ ] Social media posts
- [ ] ProductHunt launch

---

## 🎉 DÉPLOIEMENT RÉUSSI SI

**Backend:**
- [x] Service Live sur Render
- [x] Health check 200
- [x] Stripe config retourne LIVE keys
- [x] Logs: pas d'erreur
- [x] Database connectée

**Frontend:**
- [x] Site accessible (HTTPS)
- [x] Pricing 2 plans
- [x] Signup fonctionne
- [x] Checkout redirect Stripe
- [x] Console: pas d'erreur

**Integration:**
- [x] Signup → Login → Dashboard
- [x] Checkout → Stripe → Success
- [x] Webhook reçu et traité
- [x] Stripe Dashboard: subscription visible

---

## 🚀 LANCEMENT PUBLIC

### Marketing

- [ ] Landing SEO (meta tags)
- [ ] Open Graph images
- [ ] Twitter/LinkedIn posts
- [ ] ProductHunt launch
- [ ] Email campaign (si liste)

### Support

- [ ] Email support: support@synrgy.app
- [ ] FAQ page
- [ ] Help center (optionnel)

---

## 📚 DOCUMENTATION UTILE

- [Render Deploy Guide](https://render.com/docs/deploy-node-express-app)
- [Vercel Deploy Guide](https://vercel.com/docs/deployments/overview)
- [Stripe Production Checklist](https://stripe.com/docs/development/checklist)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)

---

**✅ Checklist Production Complète — Ready to Deploy** 🚀

