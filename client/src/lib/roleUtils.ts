import type { AuthUser } from "@/hooks/useAuth";

export function getDashboardPath(role: AuthUser["role"]): string {
  if (role === "coach") return "/coach/dashboard";
  if (role === "client") return "/client/dashboard";
  return "/athlete/dashboard";
}

export function getSettingsPath(role: AuthUser["role"]): string {
  if (role === "coach") return "/coach/settings";
  if (role === "client") return "/client/settings";
  return "/athlete/settings";
}

export function getRoleLabel(role: AuthUser["role"]): string {
  if (role === "coach") return "Coach professionnel";
  if (role === "client") return "Client";
  return "Athlète indépendant";
}

