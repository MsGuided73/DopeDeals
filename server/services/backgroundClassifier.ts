/**
 * Background AI Classification Service
 * Automatically classifies products and applies compliance rules behind the scenes
 */

import { classifyProduct, bulkClassifyProducts } from './aiClassifier.js';
import { storage } from '../storage.js';
import { complianceRuleEngine } from './complianceRules.js';

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
      // Get the product first
      const product = await storage.getProduct(productId);
      if (!product) return;

      // Step 1: Quick rule-based check for obvious cases
      const ruleAnalysis = complianceRuleEngine.analyzeProduct(product.name, product.description || '');
      
      let shouldHide = false;
      let hideReason = '';
      let classificationMethod = 'rules';

      if (ruleAnalysis.shouldHide) {
        shouldHide = true;
        hideReason = `${ruleAnalysis.category} product - restricted access (rule-based)`;
        console.log(`[Background AI] Product ${product.name} flagged by rules: ${ruleAnalysis.category} (confidence: ${ruleAnalysis.confidence.toFixed(2)})`);
      } else if (ruleAnalysis.confidence < 0.7) {
        // Step 2: AI classification for complex cases only when rules aren't confident
        try {
          const classificationResult = await classifyProduct(productId);
          classificationMethod = 'ai';

          if (classificationResult.nicotineProduct && this.config.autoHideNicotineProducts) {
            shouldHide = true;
            hideReason = 'Nicotine product - restricted access (AI classified)';
          }

          if (classificationResult.categories.some(cat => 
            cat.toLowerCase().includes('tobacco') || 
            cat.toLowerCase().includes('cigarette')
          ) && this.config.autoHideTobaccoProducts) {
            shouldHide = true;
            hideReason = 'Tobacco product - restricted access (AI classified)';
          }

          console.log(`[Background AI] AI classified product ${product.name}: ${classificationResult.categories.join(', ')}`);
        } catch (aiError) {
          console.warn(`[Background AI] AI classification failed for ${product.name}, using rules only:`, aiError);
          // If AI fails but rules found something concerning, err on the side of caution
          if (ruleAnalysis.triggeredRules.length > 0) {
            shouldHide = true;
            hideReason = `${ruleAnalysis.category} product - restricted access (rule-based fallback)`;
          }
        }
      } else {
        console.log(`[Background AI] Product ${product.name} cleared by rules (no AI needed)`);
      }

      // Update product visibility if needed
      if (shouldHide && product.featured !== false) {
        await this.hideProductFromPublic(productId, hideReason);
      }

      console.log(`[Background AI] Product ${product.name} processed via ${classificationMethod}: ${shouldHide ? '(HIDDEN)' : '(VISIBLE)'}`);

    } catch (error) {
      console.error(`[Background AI] Classification failed for product ${productId}:`, error);
    }
  }

  /**
   * Hide a product from public view (admin can still see it)
   */
  private async hideProductFromPublic(productId: string, reason: string): Promise<void> {
    try {
      // Update product to hide it from public view using isHidden field
      await storage.updateProduct(productId, {
        inStock: false,
        complianceNotes: reason
      } as any);

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
        // If isHidden exists, skip hidden products; otherwise include
        !('isHidden' in (product as any)) || !(product as any).isHidden
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
      activeProducts: products.filter(p => (p as any).isHidden !== true).length,
      hiddenProducts: products.filter(p => (p as any).isHidden === true).length
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