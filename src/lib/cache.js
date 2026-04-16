// ── Server-Side In-Memory Cache ────────────────────────────────────
// Simple Map-based cache with TTL support.
// Avoids external Redis dependency for MVP.

const cache = new Map();

/**
 * Get a value from cache. Returns undefined if expired or missing.
 * @param {string} key
 */
export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

/**
 * Set a value in cache with a TTL in seconds.
 * @param {string} key
 * @param {*} value
 * @param {number} ttlSeconds
 */
export function cacheSet(key, value, ttlSeconds) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Delete a key from cache.
 * @param {string} key
 */
export function cacheDel(key) {
  cache.delete(key);
}

/**
 * Clear all cache entries (useful for testing).
 */
export function cacheClear() {
  cache.clear();
}

/** Return cache size (for debugging). */
export function cacheSize() {
  return cache.size;
}
