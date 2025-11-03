#!/usr/bin/env tsx

/**
 * Phase 3.2.6 - Deep Diagnostics & Auto QA
 * 
 * Vérifie toutes les routes backend, simule des opérations,
 * et génère un rapport de stabilité complet
 */

import { promises as fs } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface RouteTest {
  method: string;
  path: string;
  description: string;
  expectedStatus: number;
  requiresAuth?: boolean;
  payload?: any;
}

interface TestResult {
  route: string;
  status: "✅" | "⚠️" | "❌";
  responseTime: number;
  statusCode?: number;
  error?: string;
}

interface DiagnosticReport {
  timestamp: string;
  backendRoutes: {
    total: number;
    passed: number;
    failed: number;
    warned: number;
    results: TestResult[];
  };
  dataIntegrity: {
    users: { valid: boolean; count: number; issues: string[] };
    subscriptions: { valid: boolean; count: number; issues: string[] };
    referrals: { valid: boolean; count: number; issues: string[] };
  };
  performance: {
    avgResponseTime: number;
    slowRoutes: Array<{ route: string; time: number }>;
  };
  typescript: {
    errors: number;
    warnings: number;
    output: string;
  };
  stabilityIndex: number;
}

const BACKEND_ROUTES: RouteTest[] = [
  // Auth
  { method: "GET", path: "/api/health", description: "Health check", expectedStatus: 200 },
  { method: "POST", path: "/api/auth/login", description: "Login", expectedStatus: 401, payload: {} },
  { method: "POST", path: "/api/auth/register", description: "Register", expectedStatus: 400, payload: {} },
  
  // Payments
  { method: "GET", path: "/api/payments/mode", description: "Payment mode", expectedStatus: 200 },
  { method: "GET", path: "/api/payments/plans", description: "Payment plans", expectedStatus: 200 },
  
  // Others (will require auth, so expect 401)
  { method: "GET", path: "/api/referrals/stats", description: "Referral stats", expectedStatus: 401, requiresAuth: true },
  { method: "GET", path: "/api/subscriptions/test", description: "Subscriptions test", expectedStatus: 401, requiresAuth: true },
];

/**
 * Vérifie si le serveur backend est actif
 */
