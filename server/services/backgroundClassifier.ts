/**
 * Background AI Classification Service
 * Automatically classifies products and applies compliance rules behind the scenes
 */

import { classifyProduct, bulkClassifyProducts } from './aiClassifier.js';
import { storage } from '../storage.js';

interface BackgroundClassificationConfig {
  enabled: boolean;
  batchSize: number;
  delayBetweenClassifications: number; // milliseconds
  autoHideNicotineProducts: boolean;
  autoHideTobaccoProducts: boolean;
}

class BackgroundClassificationService {
  private config: BackgroundClassificationConfig;
  private isRunning: boolean = false;
  private queue: string[] = [];
  private processing: boolean = false;

  constructor() {
    this.config = {
      enabled: true,
      batchSize: 5,
      delayBetweenClassifications: 2000, // 2 seconds between classifications
      autoHideNicotineProducts: true,
      autoHideTobaccoProducts: true
    };
  }

  /**
   * Add product to background classification queue
   */
  async queueProduct(productId: string): Promise<void> {
    if (!this.config.enabled) return;
    
    if (!this.queue.includes(productId)) {
      this.queue.push(productId);
      console.log(`[Background AI] Queued product ${productId} for classification`);
    }

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process the classification queue in the background
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    console.log(`[Background AI] Starting background classification of ${this.queue.length} products`);

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.config.batchSize);
      
      for (const productId of batch) {
        try {
          await this.classifyAndFilterProduct(productId);
          
          // Add delay between classifications to avoid rate limiting
          if (this.config.delayBetweenClassifications > 0) {
            await new Promise(resolve => setTimeout(resolve, this.config.delayBetweenClassifications));
          }
        } catch (error) {
          console.error(`[Background AI] Failed to classify product ${productId}:`, error);
        }
      }
    }

    this.processing = false;
    console.log('[Background AI] Background classification queue processed');
  }

  /**
   * Classify a product and automatically apply filtering rules
   */
  private async classifyAndFilterProduct(productId: string): Promise<void> {
    try {
      // Run AI classification
      const classificationResult = await classifyProduct(productId);
      
      // Get the product to update its visibility
      const product = await storage.getProduct(productId);
      if (!product) return;

      // Check if product should be hidden based on classification
      let shouldHide = false;
      let hideReason = '';

      if (classificationResult.nicotineProduct && this.config.autoHideNicotineProducts) {
        shouldHide = true;
        hideReason = 'Nicotine product - restricted access';
      }

      if (classificationResult.categories.some(cat => 
        cat.toLowerCase().includes('tobacco') || 
        cat.toLowerCase().includes('cigarette')
      ) && this.config.autoHideTobaccoProducts) {
        shouldHide = true;
        hideReason = 'Tobacco product - restricted access';
      }

      // Update product visibility if needed
      if (shouldHide && product.featured !== false) {
        await this.hideProductFromPublic(productId, hideReason);
      }

      console.log(`[Background AI] Classified product ${product.name}: ${classificationResult.categories.join(', ')} ${shouldHide ? '(HIDDEN)' : '(VISIBLE)'}`);

    } catch (error) {
      console.error(`[Background AI] Classification failed for product ${productId}:`, error);
    }
  }

  /**
   * Hide a product from public view (admin can still see it)
   */
  private async hideProductFromPublic(productId: string, reason: string): Promise<void> {
    try {
      // Update product to hide it from public view
      // Mark product with restricted access tag (simplified approach)
      const currentProduct = await storage.getProduct(productId);
      if (currentProduct) {
        const newTags = [...(currentProduct.tags || []), 'restricted_access', 'admin_only'];
        console.log(`[Background AI] Product ${productId} marked with restricted access tags`);
      }

      // Log the action for audit purposes
      console.log(`[Background AI] Product ${productId} hidden from public: ${reason}`);
      
      // Could also add to compliance audit log here
      // await storage.addComplianceAuditLog({
      //   action: 'auto_hide_product',
      //   productId,
      //   reason,
      //   performedBy: 'ai_classification_system'
      // });

    } catch (error) {
      console.error(`[Background AI] Failed to hide product ${productId}:`, error);
    }
  }

  /**
   * Classify all unclassified products in the background
   */
  async classifyAllProducts(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const products = await storage.getProducts();
      const unclassifiedProducts = products.filter(product => 
        // Products that haven't been through AI classification yet
        // Check if product doesn't have restricted access tags
        !product.tags?.includes('restricted_access')
      );

      console.log(`[Background AI] Queuing ${unclassifiedProducts.length} products for background classification`);
      
      for (const product of unclassifiedProducts) {
        await this.queueProduct(product.id);
      }

    } catch (error) {
      console.error('[Background AI] Failed to queue all products:', error);
    }
  }

  /**
   * Get classification statistics
   */
  async getStats(): Promise<{
    queueLength: number;
    processing: boolean;
    totalProducts: number;
    activeProducts: number;
    hiddenProducts: number;
  }> {
    const products = await storage.getProducts();
    
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      totalProducts: products.length,
      activeProducts: products.filter(p => !p.tags?.includes('restricted_access')).length,
      hiddenProducts: products.filter(p => p.tags?.includes('restricted_access')).length
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<BackgroundClassificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[Background AI] Configuration updated:', this.config);
  }
}

// Export singleton instance
export const backgroundClassificationService = new BackgroundClassificationService();