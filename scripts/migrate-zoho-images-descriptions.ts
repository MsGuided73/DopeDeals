#!/usr/bin/env tsx

/**
 * ZOHO TO SUPABASE IMAGE & DESCRIPTION MIGRATION
 * 
 * This script:
 * 1. Fetches products from Zoho with images and descriptions
 * 2. Downloads images from Zoho and uploads to Supabase storage
 * 3. Updates products table with descriptions and primary image URL
 * 4. Creates product_media records for all images
 * 5. Handles both single and multiple images per product
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';

// Environment validation
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ZOHO_ORG_ID = process.env.ZOHO_ORGANIZATION_ID;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ZOHO_ORG_ID) {
  console.error('❌ Missing required environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ZOHO_ORGANIZATION_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
  custom_fields?: Array<{
    customfield_id: string;
    label: string;
    value: string;
  }>;
}

interface MigrationStats {
  processed: number;
  imagesDownloaded: number;
  imagesUploaded: number;
  descriptionsUpdated: number;
  errors: string[];
  skipped: number;
}

async function getZohoAccessToken(): Promise<string> {
  const orgId = process.env.ZOHO_ORGANIZATION_ID!;

  // First, try to get token from database
  const { data: tokenRow, error } = await supabase
    .from('zoho_tokens')
    .select('*')
    .eq('org_id', orgId)
    .single();

  if (error || !tokenRow) {
    throw new Error('No Zoho token found in database. Please run Zoho OAuth first.');
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = new Date(tokenRow.expires_at);

  if (expiresAt > now && tokenRow.access_token) {
    console.log('🔑 Using existing valid access token');
    return tokenRow.access_token;
  }

  // Token is expired, refresh it
  console.log('🔄 Token expired, refreshing...');
  const newAccessToken = await refreshZohoToken(tokenRow.refresh_token, tokenRow.dc, orgId);

  return newAccessToken;
}

async function refreshZohoToken(refreshToken: string, dc: string, orgId: string): Promise<string> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Zoho client credentials in environment variables');
  }

  const tokenUrl = `https://accounts.zoho.com/oauth/v2/token`;
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to refresh Zoho access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Zoho token refresh error: ${data.error_description || data.error}`);
  }

  const newAccessToken = data.access_token;
  const expiresIn = data.expires_in || 3600; // Default 1 hour
  const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString();

  // Update the token in database
  const { error: updateError } = await supabase
    .from('zoho_tokens')
    .update({
      access_token: newAccessToken,
      expires_at: expiresAt
    })
    .eq('org_id', orgId);

  if (updateError) {
    console.warn('⚠️ Failed to update token in database:', updateError.message);
    // Don't throw error here, we still have the token
  } else {
    console.log('✅ Token refreshed and updated in database');
  }

  return newAccessToken;
}

async function fetchZohoProducts(accessToken: string, page = 1, perPage = 50): Promise<ZohoProduct[]> {
  const url = `https://www.zohoapis.com/inventory/v1/items?organization_id=${ZOHO_ORG_ID}&page=${page}&per_page=${perPage}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as any;
  return data.items || [];
}

async function fetchZohoProductDetails(accessToken: string, itemId: string): Promise<ZohoProduct> {
  const url = `https://www.zohoapis.com/inventory/v1/items/${itemId}?organization_id=${ZOHO_ORG_ID}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho API error for item ${itemId}: ${response.status}`);
  }

  const data = await response.json() as any;
  return data.item;
}

async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadImageToSupabase(
  imageBuffer: Buffer, 
  sku: string, 
  imageName: string, 
  imageType?: string
): Promise<string> {
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
  alt?: string,
  width?: number,
  height?: number
): Promise<void> {
  const mediaRecord = {
    product_id: productId,
    type: 'image',
    path: imagePath.replace(/^.*\/products\//, ''), // Store relative path
    alt: alt || null,
    role: imageIndex === 0 ? 'hero' : 'gallery',
    sort: imageIndex,
    width: width || null,
    height: height || null
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

async function updateProductWithImageAndDescription(
  productId: string,
  primaryImageUrl: string,
  description?: string
): Promise<void> {
  const updateData: any = {
    image_url: primaryImageUrl,
    updated_at: new Date().toISOString(),
    updated_by: 'zoho-migration-script'
  };

  if (description) {
    updateData.description = description;
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

async function findProductByZohoId(zohoItemId: string): Promise<{ id: string; sku: string } | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku')
    .eq('zoho_item_id', zohoItemId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function migrateProduct(zohoProduct: ZohoProduct, accessToken: string, stats: MigrationStats): Promise<void> {
  try {
    // Find corresponding Supabase product
    const supabaseProduct = await findProductByZohoId(zohoProduct.item_id);
    if (!supabaseProduct) {
      console.log(`⚠️  No Supabase product found for Zoho item ${zohoProduct.item_id} (${zohoProduct.name})`);
      stats.skipped++;
      return;
    }

    console.log(`🔄 Processing: ${zohoProduct.name} (SKU: ${supabaseProduct.sku})`);

    // Get detailed product info with images
    const detailedProduct = await fetchZohoProductDetails(accessToken, zohoProduct.item_id);
    
    let primaryImageUrl: string | null = null;
    const imageUrls: string[] = [];

    // Process images if they exist
    if (detailedProduct.images && detailedProduct.images.length > 0) {
      console.log(`  📸 Found ${detailedProduct.images.length} images`);

      for (let i = 0; i < detailedProduct.images.length; i++) {
        const image = detailedProduct.images[i];
        
        try {
          // Download image from Zoho
          const imageUrl = image.image_url || `/api/zoho/images/${image.image_id}`;
          const imageBuffer = await downloadImage(imageUrl);
          stats.imagesDownloaded++;

          // Upload to Supabase
          const supabaseImageUrl = await uploadImageToSupabase(
            imageBuffer,
            supabaseProduct.sku,
            image.image_name || `image_${i}`,
            image.image_type
          );
          stats.imagesUploaded++;

          imageUrls.push(supabaseImageUrl);
          if (i === 0) primaryImageUrl = supabaseImageUrl;

          // Create product_media record
          await createProductMediaRecord(
            supabaseProduct.id,
            supabaseImageUrl,
            i,
            `${zohoProduct.name} - Image ${i + 1}`
          );

          console.log(`    ✅ Image ${i + 1} uploaded and linked`);
          
          // Small delay to avoid overwhelming the APIs
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (imageError) {
          console.error(`    ❌ Failed to process image ${i + 1}:`, imageError);
          stats.errors.push(`Image ${i + 1} for ${zohoProduct.name}: ${imageError}`);
        }
      }
    }

    // Update product with primary image and description
    if (primaryImageUrl || detailedProduct.description) {
      await updateProductWithImageAndDescription(
        supabaseProduct.id,
        primaryImageUrl || '',
        detailedProduct.description
      );
      
      if (detailedProduct.description) {
        stats.descriptionsUpdated++;
        console.log(`    ✅ Description updated`);
      }
      if (primaryImageUrl) {
        console.log(`    ✅ Primary image set`);
      }
    }

    stats.processed++;
    console.log(`✅ Completed: ${zohoProduct.name}`);

  } catch (error) {
    console.error(`❌ Failed to migrate ${zohoProduct.name}:`, error);
    stats.errors.push(`${zohoProduct.name}: ${error}`);
  }
}

async function main() {
  console.log('🚀 Starting Zoho to Supabase Image & Description Migration');
  console.log('=' .repeat(60));

  const stats: MigrationStats = {
    processed: 0,
    imagesDownloaded: 0,
    imagesUploaded: 0,
    descriptionsUpdated: 0,
    errors: [],
    skipped: 0
  };

  try {
    // Get Zoho access token
    console.log('🔑 Getting Zoho access token...');
    const accessToken = await getZohoAccessToken();

    // Fetch all Zoho products (paginated)
    console.log('📦 Fetching Zoho products...');
    let page = 1;
    let allProducts: ZohoProduct[] = [];
    
    while (true) {
      const products = await fetchZohoProducts(accessToken, page, 50);
      if (products.length === 0) break;
      
      allProducts = allProducts.concat(products);
      console.log(`  📄 Page ${page}: ${products.length} products`);
      page++;
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`📊 Total products to process: ${allProducts.length}`);
    console.log('=' .repeat(60));

    // Process each product
    for (const product of allProducts) {
      await migrateProduct(product, accessToken, stats);
      
      // Progress update every 10 products
      if (stats.processed % 10 === 0) {
        console.log(`📈 Progress: ${stats.processed}/${allProducts.length} products processed`);
      }
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
    stats.errors.push(`Migration error: ${error}`);
  }

  // Final report
  console.log('=' .repeat(60));
  console.log('📊 MIGRATION COMPLETE');
  console.log('=' .repeat(60));
  console.log(`✅ Products processed: ${stats.processed}`);
  console.log(`⚠️  Products skipped: ${stats.skipped}`);
  console.log(`📸 Images downloaded: ${stats.imagesDownloaded}`);
  console.log(`☁️  Images uploaded: ${stats.imagesUploaded}`);
  console.log(`📝 Descriptions updated: ${stats.descriptionsUpdated}`);
  console.log(`❌ Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    stats.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }

  console.log('\n🎉 Migration script completed!');
}

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}
