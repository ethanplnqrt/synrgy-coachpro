# Phase 2 — Chat IA complet connecté au profil utilisateur ✅

## 🎯 Objectif atteint

Le chat IA intelligent de Synrgy est maintenant activé pour chaque utilisateur connecté avec :
- Personnalisation selon le profil (coach/athlète)
- Persistance des messages par utilisateur
- Réponses contextuelles et humaines
- Historique complet et gestion des conversations

## 📁 Architecture implémentée

```
server/
├── ai/
│   └── promptBuilder.ts       # Construction de prompts intelligents
├── routes/
│   └── chat.ts               # Routes de chat IA
├── utils/
│   └── db.ts                 # Stockage des messages
└── openai.ts                 # Interface OpenAI
```

## 🔐 Routes disponibles

Toutes les routes nécessitent une authentification (JWT cookie).

### POST /api/chat
**Envoi d'un message au chat IA**

Request:
```json
{
  "message": "Comment améliorer ma force au développé couché ?"
}
```

Response:
```json
{
  "success": true,
  "reply": "Pour améliorer ta force au développé couché...",
  "context": {
    "role": "athlete",
    "messagesCount": 12
  }
}
```

### GET /api/chat/history
**Récupération de l'historique complet**

Response:
```json
{
  "success": true,
  "history": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "role": "user",
      "content": "Bonjour Synrgy",
      "timestamp": 1234567890
    },
    {
      "id": "uuid",
      "userId": "user-uuid",
      "role": "assistant",
      "content": "Bonjour ! Prêt à progresser ?",
      "timestamp": 1234567891
    }
  ],
  "context": {
    "totalMessages": 2,
    "userRole": "athlete",
    "userId": "user-uuid"
  }
}
```

### DELETE /api/chat/history
**Suppression de l'historique utilisateur**

Response:
```json
{
  "success": true,
  "message": "Historique de chat supprimé"
}
```

## 🤖 Système de prompts intelligents

### Personnalisation par rôle

**Pour les COACHES** :
```
Tu es Synrgy, assistant IA pour coachs sportifs professionnels.

Ton rôle:
- Aider à créer des programmes d'entraînement personnalisés
- Conseiller sur la gestion des athlètes et la progression
- Fournir des insights sur nutrition et récupération
- Répondre avec expertise mais de manière accessible

Ton style:
- Professionnel et expert, mais chaleureux
- Basé sur la science et l'expérience terrain
- Motivant et encourageant
- Concis mais complet
```

**Pour les ATHLÈTES** :
```
Tu es Synrgy, ton coach IA personnel et partenaire d'entraînement.

Ton rôle:
- Motiver et accompagner dans la progression
- Répondre aux questions sur entraînement, nutrition, récupération
- Analyser les performances et suggérer des améliorations
- Créer une relation de confiance et d'encouragement

Ton style:
- Amical, motivant et positif
- Empathique et à l'écoute
- Pédagogue et accessible
- Humain avant tout
```

### Construction du prompt

Le système `promptBuilder.ts` construit un prompt complet avec :

1. **Persona** - Selon le rôle utilisateur
2. **Historique** - Les 10 derniers messages de la conversation
3. **Message actuel** - La question/demande de l'utilisateur
4. **Instructions** - Directives pour une réponse naturelle et utile

Exemple de prompt généré :
```
Tu es Synrgy, ton coach IA personnel et partenaire d'entraînement.

[...persona complète...]

Historique de conversation:
Utilisateur: Bonjour, je veux progresser en musculation
Synrgy: Super ! Parlons de tes objectifs...
Utilisateur: Je veux gagner en force

Utilisateur: Comment améliorer mon développé couché ?

Réponds naturellement, avec empathie et expertise. Sois concis mais utile.

Synrgy:
```

## 💾 Stockage des messages

**Fichier** : `server/db.json`

**Structure** :
```json
{
  "messages": [
    {
      "id": "uuid-v4",
      "userId": "user-uuid",
      "role": "user",
      "content": "Message de l'utilisateur",
      "timestamp": 1234567890
    },
    {
      "id": "uuid-v4",
      "userId": "user-uuid",
      "role": "assistant",
      "content": "Réponse de Synrgy",
      "timestamp": 1234567891
    }
  ],
  "nutrition": [],
  "goals": []
}
```

**Caractéristiques** :
- Messages isolés par `userId`
- Tri chronologique par `timestamp`
- Les 10 derniers messages utilisés pour le contexte
- Stockage JSON pour simplicité et rapidité

## 🔄 Flux de conversation

