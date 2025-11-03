# 🤖 Codex AI Engine - Intégration complète

## ✅ Intégration réussie

Codex est maintenant intégré de manière propre et stable dans Synrgy comme **moteur IA interne**.

---

## 📁 Architecture Codex

```
server/
├── ai/
│   ├── codex/
│   │   └── index.ts          ✅ Moteur Codex principal
│   └── promptBuilder.ts      ✅ Builder prompts chat
│
├── routes/
│   └── codex.ts              ✅ Endpoints Codex API
│
└── index.ts                  ✅ Route /api/codex montée

client/
└── src/
    └── utils/
        └── aiClient.ts       ✅ Client frontend Codex
```

---

## 🔧 Backend - Module Codex

### `server/ai/codex/index.ts`

**Fonction principale** :
```typescript
queryCodex(prompt: string, context?: CodexContext): Promise<string>
```

**Fonctionnalités** :
- ✅ Appel API OpenAI (ou Codex dédié)
- ✅ Gestion du contexte utilisateur (rôle, historique)
- ✅ Mode fallback si pas de clé API
- ✅ Gestion d'erreurs robuste (timeout, rate limit, auth)
- ✅ System messages adaptés par rôle

**Contexte supporté** :
```typescript
interface CodexContext {
  role?: "coach" | "client" | "athlete";
  userId?: string;
  history?: Array<{ role: string; content: string }>;
  [key: string]: any;
}
```

**Mode fallback** :
Si `CODEX_API_KEY` n'est pas configurée, Codex retourne des réponses génériques intelligentes basées sur des patterns (motivation, programme, nutrition).

---

## 🛣️ Routes API

### POST /api/codex
**Query Codex engine**

Request:
```json
{
  "prompt": "Génère un plan d'entraînement 3 jours",
  "context": {
    "goal": "prise de masse",
    "level": "intermédiaire"
  }
}
```

Response:
```json
{
  "success": true,
  "result": "Voici un programme 3 jours optimal...",
  "configured": true
}
```

**Authentification** : Optionnelle (enrichit le contexte si user connecté)

### GET /api/codex/status
**Check Codex configuration**

Response:
```json
{
  "success": true,
  "configured": true,
  "model": "gpt-4o-mini",
  "fallbackMode": false
}
```

---

## 💻 Frontend - Client Codex

### `client/src/utils/aiClient.ts`

**Fonctions disponibles** :

#### 1. askCodex()
```typescript
const response = await askCodex(
  "Comment améliorer mon développé couché ?",
  { role: "athlete" }
);

if (response.success) {
  console.log(response.result);
}
```

#### 2. getCodexStatus()
```typescript
const status = await getCodexStatus();
console.log(`Codex configured: ${status.configured}`);
```

#### 3. getMotivation()
```typescript
const message = await getMotivation("athlete");
// "Continue comme ça ! 💪"
```

#### 4. generateTrainingPlan()
```typescript
const plan = await generateTrainingPlan(
  "prise de masse",
  "intermédiaire",
  3,
  "athlete"
);
```

#### 5. generateNutritionPlan()
```typescript
const nutrition = await generateNutritionPlan(
  2500,
  "prise de masse",
  "athlete"
);
```

---

## 🔐 Configuration

### Variables d'environnement

Ajoute dans `.env` :
```bash
# Codex AI Engine (utilise OpenAI par défaut)
CODEX_API_KEY=sk-your-api-key-here
CODEX_API_URL=https://api.openai.com/v1/chat/completions
CODEX_MODEL=gpt-4o-mini
```

**Note** : Si `CODEX_API_KEY` n'est pas définie, Codex fonctionne en **mode fallback** avec des réponses génériques.

---

## 🎯 Cas d'usage

### 1. Génération de programmes

```typescript
// Dans une page coach ou athlete
import { askCodex } from "@/utils/aiClient";

const handleGenerateProgram = async () => {
  const response = await askCodex(
    "Crée un programme PPL 6 jours pour hypertrophie",
    { 
      role: user.role,
      goal: "hypertrophie",
      frequency: 6
    }
  );
  
  if (response.success) {
    setProgramContent(response.result);
  }
};
```

### 2. Conseils nutrition

```typescript
const getNutritionAdvice = async () => {
  const response = await askCodex(
    `Calcule mes macros pour ${calories} kcal en prise de masse`,
    { role: "athlete" }
  );
  
  setNutritionAdvice(response.result);
};
```

### 3. Motivation personnalisée

```typescript
import { getMotivation } from "@/utils/aiClient";

const motivationMessage = await getMotivation(user.role);
toast({ title: motivationMessage });
```

### 4. Analyse de progression

```typescript
const analyzeProgress = async (data: any) => {
  const response = await askCodex(
    "Analyse cette progression et donne des recommandations",
    {
      role: "coach",
      data: {
        weight: [70, 71, 72, 71.5],
        performance: [80, 85, 90, 92]
      }
    }
  );
  
  return response.result;
};
```

---

## 🔄 Différence avec /api/chat

### /api/chat (existant)
- Conversation continue avec historique
- Sauvegarde des messages dans db.json
- Authentification requise
- Contexte conversationnel maintenu

### /api/codex (nouveau)
- Queries one-shot pour génération
- Pas de sauvegarde automatique
- Auth optionnelle (enrichit le contexte)
- Idéal pour : plans, conseils, analyses

**Complémentarité** : Chat pour conversation, Codex pour génération.

