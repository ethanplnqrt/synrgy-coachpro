# 🚀 Configuration Stripe en local - Guide complet

## ✅ Script automatique disponible

Un script automatise toute la configuration du tunnel Stripe CLI vers ton backend Synrgy.

---

## 🎯 Méthode automatique (recommandée)

### Prérequis

**1. Installer Stripe CLI** :
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/vX.XX.X/stripe_X.XX.X_linux_x86_64.tar.gz
tar -xvf stripe_*.tar.gz
sudo mv stripe /usr/local/bin/

# Windows
scoop install stripe

# Ou télécharger depuis:
# https://github.com/stripe/stripe-cli/releases
```

**2. Lancer le backend** :
```bash
npm run dev:server
```

Attendre de voir :
```
✅ Synrgy live on http://localhost:5001
```

---

### Lancement du script

**Terminal 1 - Backend (déjà lancé)** :
```bash
npm run dev:server
```

**Terminal 2 - Script Stripe** :
```bash
./setup-stripe-local.sh
```

**Le script va** :
1. ✅ Vérifier que Stripe CLI est installé
2. ✅ Vérifier la connexion Stripe (lance `stripe login` si nécessaire)
3. ✅ Vérifier que le backend est accessible sur :5001
4. ✅ Lancer `stripe listen --forward-to localhost:5001/api/payments/webhook`
5. ✅ Récupérer automatiquement la clé `whsec_...`
6. ✅ Mettre à jour le fichier `.env` avec `STRIPE_WEBHOOK_SECRET`
7. ✅ Afficher les événements webhook en temps réel

**Output attendu** :
```
=== Configuration Stripe CLI pour Synrgy ===

✓ Stripe CLI détecté
✓ Connecté à Stripe
✓ Backend Synrgy détecté sur :5001

Démarrage du tunnel Stripe CLI...

📡 Forwarding webhooks: Stripe → localhost:5001/api/payments/webhook

✓ Clé webhook récupérée: whsec_a1b2c3d4e5f6...

Mise à jour du fichier .env...
✓ STRIPE_WEBHOOK_SECRET ajouté dans .env

==================================
✅ Configuration Stripe CLI terminée !
==================================

Informations:
  • Tunnel actif: Stripe → localhost:5001/api/payments/webhook
  • Webhook secret: whsec_a1b2c3d4e5f6...
  • PID: 12345

Prochaines étapes:
  1. Redémarrer le serveur pour charger la nouvelle clé:
     npm run dev:server

  2. Tester un événement Stripe:
     stripe trigger checkout.session.completed

⚠️  NE PAS FERMER CE TERMINAL
Le tunnel Stripe CLI doit rester actif pour recevoir les webhooks.

Affichage des événements en temps réel...
```

---

### Redémarrer le serveur

**Terminal 3 - Redémarrer le backend** :
```bash
# Ctrl+C pour arrêter le serveur actuel
# Puis relancer:
npm run dev:server
```

**Logs attendus** :
```
✅ Stripe connecté
✅ Synrgy live on http://localhost:5001
```

---

## 🧪 Tester le webhook

**Terminal 4 - Tester** :
```bash
stripe trigger checkout.session.completed
```

**Logs backend attendus** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
✅ Subscription activée pour test@stripe.com (plan: ATHLETE)
   → Subscription ID: test-sub-123
   → Stripe Sub ID: sub_test_xxx
```

**Terminal Stripe CLI** :
```
→   checkout.session.completed  [200 OK]
```

---

## 🛠️ Méthode manuelle

Si tu préfères faire manuellement :

### 1. Vérifier le backend

```bash
curl http://localhost:5001/api/health
# → { "status": "ok" }
```

### 2. Lancer Stripe listen

```bash
stripe listen --forward-to localhost:5001/api/payments/webhook
```

**Output** :
```
> Ready! Your webhook signing secret is whsec_a1b2c3d4e5f6g7h8i9j0
```

### 3. Copier la clé

**Copier** : `whsec_a1b2c3d4e5f6g7h8i9j0`

### 4. Éditer .env manuellement

```bash
# Ouvrir .env
nano .env

# Ajouter ou modifier:
STRIPE_WEBHOOK_SECRET=whsec_a1b2c3d4e5f6g7h8i9j0

# Sauvegarder: Ctrl+O, Enter, Ctrl+X
```

### 5. Redémarrer le serveur

```bash
# Terminal backend: Ctrl+C puis:
npm run dev:server
```

---

## 🔍 Vérification

### Vérifier que le webhook est configuré

```bash
cat .env | grep STRIPE_WEBHOOK_SECRET
```

**Output attendu** :
```
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Vérifier que le serveur est connecté

**Logs backend** :
```
✅ Stripe connecté
```

### Tester un événement

```bash
stripe trigger checkout.session.completed
```

**Backend devrait logger** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
✅ Subscription activée pour test@stripe.com (plan: ATHLETE)
```

---

## 📊 Événements disponibles

### Tester différents événements

```bash
# Paiement réussi
stripe trigger checkout.session.completed

# Paiement récurrent
stripe trigger invoice.payment_succeeded

# Abonnement annulé
stripe trigger customer.subscription.deleted

# Abonnement mis à jour
stripe trigger customer.subscription.updated
```

