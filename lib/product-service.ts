import { createSupabaseClient } from './supabase-client-factory';
import { transformImageUrl } from './image-url-utils';

/**
 * Enhanced product service that ensures all components:
 * 1. Use centralized Supabase configuration from environment variables
 * 2. Query products from main_site_products table
 * 3. Transform sigdistro.com image URLs properly
 */

export interface ProductFilters {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  our_price: number;
  sale_price?: number;
  fire_price?: number;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  categories?: any;
  brand?: string;
  nicotine_product?: boolean;
  tobacco_product?: boolean;
  // Add other product fields as needed
}

export class ProductService {
  private supabase: any = null;

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createSupabaseClient();
    }
    return this.supabase;
  }

  /**
   * Get products with proper filtering and image URL transformation
   */
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const supabase = await this.getSupabaseClient();
      let query = supabase
        .from('main_site_products')
        .select('*');

      // Apply filters
      if (filters.category) {
        query = query.contains('categories', [filters.category]);
      }

      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('our_price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('our_price', filters.maxPrice);
      }

      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      // Order by name for consistent results
      query = query.order('name');

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      // Transform image URLs for sigdistro.com images
      const transformedProducts = (data || []).map((product: Product) => ({
        ...product,
        image_url: transformImageUrl(product.image_url)
      }));

      return transformedProducts;
    } catch (error) {
      console.error('ProductService.getProducts error:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID with image URL transformation
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('main_site_products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching product:', error);
        throw new Error(`Failed to fetch product: ${error.message}`);
      }

      // Transform image URL for sigdistro.com images
      const transformedProduct = {
        ...data,
        image_url: transformImageUrl(data.image_url)
      };

      return transformedProduct;
    } catch (error) {
      console.error('ProductService.getProductById error:', error);
      throw error;
    }
  }

  /**
   * Get multiple products by IDs with image URL transformation
   */
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];
    
    try {
      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('main_site_products')
        .select('*')
        .in('id', ids);

      if (error) {
        console.error('Error fetching products by IDs:', error);
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      // Transform image URLs for sigdistro.com images
      const transformedProducts = (data || []).map((product: any) => ({
        ...product,
        image_url: transformImageUrl(product.image_url)
      }));

      return transformedProducts;
    } catch (error) {
      console.error('ProductService.getProductsByIds error:', error);
      throw error;
    }
  }


  /**
   * Get products by category with image URL transformation
   */
  async getProductsByCategory(category: string, limit?: number): Promise<Product[]> {
    return this.getProducts({
      category,
      inStock: true,
      limit,
      // Order by price for category pages
      // You can customize this ordering as needed
    });
  }

  /**
   * Get featured products with image URL transformation
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return this.getProducts({
      inStock: true,
      limit,
      // You can add additional filtering for featured products
      // For example, if you have a 'featured' field in your database
    });
  }

  /**
   * Search products with image URL transformation
   */
  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    return this.getProducts({
      search: query,
      inStock: true,
      limit,
    });
  }

  /**
   * Get product count for pagination
   */
  async getProductCount(filters: ProductFilters = {}): Promise<number> {
    try {
      const supabase = await this.getSupabaseClient();
      let query = supabase
        .from('main_site_products')
        .select('*', { count: 'exact', head: true });

      // Apply the same filters as getProducts but only for counting
      if (filters.category) {
        query = query.contains('categories', [filters.category]);
      }

      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('our_price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('our_price', filters.maxPrice);
      }

      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error counting products:', error);
        throw new Error(`Failed to count products: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('ProductService.getProductCount error:', error);
      throw error;
    }
  }
}

// Export a singleton instance for use across the application
export const productService = new ProductService();
