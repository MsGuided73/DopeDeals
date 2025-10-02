/**
 * Airtable API Client
 * Handles communication with Airtable API for product data sync
 */

export interface AirtableConfig {
  baseId: string;
  tableId: string;
  apiKey: string;
  viewId?: string;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export class AirtableClient {
  private config: AirtableConfig;
  private baseUrl: string;

  constructor(config: AirtableConfig) {
    this.config = config;
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}/${config.tableId}`;
  }

  /**
   * Test connection to Airtable base
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Airtable connection successful');
      console.log(`📊 Found ${data.records?.length || 0} records in test query`);

      return true;
    } catch (error) {
      console.error('❌ Airtable connection failed:', error);
      return false;
    }
  }

  /**
   * Fetch all records from the table
   */
  async fetchAllRecords(): Promise<AirtableRecord[]> {
    const allRecords: AirtableRecord[] = [];
    let offset: string | undefined;

    try {
      do {
        const url = offset
          ? `${this.baseUrl}?offset=${offset}`
          : this.baseUrl;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }

        const data: AirtableResponse = await response.json();

        if (data.records) {
          allRecords.push(...data.records);
          console.log(`📦 Fetched ${data.records.length} records (total: ${allRecords.length})`);
        }

        offset = data.offset;
      } while (offset);

      console.log(`✅ Successfully fetched ${allRecords.length} total records from Airtable`);
      return allRecords;
    } catch (error) {
      console.error('❌ Error fetching Airtable records:', error);
      throw error;
    }
  }

  /**
   * Fetch records with specific view
   */
  async fetchRecordsFromView(viewId?: string): Promise<AirtableRecord[]> {
    const url = viewId
      ? `${this.baseUrl}?view=${viewId}`
      : this.baseUrl;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data: AirtableResponse = await response.json();

      console.log(`✅ Successfully fetched ${data.records?.length || 0} records from view`);
      return data.records || [];
    } catch (error) {
      console.error('❌ Error fetching Airtable records from view:', error);
      throw error;
    }
  }

  /**
   * Get table schema/fields
   */
  async getTableSchema(): Promise<any> {
    try {
      // First get a sample record to understand the schema
      const records = await this.fetchAllRecords();
      if (records.length === 0) {
        throw new Error('No records found to analyze schema');
      }

      const sampleRecord = records[0];
      const fields = Object.keys(sampleRecord.fields);

      console.log('📋 Airtable schema analysis:');
      console.log(`🔢 Total fields found: ${fields.length}`);
      console.log('📝 Fields:', fields);

      return {
        fieldCount: fields.length,
        fields: fields,
        sampleRecord: sampleRecord.fields
      };
    } catch (error) {
      console.error('❌ Error analyzing Airtable schema:', error);
      throw error;
    }
  }
}

/**
 * Create Airtable client instance using environment variables
 */
export function createAirtableClient(): AirtableClient {
  const config: AirtableConfig = {
    baseId: process.env.AIRTABLE_BASE_ID || '',
    tableId: process.env.AIRTABLE_TABLE_ID || '',
    apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || '',
    viewId: process.env.AIRTABLE_VIEW_ID
  };

  // Validate configuration
  if (!config.baseId || !config.tableId || !config.apiKey) {
    throw new Error('Missing Airtable configuration. Please check AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, and AIRTABLE_PERSONAL_ACCESS_TOKEN');
  }

  return new AirtableClient(config);
}
