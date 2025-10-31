/**
 * Compliance Guard - Critical System for Nicotine Product Filtering
 * ENSURES Highway 420 NEVER DISPLAYS NICOTINE PRODUCTS
 */

export interface ComplianceCheck {
  productId: string;
  isCompliant: boolean;
  violations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface ComplianceReport {
  totalProducts: number;
  compliantProducts: number;
  violationsFound: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastScan: string;
  flaggedProducts: string[];
}

/**
 * Product categories that are inherently nicotine-free accessories
 * These cannot contain nicotine by physical nature
 */
const NICOTINE_FREE_CATEGORIES = [
  'pipes', 'bongs', 'dab-rigs', 'bowls-stems', 'percolators', 'downstems',
  'carb caps', 'nails', 'grinders', 'screens', 'storage', 'screens',
  'tools', 'accessories', 'hookahs', 'shisha', 'water adapters'
];

/**
 * High-risk product detection patterns
 */
const HIGH_RISK_PATTERNS = {
  nicotine: [
    'nicotine', 'tobacco', 'cigarette', 'cigar', 'vape', 'e-liquid',
    'e-juice', 'salt nic', 'freebase', 'synthetic nicotine',
    'tobacco leaf', 'nic salt', 'vaporizer', 'e-cigarette'
  ],
  kratom: [
    'kratom', 'mitragyna', 'speciosa', '7-hydroxy', '7hydroxymitragynine',
    '7-oh', 'hydroxymitragynine', 'mitragynine'
  ],
  delta8: [
    'delta 8', 'delta-8', 'd8', 'delta8', 'delta 8 thc', 'd8 thc'
  ],
  delta10: [
    'delta 10', 'delta-10', 'd10', 'delta10', 'delta 10 thc', 'd10 thc'
  ],
  thca: [
    'thca', 'thc-a', 'tetrahydrocannabinolic acid', 'thca flower',
    'thca concentrate', 'thca diamond'
  ]
};

/**
 * Compliance violation severity levels
 */
const VIOLATION_SEVERITY = {
  nicotine: 'critical',
  tobacco: 'critical',
  kratom: 'high',
  delta8: 'high',
  delta10: 'high',
  thca: 'medium'
};

/**
 * Check if a product contains nicotine or tobacco
 */
export function isNicotineProduct(product: {
  name: string;
  description?: string | null;
  nicotine_product?: boolean;
  tobacco_product?: boolean;
  category?: string | null;
}): boolean {
  // Check if this is an accessory category that cannot contain nicotine
  const isAccessoryCategory = product.category &&
    NICOTINE_FREE_CATEGORIES.some(accessoryCategory =>
      product.category!.toLowerCase().includes(accessoryCategory.toLowerCase())
    );

  if (isAccessoryCategory) {
    console.log(`✋ ACCESSORY EXEMPTION: Skipping nicotine checks for ${product.name} (category: ${product.category})`);
    return false;
  }

  // First check database flags (most reliable)
  if (product.nicotine_product === true || product.tobacco_product === true) {
    console.warn(`🚨 COMPLIANCE VIOLATION: Product ${product.name} flagged as nicotine/tobacco in database`);
    return true;
  }

  // Check product name and description
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();

  // Check for nicotine/tobacco keywords
  const nicotineKeywords = HIGH_RISK_PATTERNS.nicotine;
  const hasNicotineKeywords = nicotineKeywords.some(keyword =>
    searchText.includes(keyword.toLowerCase())
  );

  if (hasNicotineKeywords) {
    console.warn(`🚨 COMPLIANCE VIOLATION: Product ${product.name} contains nicotine keywords`);
    return true;
  }

  return false;
}

/**
 * Check if a product is high-risk (requires special handling)
 */
export function isHighRiskProduct(product: {
  name: string;
  description?: string | null;
  category?: string | null;
}): { isHighRisk: boolean; riskType: string | null; severity: string } {
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();

  // Check each risk category
  for (const [riskType, keywords] of Object.entries(HIGH_RISK_PATTERNS)) {
    const hasKeywords = keywords.some(keyword =>
      searchText.includes(keyword.toLowerCase())
    );

    if (hasKeywords) {
      return {
        isHighRisk: true,
        riskType,
        severity: VIOLATION_SEVERITY[riskType as keyof typeof VIOLATION_SEVERITY] || 'medium'
      };
    }
  }

  return { isHighRisk: false, riskType: null, severity: 'low' };
}

/**
 * Comprehensive compliance check for a single product
 */
export function performComplianceCheck(product: any): ComplianceCheck {
  const violations: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // Check for nicotine products (CRITICAL)
  if (isNicotineProduct(product)) {
    violations.push('NICOTINE_PRODUCT_VIOLATION');
    riskLevel = 'critical';
  }

  // Check for high-risk products
  const highRiskCheck = isHighRiskProduct(product);
  if (highRiskCheck.isHighRisk && highRiskCheck.riskType) {
    violations.push(`${highRiskCheck.riskType.toUpperCase()}_RISK`);
    if (highRiskCheck.severity === 'high') riskLevel = 'high';
    else if (highRiskCheck.severity === 'medium' && riskLevel === 'low') riskLevel = 'medium';
  }

  // Check for missing compliance fields
  if (product.nicotine_product === null || product.nicotine_product === undefined) {
    violations.push('MISSING_NICOTINE_FLAG');
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  if (product.tobacco_product === null || product.tobacco_product === undefined) {
    violations.push('MISSING_TOBACCO_FLAG');
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  return {
    productId: product.id,
    isCompliant: violations.length === 0,
    violations,
    riskLevel,
    timestamp: new Date().toISOString()
  };
}

/**
 * Filter products to ensure compliance
 */
export function filterCompliantProducts(products: any[]): any[] {
  console.log(`🔒 COMPLIANCE: Filtering ${products.length} products for nicotine compliance`);

  const compliantProducts = products.filter(product => {
    const check = performComplianceCheck(product);

    if (!check.isCompliant) {
      console.warn(`🚨 COMPLIANCE: Filtering out non-compliant product:`, {
        id: product.id,
        name: product.name,
        violations: check.violations,
        riskLevel: check.riskLevel
      });
      return false;
    }

    return true;
  });

  console.log(`✅ COMPLIANCE: ${compliantProducts.length}/${products.length} products passed compliance check`);

  return compliantProducts;
}

/**
 * Generate compliance report for monitoring
 */
export function generateComplianceReport(products: any[]): ComplianceReport {
  const totalProducts = products.length;
  const flaggedProducts: string[] = [];
  let violationsFound = 0;
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

  products.forEach(product => {
    const check = performComplianceCheck(product);

    if (!check.isCompliant) {
      violationsFound++;
      flaggedProducts.push(product.id);

      // Update overall risk level
      if (check.riskLevel === 'critical') riskLevel = 'critical';
      else if (check.riskLevel === 'high' && riskLevel !== 'critical') riskLevel = 'high';
      else if (check.riskLevel === 'medium' && riskLevel === 'low') riskLevel = 'medium';
    }
  });

  const compliantProducts = totalProducts - violationsFound;

  return {
    totalProducts,
    compliantProducts,
    violationsFound,
    riskLevel,
    lastScan: new Date().toISOString(),
    flaggedProducts
  };
}

/**
 * Compliance monitoring function for scheduled checks
 */
export async function runComplianceAudit(): Promise<ComplianceReport> {
  try {
    console.log('🔒 COMPLIANCE AUDIT: Starting comprehensive compliance check');

    // This would typically fetch from your database
    // For now, we'll use the existing storage method
    const { getStorage } = await import('./storage');
    const storage = await getStorage();

    const allProducts = await storage.getAllProducts();
    const report = generateComplianceReport(allProducts);

    console.log('📊 COMPLIANCE AUDIT RESULTS:', report);

    // Log critical violations
    if (report.violationsFound > 0) {
      console.error(`🚨 COMPLIANCE VIOLATIONS DETECTED: ${report.violationsFound} products flagged`);
      console.error('🚨 Flagged products:', report.flaggedProducts);
    }

    return report;
  } catch (error) {
    console.error('❌ COMPLIANCE AUDIT FAILED:', error);
    throw error;
  }
}

/**
 * Emergency compliance filter for any product array
 */
export function emergencyComplianceFilter<T extends { id: string; name: string; description?: string | null }>(
  products: T[]
): T[] {
  console.log(`🚨 EMERGENCY COMPLIANCE: Filtering ${products.length} products`);

  return products.filter(product => {
    if (isNicotineProduct(product)) {
      console.error(`🚨 EMERGENCY: Filtered nicotine product: ${product.name} (${product.id})`);
      return false;
    }
    return true;
  });
}

/**
 * Validate that recommendation results are compliant
 */
export function validateRecommendationCompliance(recommendations: any[]): any[] {
  console.log(`🔒 COMPLIANCE: Validating ${recommendations.length} recommendations`);

  const compliantRecommendations = recommendations.filter(rec => {
    if (!rec.product) return false;

    const check = performComplianceCheck(rec.product);
    if (!check.isCompliant) {
      console.warn(`🚨 COMPLIANCE: Removing non-compliant recommendation:`, {
        productId: rec.productId,
        productName: rec.product.name,
        violations: check.violations
      });
      return false;
    }

    return true;
  });

  console.log(`✅ COMPLIANCE: ${compliantRecommendations.length}/${recommendations.length} recommendations passed compliance`);

  return compliantRecommendations;
}
