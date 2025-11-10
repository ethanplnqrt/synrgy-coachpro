import axios from "axios";

const BASE_URL = process.env.RENDER_URL || "https://synrgy-api.onrender.com";

const routes = [
  "/api/health",
  "/api/auth/login",
  "/api/auth/register",
  "/api/programs",
  "/api/payments/create-checkout-session",
  "/api/referrals",
];

(async () => {
  console.log("🧩 Checking Synrgy API health...\n");
  for (const r of routes) {
    try {
      const res = await axios.get(BASE_URL + r);
      console.log(`✅ ${r} -> ${res.status} ${res.statusText}`);
    } catch (err: any) {
      console.error(`❌ ${r} -> ${err.response?.status || "ERR"}`);
    }
  }
})();
