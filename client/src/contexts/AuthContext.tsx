import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";

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

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: "coach" | "client", fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async (): Promise<AuthUser | null> => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to verify session");
      }

      const data = await response.json();
      return data?.user ?? null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await response.json();
    
    if (data.user) {
      setUser(data.user);
      queryClient.setQueryData(["/api/auth/me"], data.user);
    }
  };

  const register = async (email: string, password: string, role: "coach" | "client", fullName?: string) => {
    const response = await apiRequest("POST", "/api/auth/register", { 
      email, 
      password, 
      role,
      fullName: fullName || email.split('@')[0],
      username: email.split('@')[0] + Math.random().toString(36).slice(2, 6),
    });
    const data = await response.json();
    
    if (data.user) {
      setUser(data.user);
      queryClient.setQueryData(["/api/auth/me"], data.user);
    }
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    setUser(null);
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.clear();
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

