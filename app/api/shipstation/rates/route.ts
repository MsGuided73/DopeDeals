import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '../../../../lib/logger';

const RatesSchema = z.object({
  shipTo: z.object({
    postalCode: z.string(),
    countryCode: z.string().default('US'),
    cityLocality: z.string().optional(),
    stateProvince: z.string().optional(),
  }),
  weight: z.object({
    value: z.number().positive(),
    unit: z.enum(['ounce', 'pound', 'gram', 'kilogram']).default('ounce'),
  }),
  dimensions: z
    .object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
      unit: z.enum(['inch', 'centimeter']).default('inch'),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.SHIPSTATION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ShipStation not configured' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const parse = RatesSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parse.error.issues },
        { status: 400 }
      );
    }

    const { ShipstationService } = await import('../../../../lib/services/shipstation/service');
    const storage = await (await import('../../../../lib/storage')).getStorage();
    const svc = new ShipstationService({ apiKey }, storage as any);

    const result = await svc.getShippingRates(parse.data);

    if (!result.success) {
      logger.error('[ShipStation Rates] Failed:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }

    // Normalize rates for the frontend — pick the key fields customers need
    const normalized = (result.rates ?? []).map((r: any) => ({
      serviceCode: r.service_code ?? r.serviceCode,
      serviceName: r.service_type ?? r.serviceName,
      carrierCode: r.carrier_id ?? r.carrierCode,
      carrierName: r.carrier_friendly_name ?? r.carrierName,
      shipmentCost: r.shipping_amount?.amount ?? r.shipmentCost ?? 0,
      currency: r.shipping_amount?.currency ?? 'USD',
      deliveryDays: r.delivery_days ?? r.transitDays ?? null,
      guaranteedDelivery: r.guaranteed_service ?? false,
    }));

    return NextResponse.json({ success: true, rates: normalized });
  } catch (err: any) {
    logger.error('[ShipStation Rates] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Rate fetch failed' },
      { status: 500 }
    );
  }
}
