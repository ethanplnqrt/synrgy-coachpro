import { useQuery } from "@tanstack/react-query";
import type { User } from "../../shared/schema";

export interface AppConfig {
  testMode: boolean;
}

export function useAppConfig() {
  return useQuery<AppConfig>({
    queryKey: ["app-config"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/config", { credentials: "include" });
        if (!res.ok) throw new Error("failed");
        return (await res.json()) as AppConfig;
      } catch {
        // Fallback to TEST mode when backend isn't running
        return { testMode: true } as AppConfig;
      }
    },
    staleTime: Infinity,
  });
}

// Role utilities
export const isCoach = (user: User | undefined) => user?.role === "coach";
export const isAthlete = (user: User | undefined) => user?.role === "athlete";


