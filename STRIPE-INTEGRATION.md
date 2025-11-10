# 🔐 Stripe Integration - Documentation

## ✅ Intégration complète et opérationnelle

Synrgy dispose maintenant d'une intégration Stripe production-ready pour gérer les paiements récurrents.

---

## 📂 Structure

```
server/
├── utils/
│   └── stripe.ts              ✅ Configuration Stripe
└── routes/
    └── payments.ts            ✅ Endpoints Stripe

.env.example                   ✅ Variables d'environnement
```

---

## 🎯 Endpoints créés

### 1. `POST /api/payments/checkout`

Crée une session Stripe Checkout pour un abonnement récurrent.

**Request** :
```json
{
  "plan": "athlete" | "client" | "coach",
  "referralCode": "SYNRGY-XXX-YYY" (optionnel)
}
```

**Response** :
```json
{
  "success": true,
  "url": "https://checkout.stripe.com/c/pay/cs_...",
  "sessionId": "cs_..."
}
```

**Comportement** :
- Valide le plan
- Récupère le Price ID Stripe correspondant
- Applique un coupon si code de parrainage valide
- Crée une session Stripe Checkout (mode subscription)
- Retourne l'URL de paiement

**Log** :
```
✅ Checkout session créée pour user@example.com (athlete)
```

---

### 2. `POST /api/payments/webhook`

Écoute les événements Stripe et met à jour les abonnements.

**Headers** :
- `stripe-signature`: Signature Stripe (automatique)

**Events gérés** :

#### `checkout.session.completed`
- Déclenché quand le paiement initial est réussi
- Crée l'abonnement dans le store local
- Marque le code de parrainage comme utilisé
- **Log** : `✅ Paiement reçu pour user@example.com (athlete)`

#### `invoice.payment_succeeded`
- Déclenché pour chaque paiement récurrent
- Confirme que l'abonnement est toujours actif
- **Log** : `✅ Paiement récurrent réussi : sub_xxx`

#### `customer.subscription.deleted`
- Déclenché quand l'abonnement est annulé
- Marque l'abonnement comme "canceled" dans le store
- **Log** : `✅ Abonnement annulé pour userId: xxx`

#### `customer.subscription.updated`
- Déclenché quand l'abonnement est modifié
- Réactive l'abonnement si le statut passe à "active"
- **Log** : `✅ Abonnement réactivé pour userId: xxx`

**Sécurité** :
- Vérification de la signature Stripe
- Rejet si signature invalide
- **Log** : `⚠️ Webhook signature verification failed`

---

### 3. `GET /api/payments/status/:userId`

Récupère le statut d'abonnement d'un utilisateur.

**Authorization** :
- L'utilisateur peut voir son propre statut
- Les coaches peuvent voir le statut de leurs clients

**Response** :
```json
{
  "success": true,
  "active": true,
  "plan": "athlete",
  "lastPayment": "2024-11-02T10:00:00.000Z",
  "discount": 20,
  "referralCode": "SYNRGY-XXX-YYY"
}
```

**Fonctionnalité avancée** :
- Si abonnement Stripe, récupère la date du dernier paiement depuis Stripe
- Sinon, utilise la date de début d'abonnement

---

## ⚙️ Configuration (.env)

```env
# Stripe Secret Key (test ou production)
STRIPE_SECRET_KEY=sk_test_xxx
# ou
STRIPE_SECRET_KEY=sk_live_xxx

# Price IDs Stripe (créés dans le Dashboard)
STRIPE_PRICE_BASIC=price_xxx  # Pour athlete/client
STRIPE_PRICE_PRO=price_xxx    # Pour coach

# Webhook Secret (depuis le Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Frontend URL (pour les redirections)
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Setup Stripe

### 1. Créer un compte Stripe

https://dashboard.stripe.com/register

### 2. Créer les Products & Prices

**Dashboard → Products → Add Product**

**Product 1 : Basic**
- Nom : Synrgy Basic (Athlete/Client)
- Prix : 19€/mois (athlete) ou 29€/mois (client)
- Récurrent : Mensuel
- Copier le Price ID : `price_xxx`

**Product 2 : Pro**
- Nom : Synrgy Pro (Coach)
- Prix : 49€/mois
- Récurrent : Mensuel
- Copier le Price ID : `price_xxx`

Ajouter les Price IDs dans `.env` :
```env
STRIPE_PRICE_BASIC=price_xxx
STRIPE_PRICE_PRO=price_xxx
```

### 3. Configurer le Webhook

**Dashboard → Developers → Webhooks → Add endpoint**

**URL** :
```
https://your-domain.com/api/payments/webhook
```

**Events à écouter** :
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`
- `customer.subscription.updated`

**Copier le Signing Secret** : `whsec_xxx`

Ajouter dans `.env` :
```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 4. Récupérer la Secret Key

**Dashboard → Developers → API Keys**

**Mode Test** :
- Secret Key : `sk_test_xxx`

**Mode Production** :
- Secret Key : `sk_live_xxx`

Ajouter dans `.env` :
```env
STRIPE_SECRET_KEY=sk_test_xxx
```

### 5. Tester

```bash
# Redémarrer le serveur
npm run dev:server

# Logs attendus :
# ✅ Stripe connecté
```

---

## 🧪 Test local avec Stripe CLI

### Installation

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Autres OS
https://stripe.com/docs/stripe-cli
```

### Login

```bash
stripe login
```

### Forward webhooks localement

