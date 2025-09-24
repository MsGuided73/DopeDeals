/**
 * Inventory Service
 * 
 * Provides client-side utilities for inventory validation, reservation,
 * and stock checking with proper error handling and caching.
 */

export interface InventoryItem {
  productId: string;
  quantity: number;
  warehouseId?: string;
}

export interface InventoryValidationResult {
  valid: boolean;
  items: Array<{
    productId: string;
    productName?: string;
    productSku?: string;
    requestedQuantity: number;
    availableStock: number;
    isValid: boolean;
    error?: string;
  }>;
  summary: {
    totalItems: number;
    validItems: number;
    invalidItems: number;
  };
}

export interface InventoryReservation {
  reservationId: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity: number;
  warehouseId: string;
  expiresAt: string;
}

export interface ReservationResult {
  success: boolean;
  reservations: InventoryReservation[];
  errors: Array<{
    productId: string;
    error: string;
  }>;
  summary: {
    totalItems: number;
    reservedItems: number;
    failedItems: number;
    holdMinutes: number;
    expiresAt?: string;
  };
}

export class InventoryService {
  private baseUrl: string;
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  }

  /**
   * Validate inventory availability for multiple items
   */
  async validateInventory(
    items: InventoryItem[],
    userId?: string,
    sessionId?: string
  ): Promise<InventoryValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/inventory/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[InventoryService] Validation error:', error);
      throw new Error('Failed to validate inventory');
    }
  }

  /**
   * Get available stock for a single product
   */
  async getAvailableStock(
    productId: string,
    warehouseId: string = 'main'
  ): Promise<number> {
    const cacheKey = `stock:${productId}:${warehouseId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data.availableStock;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/api/inventory/validate?productId=${productId}&warehouseId=${warehouseId}`
      );

      if (!response.ok) {
        throw new Error(`Stock check failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        expires: Date.now() + this.cacheTimeout
      });

      return result.availableStock || 0;
    } catch (error) {
      console.error('[InventoryService] Stock check error:', error);
      return 0; // Assume out of stock on error
    }
  }

  /**
   * Reserve inventory for checkout
   */
  async reserveInventory(
    items: InventoryItem[],
    options: {
      userId?: string;
      sessionId?: string;
      holdMinutes?: number;
      reason?: string;
      authToken?: string;
    } = {}
  ): Promise<ReservationResult> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
      }

      const response = await fetch(`${this.baseUrl}/api/inventory/reserve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items,
          sessionId: options.sessionId,
          holdMinutes: options.holdMinutes || 15,
          reason: options.reason || 'checkout'
        })
      });

      if (!response.ok) {
        throw new Error(`Reservation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[InventoryService] Reservation error:', error);
      throw new Error('Failed to reserve inventory');
    }
  }

  /**
   * Release inventory reservations
   */
  async releaseReservations(
    reservationIds: string[],
    authToken?: string
  ): Promise<{ success: boolean; released: number; errors: number }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${this.baseUrl}/api/inventory/reserve`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          reservationIds
        })
      });

      if (!response.ok) {
        throw new Error(`Release failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: result.success,
        released: result.summary.releasedReservations,
        errors: result.summary.failedReleases
      };
    } catch (error) {
      console.error('[InventoryService] Release error:', error);
      throw new Error('Failed to release reservations');
    }
  }

  /**
   * Get user's active reservations
   */
  async getActiveReservations(
    authToken?: string,
    sessionId?: string
  ): Promise<InventoryReservation[]> {
    try {
      const headers: Record<string, string> = {};

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const url = new URL(`${this.baseUrl}/api/inventory/reserve`);
      if (sessionId) {
        url.searchParams.set('sessionId', sessionId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Get reservations failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.reservations || [];
    } catch (error) {
      console.error('[InventoryService] Get reservations error:', error);
      return [];
    }
  }

  /**
   * Check if items are available for immediate purchase
   */
  async checkAvailability(items: InventoryItem[]): Promise<boolean> {
    try {
      const validation = await this.validateInventory(items);
      return validation.valid;
    } catch (error) {
      console.error('[InventoryService] Availability check error:', error);
      return false;
    }
  }

  /**
   * Clear cache (useful for testing or after inventory updates)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();

// Export utility functions
export const validateInventory = (items: InventoryItem[], userId?: string, sessionId?: string) =>
  inventoryService.validateInventory(items, userId, sessionId);

export const getAvailableStock = (productId: string, warehouseId?: string) =>
  inventoryService.getAvailableStock(productId, warehouseId);

export const reserveInventory = (items: InventoryItem[], options?: any) =>
  inventoryService.reserveInventory(items, options);

export const releaseReservations = (reservationIds: string[], authToken?: string) =>
  inventoryService.releaseReservations(reservationIds, authToken);

export const checkAvailability = (items: InventoryItem[]) =>
  inventoryService.checkAvailability(items);
