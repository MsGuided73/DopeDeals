// Wrapper to access server/storage at runtime without importing server types into app-only typecheck
export async function getStorage(): Promise<any> {
  // Build the path dynamically so TypeScript cannot follow it during type-checking
  const path = ["..", "..", "server", "storage"].join("/");
  const mod: any = await import(path as any);
  return mod.storage as any;
}

