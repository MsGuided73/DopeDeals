// VIP Smoke Custom Fields Configuration for Zoho Inventory
import { ZohoInventoryClient } from './client.js';

// Custom field definitions as specified in the integration instructions
export interface VIPSmokeCustomFields {
  cf_dtc_description: string; // Consumer-facing product description
  cf_msrp: string; // Suggested retail price for DTC sales
  cf_club_discount: string; // Member discount percentage
  cf_age_required: string; // Age verification required flag
  cf_restricted_states: string; // States where shipping is banned
}

// Custom field mapping for VIP Smoke products
export const CUSTOM_FIELD_MAPPINGS = {
  dtc_description: 'cf_dtc_description',
  msrp: 'cf_msrp', 
  club_discount: 'cf_club_discount',
  age_required: 'cf_age_required',
  restricted_states: 'cf_restricted_states'
} as const;

// Function to retrieve custom field IDs from Zoho
export async function getCustomFieldIds(client: ZohoInventoryClient): Promise<VIPSmokeCustomFields> {
  try {
    const response = await client.getCustomFields();
    const customFields = response.customfields || [];
    
    const fieldIds: Partial<VIPSmokeCustomFields> = {};
    
    // Map custom field names to their IDs
    customFields.forEach((field: any) => {
      switch (field.field_name_formatted?.toLowerCase()) {
        case 'dtc product description':
        case 'dtc_description':
          fieldIds.cf_dtc_description = field.customfield_id;
          break;
        case 'msrp':
        case 'suggested retail price':
          fieldIds.cf_msrp = field.customfield_id;
          break;
        case 'club discount':
        case 'member discount':
          fieldIds.cf_club_discount = field.customfield_id;
          break;
        case 'age required':
        case 'age verification required':
          fieldIds.cf_age_required = field.customfield_id;
          break;
        case 'restricted states':
        case 'shipping restrictions':
          fieldIds.cf_restricted_states = field.customfield_id;
          break;
      }
    });
    
    return fieldIds as VIPSmokeCustomFields;
  } catch (error) {
    console.error('Error retrieving custom field IDs:', error);
    throw new Error('Failed to retrieve custom field configuration from Zoho');
  }
}

// Helper function to format custom field values for Zoho API
export function formatCustomFieldValue(fieldType: string, value: any): string {
  switch (fieldType) {
    case 'currency':
      return typeof value === 'number' ? value.toFixed(2) : value?.toString() || '0.00';
    case 'decimal':
      return typeof value === 'number' ? value.toString() : value?.toString() || '0';
    case 'checkbox':
      return typeof value === 'boolean' ? (value ? 'true' : 'false') : value?.toString() || 'false';
    case 'multi_select':
      return Array.isArray(value) ? value.join(',') : value?.toString() || '';
    case 'text':
    default:
      return value?.toString() || '';
  }
}

// Function to extract VIP Smoke specific data from Zoho product
export function extractVIPSmokeData(zohoProduct: any, customFieldIds: VIPSmokeCustomFields) {
  const customFields = zohoProduct.custom_fields || [];
  const vipData: any = {};
  
  // Extract custom field values
  customFields.forEach((field: any) => {
    switch (field.customfield_id) {
      case customFieldIds.cf_dtc_description:
        vipData.dtcDescription = field.value;
        break;
      case customFieldIds.cf_msrp:
        vipData.msrp = parseFloat(field.value) || 0;
        break;
      case customFieldIds.cf_club_discount:
        vipData.clubDiscount = parseFloat(field.value) || 0;
        break;
      case customFieldIds.cf_age_required:
        vipData.ageRequired = field.value === 'true' || field.value === true;
        break;
      case customFieldIds.cf_restricted_states:
        vipData.restrictedStates = field.value ? field.value.split(',').map((s: string) => s.trim()) : [];
        break;
    }
  });
  
  return vipData;
}

// Function to prepare custom fields for Zoho product creation/update
export function prepareCustomFields(
  vipData: {
    dtcDescription?: string;
    msrp?: number;
    clubDiscount?: number;
    ageRequired?: boolean;
    restrictedStates?: string[];
  },
  customFieldIds: VIPSmokeCustomFields
): Array<{ customfield_id: string; value: string }> {
  const customFields: Array<{ customfield_id: string; value: string }> = [];
  
  if (vipData.dtcDescription && customFieldIds.cf_dtc_description) {
    customFields.push({
      customfield_id: customFieldIds.cf_dtc_description,
      value: formatCustomFieldValue('text', vipData.dtcDescription)
    });
  }
  
  if (vipData.msrp !== undefined && customFieldIds.cf_msrp) {
    customFields.push({
      customfield_id: customFieldIds.cf_msrp,
      value: formatCustomFieldValue('currency', vipData.msrp)
    });
  }
  
  if (vipData.clubDiscount !== undefined && customFieldIds.cf_club_discount) {
    customFields.push({
      customfield_id: customFieldIds.cf_club_discount,
      value: formatCustomFieldValue('decimal', vipData.clubDiscount)
    });
  }
  
  if (vipData.ageRequired !== undefined && customFieldIds.cf_age_required) {
    customFields.push({
      customfield_id: customFieldIds.cf_age_required,
      value: formatCustomFieldValue('checkbox', vipData.ageRequired)
    });
  }
  
  if (vipData.restrictedStates && customFieldIds.cf_restricted_states) {
    customFields.push({
      customfield_id: customFieldIds.cf_restricted_states,
      value: formatCustomFieldValue('multi_select', vipData.restrictedStates)
    });
  }
  
  return customFields;
}

// Default VIP Smoke product configuration
export const DEFAULT_VIP_PRODUCT_CONFIG = {
  dtcDescription: '',
  msrp: 0,
  clubDiscount: 0.10, // 10% default member discount
  ageRequired: true, // Default to requiring age verification
  restrictedStates: ['UT', 'AL', 'AK'] // Default PACT Act restricted states
};