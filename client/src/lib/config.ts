export interface AppConfig {
  testMode: boolean;
  status?: string;
  mode?: string;
}

export function useAppConfig() {
  return {
    data: {
      testMode: false,
      status: "ok",
      mode: "production",
    } as AppConfig,
    isLoading: false,
    isError: false,
  } as const;
}


