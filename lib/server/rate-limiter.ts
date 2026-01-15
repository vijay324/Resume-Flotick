/**
 * In-memory rate limiter for AI requests
 * In production, this should be replaced with Redis for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private requestsPerDay: number;

  constructor(requestsPerDay: number = 50) {
    this.requestsPerDay = requestsPerDay;

    // Clean up expired entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  /**
   * Check if a user can make a request
   * @param userId - User identifier (device ID)
   * @returns true if allowed, false if rate limited
   */
  async checkLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const entry = this.limits.get(userId);

    if (!entry) {
      // First request from this user
      this.limits.set(userId, {
        count: 1,
        resetAt: this.getResetTime(now),
      });
      return true;
    }

    // Check if the limit has reset
    if (now >= entry.resetAt) {
      this.limits.set(userId, {
        count: 1,
        resetAt: this.getResetTime(now),
      });
      return true;
    }

    // Check if under limit
    if (entry.count < this.requestsPerDay) {
      entry.count++;
      return true;
    }

    // Rate limited
    return false;
  }

  /**
   * Increment the counter for a user (call after successful request)
   */
  async incrementCount(userId: string): Promise<void> {
    // Already incremented in checkLimit
  }

  /**
   * Get remaining requests for a user
   */
  async getRemainingRequests(userId: string): Promise<{
    remaining: number;
    resetAt: number;
  }> {
    const now = Date.now();
    const entry = this.limits.get(userId);

    if (!entry || now >= entry.resetAt) {
      return {
        remaining: this.requestsPerDay,
        resetAt: this.getResetTime(now),
      };
    }

    return {
      remaining: Math.max(0, this.requestsPerDay - entry.count),
      resetAt: entry.resetAt,
    };
  }

  /**
   * Get the reset time (start of next day in UTC)
   */
  private getResetTime(now: number): number {
    const date = new Date(now);
    date.setUTCHours(24, 0, 0, 0);
    return date.getTime();
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [userId, entry] of this.limits.entries()) {
      if (now >= entry.resetAt) {
        this.limits.delete(userId);
      }
    }
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

/**
 * Get or create the rate limiter instance
 */
export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    const limit = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_DAY || "50", 10);
    rateLimiterInstance = new RateLimiter(limit);
  }
  return rateLimiterInstance;
}

/**
 * Check if a request is rate limited
 * @returns Error message if rate limited, null if allowed
 */
export async function checkRateLimit(userId: string): Promise<string | null> {
  const limiter = getRateLimiter();
  const allowed = await limiter.checkLimit(userId);

  if (!allowed) {
    const { resetAt } = await limiter.getRemainingRequests(userId);
    const resetDate = new Date(resetAt);
    return `Rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}`;
  }

  return null;
}
