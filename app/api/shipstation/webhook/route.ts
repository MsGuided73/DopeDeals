import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/server-storage';
import { ShipstationService } from '@/server/shipstation/service';

// Lightweight initializer (avoids importing Express router)
async function getService(): Promise<ShipstationService | null> {
  const apiKey = process.env.SHIPSTATION_API_KEY;
  const apiSecret = process.env.SHIPSTATION_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  const storage = await (await import('@/server/storage')).storage;
  const svc = new ShipstationService({ apiKey, apiSecret, webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL }, storage);
  return svc;
}

export async function POST(req: NextRequest) {
  try {
    const service = await getService();
    if (!service) {
      return NextResponse.json({ success: false, error: 'ShipStation disabled' }, { status: 503 });
    }
    const body = await req.json();
    const resourceUrl = body?.resource_url || body?.resourceUrl;
    const resourceType = body?.resource_type || body?.resourceType;
    if (!resourceUrl || !resourceType) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const result = await service.processWebhook({ resourceUrl, resourceType });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed' }, { status: 500 });
  }
}

