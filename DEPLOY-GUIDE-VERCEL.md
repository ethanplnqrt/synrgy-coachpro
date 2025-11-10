# 🌐 DEPLOY FRONTEND TO VERCEL — GUIDE COMPLET

**Platform:** Vercel  
**Framework:** Vite + React  
**Date:** November 9, 2025

---

## 📋 PRÉ-REQUIS

- [x] Compte Vercel (gratuit)
- [x] Repository GitHub avec code Synrgy
- [x] Backend déployé sur Render (URL disponible)
- [x] Frontend fonctionne localement

---

## 🚀 ÉTAPE 1: CONNECTER GITHUB

### Sur Vercel Dashboard

1. Aller sur https://vercel.com/dashboard
2. Cliquer "**Add New...**" → "**Project**"
3. Cliquer "**Import Git Repository**"
4. Sélectionner `CoachPro-Saas-main`
5. Si pas visible → Configure GitHub App → Autoriser repo

---

## ⚙️ ÉTAPE 2: CONFIGURATION

### Framework Preset

- **Framework:** Vite
- **Root Directory:** `./` (ou laisser vide)
- **Build Command:** `npm run build:client`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

### Environment Variables

Ajouter ces variables:

```env
# Backend API URL (depuis Render)
VITE_API_URL=https://synrgy-api.onrender.com

# Stripe Publishable Key (LIVE)
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx

# Environment
NODE_ENV=production
```

**Important:**
- Utiliser clés **LIVE** Stripe (pas TEST)
- URL backend **HTTPS** (Render)
- Préfixe `VITE_` obligatoire pour Vite

---

## 🚀 ÉTAPE 3: DÉPLOYER

1. Cliquer "**Deploy**"
2. Vercel va:
   - Cloner le repo
   - Installer dépendances
   - Build Vite (`vite build`)
   - Déployer sur CDN global
3. Attendre 2-5 minutes
4. URL disponible: `https://synrgy-xxx.vercel.app`

---

## 🌐 ÉTAPE 4: CUSTOM DOMAIN (Optionnel)

### Acheter Domain

1. Acheter domaine (ex: synrgy.app sur Namecheap, Google Domains)

### Configurer DNS

2. Dans Vercel Dashboard → Project → Settings → Domains
3. Ajouter "**synrgy.app**"
4. Vercel donne les DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
5. Dans votre DNS provider (Namecheap, etc.):
   - Ajouter ces records
   - Attendre propagation (5-30 min)
6. Vercel détecte automatiquement → SSL activé
7. Site accessible sur: `https://synrgy.app`

---

## ✅ ÉTAPE 5: VÉRIFICATION

### Test 1: Homepage

```bash
curl https://synrgy.vercel.app
```

**Attendu:** HTML de la landing page

---

### Test 2: Pricing Section

**Browser:**
```
https://synrgy.vercel.app
```

**Vérifier:**
- ✅ Landing page s'affiche
- ✅ Scroll to pricing
- ✅ 2 plans visibles (Client 9,90€ / Coach 29,90€)
- ✅ Design glassmorphism
- ✅ Buttons "Démarrer"
- ✅ Pas de plan "Athlète"

---

### Test 3: Signup

1. Cliquer "**Démarrer**" (Client)
2. ✅ Redirect `/signup?role=client`
3. Remplir formulaire
4. Submit
5. ✅ Compte créé
6. ✅ Redirect dashboard

---

### Test 4: Checkout Flow

1. Login (si pas déjà)
2. Landing → Pricing
3. Cliquer "**Démarrer**"
4. ✅ Redirect `/checkout?plan=client`
5. ✅ Auto-redirect Stripe checkout
6. Carte test: `4242 4242 4242 4242`
7. Complete payment
8. ✅ Redirect `/subscription/success`

---

### Test 5: Console Errors

**Browser:** Ouvrir Console (F12)

**Vérifier:**
- ✅ Aucune erreur 401 Unauthorized
- ✅ Aucune erreur CORS
- ✅ API calls vers `https://synrgy-api.onrender.com`

---

## 🔄 ÉTAPE 6: METTRE À JOUR BACKEND

### Ajouter Frontend URL dans Render

1. Render Dashboard → `synrgy-api` → Environment
2. Mettre à jour `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://synrgy.vercel.app
   ```
   (ou votre custom domain: `https://synrgy.app`)
3. Cliquer "**Save Changes**"
4. Render va auto-redeploy (2-3 min)

---

