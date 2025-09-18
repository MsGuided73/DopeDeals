import { createClient } from '@supabase/supabase-js';

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
      let query = supabase.from('products').select('*');
      
      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
      if (filters?.brandId) query = query.eq('brand_id', filters.brandId);
      if (filters?.featured !== undefined) query = query.eq('featured', filters.featured);
      if (filters?.vipExclusive !== undefined) query = query.eq('vip_exclusive', filters.vipExclusive);
      if (filters?.priceMin) query = query.gte('price', filters.priceMin);
      if (filters?.priceMax) query = query.lte('price', filters.priceMax);
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    async getProduct(id: string) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
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
        .from('brands')
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

    // Get all products for recommendations
    async getAllProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('nicotine_product', false)
          .eq('tobacco_product', false)
          .limit(100);

        if (error) throw error;
        return data || [];
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
