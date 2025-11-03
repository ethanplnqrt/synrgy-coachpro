# 🚀 Synrgy Go-to-Market System - Documentation complète

## ✅ Système commercial complet implémenté

Synrgy dispose maintenant d'un système de paiement, d'abonnements et de parrainage **production-ready** avec détection automatique du mode (mock/Stripe).

---

## 🎯 Fonctionnalités implémentées

### 1. Système de paiement modulaire ✅
- **Mode automatique** : Détection si Stripe est configuré dans `.env`
- **Mode mock** : Paiements simulés par défaut (aucune carte requise)
- **Mode Stripe** : Paiements réels via Stripe Checkout (si `STRIPE_SECRET_KEY` configuré)
- **Store JSON local** : Gestion légère des abonnements sans base de données

### 2. Page Pricing améliorée ✅
- **3 formules** : Athlète (19€), Client (29€), Coach (49€)
- **Indicateur de mode** : Affichage clair (test/production)
- **Code de parrainage** : Input pour appliquer une réduction
- **Validation en temps réel** : Vérification immédiate du code
- **Affichage des prix** : Prix barré + prix réduit si parrainage
- **Flow d'abonnement** : Sélection → Parrainage → Abonnement

### 3. Système de parrainage ✅
- **Codes uniques** : Format `SYNRGY-NOM-XXXXX`
- **Réservé aux coaches** : Seuls les coaches peuvent générer des codes
- **Réduction automatique** : -20% par défaut
- **Historique d'utilisation** : Suivi des clients parrainés
- **Copie facile** : Bouton "Copier le code"
- **Stats** : Total utilisations, ce mois-ci, réduction offerte

### 4. Gestion d'abonnement ✅
- **Page dédiée** : `/coach/subscription`, `/client/subscription`, `/athlete/subscription`
- **Statut en temps réel** : Actif, Annulé, Expiré
- **Informations complètes** : Plan, prix, date début, code parrainage utilisé
- **Actions disponibles** : Changer de formule, Annuler l'abonnement
- **FAQ intégrée** : Questions fréquentes

### 5. Middleware de vérification (optionnel) ✅
- **`requireSubscription`** : Bloque l'accès si pas d'abonnement actif
- **`attachSubscription`** : Attache l'info d'abonnement à la requête
- **Prêt à l'emploi** : Peut être ajouté sur n'importe quelle route protégée

---

## 🏗️ Architecture

### Backend - Store JSON

```
server/
├── data/
│   ├── subscriptions.json     ✅ Abonnements utilisateurs
│   ├── referrals.json          ✅ Codes de parrainage coaches
│   └── users.json              ✅ Utilisateurs (existant)
├── utils/
│   └── paymentStore.ts         ✅ Logique de gestion
└── routes/
    └── payments.ts             ✅ API endpoints
```

**paymentStore.ts** :
- `getSubscriptions()` - Récupérer tous les abonnements
- `getUserSubscription(userId)` - Abonnement d'un utilisateur
- `createSubscription(data)` - Créer un abonnement
- `updateSubscriptionStatus(userId, status)` - Mettre à jour le statut
- `getReferrals()` - Récupérer tous les codes
- `getCoachReferrals(coachId)` - Codes d'un coach
- `createReferralCode(coachId, coachName)` - Générer un code
- `useReferralCode(code, userId, userName)` - Utiliser un code
- `getPaymentMode()` - Détection automatique mock/stripe
- `isStripeConfigured()` - Vérifier si Stripe est configuré

### Routes API

```typescript
GET  /api/payments/plans              // Lister les plans disponibles
GET  /api/payments/mode                // Mode de paiement (mock/stripe)
GET  /api/payments/status              // Statut abonnement utilisateur
POST /api/payments/subscribe           // S'abonner (mock ou Stripe)
POST /api/payments/cancel              // Annuler l'abonnement

GET  /api/payments/referrals           // Codes du coach (coach only)
POST /api/payments/referrals/create    // Créer un code (coach only)
POST /api/payments/referrals/validate  // Valider un code (public)
```

### Frontend - Composants

