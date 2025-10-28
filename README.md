# CoachPro - Plateforme de Coaching Sportif

Une plateforme SaaS complète inspirée de TrueCoach pour la gestion de programmes d'entraînement, le suivi de clients et le coaching assisté par IA.

## 🎯 Fonctionnalités

### Pour les Coachs
- **Dashboard complet** : Vue d'ensemble de l'activité avec statistiques
- **Gestion des clients** : Ajout, suivi et suppression de clients
- **Création de programmes** : Programmes d'entraînement personnalisés
- **Abonnement Pro** : Débloquer des fonctionnalités avancées via Stripe
- **Coach IA** : Assistant IA pour répondre aux questions des clients

### Pour les Clients
- **Dashboard personnel** : Vue d'ensemble de la progression
- **Programme d'entraînement** : Consultation des exercices assignés
- **Coach IA** : Posez des questions sur l'entraînement et la nutrition
- **Suivi de progression** : Visualisation des exercices complétés

### Technologies

- **Frontend** : React 18 + Vite + TypeScript
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL + Drizzle ORM
- **Authentification** : JWT avec bcrypt
- **IA** : OpenAI GPT-5 via Replit AI Integrations
- **Paiements** : Stripe
- **UI** : TailwindCSS + shadcn/ui
- **State Management** : TanStack Query

## 🚀 Installation

### Prérequis

- Node.js 20+
- Accès à un compte Replit
- Clés API Stripe (pour les paiements)

### Variables d'environnement

Les variables suivantes sont automatiquement configurées par Replit :

```env
# Base de données (auto-configurée par Replit)
DATABASE_URL=...
PGHOST=...
PGPORT=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...

# Authentication
SESSION_SECRET=... (auto-généré par Replit)

# Stripe (à configurer)
VITE_STRIPE_PUBLIC_KEY=pk_... 
STRIPE_SECRET_KEY=sk_...

# OpenAI via Replit AI Integrations (auto-configuré)
AI_INTEGRATIONS_OPENAI_BASE_URL=...
AI_INTEGRATIONS_OPENAI_API_KEY=...
```

### Lancement du projet

1. **Cloner le projet sur Replit**

2. **Configurer les secrets Stripe** :
   - Allez sur https://dashboard.stripe.com/apikeys
   - Copiez votre "Publishable key" → `VITE_STRIPE_PUBLIC_KEY`
   - Copiez votre "Secret key" → `STRIPE_SECRET_KEY`

3. **Initialiser la base de données** :
   ```bash
   npm run db:push
   ```

4. **Lancer l'application** :
   ```bash
   npm run dev
   ```

L'application sera accessible sur `http://localhost:5000`

## 📖 Utilisation

### Première connexion

1. **Créer un compte Coach** :
   - Cliquez sur "Inscription"
   - Sélectionnez "Coach"
   - Remplissez le formulaire

2. **Ajouter des clients** :
   - Connectez-vous comme coach
   - Allez dans "Mes clients"
   - Cliquez sur "Ajouter un client"

3. **Créer un programme** :
   - Allez dans "Programmes"
   - Cliquez sur "Nouveau programme"
   - Assignez-le à un client

4. **Tester le Coach IA** :
   - Allez dans "Coach IA" ou "Messages IA"
   - Posez des questions sur l'entraînement

### Upgrade vers Pro

1. Connectez-vous comme coach
2. Allez dans "Abonnement"
3. Complétez le processus de paiement Stripe
4. Profitez de toutes les fonctionnalités Pro !

## 🏗️ Architecture

### Structure du projet

```
/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── lib/            # Utilitaires (queryClient)
│   │   └── App.tsx         # Point d'entrée
│   └── index.html
│
├── server/                 # Backend Express
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche de persistance
│   ├── db.ts              # Configuration DB
│   └── openai.ts          # Intégration OpenAI
│
├── shared/                # Code partagé
│   └── schema.ts          # Schémas de données
│
└── design_guidelines.md   # Guide de design
```

### API Routes

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur courant
- `POST /api/auth/logout` - Déconnexion

#### Clients
- `GET /api/clients` - Liste des clients du coach
- `POST /api/clients` - Créer un client
- `DELETE /api/clients/:id` - Supprimer un client

#### Programmes
- `GET /api/programs` - Liste des programmes
- `GET /api/programs/my-programs` - Programmes du client
- `POST /api/programs` - Créer un programme
- `DELETE /api/programs/:id` - Supprimer un programme

#### Exercices
- `GET /api/exercises/:programId` - Exercices d'un programme
- `POST /api/exercises` - Créer un exercice

#### Messages IA
- `GET /api/messages` - Historique des messages
- `POST /api/messages` - Envoyer un message au coach IA

#### Stripe
- `POST /api/get-or-create-subscription` - Créer/récupérer un abonnement

## 🎨 Design

Le design suit les principes de **design_guidelines.md** :
- Système de design cohérent avec shadcn/ui
- Palette de couleurs professionnelle
- Typography hiérarchisée (Inter + JetBrains Mono)
- Espacement et layout consistants
- Interactions subtiles et élégantes
- Support dark mode automatique

## 🔒 Sécurité

- **Mots de passe** : Hachage avec bcrypt (10 rounds)
- **Authentification** : JWT stocké en localStorage
- **Sessions** : SECRET_KEY requis (auto-généré)
- **Base de données** : Variables d'environnement sécurisées
- **Stripe** : Clés séparées (publique/secrète)

## 🧪 Tests

Pour tester manuellement l'application :

1. **Créer un compte coach** et un compte client
2. **Ajouter des clients** depuis le compte coach
3. **Créer un programme** et l'assigner
4. **Tester le chat IA** avec différentes questions
5. **Essayer l'upgrade Pro** (mode test Stripe)

## 📦 Déploiement

L'application est prête pour le déploiement sur Replit :

1. Cliquez sur "Deploy" dans l'interface Replit
2. L'application sera automatiquement déployée avec un domaine `.replit.app`
3. Tous les secrets seront automatiquement inclus

## 🤝 Support

Pour toute question ou problème :
- Consultez la documentation Replit
- Vérifiez que toutes les variables d'environnement sont configurées
- Assurez-vous que la base de données est bien initialisée

## 📝 Licence

Ce projet est un exemple/template pour une plateforme de coaching sportif.

---

Développé avec ❤️ sur Replit
