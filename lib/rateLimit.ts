/**
 * In-memory rate limiter for story generation (per IP).
 * For production at scale, replace with Redis or similar.
 */
const windowMs = 60 * 1000; // 1 minute
const store = new Map<string, { count: number; resetAt: number }>();

function getLimit(): number {
  const n = parseInt(process.env.STORY_RATE_LIMIT_PER_MIN ?? "10", 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

/** Returns true if request is allowed, false if rate limited. */
export function checkRateLimit(ip: string): boolean {
  const limit = getLimit();
  const now = Date.now();
  let entry = store.get(ip);
  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(ip, entry);
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export function getRateLimitHeaders(ip: string): { remaining: number; resetAt: number } {
  const limit = getLimit();
  const entry = store.get(ip);
  if (!entry) return { remaining: limit - 1, resetAt: Date.now() + windowMs };
  const remaining = Math.max(0, limit - entry.count);
  return { remaining, resetAt: entry.resetAt };
}
