import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Set JWT token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem("auth_token", token);
}

// Remove JWT token from localStorage
export function removeAuthToken() {
  localStorage.removeItem("auth_token");
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = getAuthToken();
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: i => Math.min(500 * 2 ** i, 4000),
      staleTime: 15_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});