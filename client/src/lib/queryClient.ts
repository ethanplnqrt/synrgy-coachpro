import { QueryClient } from "@tanstack/react-query";

// API Base URL from environment or fallback to relative
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};

  // Prepend API_BASE if URL is relative
  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Removes auth token - kept for compatibility but auth is now cookie-based
 */
export function removeAuthToken() {
  // Auth is now handled via httpOnly cookies
  // This function is kept for backward compatibility
  queryClient.clear();
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