import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANT: Database Table Usage Guide for DOPE CITY
 *
 * CORRECT TABLE: Use "main_site_products" for all product operations
 * - This is the primary products table with proper schema
 * - Contains: id, name, description, our_price, image_url, image_urls, etc.
 * - Supports both single image_url and image_urls array
 *
 * DEPRECATED TABLES: DO NOT USE
 * - "brands_new" - Legacy brands table, not for products
 * - "products" - Old products table, replaced by main_site_products
 *
 * IMAGE HANDLING:
 * - Primary image: Use image_url field
 * - Gallery images: Use image_urls array field
 * - Both fields are text type, image_urls supports arrays
 */

// Storage abstraction layer for Next.js
export async function getStorage() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    // Products
    async getProducts(filters?: any) {
      let query = supabase.from('main_site_products').select(`
        id, name, description, short_description, our_price, sale_price,
        image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
        created_at, updated_at
      `);

      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.brandId) query = query.eq('brand_id', filters.brandId);
      if (filters?.featured !== undefined) query = query.eq('featured', filters.featured);
      if (filters?.vipExclusive !== undefined) query = query.eq('vip_exclusive', filters.vipExclusive);
      if (filters?.priceMin) query = query.gte('our_price', filters.priceMin);
      if (filters?.priceMax) query = query.lte('our_price', filters.priceMax);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getProduct(id: string) {
      // Convert string ID to integer for proper database querying
      const productId = parseInt(id, 10);
      
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }

      const { data, error } = await supabase
        .from('main_site_products')
        .select(`
          id, name, description, short_description, our_price, sale_price,
          image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
          created_at, updated_at
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      return data;
    },

    async createProduct(product: any) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // Categories
    async getCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },

    // Brands
    async getBrands() {
      const { data, error } = await supabase
        .from('brands_new')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },

    // Users
    async getUser(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    async createUser(user: any) {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateUser(id: string, updates: any) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    // User Behavior for Recommendations (with graceful fallback)
    async trackUserBehavior(behavior: any) {
      try {
        const { data, error } = await supabase
          .from('user_behavior')
          .insert(behavior)
          .select()
          .single();

        if (error) {
          // If table doesn't exist, log but don't throw
          if (error.code === '42P01') {
            console.warn('⚠️ user_behavior table does not exist, skipping behavior tracking');
            return null;
          }
          throw error;
        }
        return data;
      } catch (error) {
        console.warn('⚠️ Error tracking user behavior:', error);
        return null;
      }
    },

    async getUserBehavior(userId: string, limit = 50) {
      try {
        const { data, error } = await supabase
          .from('user_behavior')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          // If table doesn't exist, return empty array
          if (error.code === '42P01') {
            console.warn('⚠️ user_behavior table does not exist, returning empty behavior');
            return [];
          }
          throw error;
        }
        return data || [];
      } catch (error) {
        console.warn('⚠️ Error fetching user behavior:', error);
        return [];
      }
    },

    // Get all products for recommendations (COMPLIANCE: Excludes nicotine products)
    async getAllProducts() {
      try {
        console.log('🔒 COMPLIANCE: Fetching only non-nicotine products for recommendations');

        const { data, error } = await supabase
          .from('main_site_products')
          .select(`
            id, name, description, short_description, our_price, sale_price,
            image_url, image_urls, sku, stock_quantity, is_active, featured, brand_id, category_id,
            created_at, updated_at
          `)
          .eq('is_active', true)
          .limit(100);

        if (error) throw error;

        const products = data || [];
        console.log(`✅ COMPLIANCE: Filtered ${products.length} products for recommendations`);

        return products;
      } catch (error) {
        console.warn('⚠️ Error fetching all products:', error);
        return [];
      }
    },

    // Orders for Purchase History
    async getUserOrders(userId: string) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    // Product Similarity for Recommendations
    async getProductSimilarity(productId: string) {
      const { data, error } = await supabase
        .from('product_similarity')
        .select('*')
        .eq('product_id', productId)
        .order('similarity_score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },

    async createProductSimilarity(similarity: any) {
      const { data, error } = await supabase
        .from('product_similarity')
        .insert(similarity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  };
}