---

## 🛡️ Sécurité & Robustesse

### Gestion d'erreurs
```typescript
✅ 401 - Invalid API key → "Invalid Codex API key"
✅ 429 - Rate limit → "Codex rate limit exceeded"
✅ Timeout - 30s max → "Codex request timeout"
✅ Network error → Retour JSON avec error
✅ No API key → Mode fallback automatique
```

### Isolation
- ✅ Codex ne modifie pas les routes existantes
- ✅ Pas d'impact sur /api/chat
- ✅ Ajout pur, pas de remplacement
- ✅ Fonctionne avec ou sans clé API

### Performance
- Timeout: 30 secondes
- Historique: 5 derniers messages max
- Temperature: 0.7 (équilibre créativité/précision)
- Max tokens: 1000

---

## 🧪 Tests

### Via script automatisé
```bash
./test-codex.sh
```

Tests :
1. Status endpoint accessible
2. Query sans auth
3. Query avec auth athlete
4. Query avec auth coach

### Via curl

```bash
# Status
curl http://localhost:5001/api/codex/status

# Simple query
curl -X POST http://localhost:5001/api/codex \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Conseil motivation"}'

# Query avec contexte
curl -X POST http://localhost:5001/api/codex \
  -H "Content-Type: application/json" \
  -d '{
    "prompt":"Programme force 3 jours",
    "context":{"goal":"force","level":"débutant"}
  }'
```

### Via frontend
```typescript
import { askCodex, getCodexStatus } from "@/utils/aiClient";

// Check status
const status = await getCodexStatus();
console.log(status);

// Ask Codex
const response = await askCodex("Génère un plan nutrition");
console.log(response.result);
```

---

## 📊 Exemples de réponses

### Mode configuré (avec API key)
```json
{
  "success": true,
  "result": "Voici un programme PPL optimisé pour l'hypertrophie...",
  "configured": true
}
```

### Mode fallback (sans API key)
```json
{
  "success": true,
  "result": "Pour créer un programme efficace, commence par définir tes objectifs...",
  "configured": false
}
```

### Erreur
```json
{
  "success": false,
  "error": "Codex rate limit exceeded"
}
```

---

## 🚀 Utilisation dans les pages

### Exemple: Coach Dashboard

```typescript
import { askCodex } from "@/utils/aiClient";

export default function CoachDashboard() {
  const { user } = useAuth();
  
  const generateClientProgram = async (clientGoal: string) => {
    const response = await askCodex(
      `Crée un programme personnalisé pour: ${clientGoal}`,
      { 
        role: user.role,
        clientGoal 
      }
    );
    
    if (response.success) {
      setProgram(response.result);
    } else {
      toast({ 
        title: "Erreur", 
        description: response.error,
        variant: "destructive" 
      });
    }
  };
  
  return (
    <Button onClick={() => generateClientProgram("prise de masse")}>
      Générer avec Codex
    </Button>
  );
}
```

### Exemple: Athlete Dashboard

```typescript
import { generateTrainingPlan, getMotivation } from "@/utils/aiClient";

const plan = await generateTrainingPlan(
  "force maximale",
  "avancé",
  4,
  "athlete"
);

const motivation = await getMotivation("athlete");
```

---

## 📝 Points d'intégration suggérés

### Pages Coach
- ✅ `/coach/programs` - Génération assistée de programmes
- ✅ `/coach/analytics` - Analyse données clients
- ✅ `/coach/client-detail` - Recommandations personnalisées

### Pages Client
- ✅ `/client/training` - Explications du programme
- ✅ `/client/nutrition` - Conseils nutrition
- ✅ `/client/progress` - Analyse progression

### Pages Athlete
- ✅ `/athlete/training-create` - Aide à la création
- ✅ `/athlete/nutrition-create` - Génération plans
- ✅ `/athlete/dashboard` - Conseils quotidiens

---

## ✅ Checklist d'intégration

- [x] Module `server/ai/codex/` créé
- [x] Fonction `queryCodex()` implémentée
- [x] Route `/api/codex` ajoutée
- [x] Endpoint `/api/codex/status` fonctionnel
- [x] Client frontend `aiClient.ts` créé
- [x] Helpers (getMotivation, generateTrainingPlan, etc.)
- [x] Gestion d'erreurs robuste
- [x] Mode fallback opérationnel
- [x] `.env.example` mis à jour
- [x] Script de test `test-codex.sh` créé
- [x] Build réussi (0 erreur)
- [x] Aucune régression backend

---

## 🎉 Résultat final

**Codex est maintenant intégré** :

✅ **Module dédié** isolé dans `server/ai/codex/`
✅ **Route API** `/api/codex` fonctionnelle
✅ **Client frontend** avec helpers pratiques
✅ **Mode fallback** si pas de clé API
✅ **Contexte utilisateur** pris en compte
✅ **Gestion d'erreurs** robuste
✅ **Tests automatisés** disponibles
✅ **Build réussi** sans régression

**Codex peut maintenant enrichir Synrgy avec des modules IA spécifiques en toute sécurité ! 🚀**

---

## 🚀 Démarrage rapide

```bash
# 1. Configure Codex dans .env
CODEX_API_KEY=sk-your-key
CODEX_MODEL=gpt-4o-mini

# 2. Build
npm run build

# 3. Start
npm start

# 4. Test
./test-codex.sh
```

**Codex est opérationnel ! 🎉**

