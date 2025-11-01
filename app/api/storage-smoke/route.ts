import { NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const path = `smoke/${Date.now()}.txt`;
    const testData = Buffer.from('ok');

    // Test put operation
    await storage.put(path, testData, 'text/plain');

    // Test get operation
    const retrieved = await storage.get(path);

    // Test remove operation
    await storage.remove(path);

    const success = retrieved !== null && retrieved.byteLength === testData.byteLength;

    return NextResponse.json({
      wrote: success,
      bytes: retrieved?.byteLength ?? 0,
      path
    });
  } catch (error) {
    console.error('Storage smoke test failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
