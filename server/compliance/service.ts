import { storage } from '../storage.js';
import type { 
  ComplianceRule, 
  InsertComplianceRule, 
  ProductCompliance, 
  InsertProductCompliance,
  ComplianceAuditLog,
  InsertComplianceAuditLog,
  Product
} from '../../shared/schema.js';

export interface ComplianceViolation {
  productId: string;
  violation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

export interface StateRestriction {
  state: string;
  reason: string;
  allowedWithRestrictions?: boolean;
  requiredWarnings?: string[];
}

export class ComplianceService {
  
  // Default compliance rules for high-risk categories
  private readonly defaultRules: Record<string, Partial<InsertComplianceRule>> = {
    'THCA': {
      category: 'THCA',
      substanceType: 'Delta-9 THC Precursor',
      restrictedStates: ['ID', 'KS', 'NE', 'NC', 'SC', 'TN', 'TX', 'UT', 'WY'],
      ageRequirement: 21,
      labTestingRequired: true,
      batchTrackingRequired: true,
      warningLabels: [
        'This product has not been evaluated by the FDA',
        'This product may convert to Delta-9 THC when heated',
        'Keep out of reach of children and pets',
        'Do not drive or operate machinery after use',
        'For adult use only (21+)'
      ],
      shippingRestrictions: {
        carrierRestrictions: ['FedEx', 'UPS'],
        requiresAdultSignature: true,
        maxQuantityPerOrder: 10,
        noInternationalShipping: true
      }
    },
    'Kratom': {
      category: 'Kratom',
      substanceType: 'Mitragyna speciosa',
      restrictedStates: ['AL', 'AR', 'IN', 'RI', 'VT', 'WI'],
      ageRequirement: 18,
      labTestingRequired: true,
      batchTrackingRequired: true,
      warningLabels: [
        'This product has not been evaluated by the FDA',
        'Not for human consumption',
        'Keep out of reach of children and pets',
        'Consult your physician before use',
        'May cause drowsiness'
      ],
      shippingRestrictions: {
        requiresAdultSignature: true,
        maxQuantityPerOrder: 50,
        noInternationalShipping: true
      }
    },
    '7-Hydroxy': {
      category: '7-Hydroxy',
      substanceType: '7-Hydroxymitragynine',
      restrictedStates: ['AL', 'AR', 'IN', 'RI', 'VT', 'WI', 'TN'],
      ageRequirement: 21,
      labTestingRequired: true,
      batchTrackingRequired: true,
      warningLabels: [
        'This product has not been evaluated by the FDA',
        'Extremely potent - use with caution',
        'Not for human consumption',
        'Keep out of reach of children and pets',
        'For research purposes only'
      ],
      shippingRestrictions: {
        requiresAdultSignature: true,
        maxQuantityPerOrder: 5,
        noInternationalShipping: true,
        specialHandling: true
      }
    },
    'Nicotine': {
      category: 'Nicotine',
      substanceType: 'Tobacco/Nicotine Products',
      restrictedStates: [], // Generally legal but age-restricted
      ageRequirement: 21,
      labTestingRequired: false,
      batchTrackingRequired: false,
      warningLabels: [
        'WARNING: This product contains nicotine',
        'Nicotine is an addictive chemical',
        'Keep out of reach of children and pets',
        'For adult use only (21+)'
      ],
      shippingRestrictions: {
        requiresAdultSignature: true,
        noInternationalShipping: true
      }
    }
  };

  /**
   * Initialize default compliance rules in the database
   */
  async initializeDefaultRules(): Promise<void> {
    try {
      for (const [category, ruleData] of Object.entries(this.defaultRules)) {
        // Check if rule already exists
        const existingRules = await storage.getComplianceRulesByCategory(category);
        
        if (existingRules.length === 0) {
          await storage.createComplianceRule(ruleData as InsertComplianceRule);
          console.log(`[Compliance] Initialized default rule for ${category}`);
        }
      }
    } catch (error) {
      console.error('[Compliance] Failed to initialize default rules:', error);
    }
  }

  /**
   * Check if a product is compliant for sale in a specific state
   */
  async checkStateCompliance(productId: string, state: string): Promise<{
    allowed: boolean;
    violations: string[];
    warnings: string[];
  }> {
    const productCompliances = await storage.getProductComplianceByProductId(productId);
    const violations: string[] = [];
    const warnings: string[] = [];
    let allowed = true;

    for (const compliance of productCompliances) {
      const rule = await storage.getComplianceRuleById(compliance.complianceId);
      
      if (rule && rule.restrictedStates.includes(state)) {
        allowed = false;
        violations.push(`Product contains ${rule.category} which is restricted in ${state}`);
      }

      if (rule?.warningLabels) {
        warnings.push(...rule.warningLabels);
      }
    }

    return { allowed, violations, warnings };
  }