```bash
stripe listen --forward-to localhost:5001/api/payments/webhook
```

**Output** :
```
> Ready! Your webhook signing secret is whsec_xxx
```

Copier le secret dans `.env` temporairement pour les tests locaux.

### Déclencher un événement test

```bash
stripe trigger checkout.session.completed
```

**Log serveur attendu** :
```
✅ Webhook reçu : checkout.session.completed
✅ Paiement reçu pour test@stripe.com (athlete)
```

---

## 📊 Flow utilisateur complet

### 1. Utilisateur clique "S'abonner"

Frontend envoie :
```javascript
const res = await fetch("/api/payments/checkout", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    plan: "athlete",
    referralCode: "SYNRGY-XXX-YYY" // optionnel
  })
});
const data = await res.json();
// → { success: true, url: "https://checkout.stripe.com/..." }
```

### 2. Redirection vers Stripe Checkout

```javascript
window.location.href = data.url;
```

L'utilisateur arrive sur la page de paiement Stripe.

### 3. Paiement réussi

Stripe déclenche `checkout.session.completed` → Webhook

**Serveur** :
```
✅ Webhook reçu : checkout.session.completed
✅ Paiement reçu pour user@example.com (athlete)
```

**Store local** :
```json
{
  "id": "xxx",
  "userId": "user-id",
  "planId": "athlete",
  "status": "active",
  "startDate": "2024-11-02T10:00:00.000Z",
  "stripeSubscriptionId": "sub_xxx",
  "referralCode": "SYNRGY-XXX-YYY",
  "discount": 20
}
```

### 4. Redirection vers l'app

Stripe redirige vers :
```
http://localhost:5173/subscription?success=true
```

Frontend peut vérifier le statut :
```javascript
const status = await fetch("/api/payments/status", {
  credentials: "include"
});
// → { active: true, plan: "athlete", ... }
```

### 5. Paiements récurrents

Chaque mois, Stripe déclenche `invoice.payment_succeeded` → Webhook

**Serveur** :
```
✅ Webhook reçu : invoice.payment_succeeded
✅ Paiement récurrent réussi : sub_xxx
```

### 6. Annulation

Si l'utilisateur annule depuis Stripe ou l'app, Stripe déclenche `customer.subscription.deleted` → Webhook

**Serveur** :
```
✅ Webhook reçu : customer.subscription.deleted
✅ Abonnement annulé pour userId: xxx
```

**Store local** :
```json
{
  "status": "canceled",
  "endDate": "2024-11-02T10:00:00.000Z"
}
```

---

## 🔐 Sécurité

### Vérification de signature

Le webhook vérifie **toujours** la signature Stripe :

```typescript
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  STRIPE_WEBHOOK_SECRET
);
```

Si la signature est invalide → `400 Bad Request`

### Raw body

Le webhook reçoit le **raw body** (pas de JSON parsing) pour préserver la signature :

```typescript
// server/index.ts
app.use("/api/payments/webhook", bodyParser.raw({ type: "application/json" }));
```

### Authorization

L'endpoint `/status/:userId` vérifie :
- L'utilisateur est authentifié
- L'utilisateur demande son propre statut OU est un coach

---

## 🎯 Mode Mock vs Stripe

Le système détecte automatiquement si Stripe est configuré :

```typescript
// server/utils/stripe.ts
export function isStripeConfigured(): boolean {
  return !!stripe;
}
```

**Si STRIPE_SECRET_KEY est vide** :
```
ℹ️  Stripe en mode mock (pas de clé configurée)
```

**Si STRIPE_SECRET_KEY est configurée** :
```
✅ Stripe connecté
```

Les routes `/checkout` et `/webhook` retournent une erreur 503 si Stripe n'est pas configuré.

---

## 📝 Logs

Tous les événements importants sont loggés :

**Startup** :
```
✅ Stripe connecté
```
ou
```
ℹ️  Stripe en mode mock
⚠️  STRIPE_SECRET_KEY not configured
```

**Checkout** :
```
✅ Checkout session créée pour user@example.com (athlete)
```

**Webhook** :
```
✅ Webhook reçu : checkout.session.completed
✅ Paiement reçu pour user@example.com (athlete)
✅ Paiement récurrent réussi : sub_xxx
✅ Abonnement annulé pour userId: xxx
✅ Abonnement réactivé pour userId: xxx
```

**Erreurs** :
```
⚠️  Webhook signature verification failed: ...
```

---

## ✅ Checklist Production

Avant de lancer en production :

- [ ] Créer un compte Stripe production
- [ ] Créer les Products & Prices
- [ ] Configurer le webhook avec l'URL de production
- [ ] Ajouter `STRIPE_SECRET_KEY=sk_live_xxx` dans `.env`
- [ ] Ajouter les Price IDs production
- [ ] Ajouter le Webhook Secret production
- [ ] Tester un paiement en mode test d'abord
- [ ] Vérifier que les webhooks sont bien reçus
- [ ] Passer en mode live

---

## 🎉 Résultat

**Stripe est maintenant intégré dans Synrgy !**

✅ Checkout Stripe Checkout pour abonnements récurrents  
✅ Webhooks pour suivre les paiements  
✅ Status endpoint pour vérifier l'abonnement  
✅ Codes de parrainage avec coupons Stripe  
✅ Mode test/production automatique  
✅ Logs clairs et complets  
✅ Sécurité (signature webhooks)  
✅ Build réussi (0 erreur)  

**Le SaaS est prêt à commercialiser ! 🚀**

