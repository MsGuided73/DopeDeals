import { NextRequest, NextResponse } from 'next/server';
import { ShipstationService } from '../../../../lib/services/shipstation/service';
import { logger } from '../../../../lib/logger';

// Lightweight initializer — V2 only requires API key
async function getService(): Promise<ShipstationService | null> {
  const apiKey = process.env.SHIPSTATION_API_KEY;
  if (!apiKey) return null;
  const storage = await (await import('../../../../lib/storage')).getStorage();
  const svc = new ShipstationService(
    { apiKey, webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL },
    storage as any
  );
  return svc;
}

export async function POST(req: NextRequest) {
  try {
    const service = await getService();
    if (!service) {
      return NextResponse.json({ success: false, error: 'ShipStation not configured' }, { status: 503 });
    }

    const body = await req.json();
    const resourceUrl = body?.resource_url || body?.resourceUrl;
    const resourceType = body?.resource_type || body?.resourceType;

    if (!resourceUrl || !resourceType) {
      return NextResponse.json({ success: false, error: 'Invalid payload — missing resource_url or resource_type' }, { status: 400 });
    }

    logger.info(`[ShipStation Webhook] ${resourceType} received`);

    // On SHIP_NOTIFY: persist tracking number to our orders table
    if (resourceType === 'SHIP_NOTIFY') {
      try {
        // ShipStation sends the shipment detail URL; fetch it to get tracking info
        const res = await fetch(resourceUrl, {
          headers: { 'API-Key': process.env.SHIPSTATION_API_KEY! }
        });
        if (res.ok) {
          const shipmentData = await res.json();
          const shipments = shipmentData?.shipments ?? [shipmentData];
          const storage = await (await import('../../../../lib/storage')).getStorage();
          for (const s of shipments) {
            const trackingNumber = s?.tracking_number ?? s?.trackingNumber;
            const orderNumber = s?.order_number ?? s?.orderNumber;
            const carrierCode = s?.carrier_code ?? s?.carrierCode;
            if (trackingNumber && orderNumber) {
              // Update tracking on local order by orderNumber
              try {
                await (storage as any).updateOrderByOrderNumber?.(orderNumber, {
                  tracking_number: trackingNumber,
                  carrier: carrierCode,
                  fulfillment_status: 'shipped',
                  shipped_at: new Date().toISOString(),
                });
              } catch (updateErr) {
                logger.error('[ShipStation Webhook] Failed to update order tracking:', updateErr);
              }
            }
          }
        }
      } catch (fetchErr) {
        logger.error('[ShipStation Webhook] Failed to fetch shipment details:', fetchErr);
      }
    }

    const result = await service.processWebhook({ resourceUrl, resourceType });
    return NextResponse.json(result);
  } catch (err: any) {
    logger.error('[ShipStation Webhook] Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed' }, { status: 500 });
  }
}
