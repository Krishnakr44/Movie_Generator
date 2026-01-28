/**
 * Auth-related env; validated at runtime where used.
 * Never log or expose JWT_SECRET.
 */

const AUTH_CONFIG_ERROR = "AUTH_CONFIG_MISSING";

export function getJwtSecret(): string {
  const s = process.env.JWT_SECRET?.trim();
  if (!s || s.length < 32) {
    const err = new Error(
      "JWT_SECRET must be set and at least 32 characters (use openssl rand -hex 32)"
    ) as Error & { code?: string };
    err.code = AUTH_CONFIG_ERROR;
    throw err;
  }
  return s;
}

export function getAppUrl(): string {
  const u = process.env.APP_URL?.trim();
  if (!u) {
    const err = new Error("APP_URL must be set (e.g. http://localhost:3000)") as Error & {
      code?: string;
    };
    err.code = AUTH_CONFIG_ERROR;
    throw err;
  }
  return u.replace(/\/$/, "");
}

/** Use this to fail fast and return 503 instead of 500 when env is missing. */
export function isAuthConfigError(e: unknown): boolean {
  return e instanceof Error && (e as Error & { code?: string }).code === AUTH_CONFIG_ERROR;
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || "7d";
}
