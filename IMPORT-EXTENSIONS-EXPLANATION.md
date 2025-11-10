# 📚 TYPESCRIPT + ESM IMPORTS — EXPLANATION

**Date:** November 9, 2025  
**Issue:** `.js` vs `.ts` dans les imports

---

## ⚠️ IMPORTANT: NE PAS CHANGER .js EN .ts

### Pourquoi les imports utilisent `.js` ?

**TypeScript avec ES Modules (ESM) requiert les extensions `.js` dans les imports, même si les fichiers sources sont en `.ts`.**

**Raison:**
1. TypeScript compile `.ts` → `.js`
2. Les imports sont résolus au runtime
3. Node.js cherche les fichiers `.js` compilés
4. TypeScript ne modifie PAS les chemins d'import pendant la compilation

---

## 📖 DOCUMENTATION OFFICIELLE

**TypeScript Handbook:**
> "TypeScript does not rewrite module specifiers. If you write `import "./foo.ts"`, TypeScript will emit that as-is, and Node.js will fail to find the file because it doesn't have a `.ts` extension."

**Solution recommandée:**
```typescript
// ✅ CORRECT (même si foo.ts existe)
import { something } from "./foo.js";

// ❌ INCORRECT (ne fonctionne pas avec tsc + Node.js)
import { something } from "./foo.ts";
```

**Source:** https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html

---

## 🔧 CONFIGURATION SYNRGY

### package.json
```json
{
  "type": "module",  // ✅ ESM activé
  "scripts": {
    "dev:server": "tsx watch server/index.ts",  // tsx pour dev
    "build:server": "tsc",  // tsc pour prod
    "start": "node dist/index.js"  // Node.js exécute .js
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "module": "ESNext",  // ✅ ES Modules
    "moduleResolution": "node",
    "outDir": "./dist"
  }
}
```

---

## 🎯 POURQUOI ÇA FONCTIONNE

### En Développement (tsx)

```bash
npm run dev:server
→ tsx watch server/index.ts
```

**tsx:**
- Exécute TypeScript directement (pas de compilation)
- Résout automatiquement `.js` → `.ts` (smart resolution)
- Exemple: `import x from "./routes/auth.js"` → trouve `./routes/auth.ts`

**Résultat:** ✅ Fonctionne avec extensions `.js`

---

### En Production (tsc + node)

```bash
npm run build:server  # tsc compile .ts → .js
npm start             # node dist/index.js
```

**tsc:**
- Compile `server/index.ts` → `dist/index.js`
- Copie les imports tel quel (ne change PAS `.js`)
- Exemple: `import x from "./routes/auth.js"` reste `import x from "./routes/auth.js"`

**node:**
- Exécute `dist/index.js`
- Cherche `dist/routes/auth.js` (qui existe après compilation)

**Résultat:** ✅ Fonctionne avec extensions `.js`

---

## ❌ CE QUI NE FONCTIONNE PAS

### Si on change `.js` en `.ts`

**Code:**
```typescript
import authRouter from "./routes/auth.ts";  // ❌ INCORRECT
```

**En développement (tsx):**
- ✅ Fonctionne (tsx résout .ts)

**En production (tsc + node):**
```bash
npm run build:server
→ tsc compile → dist/index.js contient:
  import authRouter from "./routes/auth.ts";  // ❌ PROBLÈME

npm start
→ node dist/index.js
→ Error: Cannot find module './routes/auth.ts'
   (car le fichier compilé est auth.js, pas auth.ts)
```

**Résultat:** ❌ Casse la production

---

## ✅ SOLUTION ACTUELLE (CORRECTE)

### server/index.ts

```typescript
import authRouter from "./routes/auth.js";  // ✅ CORRECT
import chatRouter from "./routes/chat.js";   // ✅ CORRECT
import { loadDB } from "./utils/db.js";      // ✅ CORRECT
```

**Développement:**
- tsx résout `./routes/auth.js` → `./routes/auth.ts` ✅

**Production:**
- tsc compile `./routes/auth.ts` → `dist/routes/auth.js` ✅
- node exécute et trouve `dist/routes/auth.js` ✅

---

## 🔍 VÉRIFICATION RAPIDE

```bash
# Vérifier que les imports sont corrects
grep "from.*\.js" server/index.ts

# Attendu: Tous les imports locaux utilisent .js
```

**Si tous les imports utilisent `.js`:** ✅ Correct, ne rien changer

---

## 📝 RÈGLE GÉNÉRALE

**Avec TypeScript + ESM:**

| Import | Extension | Statut |
|--------|-----------|--------|
| Fichiers locaux `.ts` | `.js` | ✅ Correct |
| node_modules | Aucune extension | ✅ Correct |
| JSON | `.json` | ✅ Correct |
| Fichiers `.js` réels | `.js` | ✅ Correct |

**Exemple complet:**
```typescript
// ✅ TOUS CORRECTS
import express from "express";              // node_modules
import authRouter from "./routes/auth.js";  // .ts source
import config from "./config.json";         // .json
```

---

## 🚀 CONCLUSION

**Pour Synrgy:**

1. **NE PAS changer `.js` en `.ts` dans les imports**
2. Les imports actuels avec `.js` sont **CORRECTS**
3. Cette convention est **obligatoire** pour TypeScript + ESM
4. Fonctionne en dev (tsx) ET en prod (tsc + node)

**Si erreur `ERR_MODULE_NOT_FOUND`:**
- ✅ Vérifier que le fichier source existe
- ✅ Vérifier le chemin relatif
- ❌ NE PAS changer l'extension

---

## 📚 RESSOURCES

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [tsx Documentation](https://github.com/esbuild-kit/tsx)

---

**✅ LES IMPORTS ACTUELS AVEC `.js` SONT CORRECTS — NE RIEN CHANGER** ✓

