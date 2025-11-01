const API_URL = (import.meta.env as Record<string, string | undefined>).VITE_API_URL ?? "/api";

export const CONFIG = {
  API_URL,
  APP_MODE: 'live',
};

export default CONFIG;

