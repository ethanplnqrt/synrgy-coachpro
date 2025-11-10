# 🔍 DIAGNOSTIC — ROUTES MANQUANTES

**Problème:** `server/index.ts` importe des routes qui n'existent plus

---

## ❌ ROUTES IMPORTÉES MAIS MANQUANTES

```typescript
// ❌ Ces imports échouent car les fichiers ont été supprimés par git clean
import programsRouter from "./routes/programs.js";     // ❌ programs.ts n'existe pas
import sessionsRouter from "./routes/sessions.js";     // ❌ sessions.ts n'existe pas
import feedbacksRouter from "./routes/feedbacks.js";   // ❌ feedbacks.ts n'existe pas
import messagesRouter from "./routes/messages.js";     // ❌ messages.ts n'existe pas
import aiRouter from "./routes/ai.js";                 // ❌ ai.ts n'existe pas
```

**Ces fichiers ont été supprimés lors de git clean -fd (Phase 4.4.0)**

---

## ✅ ROUTES QUI EXISTENT

```
server/routes/
├── auth.ts          ✅ Existe
├── chat.ts          ✅ Existe
├── checkins.ts      ✅ Existe
├── codex.ts         ✅ Existe
├── goals.ts         ✅ Existe
├── nutrition.ts     ✅ Existe
├── payments.ts      ✅ Existe
├── plans.ts         ✅ Existe
├── referrals.ts     ✅ Existe
└── subscriptions.ts ✅ Existe
```

---

## 🔧 SOLUTION

**Nettoyer `server/index.ts`:**
1. Supprimer imports des routes manquantes
2. Supprimer app.use() correspondants
3. Garder uniquement les routes existantes

**Extension `.js`:** ✅ GARDER (correct pour ESM)

---

**✅ Fix nécessaire: Nettoyer les imports, pas changer .js en .ts**
