import { useEffect } from "react";
import { useLocation } from "wouter";
import AthleteDashboard from "./athlete-dashboard";
import { setAuthToken } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function DemoAthlete() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Charger les données de démo depuis localStorage
    const demoDataStr = localStorage.getItem("synrgy_demo_data");
    if (!demoDataStr) {
      // Si pas de données, rediriger vers /demo
      setLocation("/demo");
      return;
    }

    const demoData = JSON.parse(demoDataStr);
    
    // Créer un token de démo et un utilisateur fictif
    const demoToken = "demo_token_athlete_" + Date.now();
    const demoUser = {
      id: "demo_athlete",
      username: "demo_athlete",
      email: demoData.email,
      fullName: demoData.name,
      role: "athlete" as const,
      avatarUrl: null,
      coachId: null,
    };

    // Sauvegarder dans queryClient pour que useAuth() fonctionne
    setAuthToken(demoToken);
    queryClient.setQueryData(["/api/auth/me"], demoUser);

    // Sauvegarder aussi dans localStorage pour persistance
    localStorage.setItem("synrgy_demo_token", demoToken);
    localStorage.setItem("synrgy_demo_user", JSON.stringify(demoUser));
    // Marquer comme mode démo
    localStorage.setItem("synrgy_demo_mode", "true");
  }, [setLocation]);

  return <AthleteDashboard />;
}

