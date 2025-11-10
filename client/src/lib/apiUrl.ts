/**
 * API URL helper - Centralizes API base URL configuration
 * Supports both relative URLs (local dev with proxy) and absolute URLs (production)
 */

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/**
 * Converts a relative API path to a full URL
 * @param path - API path (e.g., "/auth/me" or "auth/me")
 * @returns Full URL for the API endpoint
 */
export function apiUrl(path: string): string {
  // If path already has API_BASE or is absolute, return as-is
  if (path.startsWith("http") || path.includes(API_BASE)) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // For paths starting with /api, replace with API_BASE
  if (normalizedPath.startsWith("/api")) {
    return API_BASE + normalizedPath.slice(4);
  }
  
  return API_BASE + normalizedPath;
}

export { API_BASE };

