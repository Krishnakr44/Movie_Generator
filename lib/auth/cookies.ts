/**
 * Auth cookie: httpOnly, secure in prod, SameSite=Lax.
 * Cookie name is fixed; do not put token in response body.
 */

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds (match JWT exp or lower)

export function getAuthCookieFromHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((s) => s.trim());
  for (const part of parts) {
    const [name, ...valueParts] = part.split("=");
    if (name?.trim() === COOKIE_NAME && valueParts.length) {
      return decodeURIComponent(valueParts.join("=").trim());
    }
  }
  return null;
}

/** Build Set-Cookie header value to set auth token. */
export function buildSetAuthCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${COOKIE_MAX_AGE}`,
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

/** Build Set-Cookie header value to clear auth cookie. */
export function buildClearAuthCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
