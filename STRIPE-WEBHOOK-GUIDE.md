# 🔔 Guide Webhook Stripe - Mise à jour automatique des abonnements

## ✅ Système de synchronisation automatique

Le webhook Stripe met automatiquement à jour le statut d'abonnement des utilisateurs en temps réel.

---

## 🔄 Flow complet

### 1. Utilisateur paie sur Stripe

```
Client clique "Payer avec Stripe"
→ Redirection vers Stripe Checkout
→ Client entre ses informations bancaires
→ Paiement validé ✅
```

### 2. Stripe envoie `checkout.session.completed`

**Webhook reçu** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
```

**Traitement** :
```typescript
// Extraction des métadatas
const userId = session.metadata.userId;
const planId = session.metadata.planId;
const referralCode = session.metadata.referralCode;

// Création de l'abonnement
createSubscription({
  userId,
  planId,
  status: "active",
  startDate: new Date().toISOString(),
  stripeSubscriptionId: session.subscription,
  referralCode: referralCode || undefined,
  discount: calculatedDiscount
});
```

**Log** :
```
✅ Subscription activée pour user@example.com (plan: ATHLETE)
   → Subscription ID: abc-123-def
   → Stripe Sub ID: sub_xxx
   → Réduction: -20% (si code parrainage)
```

**Résultat** :
- `server/data/subscriptions.json` mis à jour
- `subscription.status = "active"`
- Code de parrainage marqué comme utilisé

---

### 3. Paiements récurrents mensuels

**Stripe envoie** : `invoice.payment_succeeded`

**Log** :
```
🔔 Webhook Stripe reçu: invoice.payment_succeeded
✅ Paiement récurrent réussi : sub_xxx
```

**Traitement** :
- Confirmation que l'abonnement est toujours actif
- Pas de modification nécessaire du statut

---

### 4. Client annule son abonnement

**Stripe envoie** : `customer.subscription.deleted`

**Traitement** :
```typescript
const userId = subscription.metadata.userId;
updateSubscriptionStatus(userId, "canceled");
```

**Log** :
```
🔔 Webhook Stripe reçu: customer.subscription.deleted
❌ Subscription annulée pour userId: user-id-123
   → Subscription ID: abc-123-def
   → Plan: ATHLETE
   → Date fin: 2024-11-02T10:00:00.000Z
```

**Résultat** :
- `subscription.status = "canceled"`
- `subscription.endDate = Date.now()`
- L'utilisateur perd l'accès aux fonctionnalités premium

---

### 5. Abonnement réactivé

**Stripe envoie** : `customer.subscription.updated`

**Cas 1 : Réactivation**
```
✅ Subscription réactivée pour userId: user-id-123
   → Plan: ATHLETE
```

**Cas 2 : Désactivation**
```
⚠️  Subscription désactivée (status: past_due) pour userId: user-id-123
```

---

## 📊 Vérification du statut

### Frontend : GET `/api/payments/status/:userId`

```javascript
const res = await fetch(`/api/payments/status/${userId}`, {
  credentials: "include"
});
const data = await res.json();

// Response:
{
  "success": true,
  "active": true,
  "plan": "athlete",
  "lastPayment": "2024-11-02T10:00:00.000Z",
  "discount": 20,
  "referralCode": "SYNRGY-XXX-YYY"
}
```

### Backend : `getUserSubscription(userId)`

```typescript
import { getUserSubscription } from "./utils/paymentStore.js";

const subscription = getUserSubscription(userId);

if (subscription && subscription.status === "active") {
  // User has active subscription
  console.log(`User ${userId} has active ${subscription.planId} plan`);
} else {
  // User has no active subscription
  console.log(`User ${userId} has no active subscription`);
}
```

---

## 🔒 Sécurité Webhook

### Vérification de signature

```typescript
const signature = req.headers["stripe-signature"];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  STRIPE_WEBHOOK_SECRET
);
```

**Si signature invalide** :
```
⚠️  Webhook signature verification failed: Invalid signature
→ 400 Bad Request
```

**Si signature valide** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
```

### Raw Body Required

Le webhook nécessite le **raw body** pour vérifier la signature :

```typescript
// server/index.ts
app.use("/api/payments/webhook", bodyParser.raw({ type: "application/json" }));
```

---

## 🧪 Test du Webhook

### En local avec Stripe CLI

```bash
# 1. Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# 2. Login
stripe login

# 3. Forward webhooks vers localhost
stripe listen --forward-to localhost:5001/api/payments/webhook

# Output:
# > Ready! Your webhook signing secret is whsec_xxx
# Copier ce secret dans .env : STRIPE_WEBHOOK_SECRET=whsec_xxx

# 4. Déclencher un événement test
stripe trigger checkout.session.completed
```

