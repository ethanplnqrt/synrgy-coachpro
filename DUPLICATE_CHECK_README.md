# 🔍 Système de Vérification des Doublons

## 📋 Description

Ce système de vérification automatique détecte les doublons d'import et de déclarations TypeScript/JavaScript avant qu'ils ne causent des erreurs de compilation.

## 🚀 Installation

Le système est déjà intégré au projet via le fichier `check-duplicates.js`.

## 🎯 Utilisation

### Vérification manuelle

```bash
npm run check-duplicates
```

### Vérification automatique

La vérification s'exécute automatiquement avant :
- `npm run dev` (développement)
- `npm run dev:client` (client de développement)
- `npm run build` (production)

Grâce aux hooks `predev`, `predev:client` et `prebuild` configurés dans `package.json`.

## 🔍 Ce qui est vérifié

### 1. Imports dupliqués

Détecte les imports multiples du même module ou composant :

```typescript
// ❌ ERREUR
import CoachDashboard from "./pages/coach-dashboard";
import CoachDashboard from "./pages/coach-dashboard"; // Doublon !
```

### 2. Déclarations dupliquées

Détecte les fonctions, classes, interfaces, etc. déclarées plusieurs fois :

```typescript
// ❌ ERREUR
function myFunction() { }
function myFunction() { } // Doublon !
```

### 3. Variables dupliquées

Détecte les variables `const`, `let`, `var` déclarées plusieurs fois :

```typescript
// ❌ ERREUR
const myVariable = 1;
const myVariable = 2; // Doublon !
```

## 📊 Rapport de sortie

### ✅ Succès

```
🔍 Vérification des doublons d'import et de déclarations...

📁 112 fichiers analysés

════════════════════════════════════════════════════
📊 Résumé de l'analyse
════════════════════════════════════════════════════

Fichiers analysés: 112
Fichiers avec doublons: 0
Total de doublons trouvés: 0

✅ Aucun doublon détecté !
```

### ❌ Doublons détectés

```
⚠️ Import 'CoachDashboard' en double depuis './pages/coach-dashboard' (lignes 10 et 47)
   Fichier: client/src/App.tsx

════════════════════════════════════════════════════
📊 Résumé de l'analyse
════════════════════════════════════════════════════

Fichiers analysés: 112
Fichiers avec doublons: 1
Total de doublons trouvés: 1

❌ Doublons détectés !
💡 Action recommandée:
   1. Ouvrez le fichier mentionné
   2. Supprimez la ligne de doublon
   3. Relancez 'npm run dev'
```

## 🛡️ Protection

Le script retourne un code de sortie 1 en cas de doublon détecté, ce qui interrompt le processus de build/développement. Cela empêche les erreurs de type :

```
[plugin:vite:react-babel] Identifier 'X' has already been declared
```

## 🔧 Configuration

### Fichiers ignorés

Le script ignore automatiquement :
- `node_modules/`
- `.git/`
- `dist/`
- `build/`
- Fichiers commençant par `.`

### Extensions vérifiées

- `.ts` (TypeScript)
- `.tsx` (TypeScript React)
- `.js` (JavaScript)
- `.jsx` (JavaScript React)

## 📝 Exemples d'utilisation

### Avant un commit Git

```bash
npm run check-duplicates && git add . && git commit -m "Mes changements"
```

### Dans un pipeline CI/CD

```bash
npm run check-duplicates || exit 1
```

## 🎨 Personnalisation

Pour modifier le comportement du script, éditez le fichier `check-duplicates.js` :

```javascript
// Modifier le répertoire à scanner
const srcDir = join(process.cwd(), 'client', 'src');

// Ajouter des patterns de détection
const patterns = {
  import: /^import\s+.../gm,
  // ...
};
```

## 📚 Documentation Cursor

Le fichier `.cursorrules.json` inclut la configuration de ce système :

```json
{
  "duplicateCheck": {
    "enabled": true,
    "script": "check-duplicates.js",
    "autoFix": false,
    "description": "Vérification automatique des doublons d'import avant chaque build/dev"
  }
}
```

## 🐛 Dépannage

### Le script ne se lance pas automatiquement

Vérifiez que les hooks sont bien configurés dans `package.json` :

```json
{
  "scripts": {
    "predev": "node check-duplicates.js",
    "prebuild": "node check-duplicates.js"
  }
}
```

### Permission refusée

```bash
chmod +x check-duplicates.js
```

### Erreur de syntaxe

Le script utilise les modules ES6. Assurez-vous que votre `package.json` contient :

```json
{
  "type": "module"
}
```

## 📞 Support

Pour toute question ou problème, consultez la documentation du projet Synrgy ou contactez l'équipe de développement.

---

**Auteur**: Système automatique Synrgy v3.0  
**Date**: $(date)  
**Version**: 1.0.0
