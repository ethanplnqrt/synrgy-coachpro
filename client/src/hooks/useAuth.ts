import { useQuery } from "@tanstack/react-query";
import type { User } from "../../shared/schema";
import { useAppConfig } from "../lib/config";

export function useAuth() {
  const { data: config } = useAppConfig();
  
  return useQuery<User>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (config?.testMode) {
        return {
          id: "demo-user",
          username: "demo-user",
          email: "demo@coachpro.app",
          password: "",
          role: "athlete" as const,
          fullName: "Utilisateur Démo",
          avatarUrl: null,
          isPro: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          coachId: null,
          createdAt: new Date(),
        };
      }
      const response = await fetch("/api/auth/me");
      if (!response.ok) throw new Error("Not authenticated");
      return response.json();
    },
    enabled: !config?.testMode,
  });
}