**Logs serveur attendus** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
✅ Subscription activée pour test@stripe.com (plan: ATHLETE)
   → Subscription ID: test-sub-123
   → Stripe Sub ID: sub_test_xxx
```

### En production

**Dashboard Stripe** → **Developers** → **Webhooks** → **Add endpoint**

**URL** :
```
https://your-domain.com/api/payments/webhook
```

**Events** :
- ✅ `checkout.session.completed`
- ✅ `invoice.payment_succeeded`
- ✅ `customer.subscription.deleted`
- ✅ `customer.subscription.updated`

**Signing Secret** : Copier dans `.env`

---

## 📝 Logs détaillés

### Checkout Session Created

```
💳 Checkout Stripe créée pour user@example.com
   → Plan: ATHLETE
   → Session ID: cs_test_xxx
   → Code parrainage: SYNRGY-JOHN-A1B2C3 (-20%)
```

### Payment Successful

```
🔔 Webhook Stripe reçu: checkout.session.completed
✅ Subscription activée pour user@example.com (plan: ATHLETE)
   → Subscription ID: abc-123-def
   → Stripe Sub ID: sub_xxx
   → Réduction: -20%
📢 Code parrainage SYNRGY-JOHN-A1B2C3 utilisé par user@example.com
```

### Recurring Payment

```
🔔 Webhook Stripe reçu: invoice.payment_succeeded
✅ Paiement récurrent réussi : sub_xxx
```

### Subscription Canceled

```
🔔 Webhook Stripe reçu: customer.subscription.deleted
❌ Subscription annulée pour userId: user-id-123
   → Subscription ID: abc-123-def
   → Plan: ATHLETE
   → Date fin: 2024-12-02T10:00:00.000Z
```

### Subscription Reactivated

```
🔔 Webhook Stripe reçu: customer.subscription.updated
✅ Subscription réactivée pour userId: user-id-123
   → Plan: ATHLETE
```

---

## 🎯 Gestion des erreurs

### Metadata manquantes

```
🔔 Webhook Stripe reçu: checkout.session.completed
❌ Missing userId or planId in session metadata
```

**Solution** : Vérifier que le checkout session contient bien les metadata :
```typescript
metadata: {
  userId: user.id,
  planId: plan,
  referralCode: referralCode || ""
}
```

### Abonnement non trouvé

```
🔔 Webhook Stripe reçu: customer.subscription.deleted
⚠️  Aucun abonnement actif trouvé pour userId: user-id-123
```

**Cause** : L'abonnement a déjà été annulé ou n'existe pas.

### Signature invalide

```
⚠️  Webhook signature verification failed: No signatures found matching the expected signature
```

**Solution** : Vérifier que `STRIPE_WEBHOOK_SECRET` est correct dans `.env`.

---

## 📊 Données stockées

### `server/data/subscriptions.json`

```json
[
  {
    "id": "abc-123-def",
    "userId": "user-id-123",
    "planId": "athlete",
    "status": "active",
    "startDate": "2024-11-02T10:00:00.000Z",
    "stripeSubscriptionId": "sub_xxx",
    "referralCode": "SYNRGY-JOHN-A1B2C3",
    "discount": 20
  }
]
```

### Statuts possibles

- `"active"` - Abonnement actif et payé
- `"canceled"` - Abonnement annulé
- `"expired"` - Abonnement expiré (pas utilisé actuellement)
- `"trial"` - Période d'essai (pas utilisé actuellement)

---

## ✅ Checklist intégration

**Backend** :
- [x] Webhook configuré dans `server/routes/payments.ts`
- [x] Vérification signature Stripe
- [x] Gestion `checkout.session.completed`
- [x] Gestion `customer.subscription.deleted`
- [x] Gestion `customer.subscription.updated`
- [x] Logs détaillés pour chaque événement
- [x] Mise à jour automatique du store
- [x] Codes de parrainage marqués comme utilisés

**Stripe** :
- [ ] Webhook configuré dans Dashboard Stripe
- [ ] Events sélectionnés
- [ ] Signing Secret copié dans `.env`
- [ ] URL de production configurée

**Test** :
- [ ] Test local avec Stripe CLI
- [ ] Événement `checkout.session.completed` testé
- [ ] Événement `customer.subscription.deleted` testé
- [ ] Logs vérifiés
- [ ] Statut vérifié via `/api/payments/status/:userId`

---

## 🎉 Résultat

**Le système de synchronisation automatique est opérationnel !**

✅ Paiement Stripe → Abonnement activé immédiatement  
✅ Annulation Stripe → Abonnement désactivé automatiquement  
✅ Logs détaillés pour chaque événement  
✅ Sécurité (vérification signature)  
✅ Codes de parrainage gérés automatiquement  
✅ Status endpoint pour vérifier l'état  

**Les utilisateurs ont accès aux fonctionnalités dès le paiement réussi ! 🚀**

