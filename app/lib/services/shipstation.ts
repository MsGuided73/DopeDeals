import 'server-only';

export type ShipstationConfig = {
  apiKey: string;
  apiSecret: string;
  webhookUrl?: string;
};

// Minimal interface this service needs from storage layer
export interface ShipstationStorage {
  createShipstationOrderRecord?: (payload: any) => Promise<void> | Promise<any>;
  // Add other methods as needed later
}

export class ShipstationService {
  private cfg: ShipstationConfig;
  private storage?: ShipstationStorage;

  constructor(cfg: ShipstationConfig, storage?: ShipstationStorage) {
    this.cfg = cfg;
    this.storage = storage;
  }

  async createShipstationOrder(order: any): Promise<{ success: boolean; id?: string }>{
    // TODO: call ShipStation API using this.cfg credentials
    // Placeholder: just persist a record if storage is present
    try {
      if (this.storage?.createShipstationOrderRecord) {
        await this.storage.createShipstationOrderRecord(order);
      }
      return { success: true, id: order?.orderNumber };
    } catch {
      return { success: false };
    }
  }

  async processWebhook(evt: { resourceUrl: string; resourceType: string }): Promise<{ success: boolean }>{
    // TODO: fetch resourceUrl and update statuses as needed
    return { success: true };
  }
}

