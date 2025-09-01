// Wrapper to access server/storage at runtime without importing server types into app-only typecheck
export async function getStorage(): Promise<any> {
  try {
    // Try absolute path first
    const mod: any = await import(process.cwd() + '/server/storage');
    return mod.storage as any;
  } catch (error) {
    console.error('Failed to import server storage:', error);
    throw new Error('Could not load server storage module');
  }
}