## 🪝 ÉTAPE 7: CONFIGURER WEBHOOKS STRIPE

### Dans Stripe Dashboard (LIVE mode)

1. Aller "**Developers**" → "**Webhooks**"
2. Cliquer "**Add endpoint**"
3. **Endpoint URL:**
   ```
   https://synrgy-api.onrender.com/api/stripe/webhook
   ```
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Cliquer "**Add endpoint**"
6. Copier "**Signing secret**": `whsec_...`
7. Render → synrgy-api → Environment
8. Mettre à jour `STRIPE_WEBHOOK_SECRET=whsec_...`
9. Save → Redeploy

---

## 🧪 TESTER PRODUCTION

### Test Complet E2E

```bash
# Browser
open https://synrgy.vercel.app
```

**Flow:**
1. Landing → Pricing
2. Click "Démarrer" (Client)
3. Signup avec email réel
4. Login
5. Dashboard apparaît
6. Retour landing → Click "Démarrer"
7. Redirect Stripe checkout
8. **Carte TEST** (ne PAS utiliser vraie carte):
   - Card: `4242 4242 4242 4242`
   - Email: votre email
   - Complete
9. ✅ Redirect success
10. Vérifier Stripe Dashboard → Payment received

---

### Test Webhook

1. Render Logs → synrgy-api
2. Chercher:
   ```
   ✅ Payment successful for user X (client)
   ```
3. Vérifier database (Prisma Studio local):
   ```bash
   # Connect to production DB
   DATABASE_URL="postgresql://..." npx prisma studio
   ```

---

## 📊 MONITORING

### Vercel Analytics

1. Project → Analytics
2. Activer Vercel Analytics (gratuit)
3. Voir:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Uptime Monitoring

**Utiliser:** UptimeRobot (gratuit)
- Monitor: `https://synrgy.vercel.app`
- Check every: 5 minutes
- Alert email si down

---

## 🔒 SÉCURITÉ

### Headers HTTP

Vercel ajoute automatiquement:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### SSL/TLS

- ✅ Auto-activé par Vercel
- ✅ Certificat Let's Encrypt
- ✅ Auto-renewal

### Environment Variables

- ✅ Secrets jamais exposés au client
- ✅ Seules variables `VITE_*` incluses dans build

---

## 🐛 TROUBLESHOOTING

### Build Failed

**Vérifier:**
- `package.json` scripts corrects
- `vite.config.ts` existe
- Toutes les dépendances installées

**Solution:**
```bash
# Test local
npm run build:client
```

---

### Page Blanche

**Cause:** Routes non configurées (SPA fallback)

**Solution:** Vérifier `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### API Calls 404

**Cause:** VITE_API_URL incorrect

**Solution:**
1. Vercel → Project → Settings → Environment Variables
2. Vérifier `VITE_API_URL` = URL backend Render
3. Redeploy

---

### CORS Errors

**Cause:** Backend CORS origin ≠ frontend URL

**Solution:**
1. Render → synrgy-api → Environment
2. `FRONTEND_URL` = URL Vercel exacte
3. Redeploy backend

---

## 📝 COMMANDES UTILES

| Action | Commande |
|--------|----------|
| Deploy preview | Git push branch → Auto-deploy preview |
| Redeploy | Vercel Dashboard → Deployments → Redeploy |
| Rollback | Deployments → Previous → Promote to Production |
| View logs | Deployments → Click deployment → View Function Logs |

---

## ✅ VALIDATION

**Frontend est correctement déployé si:**

- [x] Homepage accessible (HTTPS)
- [x] Pricing 2 plans (9,90€ / 29,90€)
- [x] Signup fonctionne
- [x] Login fonctionne
- [x] Dashboard accessible
- [x] Checkout redirect Stripe
- [x] Pas d'erreur console
- [x] Performance score > 90

---

## 🎯 APRÈS DÉPLOIEMENT

### 1. Tester Payment Live

**Important:** Utiliser carte TEST (pas vraie carte)
```
4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

### 2. Vérifier Webhook

Stripe Dashboard → Webhooks → Voir events
- ✅ `checkout.session.completed` delivered

### 3. Analytics

Vercel Analytics → Activer
Google Analytics → Ajouter tracking code (optionnel)

---

## 📚 RESSOURCES

- [Vercel Vite Docs](https://vercel.com/docs/frameworks/vite)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Domains](https://vercel.com/docs/custom-domains)

---

**✅ Guide Vercel Complet — Frontend Ready to Deploy** 🌐

