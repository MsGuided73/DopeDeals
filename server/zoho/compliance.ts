// VIP Smoke Compliance Features for Zoho Integration
import { ZohoProduct } from './types.js';

// Age verification service interface
export interface AgeVerificationResult {
  isVerified: boolean;
  age: number;
  errorMessage?: string;
  riskScore?: number;
}

// Shipping restriction service
export interface ShippingValidationResult {
  isAllowed: boolean;
  restrictedStates: string[];
  errorMessage?: string;
  complianceNotes?: string;
}

// Compliance configuration for high-risk products
export interface ComplianceConfig {
  minimumAge: number;
  restrictedStates: string[];
  requiresSignature: boolean;
  requiresAgeVerification: boolean;
  pactActCompliant: boolean;
}

// Default compliance settings for VIP Smoke products
export const DEFAULT_COMPLIANCE_CONFIG: ComplianceConfig = {
  minimumAge: 21,
  restrictedStates: ['UT', 'AL', 'AK'], // Example restricted states
  requiresSignature: true,
  requiresAgeVerification: true,
  pactActCompliant: true
};

// PACT Act compliance states (states with tobacco shipping restrictions)
export const PACT_ACT_RESTRICTED_STATES = [
  'UT', 'AL', 'AK', 'CT', 'HI', 'ME', 'NY', 'VT', 'WA'
];

// Age verification function
export async function verifyAge(
  dateOfBirth: string, 
  ipAddress: string,
  minimumAge: number = 21
): Promise<AgeVerificationResult> {
  try {
    // Calculate age from date of birth
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const isVerified = age >= minimumAge;

    // TODO: Integrate with third-party age verification service (e.g., AgeChecker.net)
    // This would include IP-based verification and enhanced fraud detection
    
    return {
      isVerified,
      age,
      riskScore: 0.1 // Low risk for demo purposes
    };
  } catch (error: any) {
    return {
      isVerified: false,
      age: 0,
      errorMessage: 'Age verification failed: ' + (error?.message || 'Unknown error')
    };
  }
}

// Shipping validation function
export function validateShipping(
  shippingAddress: {
    state: string;
    zipCode: string;
    country: string;
  },
  product: ZohoProduct
): ShippingValidationResult {
  try {
    const { state, country } = shippingAddress;
    
    // Only allow US shipping for tobacco/CBD products
    if (country !== 'US') {
      return {
        isAllowed: false,
        restrictedStates: [],
        errorMessage: 'International shipping not allowed for restricted products',
        complianceNotes: 'PACT Act compliance: US shipping only'
      };
    }

    // Check product-specific restrictions
    const productRestrictedStates = product.cf_restricted_states || [];
    const allRestrictedStates = [...PACT_ACT_RESTRICTED_STATES, ...productRestrictedStates];
    
    if (allRestrictedStates.includes(state)) {
      return {
        isAllowed: false,
        restrictedStates: allRestrictedStates,
        errorMessage: `Shipping to ${state} is not allowed for this product`,
        complianceNotes: 'State-specific tobacco/CBD shipping restrictions apply'
      };
    }

    return {
      isAllowed: true,
      restrictedStates: allRestrictedStates,
      complianceNotes: 'Shipping allowed with adult signature required'
    };
  } catch (error: any) {
    return {
      isAllowed: false,
      restrictedStates: [],
      errorMessage: 'Shipping validation failed: ' + (error?.message || 'Unknown error')
    };
  }
}

// Product compliance checker
export function checkProductCompliance(product: ZohoProduct): {
  requiresAgeVerification: boolean;
  minimumAge: number;
  restrictedStates: string[];
  specialHandling: string[];
} {
  const specialHandling: string[] = [];
  
  // Check if age verification is required
  const requiresAgeVerification = product.cf_age_required || false;
  const minimumAge = requiresAgeVerification ? 21 : 18;
  
  // Get product-specific restrictions
  const restrictedStates = product.cf_restricted_states || [];
  
  // Add special handling requirements
  if (requiresAgeVerification) {
    specialHandling.push('ADULT_SIGNATURE_REQUIRED');
    specialHandling.push('AGE_VERIFICATION_REQUIRED');
  }
  
  // Check for high-risk product categories (tobacco, CBD, etc.)
  const productTags = product.tags || [];
  if (productTags.includes('tobacco') || productTags.includes('cbd')) {
    specialHandling.push('PACT_ACT_COMPLIANT');
    specialHandling.push('RESTRICTED_SHIPPING');
  }
  
  return {
    requiresAgeVerification,
    minimumAge,
    restrictedStates: [...PACT_ACT_RESTRICTED_STATES, ...restrictedStates],
    specialHandling
  };
}

// Order compliance validation
export interface OrderComplianceResult {
  isCompliant: boolean;
  violations: string[];
  warnings: string[];
  requiredActions: string[];
}

export function validateOrderCompliance(
  customerAge: number,
  shippingAddress: { state: string; zipCode: string; country: string },
  orderItems: ZohoProduct[]
): OrderComplianceResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const requiredActions: string[] = [];
  
  // Check each product in the order
  for (const item of orderItems) {
    const compliance = checkProductCompliance(item);
    
    // Age verification check
    if (compliance.requiresAgeVerification && customerAge < compliance.minimumAge) {
      violations.push(`Customer must be ${compliance.minimumAge}+ to purchase ${item.name}`);
    }
    
    // Shipping restriction check
    const shippingResult = validateShipping(shippingAddress, item);
    if (!shippingResult.isAllowed) {
      violations.push(`Cannot ship ${item.name} to ${shippingAddress.state}: ${shippingResult.errorMessage}`);
    }
    
    // Add required actions for compliant orders
    if (compliance.specialHandling.includes('ADULT_SIGNATURE_REQUIRED')) {
      requiredActions.push('Adult signature required on delivery');
    }
    
    if (compliance.specialHandling.includes('PACT_ACT_COMPLIANT')) {
      requiredActions.push('PACT Act compliance documentation required');
    }
  }
  
  // Add warnings for California-specific requirements
  if (shippingAddress.state === 'CA') {
    warnings.push('California Proposition 65 warning may be required');
  }
  
  return {
    isCompliant: violations.length === 0,
    violations,
    warnings,
    requiredActions
  };
}

// Logging function for compliance audit trail
export function logComplianceEvent(
  eventType: 'age_verification' | 'shipping_validation' | 'order_compliance',
  customerId: string,
  details: any
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    customerId,
    details,
    environment: process.env.NODE_ENV || 'development'
  };
  
  // TODO: Implement proper logging to compliance audit system
  console.log('COMPLIANCE_LOG:', JSON.stringify(logEntry));
}