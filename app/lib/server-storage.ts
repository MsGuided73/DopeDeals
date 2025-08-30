// Ensure this helper is only used on the server
import 'server-only';

// Wrapper to access server/storage at runtime without leaking server code into client bundles
export async function getStorage(): Promise<any> {
  // Use a static import path so Next.js can bundle it in the server build only
  const mod: any = await import('../../server/storage');
  return mod.storage as any;
}

