const API_URL = (import.meta.env as Record<string, string | undefined>).VITE_API_URL ?? "/api";

export const CONFIG = {
  API_URL,
};

export function useAppConfig() {
  return {
    data: {
      testMode: false,
      mode: "production",
    },
    isLoading: false,
    isError: false,
  } as const;
}

export default CONFIG;

