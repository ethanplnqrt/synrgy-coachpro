import axios from "axios";

const BASE_URL = process.env.RENDER_URL || "http://localhost:10000";

const routes = [
  "/api/health",
  "/api/plans",
  "/api/auth/login",
  "/api/auth/register",
  "/api/payments/create-checkout-session",
  "/api/referrals",
  "/api/stripe/config",
  "/api/subscriptions/status",
  "/api/codex/ask",
  "/api/checkins",
  "/api/goals",
];

(async () => {
  console.log("🧩 Checking Synrgy API health...\n");
  console.log(`🌐 Base URL: ${BASE_URL}\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const r of routes) {
    try {
      const res = await axios.get(BASE_URL + r, {
        validateStatus: () => true, // Accept any status code
        timeout: 5000,
      });
      
      if (res.status < 400) {
        console.log(`✅ ${r} -> ${res.status} ${res.statusText}`);
        successCount++;
      } else if (res.status === 401 || res.status === 403) {
        console.log(`🔒 ${r} -> ${res.status} (Auth required - OK)`);
        successCount++;
      } else if (res.status === 404) {
        console.log(`❌ ${r} -> ${res.status} NOT FOUND`);
        failureCount++;
      } else {
        console.log(`⚠️  ${r} -> ${res.status} ${res.statusText}`);
        failureCount++;
      }
    } catch (err: any) {
      console.error(`❌ ${r} -> ${err.message || "Connection error"}`);
      failureCount++;
    }
  }
  
  console.log(`\n📊 Results: ${successCount} OK / ${failureCount} Failed / ${routes.length} Total`);
  
  if (failureCount > 0) {
    console.log("\n⚠️  Some routes failed. Review the errors above.");
    process.exit(1);
  } else {
    console.log("\n✅ All routes are accessible!");
    process.exit(0);
  }
})();