### 1. L'utilisateur envoie un message
```
Frontend → POST /api/chat
         → { message: "Comment progresser ?" }
```

### 2. Le serveur récupère le contexte
```
Server → authenticate() → req.user
      → loadDB()
      → filter messages by userId
      → slice(-10) pour garder 10 derniers
```

### 3. Construction du prompt intelligent
```
Server → buildChatPrompt()
       → Détection du rôle (coach/athlete)
       → Sélection de la persona appropriée
       → Formatage de l'historique
       → Ajout du message actuel
```

### 4. Génération de la réponse IA
```
Server → generateAIResponse(prompt)
       → POST https://api.openai.com/v1/chat/completions
       → model: "gpt-4o-mini"
       → Retour de la réponse
```

### 5. Sauvegarde et retour
```
Server → Save user message
       → Save AI response
       → saveDB()
       → Return { reply, context }
Frontend → Affiche la réponse
```

## 🎨 Ton et personnalité

### Principes clés

**Humanité** :
- Pas de réponses robotiques
- Empathie et compréhension
- Célébration des victoires
- Soutien dans les difficultés

**Expertise** :
- Basé sur la science
- Références aux méthodes reconnues
- Adaptation au niveau de l'utilisateur
- Conseils concrets et actionnables

**Motivation** :
- Encouragement positif
- Focus sur la progression
- Patience et constance
- Responsabilisation

### Exemples de réponses

**Coach demande** : "Comment structurer un programme PPL ?"
```
Excellente question ! Le Push-Pull-Legs est un format solide pour tes athlètes.

Voici une structure efficace :

PUSH (Pectoraux, Épaules, Triceps)
- Développé couché : 4×6-8
- Développé incliné : 3×8-10
- Élévations latérales : 3×12-15
- Extensions triceps : 3×10-12

[...suite structurée...]

L'important : adapter le volume selon le niveau de récupération de chaque athlète. 
Commence conservateur, observe les progrès sur 3-4 semaines, ajuste ensuite.

Des questions sur la périodisation ?
```

**Athlète demande** : "Je stagne au squat, que faire ?"
```
Je comprends, c'est frustrant de stagner ! Mais c'est normal et ça se corrige.

Quelques pistes à explorer :

1. **Volume** : Tu fais combien de séries par semaine ?
   → Peut-être besoin de +2-3 séries

2. **Technique** : Filme-toi !
   → Position des pieds, profondeur, stabilité

3. **Récupération** : Tu dors assez ?
   → Le muscle se construit au repos

4. **Nutrition** : Calories suffisantes ?
   → Difficile de progresser en déficit

Dis-moi, quel aspect te semble le plus problématique ? On va identifier le blocage ensemble 💪
```

## 🧪 Tester le chat

### Via curl
```bash
# Connexion
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@test.com","password":"password123"}' \
  -c cookies.txt

# Envoyer un message
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Comment progresser en musculation ?"}' \
  -b cookies.txt

# Voir l'historique
curl http://localhost:5001/api/chat/history -b cookies.txt

# Supprimer l'historique
curl -X DELETE http://localhost:5001/api/chat/history -b cookies.txt
```

### Via frontend
1. Connecte-toi : http://localhost:5173/login
2. Va sur la page chat : http://localhost:5173/chat-ia
3. Envoie un message
4. Observe la réponse personnalisée selon ton rôle

## 🔒 Sécurité et isolation

✅ **Middleware** : Toutes les routes nécessitent authentification
✅ **Isolation** : Chaque utilisateur voit uniquement ses messages
✅ **Validation** : Messages vides rejetés
✅ **Tokens** : JWT vérifié à chaque requête
✅ **CORS** : Configuré pour localhost:5173

## 📊 Performance

- **Contexte limité** : 10 derniers messages max
- **Stockage JSON** : Rapide pour < 10k messages
- **Cache** : Aucun pour garantir la fraîcheur
- **Timeout** : 10s max pour réponse OpenAI

## 🚀 Améliorations futures possibles

- [ ] Streaming des réponses IA (SSE)
- [ ] Analyse de sentiment
- [ ] Suggestions proactives
- [ ] Export de conversation
- [ ] Partage de conversations avec coach
- [ ] Voice input/output
- [ ] Réponses multimodales (images)

## ✅ Résultat

Le chat IA est maintenant :
- ✅ Personnalisé selon le rôle utilisateur
- ✅ Contextualisé avec l'historique
- ✅ Persistant par utilisateur
- ✅ Humain et empathique
- ✅ Expert et motivant
- ✅ Complètement fonctionnel

**Phase 2 terminée avec succès ! 🎉**

