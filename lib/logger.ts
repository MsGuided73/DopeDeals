/**
 * Structured logger that respects environment.
 *
 * - Development: logs everything to console
 * - Production: only logs warnings and errors (no debug/info noise)
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('[Cart]', 'Item added', { productId });
 *   logger.error('[Checkout]', 'Payment failed', error);
 */

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  /** Debug-level: only in development */
  debug(...args: unknown[]) {
    if (!isProduction) console.log(...args);
  },

  /** Info-level: only in development */
  info(...args: unknown[]) {
    if (!isProduction) console.log(...args);
  },

  /** Warning-level: always logged */
  warn(...args: unknown[]) {
    console.warn(...args);
  },

  /** Error-level: always logged */
  error(...args: unknown[]) {
    console.error(...args);
  },
};
