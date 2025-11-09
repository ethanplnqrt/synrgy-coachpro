import { useAuthContext } from "@/contexts/AuthContext";

export interface AuthUser {
  id: string;
  email: string;
  role: "coach" | "client";
  fullName?: string | null;
  avatarUrl?: string | null;
  isPro?: boolean;
  isClient?: boolean;
  coachId?: string | null;
  integrations?: {
    macrosToken?: string;
    macrosRefreshToken?: string;
    macrosExpiresAt?: string;
  };
}

/**
 * Hook to access authentication state and methods
 * @returns Authentication context with user, login, logout, register methods
 */
export function useAuth() {
  return useAuthContext();
}
