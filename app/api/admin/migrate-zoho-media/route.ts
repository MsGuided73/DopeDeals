import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ZohoImage {
  image_id: string;
  image_url?: string;
  image_name?: string;
  image_type?: string;
}

interface ZohoProduct {
  item_id: string;
  name: string;
  description?: string;
  sku: string;
  images?: ZohoImage[];
}

interface MigrationResult {
  success: boolean;
  stats: {
    processed: number;
    imagesDownloaded: number;
    imagesUploaded: number;
    descriptionsUpdated: number;
    errors: string[];
    skipped: number;
  };
  message: string;
}

async function getZohoAccessToken(): Promise<string> {
  const { data, error } = await supabase
    .from('zoho_tokens')
    .select('access_token')
    .single();

  if (error || !data?.access_token) {
    throw new Error('No valid Zoho access token found');
  }

  return data.access_token;
}

async function fetchZohoProductDetails(accessToken: string, itemId: string): Promise<ZohoProduct> {
  const orgId = process.env.ZOHO_ORGANIZATION_ID;
  const url = `https://www.zohoapis.com/inventory/v1/items/${itemId}?organization_id=${orgId}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho API error for item ${itemId}: ${response.status}`);
  }

  const data = await response.json() as any;
  return data.item;
}

async function downloadAndUploadImage(
  imageUrl: string,
  sku: string,
  imageName: string,
  imageType?: string
): Promise<string> {
  // Download image
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  
  const imageBuffer = Buffer.from(await response.arrayBuffer());
  
  // Upload to Supabase
  const sanitizedSku = sku.replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = Date.now();
  const extension = imageType?.split('/')[1] || 'jpg';
  const fileName = `${sanitizedSku}_${timestamp}_${imageName}.${extension}`;
  const filePath = `products/${sanitizedSku}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, imageBuffer, {
      upsert: true,
      contentType: imageType || 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable'
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicData.publicUrl;
}

async function createProductMediaRecord(
  productId: string,
  imagePath: string,
  imageIndex: number,
  alt?: string
): Promise<void> {
  const mediaRecord = {
    product_id: productId,
    type: 'image',
    path: imagePath.replace(/^.*\/products\//, ''), // Store relative path
    alt: alt || null,
    role: imageIndex === 0 ? 'hero' : 'gallery',
    sort: imageIndex,
    width: null,
    height: null
  };

  const { error } = await supabase
    .from('product_media')
    .upsert(mediaRecord, {
      onConflict: 'product_id, path'
    });

  if (error) {
    throw new Error(`Failed to create product_media record: ${error.message}`);
  }
}

async function updateProductWithZohoData(
  productId: string,
  zohoProduct: ZohoProduct,
  primaryImageUrl?: string
): Promise<void> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
    updated_by: 'zoho-migration-api',
    sync_status: 'synced',
    last_sync_attempt: new Date().toISOString()
  };

  // Basic product info
  if (zohoProduct.description) updateData.description = zohoProduct.description;
  if (primaryImageUrl) updateData.image_url = primaryImageUrl;

  // Zoho-specific fields
  updateData.unit = zohoProduct.unit || 'piece';
  updateData.item_type = zohoProduct.item_type || 'inventory';
  updateData.product_type = zohoProduct.product_type || 'goods';
  updateData.status = zohoProduct.status || 'active';
  updateData.source = 'zoho';

  // Inventory
  updateData.available_stock = zohoProduct.available_stock || 0;
  updateData.committed_stock = zohoProduct.committed_stock || 0;
  updateData.stock_on_hand = zohoProduct.stock_on_hand || 0;

  // Tax info
  updateData.is_taxable = zohoProduct.is_taxable ?? true;
  updateData.tax_id = zohoProduct.tax_id;
  updateData.tax_name = zohoProduct.tax_name;
  updateData.tax_percentage = zohoProduct.tax_percentage;

  // Category & Brand
  updateData.zoho_category_id = zohoProduct.category_id;
  updateData.zoho_category_name = zohoProduct.category_name;
  updateData.brand_name = zohoProduct.brand;
  updateData.manufacturer = zohoProduct.manufacturer;

  // Physical properties
  if (zohoProduct.weight) updateData.weight = zohoProduct.weight;
  if (zohoProduct.weight_unit) updateData.weight_unit = zohoProduct.weight_unit;
  if (zohoProduct.dimensions) {
    updateData.length_mm = zohoProduct.dimensions.length;
    updateData.width_mm = zohoProduct.dimensions.width;
    updateData.height_mm = zohoProduct.dimensions.height;
  }

  // VIP Smoke custom fields
  updateData.dtc_description = zohoProduct.cf_dtc_description;
  updateData.msrp = zohoProduct.cf_msrp;
  updateData.club_discount = zohoProduct.cf_club_discount;
  updateData.age_required = zohoProduct.cf_age_required ?? false;
  updateData.restricted_states = zohoProduct.cf_restricted_states;

  // Product flags
  updateData.is_combo_product = zohoProduct.is_combo_product ?? false;
  updateData.is_linked_with_zohocrm = zohoProduct.is_linked_with_zohocrm ?? false;
  updateData.zcrm_product_id = zohoProduct.zcrm_product_id;

  // Tags and metadata
  updateData.tags = zohoProduct.tags;
  updateData.zoho_custom_fields = zohoProduct.custom_fields;
  updateData.documents = zohoProduct.documents;

  // Timestamps
  updateData.zoho_created_time = zohoProduct.created_time;
  updateData.zoho_last_modified_time = zohoProduct.last_modified_time;

  // Multiple images
  if (zohoProduct.images && zohoProduct.images.length > 0) {
    updateData.image_urls = zohoProduct.images.map(img =>
      img.image_url || `/api/zoho/images/${img.image_id}`
    );
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<MigrationResult>> {
  const stats = {
    processed: 0,
    imagesDownloaded: 0,
    imagesUploaded: 0,
    descriptionsUpdated: 0,
    errors: [] as string[],
    skipped: 0
  };

  try {
    console.log('[Zoho Media Migration] Starting migration...');

    // Get request parameters
    const { limit = 10, startFromId } = await req.json().catch(() => ({}));

    // Get Zoho access token
    const accessToken = await getZohoAccessToken();

    // Get products that have Zoho IDs but no images
    let query = supabase
      .from('products')
      .select('id, sku, zoho_item_id, name, image_url')
      .not('zoho_item_id', 'is', null)
      .limit(limit);

    if (startFromId) {
      query = query.gt('id', startFromId);
    }

    const { data: products, error: productsError } = await query;

    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        stats,
        message: 'No products found to migrate'
      });
    }

    console.log(`[Zoho Media Migration] Processing ${products.length} products`);

    // Process each product
    for (const product of products) {
      try {
        console.log(`[Zoho Media Migration] Processing: ${product.name}`);

        // Get detailed product info from Zoho
        const zohoProduct = await fetchZohoProductDetails(accessToken, product.zoho_item_id);
        
        let primaryImageUrl: string | null = null;

        // Process images if they exist
        if (zohoProduct.images && zohoProduct.images.length > 0) {
          console.log(`[Zoho Media Migration] Found ${zohoProduct.images.length} images for ${product.name}`);

          for (let i = 0; i < zohoProduct.images.length; i++) {
            const image = zohoProduct.images[i];
            
            try {
              // Use Zoho image URL or construct API endpoint
              const imageUrl = image.image_url || `https://www.zohoapis.com/inventory/v1/items/${product.zoho_item_id}/image/${image.image_id}?organization_id=${process.env.ZOHO_ORGANIZATION_ID}`;
              
              // Download and upload image
              const supabaseImageUrl = await downloadAndUploadImage(
                imageUrl,
                product.sku,
                image.image_name || `image_${i}`,
                image.image_type
              );
              
              stats.imagesDownloaded++;
              stats.imagesUploaded++;

              if (i === 0) primaryImageUrl = supabaseImageUrl;

              // Create product_media record
              await createProductMediaRecord(
                product.id,
                supabaseImageUrl,
                i,
                `${product.name} - Image ${i + 1}`
              );

              console.log(`[Zoho Media Migration] Image ${i + 1} uploaded for ${product.name}`);
              
            } catch (imageError) {
              console.error(`[Zoho Media Migration] Failed to process image ${i + 1} for ${product.name}:`, imageError);
              stats.errors.push(`Image ${i + 1} for ${product.name}: ${imageError}`);
            }
          }
        }

        // Update product with all Zoho data
        await updateProductWithZohoData(
          product.id,
          zohoProduct,
          primaryImageUrl
        );

        if (zohoProduct.description) {
          stats.descriptionsUpdated++;
        }

        stats.processed++;
        
        // Small delay to avoid overwhelming APIs
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (productError) {
        console.error(`[Zoho Media Migration] Failed to migrate ${product.name}:`, productError);
        stats.errors.push(`${product.name}: ${productError}`);
        stats.skipped++;
      }
    }

    const message = `Migration completed: ${stats.processed} products processed, ${stats.imagesUploaded} images uploaded, ${stats.descriptionsUpdated} descriptions updated, ${stats.errors.length} errors`;

    console.log(`[Zoho Media Migration] ${message}`);

    return NextResponse.json({
      success: true,
      stats,
      message
    });

  } catch (error) {
    console.error('[Zoho Media Migration] Migration failed:', error);
    
    return NextResponse.json({
      success: false,
      stats,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Zoho Media Migration',
    description: 'Migrates images and descriptions from Zoho to Supabase storage and database',
    method: 'POST',
    parameters: {
      limit: 'Number of products to process (default: 10)',
      startFromId: 'Product ID to start from (for pagination)'
    },
    features: [
      'Downloads images from Zoho Inventory',
      'Uploads images to Supabase storage buckets',
      'Creates product_media records for image management',
      'Updates products table with primary image URL',
      'Migrates product descriptions from Zoho',
      'Handles multiple images per product',
      'Provides detailed migration statistics'
    ]
  });
}
