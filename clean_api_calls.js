/**
 * 🛡️ Synrgy Shield v10.1-AuditFix
 * Corrige automatiquement tous les appels "fetch" ou "axios" pointant vers localhost:5000
 * et les remplace par des chemins relatifs "/api/...".
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

const targetPattern = /http:\/\/localhost:5000\/api\/([a-zA-Z0-9/_-]*)/g;

let modifiedFiles = 0;
let totalReplacements = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", "dist", "build", ".git"].includes(entry.name)) continue;
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      const data = fs.readFileSync(fullPath, "utf8");
      const matches = [...data.matchAll(targetPattern)];

      if (matches.length > 0) {
        const newData = data.replace(targetPattern, (_, route) => `/api/${route}`);
        fs.writeFileSync(fullPath, newData, "utf8");
        modifiedFiles++;
        totalReplacements += matches.length;
        console.log(`✅ Corrigé : ${fullPath} (${matches.length} remplacement${matches.length > 1 ? "s" : ""})`);
      }
    }
  }
}

console.log("🔍 Audit en cours sur le projet Synrgy...");
scanDir(rootDir);
console.log("──────────────────────────────────────────");
console.log(`🏁 Audit terminé.`);
console.log(`📄 Fichiers modifiés : ${modifiedFiles}`);
console.log(`🔁 Remplacements effectués : ${totalReplacements}`);
console.log("──────────────────────────────────────────");

if (modifiedFiles === 0) {
  console.log("✅ Aucun appel localhost:5000 détecté. Tout est déjà propre !");
} else {
  console.log("🧹 Tous les appels vers localhost:5000 ont été remplacés par /api/");
}
