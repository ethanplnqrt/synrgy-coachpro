const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const apiFetch = (path: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${path}`;
  return fetch(url, options);
};

console.log("✅ Synrgy Live Mode — Connected to backend via", API_BASE);

