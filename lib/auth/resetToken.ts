import crypto from "crypto";

const HASH_ALG = "sha256";
const TOKEN_BYTES = 32;

/** Generate a secure random token (send in link) and its hash for DB storage. */
export function generateResetToken(): { token: string; hashed: string } {
  const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const hashed = crypto.createHash(HASH_ALG).update(token).digest("hex");
  return { token, hashed };
}

/** Hash an incoming token for comparison. Use timing-safe compare when comparing. */
export function hashResetToken(token: string): string {
  return crypto.createHash(HASH_ALG).update(token).digest("hex");
}

/** Constant-time comparison to prevent timing attacks. */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}
