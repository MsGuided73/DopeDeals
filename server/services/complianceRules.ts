/**
 * Rule-based compliance system to supplement AI classification
 * Provides fast, deterministic classification for obvious cases
 */

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  category: 'nicotine' | 'tobacco' | 'cbd' | 'thca' | 'kratom' | 'restricted';
  action: 'hide' | 'restrict' | 'flag' | 'require_verification';
  priority: number; // Higher numbers = higher priority
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  // Nicotine Products
  {
    id: 'nicotine_obvious',
    name: 'Obvious Nicotine Products',
    description: 'Products clearly containing nicotine',
    keywords: ['nicotine', 'nic pouch', 'nic salt', 'zyn', 'velo', 'rogue', 'on!', 'pouches'],
    category: 'nicotine',
    action: 'hide',
    priority: 100
  },
  
  // Tobacco Products
  {
    id: 'tobacco_obvious',
    name: 'Obvious Tobacco Products',
    description: 'Products clearly containing tobacco',
    keywords: ['tobacco', 'cigarette', 'cigar', 'pipe tobacco', 'chewing tobacco', 'snuff'],
    category: 'tobacco',
    action: 'hide',
    priority: 100
  },

  // Vaping/E-cigarette Products
  {
    id: 'vaping_devices',
    name: 'Vaping Devices',
    description: 'E-cigarettes and vaping devices',
    keywords: ['e-cigarette', 'e-cig', 'vape pen', 'mod', 'tank', 'coil', 'cartridge'],
    category: 'nicotine',
    action: 'restrict',
    priority: 90
  },

  // THCA Products (high priority)
  {
    id: 'thca_products',
    name: 'THCA Products',
    description: 'Products containing THCA',
    keywords: ['thca', 'thc-a', 'delta-9 thca', 'hemp flower', 'pre-roll'],
    category: 'thca',
    action: 'require_verification',
    priority: 95
  },

  // Kratom Products
  {
    id: 'kratom_products',
    name: 'Kratom Products',
    description: 'Products containing kratom',
    keywords: ['kratom', 'mitragyna', 'bali', 'maeng da', 'red vein', 'white vein', 'green vein'],
    category: 'kratom',
    action: 'restrict',
    priority: 85
  },

  // CBD Products (lower priority, often legal)
  {
    id: 'cbd_products',
    name: 'CBD Products',
    description: 'Products containing CBD',
    keywords: ['cbd', 'cannabidiol', 'hemp oil', 'hemp extract'],
    category: 'cbd',
    action: 'flag',
    priority: 50
  }
];

export class ComplianceRuleEngine {
  private rules: ComplianceRule[];

  constructor(customRules: ComplianceRule[] = []) {
    this.rules = [...COMPLIANCE_RULES, ...customRules].sort((a, b) => b.priority - a.priority);
  }

  /**
   * Analyze product name and description against compliance rules
   */
  analyzeProduct(productName: string, productDescription?: string): {
    triggeredRules: ComplianceRule[];
    highestPriorityAction: string | null;
    category: string | null;
    shouldHide: boolean;
    confidence: number;
  } {
    const text = `${productName} ${productDescription || ''}`.toLowerCase();
    const triggeredRules: ComplianceRule[] = [];

    // Check each rule against the product text
    for (const rule of this.rules) {
      const matched = rule.keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );

      if (matched) {
        triggeredRules.push(rule);
      }
    }

    // Determine the highest priority action and category
    const highestPriorityRule = triggeredRules[0] || null;
    const shouldHide = triggeredRules.some(rule => 
      rule.action === 'hide' || rule.action === 'restrict'
    );

    // Calculate confidence based on number of triggered rules and their priorities
    const confidence = triggeredRules.length > 0 
      ? Math.min(1.0, triggeredRules.reduce((sum, rule) => sum + (rule.priority / 100), 0) / triggeredRules.length)
      : 0;

    return {
      triggeredRules,
      highestPriorityAction: highestPriorityRule?.action || null,
      category: highestPriorityRule?.category || null,
      shouldHide,
      confidence
    };
  }

  /**
   * Quick check if a product should be immediately hidden
   */
  shouldHideProduct(productName: string, productDescription?: string): boolean {
    const analysis = this.analyzeProduct(productName, productDescription);
    return analysis.shouldHide;
  }

  /**
   * Get all rules for a specific category
   */
  getRulesByCategory(category: string): ComplianceRule[] {
    return this.rules.filter(rule => rule.category === category);
  }

  /**
   * Add a new custom rule
   */
  addRule(rule: ComplianceRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get statistics about rule usage
   */
  getRuleStats(): {
    totalRules: number;
    rulesByCategory: Record<string, number>;
    rulesByAction: Record<string, number>;
  } {
    const rulesByCategory: Record<string, number> = {};
    const rulesByAction: Record<string, number> = {};

    this.rules.forEach(rule => {
      rulesByCategory[rule.category] = (rulesByCategory[rule.category] || 0) + 1;
      rulesByAction[rule.action] = (rulesByAction[rule.action] || 0) + 1;
    });

    return {
      totalRules: this.rules.length,
      rulesByCategory,
      rulesByAction
    };
  }
}

// Export singleton instance
export const complianceRuleEngine = new ComplianceRuleEngine();