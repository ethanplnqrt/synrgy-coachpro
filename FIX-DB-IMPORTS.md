# 🔧 FIX DB IMPORTS — LEGACY CLEANUP

**Problème:** Routes importent `db.js` (Drizzle + SQLite) alors que Synrgy utilise Prisma + PostgreSQL

---

## ❌ IMPORTS LEGACY À NETTOYER

**Fichiers qui importent `db.js`:**
```
server/routes/nutrition.ts
server/routes/chat.ts
server/routes/goals.ts
server/routes/plans.ts
server/routes/referrals.ts
server/routes/subscriptions.ts
(possiblement d'autres)
```

---

## ✅ SOLUTION

**Option 1: Commenter imports legacy (Quick fix)**
```typescript
// import { db } from "../db.js";
// import { users } from "../../shared/schema.js";
// import { eq } from "drizzle-orm";
```

**Option 2: Remplacer par Prisma**
```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

---

**Pour Phase 5.3:** Commenter suffit (focus auth)  
**Pour Phase 5.4:** Migrer toutes les routes vers Prisma

