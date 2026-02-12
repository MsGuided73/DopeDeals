import { type Order } from "@shared/schema";

// File Storage Interface for Supabase Storage Operations (Extended to support orders)
export interface IStorage {
  put(path: string, data: Buffer | Uint8Array, contentType?: string): Promise<{ url: string }>;
  get(path: string): Promise<Uint8Array | null>;
  remove(path: string): Promise<void>;
  getUserOrders(userId: string): Promise<Order[]>;
  // Explicitly allowing extra properties for compatibility with different storage implementations
  [key: string]: any;
}

// In-memory file storage implementation for testing
export class MemoryStorage implements IStorage {
  private files = new Map<string, Uint8Array>();

  async put(path: string, data: Buffer | Uint8Array): Promise<{ url: string }> {
    const buffer = data instanceof Buffer ? new Uint8Array(data) : data;
    this.files.set(path, buffer);
    return { url: `memory://${path}` };
  }

  async get(path: string): Promise<Uint8Array | null> {
    return this.files.get(path) ?? null;
  }

  async remove(path: string): Promise<void> {
    this.files.delete(path);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return [];
  }
}

// Supabase Storage implementation
export class SupabaseStorage implements IStorage {
  private supabaseAdmin: any;
  private bucket: string;

  constructor() {
    const { createClient } = require('@supabase/supabase-js');

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    this.bucket = process.env.SUPABASE_BUCKET ?? 'public';
  }

  async put(path: string, data: Buffer | Uint8Array, contentType?: string): Promise<{ url: string }> {
    const { error } = await this.supabaseAdmin.storage
      .from(this.bucket)
      .upload(path, data, {
        upsert: true,
        contentType,
      });

    if (error) throw error;

    const { data: pub } = this.supabaseAdmin.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return { url: pub?.publicUrl ?? '' };
  }

  async get(path: string): Promise<Uint8Array | null> {
    const { data, error } = await this.supabaseAdmin.storage
      .from(this.bucket)
      .download(path);

    if (error) {
      if (error.message?.includes('Object not found')) return null;
      throw error;
    }

    const buf = await data.arrayBuffer();
    return new Uint8Array(buf);
  }

  async remove(path: string): Promise<void> {
    const { error } = await this.supabaseAdmin.storage
      .from(this.bucket)
      .remove([path]);

    if (error) throw error;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await this.supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

// Storage provider - uses Supabase if available, falls back to memory
let storage: IStorage;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    storage = new SupabaseStorage();
    console.log('✅ Supabase file storage initialized');
  } else {
    storage = new MemoryStorage();
    console.log('⚠️ Using memory file storage (Supabase credentials not found)');
  }
} catch (error) {
  console.warn('⚠️ Supabase storage failed, using memory fallback:', error);
  storage = new MemoryStorage();
}

export { storage };