**Tous les événements apparaîtront** :
- Dans le terminal Stripe CLI
- Dans les logs du backend avec détails

---

## 🔄 Workflow complet

### Terminal 1 - Backend
```bash
npm run dev:server
```

**Logs** :
```
✅ Stripe connecté
✅ Synrgy live on http://localhost:5001
```

### Terminal 2 - Stripe CLI
```bash
./setup-stripe-local.sh
```

**Ou manuellement** :
```bash
stripe listen --forward-to localhost:5001/api/payments/webhook
```

**Reste ouvert** - Le tunnel doit être actif

### Terminal 3 - Frontend
```bash
npm run dev:client
```

### Terminal 4 - Tests
```bash
# Tester un événement
stripe trigger checkout.session.completed

# Ou faire un vrai paiement test
# http://localhost:5173/pricing
# → Choisir une formule
# → Payer avec carte test: 4242 4242 4242 4242
```

---

## 📝 Fichier .env mis à jour

Après le script, ton `.env` contient :

```env
# Autres variables...
JWT_SECRET=xxx
OPENAI_API_KEY=xxx
CODEX_API_KEY=xxx

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_BASIC=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_a1b2c3d4e5f6  # ← Ajouté automatiquement
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Logs attendus

### Au démarrage du script

```
=== Configuration Stripe CLI pour Synrgy ===

✓ Stripe CLI détecté
✓ Connecté à Stripe
✓ Backend Synrgy détecté sur :5001

Démarrage du tunnel Stripe CLI...

📡 Forwarding webhooks: Stripe → localhost:5001/api/payments/webhook

✓ Clé webhook récupérée: whsec_xxx

Mise à jour du fichier .env...
✓ STRIPE_WEBHOOK_SECRET ajouté dans .env

==================================
✅ Configuration Stripe CLI terminée !
==================================
```

### Lors d'un événement webhook

**Stripe CLI** :
```
2024-11-02 10:00:00  →  checkout.session.completed  [200 OK]
```

**Backend** :
```
🔔 Webhook Stripe reçu: checkout.session.completed
✅ Subscription activée pour user@example.com (plan: ATHLETE)
   → Subscription ID: abc-123-def
   → Stripe Sub ID: sub_xxx
```

---

## ⚠️ Important

### ⚠️ Ne pas fermer le terminal Stripe CLI

Le tunnel Stripe CLI doit **rester actif** pour que les webhooks fonctionnent.

Si tu fermes le terminal :
- Les webhooks ne seront plus reçus
- Tu devras relancer le script
- La clé `whsec_...` changera

### ⚠️ La clé change à chaque redémarrage

Chaque fois que tu relances `stripe listen`, une **nouvelle clé** est générée.

Il faut donc :
1. Relancer le script
2. Redémarrer le serveur backend

### ✅ En production

En production, tu configureras un webhook **permanent** dans le Dashboard Stripe, avec une clé fixe `whsec_...`.

---

## 🧪 Test complet

### 1. Setup initial

```bash
# Terminal 1
npm run dev:server

# Terminal 2
./setup-stripe-local.sh
# → Attendre "✅ Configuration terminée"

# Terminal 3 (nouveau terminal)
npm run dev:server
# → Redémarrage avec la nouvelle clé
```

### 2. Tester un événement

```bash
# Terminal 4
stripe trigger checkout.session.completed
```

**Résultat attendu** :
- ✅ Stripe CLI : `[200 OK]`
- ✅ Backend : `✅ Subscription activée`
- ✅ Fichier `server/data/subscriptions.json` mis à jour

### 3. Vérifier l'abonnement

```bash
cat server/data/subscriptions.json | jq
```

**Devrait contenir** :
```json
[
  {
    "id": "xxx",
    "userId": "test-user",
    "planId": "athlete",
    "status": "active",
    "startDate": "2024-11-02T10:00:00.000Z",
    "stripeSubscriptionId": "sub_xxx"
  }
]
```

---

## 💡 Commandes utiles

### Arrêter le tunnel Stripe

```bash
# Trouver le PID
ps aux | grep "stripe listen"

# Tuer le processus
kill <PID>
```

Ou simplement `Ctrl+C` dans le terminal Stripe CLI.

### Nettoyer les logs

```bash
rm /tmp/stripe-listen.log
```

### Réinitialiser .env

```bash
cp .env.example .env
```

---

## ✅ Checklist

Avant de tester les paiements :

- [ ] Stripe CLI installé (`stripe --version`)
- [ ] Connecté à Stripe (`stripe login`)
- [ ] Backend lancé (`npm run dev:server` sur :5001)
- [ ] Script exécuté (`./setup-stripe-local.sh`)
- [ ] Clé `whsec_...` dans `.env`
- [ ] Serveur redémarré avec la nouvelle clé
- [ ] Logs backend : `✅ Stripe connecté`
- [ ] Terminal Stripe CLI ouvert et actif

**Tout est prêt pour tester les paiements ! 🎉**

---

## 🎊 Résultat

Après avoir suivi ces étapes :

✅ Tunnel Stripe CLI actif  
✅ Webhook secret dans `.env`  
✅ Backend redémarré avec la clé  
✅ Webhooks reçus et traités  
✅ Abonnements mis à jour automatiquement  
✅ Logs détaillés pour debug  

**Le système de paiement Stripe local est opérationnel ! 🚀**

