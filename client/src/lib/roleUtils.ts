import type { AuthUser } from "@/hooks/useAuth";

export type UserRole = "coach" | "client";

export function getDashboardPath(role: AuthUser["role"]): string {
  if (role === "coach") return "/coach/dashboard";
  return "/client/home";
}

export function getSettingsPath(role: AuthUser["role"]): string {
  if (role === "coach") return "/coach/settings";
  return "/client/settings";
}

export function getRoleLabel(role: AuthUser["role"]): string {
  if (role === "coach") return "Coach professionnel";
  return "Client";
}

export function getRolePrice(role: AuthUser["role"]): string {
  if (role === "coach") return "€29,90/mois";
  return "€9,90/mois";
}