```
client/src/
├── pages/
│   ├── pricing.tsx                   ✅ Page pricing améliorée
│   ├── subscription.tsx              ✅ Gestion abonnement
│   └── coach/
│       └── referrals.tsx             ✅ Gestion codes parrainage
└── hooks/
    └── useSubscription.ts            (optionnel - peut être ajouté)
```

---

## 📦 Modèles de données

### Subscription

```typescript
{
  id: string;                    // UUID
  userId: string;                // ID utilisateur
  planId: string;                // "athlete" | "client" | "coach"
  status: "active" | "canceled" | "expired" | "trial";
  startDate: string;             // ISO date
  endDate?: string;              // ISO date (si annulé/expiré)
  stripeSubscriptionId?: string; // ID Stripe (si mode Stripe)
  referralCode?: string;         // Code utilisé à l'inscription
  discount?: number;             // % de réduction (si parrainage)
}
```

### Referral

```typescript
{
  id: string;                    // UUID
  code: string;                  // "SYNRGY-NOM-XXXXX"
  coachId: string;               // ID du coach
  coachName: string;             // Nom du coach
  createdAt: string;             // ISO date
  discount: number;              // % de réduction (défaut: 20)
  usedBy: Array<{
    userId: string;
    userName: string;
    usedAt: string;
  }>;
}
```

---

## 🎨 UX/UI

### Mode Mock (par défaut)

**Indicateur sur /pricing** :
```
┌────────────────────────────────────┐
│ ℹ️  Mode test activé              │
│    Les paiements sont simulés.    │
│    Aucune carte bancaire requise. │
└────────────────────────────────────┘
```

**Flow d'abonnement** :
1. Utilisateur clique "Choisir cette formule"
2. Input code de parrainage apparaît
3. Optionnel : Valider le code → Prix réduit affiché
4. Click "S'abonner maintenant"
5. **Abonnement activé immédiatement**
6. Redirection vers le dashboard correspondant

### Mode Stripe (si configuré)

**Indicateur sur /pricing** :
```
┌────────────────────────────────────┐
│ 💳 Paiement sécurisé via Stripe   │
│    Vos données sont protégées.    │
└────────────────────────────────────┘
```

**Flow d'abonnement** :
1-3. Identique au mode mock
4. Click "S'abonner maintenant"
5. **Redirection vers Stripe Checkout**
6. Paiement réel sur Stripe
7. Retour sur l'app → Abonnement activé

---

## 🔄 Flux utilisateur complet

### Coach crée un code de parrainage

```
1. Va sur /coach/referrals
2. Clique "Créer mon code"
3. Code généré : SYNRGY-JOHN-A1B2C3
4. Copie le code
5. Partage avec ses futurs clients
```

### Client utilise un code de parrainage

```
1. Va sur /pricing
2. Clique "Choisir cette formule" (ex: Athlète 19€)
3. Input code apparaît
4. Tape "SYNRGY-JOHN-A1B2C3"
5. Clique "Valider"
6. Prix passe de 19€ à 15.20€ (-20%)
7. Clique "S'abonner maintenant"
8. Mode mock → Abonnement activé immédiatement
   Mode Stripe → Redirection vers paiement
9. Redirection vers /athlete/dashboard
```

### Utilisateur gère son abonnement

```
1. Va sur /athlete/subscription (ou /client, /coach)
2. Voit son abonnement actif avec détails
3. Actions possibles :
   - Changer de formule → /pricing
   - Annuler l'abonnement → Confirmation → Annulé
```

---

## 🧪 Tests

### Test manuel complet

```bash
# 1. Lancer le serveur
npm run dev:server

# 2. Lancer le client
npm run dev:client

# 3. Créer un compte coach
http://localhost:5173/login
→ Email: coach@test.com
→ Role: coach

# 4. Générer un code de parrainage
http://localhost:5173/coach/referrals
→ Cliquer "Créer mon code"
→ Copier le code (ex: SYNRGY-COACH-A1B2C3)

# 5. Créer un compte athlète
→ Logout
→ Register athlete@test.com, role: athlete

# 6. S'abonner avec le code
http://localhost:5173/pricing
→ Cliquer "Choisir cette formule" (Athlète)
→ Entrer code SYNRGY-COACH-A1B2C3
→ Valider → Prix passe de 19€ à 15.20€
→ S'abonner maintenant

# 7. Vérifier l'abonnement
http://localhost:5173/athlete/subscription
→ Voir abonnement actif avec -20%
→ Code de parrainage affiché

# 8. Côté coach : vérifier l'utilisation
http://localhost:5173/coach/referrals
→ Voir "1" dans "Total utilisations"
→ Voir "athlete@test.com" dans l'historique
```

