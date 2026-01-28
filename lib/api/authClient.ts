/**
 * Client-side auth API calls. Uses credentials: "include" so httpOnly cookies are sent.
 */

const BASE = "";

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

async function jsonFetch<T>(
  path: string,
  options: RequestInit & { body?: Record<string, unknown> } = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const { body, ...init } = options;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
    ...(body != null && { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => ({}));
  const error = (data as { error?: string }).error ?? (data as { message?: string }).message;
  return { data: data as T, error, status: res.status };
}

export const authClient = {
  async register(email: string, password: string) {
    return jsonFetch<{ user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });
  },

  async login(email: string, password: string) {
    return jsonFetch<{ user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  async logout() {
    return jsonFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },

  async me() {
    return jsonFetch<{ user: AuthUser }>("/api/auth/me");
  },

  async forgotPassword(email: string) {
    return jsonFetch<{ message?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },

  async resetPassword(token: string, password: string) {
    return jsonFetch<{ message?: string }>("/api/auth/reset-password", {
      method: "POST",
      body: { token, password },
    });
  },
};
