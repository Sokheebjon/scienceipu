/**
 * Fixed-window in-memory rate limit.
 *
 * This is per-instance only. On a serverless platform each cold instance keeps
 * its own counters, so treat it as a way to blunt naive floods rather than as a
 * hard guarantee. Put a platform-level limiter in front for anything stronger.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets; only meaningful when `ok` is false. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    // Opportunistic sweep so a long-lived instance cannot grow without bound.
    if (buckets.size > MAX_TRACKED_KEYS) {
      for (const [existingKey, existing] of buckets) {
        if (existing.resetAt <= now) buckets.delete(existingKey);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfter: 0 };
}

/** Best-effort client address from the usual proxy headers. */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return `${scope}:${address}`;
}