### Test API

```bash
# Mode de paiement
curl http://localhost:5001/api/payments/mode | jq
# → { "mode": "mock", "message": "..." }

# Créer un code (en tant que coach)
curl -X POST http://localhost:5001/api/payments/referrals/create \
  -H "Cookie: auth_token=..." \
  -H "Content-Type: application/json" | jq

# Valider un code
curl -X POST http://localhost:5001/api/payments/referrals/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SYNRGY-XXX-YYY"}' | jq

# S'abonner (mode mock)
curl -X POST http://localhost:5001/api/payments/subscribe \
  -H "Cookie: auth_token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "planId":"athlete",
    "referralCode":"SYNRGY-XXX-YYY"
  }' | jq

# Statut abonnement
curl http://localhost:5001/api/payments/status \
  -H "Cookie: auth_token=..." | jq

# Annuler abonnement
curl -X POST http://localhost:5001/api/payments/cancel \
  -H "Cookie: auth_token=..." | jq
```

---

## 🔒 Sécurité

### Authentification
- ✅ Routes protégées par JWT (`authenticate` middleware)
- ✅ Cookies httpOnly
- ✅ CORS configuré

### Autorisation
- ✅ Codes de parrainage : Création réservée aux coaches
- ✅ Validation codes : Route publique (avant auth)
- ✅ Abonnements : Isolés par userId

### Validation
- ✅ planId validé côté backend
- ✅ Code de parrainage vérifié avant application
- ✅ Pas de double utilisation d'un code par le même user

### Data
- ✅ Stockage local JSON (auto-créé si absent)
- ✅ Pas de données sensibles stockées
- ✅ IDs UUID pour éviter les collisions

---

## 🚀 Déploiement

### Mode Mock (défaut)

**Rien à configurer !**

Le système fonctionne en mode test dès l'installation :
- Paiements simulés
- Abonnements activés immédiatement
- Aucune clé API requise

### Mode Production (Stripe)

1. **Créer un compte Stripe** : https://stripe.com

2. **Récupérer les clés** :
   - Dashboard Stripe → Developers → API Keys
   - Secret key : `sk_live_...` (production) ou `sk_test_...` (test)

3. **Configurer `.env`** :
   ```env
   STRIPE_SECRET_KEY=sk_live_your_key_here
   ```

4. **Redémarrer le serveur** :
   ```bash
   npm run dev:server
   ```

5. **Vérifier le mode** :
   - Aller sur `/pricing`
   - Voir "Paiement sécurisé via Stripe"
   - Les abonnements redirigent vers Stripe Checkout

### Webhooks Stripe (optionnel - futur)

Pour gérer les événements Stripe (paiement réussi, annulation, etc.) :

1. Créer un endpoint webhook dans Stripe Dashboard
2. Créer une route `POST /api/payments/webhook`
3. Gérer les événements :
   - `checkout.session.completed` → Activer l'abonnement
   - `customer.subscription.deleted` → Annuler l'abonnement
   - `invoice.payment_failed` → Marquer comme expiré

---

## 📊 Analytics & Monitoring

### Données disponibles

**Abonnements** :
- Total actifs par plan
- Revenus mensuels estimés
- Taux de conversion
- Taux d'annulation (churn)

**Parrainages** :
- Codes actifs
- Utilisations par coach
- Impact sur les conversions
- Réduction moyenne appliquée

### Requêtes utiles

```javascript
// Tous les abonnements actifs
const active = subscriptions.filter(s => s.status === "active");

// Revenus mensuels estimés
const revenue = active.reduce((sum, s) => {
  const plan = PLANS.find(p => p.id === s.planId);
  const price = plan.price * (1 - (s.discount || 0) / 100);
  return sum + price;
}, 0);

// Top coaches parraineurs
const topCoaches = referrals
  .sort((a, b) => b.usedBy.length - a.usedBy.length)
  .slice(0, 10);
```