async function checkBackendRunning(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:5001/api/health");
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Teste une route backend
 */
async function testRoute(route: RouteTest): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const options: RequestInit = {
      method: route.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (route.payload) {
      options.body = JSON.stringify(route.payload);
    }

    const response = await fetch(`http://localhost:5001${route.path}`, options);
    const responseTime = Date.now() - startTime;

    const statusMatch = response.status === route.expectedStatus || 
                       (route.expectedStatus === 401 && [401, 403].includes(response.status));

    return {
      route: `${route.method} ${route.path}`,
      status: statusMatch ? "✅" : "⚠️",
      responseTime,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      route: `${route.method} ${route.path}`,
      status: "❌",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Vérifie l'intégrité des fichiers de données
 */
async function checkDataIntegrity(): Promise<DiagnosticReport["dataIntegrity"]> {
  const dataPath = join(process.cwd(), "server/data");
  
  const result: DiagnosticReport["dataIntegrity"] = {
    users: { valid: true, count: 0, issues: [] },
    subscriptions: { valid: true, count: 0, issues: [] },
    referrals: { valid: true, count: 0, issues: [] },
  };

  // Check users.json
  try {
    const usersData = await fs.readFile(join(dataPath, "users.json"), "utf-8");
    const users = JSON.parse(usersData);
    result.users.count = users.length;

    if (!Array.isArray(users)) {
      result.users.valid = false;
      result.users.issues.push("Format invalide (pas un array)");
    }

    users.forEach((user: any, idx: number) => {
      if (!user.id) result.users.issues.push(`User ${idx}: ID manquant`);
      if (!user.email) result.users.issues.push(`User ${idx}: Email manquant`);
      if (!user.role) result.users.issues.push(`User ${idx}: Role manquant`);
    });

    if (result.users.issues.length > 0) result.users.valid = false;
  } catch (error: any) {
    result.users.valid = false;
    result.users.issues.push(`Erreur lecture: ${error.message}`);
  }

  // Check subscriptions.json
  try {
    const subsData = await fs.readFile(join(dataPath, "subscriptions.json"), "utf-8");
    const subscriptions = JSON.parse(subsData);
    result.subscriptions.count = subscriptions.length;

    if (!Array.isArray(subscriptions)) {
      result.subscriptions.valid = false;
      result.subscriptions.issues.push("Format invalide (pas un array)");
    }

    subscriptions.forEach((sub: any, idx: number) => {
      if (!sub.id) result.subscriptions.issues.push(`Subscription ${idx}: ID manquant`);
      if (!sub.userId) result.subscriptions.issues.push(`Subscription ${idx}: userId manquant`);
      if (!sub.plan && !sub.planId) result.subscriptions.issues.push(`Subscription ${idx}: plan manquant`);
    });

    if (result.subscriptions.issues.length > 0) result.subscriptions.valid = false;
  } catch (error: any) {
    result.subscriptions.valid = false;
    result.subscriptions.issues.push(`Erreur lecture: ${error.message}`);
  }

  // Check referrals.json
  try {
    const refData = await fs.readFile(join(dataPath, "referrals.json"), "utf-8");
    const referrals = JSON.parse(refData);
    result.referrals.count = referrals.length;

    if (!Array.isArray(referrals)) {
      result.referrals.valid = false;
      result.referrals.issues.push("Format invalide (pas un array)");
    }

    referrals.forEach((ref: any, idx: number) => {
      if (!ref.id) result.referrals.issues.push(`Referral ${idx}: ID manquant`);
      if (!ref.code) result.referrals.issues.push(`Referral ${idx}: Code manquant`);
      if (!ref.coachId) result.referrals.issues.push(`Referral ${idx}: coachId manquant`);
    });

    if (result.referrals.issues.length > 0) result.referrals.valid = false;
  } catch (error: any) {
    result.referrals.valid = false;
    result.referrals.issues.push(`Erreur lecture: ${error.message}`);
  }

  return result;
}

/**
 * Vérifie TypeScript
 */
async function checkTypeScript(): Promise<DiagnosticReport["typescript"]> {
  try {
    const { stdout, stderr } = await execAsync("npm run build 2>&1");
    const output = stdout + stderr;
    
    const errorMatch = output.match(/(\d+) error/);
    const warningMatch = output.match(/(\d+) warning/);
    
    return {
      errors: errorMatch ? parseInt(errorMatch[1]) : 0,
      warnings: warningMatch ? parseInt(warningMatch[1]) : 0,
      output: output.includes("built in") ? "✅ Build successful" : output.substring(0, 500),
    };
  } catch (error: any) {
    return {
      errors: 1,
      warnings: 0,
      output: error.message.substring(0, 500),
    };
  }
}

/**
 * Calcule le Stability Index
 */
function calculateStabilityIndex(report: DiagnosticReport): number {
  let score = 100;

  // Routes backend (40 points)
  const routeSuccessRate = report.backendRoutes.passed / report.backendRoutes.total;
  score -= (1 - routeSuccessRate) * 40;

  // Data integrity (30 points)
  if (!report.dataIntegrity.users.valid) score -= 10;
  if (!report.dataIntegrity.subscriptions.valid) score -= 10;
  if (!report.dataIntegrity.referrals.valid) score -= 10;

  // TypeScript (20 points)
  score -= Math.min(20, report.typescript.errors * 2);
  score -= Math.min(10, report.typescript.warnings * 0.5);

  // Performance (10 points)
  if (report.performance.avgResponseTime > 1000) score -= 5;
  if (report.performance.avgResponseTime > 2000) score -= 5;

  return Math.max(0, score);
}

/**
 * Génère le rapport Markdown
 */
async function generateReport(report: DiagnosticReport): Promise<void> {
  const timestamp = new Date().toISOString();
  
  let markdown = `# 🔍 Synrgy Deep Diagnostics & Auto QA Report

**Date** : ${timestamp}  
**Version** : 1.0.0  
**Stability Index** : ${report.stabilityIndex.toFixed(1)} / 100  
**Status** : ${report.stabilityIndex >= 95 ? "🎊 EXCELLENT" : report.stabilityIndex >= 90 ? "✅ TRÈS BON" : report.stabilityIndex >= 80 ? "⚠️ BON" : "❌ CRITIQUE"}

---

## 🌐 Backend Routes

**Total** : ${report.backendRoutes.total} routes testées  
**Passed** : ${report.backendRoutes.passed} ✅  
**Failed** : ${report.backendRoutes.failed} ❌  
**Warned** : ${report.backendRoutes.warned} ⚠️

### Détails

| Route | Status | Time (ms) | Status Code | Notes |
|-------|--------|-----------|-------------|-------|
`;

  report.backendRoutes.results.forEach((result) => {
    markdown += `| \`${result.route}\` | ${result.status} | ${result.responseTime}ms | ${result.statusCode || "N/A"} | ${result.error || "-"} |\n`;
  });

  markdown += `\n---

## 📊 Data Integrity

### Users.json
- **Status** : ${report.dataIntegrity.users.valid ? "✅ Valide" : "❌ Invalide"}
- **Count** : ${report.dataIntegrity.users.count} users
`;
  
  if (report.dataIntegrity.users.issues.length > 0) {
    markdown += `- **Issues** :\n`;
    report.dataIntegrity.users.issues.forEach((issue) => {
      markdown += `  - ${issue}\n`;
    });
  }

  markdown += `\n### Subscriptions.json
- **Status** : ${report.dataIntegrity.subscriptions.valid ? "✅ Valide" : "❌ Invalide"}
- **Count** : ${report.dataIntegrity.subscriptions.count} subscriptions
`;

  if (report.dataIntegrity.subscriptions.issues.length > 0) {
    markdown += `- **Issues** :\n`;
    report.dataIntegrity.subscriptions.issues.forEach((issue) => {
      markdown += `  - ${issue}\n`;
    });
  }

  markdown += `\n### Referrals.json
- **Status** : ${report.dataIntegrity.referrals.valid ? "✅ Valide" : "❌ Invalide"}
- **Count** : ${report.dataIntegrity.referrals.count} referrals
`;

  if (report.dataIntegrity.referrals.issues.length > 0) {
    markdown += `- **Issues** :\n`;
    report.dataIntegrity.referrals.issues.forEach((issue) => {
      markdown += `  - ${issue}\n`;
    });
  }

  markdown += `\n---

## ⚡ Performance

- **Average Response Time** : ${report.performance.avgResponseTime.toFixed(0)}ms
- **Status** : ${report.performance.avgResponseTime < 500 ? "✅ Excellent" : report.performance.avgResponseTime < 1000 ? "✅ Bon" : "⚠️ Lent"}

`;

  if (report.performance.slowRoutes.length > 0) {
    markdown += `### Routes Lentes (>500ms)\n\n`;
    report.performance.slowRoutes.forEach((route) => {
      markdown += `- \`${route.route}\` : ${route.time}ms\n`;
    });
  } else {
    markdown += `✅ Aucune route lente détectée\n`;
  }

  markdown += `\n---

## 🔧 TypeScript Build

- **Errors** : ${report.typescript.errors} ${report.typescript.errors === 0 ? "✅" : "❌"}
- **Warnings** : ${report.typescript.warnings} ${report.typescript.warnings === 0 ? "✅" : "⚠️"}

\`\`\`
${report.typescript.output}
\`\`\`

---

## 📈 Stability Index : ${report.stabilityIndex.toFixed(1)} / 100

`;

  if (report.stabilityIndex >= 95) {
    markdown += `🎊 **EXCELLENT !** Synrgy est dans un état optimal pour le lancement.

**Breakdown** :
- Backend Routes : ${((report.backendRoutes.passed / report.backendRoutes.total) * 40).toFixed(1)}/40
- Data Integrity : ${(report.dataIntegrity.users.valid ? 10 : 0) + (report.dataIntegrity.subscriptions.valid ? 10 : 0) + (report.dataIntegrity.referrals.valid ? 10 : 0)}/30
- TypeScript : ${(20 - Math.min(20, report.typescript.errors * 2))}/20
- Performance : ${report.performance.avgResponseTime < 500 ? 10 : report.performance.avgResponseTime < 1000 ? 7 : 5}/10

✅ **Ready for Founder Testing**
`;
  } else if (report.stabilityIndex >= 90) {
    markdown += `✅ **TRÈS BON !** Quelques ajustements mineurs recommandés.

**Actions** :
- Vérifier les routes en warning
- Optimiser les routes lentes si présentes
- Résoudre les warnings TypeScript

⚠️ **Presque prêt pour Founder Testing**
`;
  } else if (report.stabilityIndex >= 80) {
    markdown += `⚠️ **BON, mais améliorations nécessaires**

**Actions prioritaires** :
- Corriger les erreurs critiques
- Résoudre les problèmes d'intégrité des données
- Fixer les erreurs TypeScript
- Optimiser les performances

❌ **Améliorations requises avant Founder Testing**
`;
  } else {
    markdown += `❌ **CRITIQUE - Action immédiate requise**

**Problèmes identifiés** :
- Routes backend défaillantes
- Intégrité des données compromise
- Erreurs TypeScript critiques
- Performances inacceptables

🚨 **Ne PAS lancer le Founder Testing dans cet état**
`;
  }

  markdown += `\n---

## 🎯 Conclusion

${report.stabilityIndex >= 95 ? "🚀 Synrgy est prêt pour le lancement ! Tous les systèmes sont opérationnels." :
report.stabilityIndex >= 90 ? "✅ Synrgy est presque prêt. Quelques ajustements mineurs amélioreront la stabilité." :
report.stabilityIndex >= 80 ? "⚠️ Des améliorations sont nécessaires avant le lancement." :
"❌ Action critique requise. Ne pas lancer en production dans cet état."}

**Stability Index** : ${report.stabilityIndex.toFixed(1)}/100  
**Backend Health** : ${((report.backendRoutes.passed / report.backendRoutes.total) * 100).toFixed(0)}%  
**Data Integrity** : ${report.dataIntegrity.users.valid && report.dataIntegrity.subscriptions.valid && report.dataIntegrity.referrals.valid ? "✅ OK" : "❌ Issues"}  
**TypeScript** : ${report.typescript.errors === 0 ? "✅ OK" : `❌ ${report.typescript.errors} error(s)`}  
**Performance** : ${report.performance.avgResponseTime < 500 ? "✅ Excellent" : report.performance.avgResponseTime < 1000 ? "✅ Good" : "⚠️ Slow"}  

**Next Step** : ${report.stabilityIndex >= 90 ? "✅ Phase 3.3 - Founder Testing" : "⚠️ Fix issues and re-run diagnostics"}

---

*Généré automatiquement par \`runDeepDiagnostics.ts\`*
`;

  const reportPath = join(process.cwd(), "diagnostics", "SYNRGY-QA-REPORT.md");
  await fs.writeFile(reportPath, markdown, "utf-8");

  console.log(`\n✅ Rapport généré : ${reportPath}`);
}

/**
 * Main
 */
async function main() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                ║");
  console.log("║   🔍 SYNRGY DEEP DIAGNOSTICS & AUTO QA - PHASE 3.2.6         ║");
  console.log("║                                                                ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const report: DiagnosticReport = {
    timestamp: new Date().toISOString(),
    backendRoutes: {
      total: 0,
      passed: 0,
      failed: 0,
      warned: 0,
      results: [],
    },
    dataIntegrity: {
      users: { valid: true, count: 0, issues: [] },
      subscriptions: { valid: true, count: 0, issues: [] },
      referrals: { valid: true, count: 0, issues: [] },
    },
    performance: {
      avgResponseTime: 0,
      slowRoutes: [],
    },
    typescript: {
      errors: 0,
      warnings: 0,
      output: "",
    },
    stabilityIndex: 0,
  };

  // 1. Check backend running
  console.log("🌐 Vérification du backend...");
  const backendRunning = await checkBackendRunning();
  
  if (!backendRunning) {
    console.log("⚠️  Backend non actif - Tests des routes skippés");
    console.log("   Lancer 'npm run dev:server' pour tester les routes\n");
  } else {
    console.log("✅ Backend actif\n");

    // 2. Test routes
    console.log("🧪 Test des routes backend...");
    report.backendRoutes.total = BACKEND_ROUTES.length;

    for (const route of BACKEND_ROUTES) {
      const result = await testRoute(route);
      report.backendRoutes.results.push(result);

      if (result.status === "✅") report.backendRoutes.passed++;
      else if (result.status === "⚠️") report.backendRoutes.warned++;
      else report.backendRoutes.failed++;

      console.log(`  ${result.status} ${result.route} - ${result.responseTime}ms`);
    }

    // Calculate performance
    const totalTime = report.backendRoutes.results.reduce((sum, r) => sum + r.responseTime, 0);
    report.performance.avgResponseTime = totalTime / report.backendRoutes.results.length;
    report.performance.slowRoutes = report.backendRoutes.results
      .filter((r) => r.responseTime > 500)
      .map((r) => ({ route: r.route, time: r.responseTime }))
      .sort((a, b) => b.time - a.time);

    console.log(`\n  Temps moyen de réponse : ${report.performance.avgResponseTime.toFixed(0)}ms`);
  }

  // 3. Check data integrity
  console.log("\n📊 Vérification de l'intégrité des données...");
  report.dataIntegrity = await checkDataIntegrity();
  console.log(`  Users: ${report.dataIntegrity.users.valid ? "✅" : "❌"} (${report.dataIntegrity.users.count})`);
  console.log(`  Subscriptions: ${report.dataIntegrity.subscriptions.valid ? "✅" : "❌"} (${report.dataIntegrity.subscriptions.count})`);
  console.log(`  Referrals: ${report.dataIntegrity.referrals.valid ? "✅" : "❌"} (${report.dataIntegrity.referrals.count})`);

  // 4. Check TypeScript
  console.log("\n🔧 Vérification TypeScript...");
  report.typescript = await checkTypeScript();
  console.log(`  Errors: ${report.typescript.errors} ${report.typescript.errors === 0 ? "✅" : "❌"}`);
  console.log(`  Warnings: ${report.typescript.warnings} ${report.typescript.warnings === 0 ? "✅" : "⚠️"}`);

  // 5. Calculate stability index
  report.stabilityIndex = calculateStabilityIndex(report);

  // 6. Generate report
  await generateReport(report);

  // Summary
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                ║");
  console.log(`║   ${report.stabilityIndex >= 95 ? "🎊" : report.stabilityIndex >= 90 ? "✅" : "⚠️"} STABILITY INDEX: ${report.stabilityIndex.toFixed(1)}/100                         ║`);
  console.log("║                                                                ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  if (report.stabilityIndex >= 90) {
    console.log("✅ Ready for Phase 3.3 - Founder Testing\n");
    process.exit(0);
  } else {
    console.log("⚠️  Améliorations recommandées avant Founder Testing\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Erreur lors de l'exécution :", error);
  process.exit(1);
});

