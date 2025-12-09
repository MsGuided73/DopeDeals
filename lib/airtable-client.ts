/**
 * Airtable API Client for product import functionality
 * Handles authentication, base/table discovery, and record fetching
 */

import { supabaseBrowser } from '../app/lib/supabase-browser';

interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

interface AirtableTable {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: AirtableField[];
}

interface AirtableField {
  id: string;
  name: string;
  type: string;
  options?: any;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

interface AirtableRecordsResponse {
  records: AirtableRecord[];
  offset?: string;
}

export class AirtableClient {
  private apiKey: string;
  private baseId?: string;

  constructor(apiKey: string, baseId?: string) {
    this.apiKey = apiKey;
    this.baseId = baseId;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `https://api.airtable.com/v0${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Airtable API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Get all bases the user has access to
   */
  async getBases(): Promise<AirtableBase[]> {
    try {
      const data = await this.makeRequest('/meta/bases');
      return data.bases || [];
    } catch (error) {
      console.error('Error fetching Airtable bases:', error);
      throw new Error('Failed to fetch Airtable bases. Please check your API key.');
    }
  }

  /**
   * Get all tables in a specific base
   */
  async getTables(baseId: string): Promise<AirtableTable[]> {
    try {
      const data = await this.makeRequest(`/meta/bases/${baseId}/tables`);
      return data.tables || [];
    } catch (error) {
      console.error('Error fetching Airtable tables:', error);
      throw new Error('Failed to fetch tables from the selected base.');
    }
  }

  /**
   * Get records from a specific table
   * Supports pagination with offset
   */
  async getRecords(
    baseId: string,
    tableId: string,
    options: {
      maxRecords?: number;
      offset?: string;
      fields?: string[];
      filterByFormula?: string;
      sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    } = {}
  ): Promise<AirtableRecordsResponse> {
    try {
      const params = new URLSearchParams();

      if (options.maxRecords) params.append('maxRecords', options.maxRecords.toString());
      if (options.offset) params.append('offset', options.offset);
      if (options.fields && options.fields.length > 0) {
        options.fields.forEach(field => params.append('fields[]', field));
      }
      if (options.filterByFormula) params.append('filterByFormula', options.filterByFormula);
      if (options.sort && options.sort.length > 0) {
        options.sort.forEach(sort => {
          params.append('sort[0][field]', sort.field);
          params.append('sort[0][direction]', sort.direction);
        });
      }

      const queryString = params.toString();
      const endpoint = `/meta/bases/${baseId}/tables/${tableId}/records${queryString ? `?${queryString}` : ''}`;

      const data = await this.makeRequest(endpoint);
      return {
        records: data.records || [],
        offset: data.offset,
      };
    } catch (error) {
      console.error('Error fetching Airtable records:', error);
      throw new Error('Failed to fetch records from the selected table.');
    }
  }

  /**
   * Get all records from a table with automatic pagination
   */
  async getAllRecords(
    baseId: string,
    tableId: string,
    options: {
      fields?: string[];
      filterByFormula?: string;
      sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
      onProgress?: (fetched: number, total?: number) => void;
    } = {}
  ): Promise<AirtableRecord[]> {
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const response: AirtableRecordsResponse = await this.getRecords(baseId, tableId, {
        ...options,
        offset,
        maxRecords: 100, // Airtable's max per request
      });

      allRecords.push(...response.records);
      offset = response.offset;

      // Call progress callback if provided
      if (options.onProgress) {
        options.onProgress(allRecords.length);
      }
    } while (offset);

    return allRecords;
  }

  /**
   * Validate API key by attempting to fetch bases
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.getBases();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get sample records from a table for preview
   */
  async getSampleRecords(
    baseId: string,
    tableId: string,
    count: number = 5
  ): Promise<AirtableRecord[]> {
    const response = await this.getRecords(baseId, tableId, {
      maxRecords: count,
    });
    return response.records;
  }
}

/**
 * Field mapping utilities for converting Airtable data to product format
 */
export interface FieldMapping {
  [airtableFieldName: string]: string; // Maps Airtable field name to product field name
}

export class ProductImportMapper {
  static readonly PRODUCT_FIELD_MAPPINGS = {
    // Basic Information
    name: ['name', 'product_name', 'title', 'product title'],
    sku: ['sku', 'product_code', 'item_code', 'code'],
    description: ['description', 'product_description', 'details', 'info'],
    short_description: ['short_description', 'summary', 'brief_description', 'excerpt'],

    // Pricing
    our_price: ['price', 'our_price', 'regular_price', 'retail_price', 'cost'],
    sale_price: ['sale_price', 'discount_price', 'special_price'],
    vip_price: ['vip_price', 'member_price', 'discounted_price'],
    compare_at_price: ['compare_at_price', 'original_price', 'msrp', 'rrp'],

    // Inventory
    stock_quantity: ['stock_quantity', 'inventory', 'quantity', 'stock', 'qty'],
    is_active: ['is_active', 'active', 'enabled', 'published', 'available'],

    // Organization
    brand_name: ['brand', 'brand_name', 'manufacturer', 'make'],
    category_name: ['category', 'category_name', 'type', 'product_type'],

    // Media
    image_url: ['image_url', 'primary_image', 'main_image', 'photo', 'picture'],
    image_urls: ['image_urls', 'images', 'gallery', 'photos', 'pictures'],

    // Compliance
    nicotine_product: ['nicotine_product', 'nicotine', 'tobacco_product', 'tobacco'],
    age_restriction: ['age_restriction', 'age_limit', 'minimum_age'],

    // Additional
    weight_g: ['weight_g', 'weight', 'product_weight'],
    dimensions: ['dimensions', 'size', 'product_size'],
    materials: ['materials', 'material', 'composition'],
  };

  /**
   * Suggest field mappings based on Airtable field names
   */
  static suggestMappings(airtableFields: string[]): FieldMapping {
    const mapping: FieldMapping = {};

    for (const airtableField of airtableFields) {
      const lowerField = airtableField.toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const [productField, possibleNames] of Object.entries(this.PRODUCT_FIELD_MAPPINGS)) {
        for (const possibleName of possibleNames) {
          const cleanPossibleName = possibleName.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (lowerField.includes(cleanPossibleName) || cleanPossibleName.includes(lowerField)) {
            mapping[airtableField] = productField;
            break;
          }
        }
        if (mapping[airtableField]) break;
      }
    }

    return mapping;
  }

  /**
   * Apply field mapping to convert Airtable record to product format
   */
  static mapRecordToProduct(
    record: AirtableRecord,
    fieldMapping: FieldMapping
  ): Record<string, any> {
    const product: Record<string, any> = {};

    for (const [airtableField, productField] of Object.entries(fieldMapping)) {
      if (record.fields[airtableField] !== undefined) {
        let value = record.fields[airtableField];

        // Type conversion based on field type
        switch (productField) {
          case 'our_price':
          case 'sale_price':
          case 'vip_price':
          case 'compare_at_price':
            value = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
            break;
          case 'stock_quantity':
            value = typeof value === 'number' ? value : parseInt(String(value)) || 0;
            break;
          case 'is_active':
          case 'nicotine_product':
            value = Boolean(value);
            break;
          case 'age_restriction':
            value = typeof value === 'number' ? value : parseInt(String(value)) || 18;
            break;
          case 'weight_g':
            value = typeof value === 'number' ? value : parseFloat(String(value)) || undefined;
            break;
          case 'image_urls':
            if (typeof value === 'string') {
              value = value.split(',').map((url: string) => url.trim()).filter((url: string) => url);
            } else if (!Array.isArray(value)) {
              value = [];
            }
            break;
          default:
            value = String(value || '').trim();
        }

        product[productField] = value;
      }
    }

    return product;
  }
}

/**
 * Product import service that coordinates Airtable fetching and Supabase insertion
 */
export class ProductImportService {
  private airtableClient: AirtableClient;
  private fieldMapping: FieldMapping;

  constructor(airtableApiKey: string, fieldMapping: FieldMapping) {
    this.airtableClient = new AirtableClient(airtableApiKey);
    this.fieldMapping = fieldMapping;
  }

  async importFromAirtable(
    baseId: string,
    tableId: string,
    options: {
      onProgress?: (processed: number, total: number) => void;
      batchSize?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    try {
      // Fetch all records from Airtable
      const records = await this.airtableClient.getAllRecords(baseId, tableId, {
        onProgress: (fetched) => {
          if (options.onProgress) {
            options.onProgress(0, fetched); // Show fetching progress
          }
        },
      });

      if (records.length === 0) {
        throw new Error('No records found in the selected table');
      }

      // Process records in batches
      const batchSize = options.batchSize || 10;
      let processed = 0;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const batchResults = await this.processBatch(batch);

        result.imported += batchResults.imported;
        result.failed += batchResults.failed;
        result.errors.push(...batchResults.errors);

        processed += batch.length;
        if (options.onProgress) {
          options.onProgress(processed, records.length);
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  private async processBatch(records: AirtableRecord[]): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    const result = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Convert Airtable records to product format
    const products = records.map(record =>
      ProductImportMapper.mapRecordToProduct(record, this.fieldMapping)
    ).filter(product => product.name && product.sku); // Only include products with required fields

    if (products.length === 0) {
      return result;
    }

    // Insert into Supabase
    try {
      const { data, error } = await supabaseBrowser
        .from('main_site_products')
        .insert(products.map(product => ({
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })))
        .select();

      if (error) {
        result.failed = products.length;
        result.errors.push(`Batch insert failed: ${error.message}`);
      } else {
        result.imported = data?.length || 0;
        result.failed = products.length - result.imported;
        if (result.failed > 0) {
          result.errors.push(`${result.failed} products failed to import in this batch`);
        }
      }
    } catch (error) {
      result.failed = products.length;
      result.errors.push(error instanceof Error ? error.message : 'Batch processing failed');
    }

    return result;
  }
}
