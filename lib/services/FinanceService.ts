/**
 * FinanceService
 * 
 * Centralized logic for financial calculations to ensure consistency 
 * between the cart, checkout API, and payment gateway.
 */
export class FinanceService {
  // Current tax rates by state
  private static readonly STATE_TAX_RATES: Record<string, number> = {
    'CA': 0.0875, // California (Average) - Suggesting specific city rates later
    'NY': 0.08875, // New York City
    'TX': 0.0625,  // Texas (Base)
    'FL': 0.06,    // Florida (Base)
    'WA': 0.065,   // Washington (Base)
  };

  private static DEFAULT_TAX_RATE = 0.08; // 8% default for unknown states
  private static FREE_SHIPPING_THRESHOLD = 75;
  private static STANDARD_SHIPPING_RATE = 9.99;
  private static EXPRESS_SHIPPING_RATE = 19.99;

  /**
   * Calculates subtotal for a list of items
   */
  static calculateSubtotal(items: any[]): number {
    return items.reduce((sum, item) => {
      // Cart items from the API use priceAtTime (locked price at add-time)
      // Fall back through all possible field name variants
      const price =
        item.priceAtTime ||
        item.price_at_time ||
        item.price ||
        item.product?.currentPrice ||
        item.product?.our_price ||
        0;
      return sum + (Number(price) * (item.quantity || 1));
    }, 0);
  }

  /**
   * Calculates tax based on subtotal and state
   */
  static calculateTax(subtotal: number, state: string | null): number {
    if (!state) return this.round(subtotal * this.DEFAULT_TAX_RATE);
    const rate = this.STATE_TAX_RATES[state.toUpperCase()] || this.DEFAULT_TAX_RATE;
    return this.round(subtotal * rate);
  }

  /**
   * Calculates shipping price based on selection and threshold
   */
  static calculateShipping(subtotal: number, method: 'standard' | 'express' = 'standard'): number {
    if (method === 'express') return this.EXPRESS_SHIPPING_RATE;
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) return 0;
    return this.STANDARD_SHIPPING_RATE;
  }

  /**
   * Formats a number to 2 decimal places (string) for API consumption
   */
  static formatAmount(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Rounds a number to 2 decimal places to avoid floating point issues
   */
  private static round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
