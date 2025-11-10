# ⚡ Synrgy Quick Start Guide

## 🚀 Démarrage Rapide (2 min)

### 1. Configuration Stripe (une fois)

```bash
./setup-stripe-env.sh
```

### 2. Lancer Synrgy

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 3. Tests Automatisés (optionnel)

```bash
npm run pretest
```

---

## 🎯 URLs Principales

- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:5001
- **Pricing** : http://localhost:5173/pricing
- **Dashboard Coach** : http://localhost:5173/coach/dashboard
- **Dashboard Client** : http://localhost:5173/client/dashboard

---

## 🧪 Test Complet (5 min)

### Coach
```
1. http://localhost:5173/login → S'inscrire comme "coach"
2. http://localhost:5173/coach/dashboard → Voir code SYNRGY-XXXX
3. Copier le code de parrainage
```

### Client avec Code
```
1. Déconnexion → Créer compte "client"
2. http://localhost:5173/pricing → Choisir Athlète 19€
3. Entrer code SYNRGY-XXXX → Valider → Prix passe à 15.20€
4. Payer avec carte test : 4242 4242 4242 4242
5. http://localhost:5173/subscription → Voir "Actif ✅"
```

### Vérification Coach
```
1. Retour dashboard coach
2. Section Parrainage → Stats mises à jour
   - Clients référés : 1
   - Commissions : 1.90€
```

---

## 📋 Commandes Utiles

```bash
# Configuration
./setup-stripe-env.sh          # Configure Stripe

# Démarrage
npm run dev:server             # Backend
npm run dev:client             # Frontend

# Tests
npm run review                 # IA Review
npm run qa                     # Diagnostics
npm run pretest                # Test complet

# Build
npm run build                  # Compilation

# Données
cat server/data/users.json | jq
cat server/data/subscriptions.json | jq
cat server/data/referrals.json | jq
```

---

## 🎯 Systèmes Actifs

✅ **Stripe** - Paiements pour 3 formules  
✅ **Parrainage** - Codes SYNRGY-XXXX avec -20%  
✅ **Subscriptions** - Gestion automatique  
✅ **Testing** - Validation automatique  
✅ **Dashboards** - Stats en temps réel  

---

## 📚 Documentation

**Guides complets** (16) :
- Stripe : 6 guides
- Subscriptions : 3 guides
- Parrainage : 1 guide
- Testing : 2 guides
- Session : 4 guides

**Voir** : Liste complète dans le README principal

---

## 🎊 Ready !

**Synrgy est prêt pour le Go-to-Market !**

✅ Build OK (0 erreur)  
✅ Tests automatisés  
✅ Documentation complète  
✅ Production-ready  

**Commande finale** : `npm run pretest` 🚀

