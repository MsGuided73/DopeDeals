import { ShipstationService, ShipstationServiceConfig } from './service';
import { IStorage } from '../storage';

export class MockShipstationService extends ShipstationService {
  constructor(config: ShipstationServiceConfig, storage: IStorage) {
    super(config, storage);
  }

  async getServiceHealth() {
    return { status: 'healthy', lastSync: new Date().toISOString(), configValid: true } as any;
  }

  async validateConfiguration() {
    return { valid: true } as any;
  }

  async createShipstationOrder(orderData: any) {
    return { success: true, data: { orderId: 'MOCK-' + Date.now(), ...orderData } };
  }

  async getShippingRates(_request: any) {
    return { success: true, data: [{ carrier: 'MockCarrier', service: 'MockGround', rate: 9.99 }] };
  }

  async createShippingLabel(orderId: string, _opts: any) {
    return { success: true, shipment: { trackingNumber: 'TRACK' + orderId }, labelData: 'BASE64PDF' };
  }

  async voidShippingLabel(_shipmentId: string) {
    return { success: true };
  }

  async getCarriers() { return { success: true, data: [{ code: 'MOCK', name: 'Mock Carrier' }] }; }
  async getWarehouses() { return { success: true, data: [{ id: 1, name: 'Mock Warehouse' }] }; }
}

