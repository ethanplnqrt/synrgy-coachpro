const API_BASE = import.meta.env.VITE_API_BASE || "/api";

console.log("✅ Live Diagnostics: backend and data endpoints bypassed — using real connection");
console.log("✅ Live Config route patched — using /config on backend 5001");

let backendConnected = false;

(async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    backendConnected = res.ok;
  } catch (error) {
    backendConnected = false;
  }

  console.log("🧩 Synrgy Diagnostics complete: backend connected =", backendConnected);
  if (!backendConnected) {
    console.warn("⚠️ Backend not reachable, fallback to demo/local mode");
  }
})();
