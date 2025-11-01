import { useQuery } from "@tanstack/react-query";
import type { User } from "../../shared/schema";
import { useAppConfig } from "../lib/config";

export function useAuth() {
  const { data: config } = useAppConfig();
  
  return useQuery<User>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      // Vérifier le mode démo via localStorage
      const demoToken = localStorage.getItem("synrgy_demo_token");
      const demoUserStr = localStorage.getItem("synrgy_demo_user");
      
      if (demoToken && demoUserStr) {
        try {
          const demoUser = JSON.parse(demoUserStr);
          return {
            id: demoUser.id,
            username: demoUser.username,
            email: demoUser.email,
            password: "",
            role: demoUser.role,
            fullName: demoUser.fullName,
            avatarUrl: demoUser.avatarUrl || null,
            isPro: false,
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            coachId: demoUser.coachId || null,
            createdAt: new Date(),
          };
        } catch {
          // Si erreur de parsing, continuer avec les autres méthodes
        }
      }
      
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
    enabled: !config?.testMode || !!localStorage.getItem("synrgy_demo_token"),
  });
}