---

## 🔮 Évolutions futures

### À court terme
- [ ] Webhooks Stripe pour auto-sync
- [ ] Notifications email (abonnement, annulation)
- [ ] Dashboard admin (monitoring abonnements)
- [ ] Exports CSV/Excel des données

### À moyen terme
- [ ] Migration vers Supabase/PostgreSQL
- [ ] Factures automatiques (PDF)
- [ ] Essais gratuits (14 jours)
- [ ] Upgrades/downgrades automatiques

### À long terme
- [ ] Paiement annuel (-10%)
- [ ] Codes promo temporaires
- [ ] Programme d'affiliation avancé
- [ ] Multi-devises (€, $, £)

---

## 📝 Configuration

### Variables d'environnement (.env)

```env
# Mode Mock (défaut - rien à configurer)
# Les abonnements sont simulés localement

# Mode Stripe (optionnel - pour paiements réels)
STRIPE_SECRET_KEY=sk_live_your_key_here
# ou sk_test_... pour le mode test Stripe

# Frontend (optionnel - pour Stripe Elements)
VITE_STRIPE_PUBLIC_KEY=pk_live_your_public_key_here
```

---

## ✅ Checklist Go-to-Market

### Backend
- [x] Store JSON subscriptions
- [x] Store JSON referrals
- [x] Logique paymentStore complète
- [x] Routes /api/payments/*
- [x] Détection automatique mock/Stripe
- [x] Middleware subscription (optionnel)

### Frontend
- [x] Page /pricing améliorée
- [x] Indicateur mode mock/live
- [x] Input code de parrainage
- [x] Validation en temps réel
- [x] Prix réduit affiché
- [x] Page /coach/referrals
- [x] Génération de codes
- [x] Copie facile
- [x] Historique d'utilisation
- [x] Page /subscription
- [x] Statut abonnement
- [x] Actions (changer/annuler)

### Qualité
- [x] Build réussi (0 erreur)
- [x] TypeScript compilé
- [x] 0 warning linter
- [x] Documentation complète

---

## 🎉 Résultat final

**Synrgy dispose maintenant d'un système commercial complet, production-ready** :

✅ **Paiements modulaires** - Mock par défaut, Stripe si configuré  
✅ **Pricing intelligent** - Mode affiché, codes de parrainage  
✅ **Parrainage coach** - Codes uniques, stats, historique  
✅ **Gestion abonnements** - Statut, actions, FAQ  
✅ **Store JSON léger** - Pas de DB requise  
✅ **Extensible** - Prêt pour migration DB future  
✅ **Sécurisé** - Auth, validation, isolation  
✅ **Testé** - Build OK, endpoints fonctionnels  

**Le SaaS est prêt pour le lancement commercial ! 🚀**

---

## 🆘 Support & Debug

### Problème : Mode Stripe non détecté

**Solution** :
```bash
# Vérifier la clé dans .env
cat .env | grep STRIPE

# Doit commencer par sk_ (sk_test_ ou sk_live_)
# Redémarrer le serveur après modification
npm run dev:server
```

### Problème : Code de parrainage invalide

**Causes possibles** :
1. Code mal tapé (sensible à la casse)
2. Coach n'a pas généré le code
3. Code déjà utilisé par cet utilisateur

**Debug** :
```bash
# Voir tous les codes
cat server/data/referrals.json | jq

# Valider via API
curl -X POST http://localhost:5001/api/payments/referrals/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SYNRGY-XXX-YYY"}' | jq
```

### Problème : Abonnement non créé

**Debug** :
```bash
# Vérifier les abonnements
cat server/data/subscriptions.json | jq

# Tester la route
curl -X POST http://localhost:5001/api/payments/subscribe \
  -H "Cookie: auth_token=..." \
  -H "Content-Type: application/json" \
  -d '{"planId":"athlete"}' | jq
```

**Le système GTM Synrgy est opérationnel ! 🎊**