  /**
   * Audit a product for compliance violations
   */
  async auditProduct(productId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const product = await storage.getProductById(productId);
    
    if (!product) {
      return violations;
    }

    const productCompliances = await storage.getProductComplianceByProductId(productId);

    for (const compliance of productCompliances) {
      const rule = await storage.getComplianceRuleById(compliance.complianceId);
      
      if (!rule) continue;

      // Check lab testing requirement
      if (rule.labTestingRequired && !product.labTestUrl) {
        violations.push({
          productId,
          violation: `Missing required lab test results for ${rule.category} product`,
          severity: 'high',
          notes: 'Lab testing is required for this substance category'
        });
      }

      // Check batch tracking requirement  
      if (rule.batchTrackingRequired && !product.batchNumber) {
        violations.push({
          productId,
          violation: `Missing required batch number for ${rule.category} product`,
          severity: 'medium',
          notes: 'Batch tracking is required for this substance category'
        });
      }

      // Check expiration date for products that require it
      if (rule.batchTrackingRequired && !product.expirationDate) {
        violations.push({
          productId,
          violation: `Missing expiration date for ${rule.category} product`,
          severity: 'medium',
          notes: 'Expiration date tracking is required for this substance category'
        });
      }

      // Check if nicotine products are properly restricted
      if (rule.category === 'Nicotine' && product.visibleOnMainSite) {
        violations.push({
          productId,
          violation: 'Nicotine product visible on main site',
          severity: 'critical',
          notes: 'Nicotine products must only be visible on tobacco-specific site'
        });
      }
    }

    return violations;
  }

  /**
   * Log compliance violations to audit trail
   */
  async logViolations(violations: ComplianceViolation[], detectedBy: string = 'system'): Promise<void> {
    for (const violation of violations) {
      const auditLog: InsertComplianceAuditLog = {
        productId: violation.productId,
        violation: violation.violation,
        severity: violation.severity,
        notes: violation.notes,
        resolvedBy: null
      };

      await storage.createComplianceAuditLog(auditLog);
    }
  }

  /**
   * Get compliance summary for a product
   */
  async getProductComplianceSummary(productId: string): Promise<{
    compliant: boolean;
    activeRules: ComplianceRule[];
    violations: ComplianceViolation[];
    restrictedStates: string[];
    requiredWarnings: string[];
  }> {
    const productCompliances = await storage.getProductComplianceByProductId(productId);
    const activeRules: ComplianceRule[] = [];
    const restrictedStates: string[] = [];
    const requiredWarnings: string[] = [];

    for (const compliance of productCompliances) {
      const rule = await storage.getComplianceRuleById(compliance.complianceId);
      if (rule) {
        activeRules.push(rule);
        restrictedStates.push(...rule.restrictedStates);
        requiredWarnings.push(...rule.warningLabels);
      }
    }

    const violations = await this.auditProduct(productId);
    const compliant = violations.length === 0;

    return {
      compliant,
      activeRules,
      violations,
      restrictedStates: Array.from(new Set(restrictedStates)),
      requiredWarnings: Array.from(new Set(requiredWarnings))
    };
  }

  /**
   * Assign compliance rule to product
   */
  async assignComplianceToProduct(productId: string, category: string): Promise<void> {
    const rules = await storage.getComplianceRulesByCategory(category);
    
    if (rules.length === 0) {
      // Create default rule if it doesn't exist
      const defaultRule = this.defaultRules[category];
      if (defaultRule) {
        const newRule = await storage.createComplianceRule(defaultRule as InsertComplianceRule);
        await storage.createProductCompliance({
          productId,
          complianceId: newRule.id
        });
      }
    } else {
      // Use existing rule
      const rule = rules[0];
      await storage.createProductCompliance({
        productId,
        complianceId: rule.id
      });
    }
  }

  /**
   * Bulk audit all products for compliance violations
   */
  async auditAllProducts(): Promise<{
    totalProducts: number;
    violationsFound: number;
    criticalViolations: number;
  }> {
    const products = await storage.getAllProducts();
    let violationsFound = 0;
    let criticalViolations = 0;

    for (const product of products) {
      const violations = await this.auditProduct(product.id);
      
      if (violations.length > 0) {
        violationsFound += violations.length;
        criticalViolations += violations.filter(v => v.severity === 'critical').length;
        await this.logViolations(violations, 'system-audit');
      }
    }

    return {
      totalProducts: products.length,
      violationsFound,
      criticalViolations
    };
  }
}

export const complianceService = new ComplianceService();