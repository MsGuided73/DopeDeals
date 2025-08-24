// Wrapper to access server/storage at runtime without importing server types into app-only typecheck
export async function getStorage(): Promise<any> {
  // Dynamic import avoids TypeScript including server/**/* during app-only typecheck
  const mod = await import("../../server/storage");
  return mod.storage as any;
}

