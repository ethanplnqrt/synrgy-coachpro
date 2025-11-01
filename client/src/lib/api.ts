// SHIELD v10.0 - Centralized API client
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${error}`);
  }
  return res.json();
}

export async function apiGet<T = any>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return handleResponse<T>(res);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  }
}

export async function apiPost<T = any>(path: string, body: any, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      body: JSON.stringify(body),
      ...init,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return handleResponse<T>(res);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  }
}

export async function apiPut<T = any>(path: string, body: any, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    ...init
  });
  return handleResponse<T>(res);
}
