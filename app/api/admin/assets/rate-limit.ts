/**
 * Rate Limiting for Asset Manager API
 * Prevents abuse and ensures fair usage
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Get or create rate limit entry
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  const entry = rateLimitStore[key];

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get rate limit identifier from request
 * Uses user ID if authenticated, otherwise IP address
 */
export function getRateLimitIdentifier(
  userId?: string,
  ip?: string
): string {
  return userId || ip || 'anonymous';
}

/**
 * Rate limit configurations for different operations
 */
export const RATE_LIMITS = {
  // List assets: 100 requests per minute
  list: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
  
  // Upload: 20 uploads per minute
  upload: {
    maxRequests: 20,
    windowMs: 60 * 1000,
  },
  
  // Delete: 50 deletes per minute
  delete: {
    maxRequests: 50,
    windowMs: 60 * 1000,
  },
} as const;

/**
 * Format rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig) {
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
}

