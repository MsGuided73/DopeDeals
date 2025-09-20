#!/usr/bin/env tsx

/**
 * FIXED ZOHO IMAGE DOWNLOAD SCRIPT
 * 
 * This script fixes the image download issues by:
 * 1. Using correct Zoho image API endpoints
 * 2. Adding proper authentication headers
 * 3. Handling different image URL formats
 * 4. Adding better error handling and logging
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
  sku: string;
  images?: ZohoImage[];
}

async function getZohoAccessToken(): Promise<string> {
  const { data: tokenRow, error } = await supabase
    .from('zoho_tokens')
    .select('*')
    .eq('org_id', ZOHO_ORG_ID)
    .single();

  if (error || !tokenRow) {
    throw new Error('No Zoho access token found');
  }

  return tokenRow.access_token;
}

async function fetchZohoProductDetails(accessToken: string, itemId: string): Promise<ZohoProduct> {
  const url = `https://www.zohoapis.com/inventory/v1/items/${itemId}?organization_id=${ZOHO_ORG_ID}`;
  
  console.log(`🔍 Fetching product details: ${url}`);
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Zoho API error for item ${itemId}: ${response.status} - ${errorText}`);
    throw new Error(`Zoho API error for item ${itemId}: ${response.status}`);
  }

  const data = await response.json() as any;
  return data.item;
}

/**
 * FIXED: Download image with proper authentication and URL handling
 */
async function downloadImageFixed(
  image: ZohoImage, 
  itemId: string, 
  accessToken: string
): Promise<Buffer> {
  let imageUrl: string;
  let needsAuth = false;

  // Try different URL formats
  if (image.image_url && image.image_url.startsWith('http')) {
    // Direct HTTP URL - might not need auth
    imageUrl = image.image_url;
    console.log(`📸 Trying direct URL: ${imageUrl}`);
  } else {
    // Construct Zoho API endpoint with proper authentication
    imageUrl = `https://www.zohoapis.com/inventory/v1/items/${itemId}/image/${image.image_id}?organization_id=${ZOHO_ORG_ID}`;
    needsAuth = true;
    console.log(`📸 Trying authenticated API URL: ${imageUrl}`);
  }

  const headers: any = {};
  if (needsAuth) {
    headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
  }

  try {
    const response = await fetch(imageUrl, { headers });
    
    if (!response.ok) {
      console.error(`❌ Image download failed: ${response.status} - ${response.statusText}`);
      
      // If direct URL failed, try authenticated API endpoint
      if (!needsAuth) {
        console.log(`🔄 Retrying with authenticated API endpoint...`);
        const apiUrl = `https://www.zohoapis.com/inventory/v1/items/${itemId}/image/${image.image_id}?organization_id=${ZOHO_ORG_ID}`;
        const apiResponse = await fetch(apiUrl, {
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
        });
        
        if (!apiResponse.ok) {
          throw new Error(`Both image URLs failed: ${response.status} and ${apiResponse.status}`);
        }
        
        console.log(`✅ Authenticated API endpoint worked!`);
        return Buffer.from(await apiResponse.arrayBuffer());
      }
      
      throw new Error(`Failed to download image: ${response.status} - ${response.statusText}`);
    }

    console.log(`✅ Image downloaded successfully from: ${imageUrl}`);
    return Buffer.from(await response.arrayBuffer());
    
  } catch (error) {
    console.error(`❌ Error downloading image ${image.image_id}:`, error);
    throw error;
  }
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

  console.log(`📤 Uploading to Supabase: ${filePath}`);

  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, imageBuffer, {
      upsert: true,
      contentType: imageType || 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable'
    });

  if (error) {
    console.error(`❌ Supabase upload error:`, error);
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  console.log(`✅ Image uploaded successfully: ${publicData.publicUrl}`);
  return publicData.publicUrl;
}

/**
 * Test image download for a single product
 */
async function testImageDownload() {
  try {
    console.log('🚀 Testing Zoho image download fix...');
    
    // Get access token
    const accessToken = await getZohoAccessToken();
    console.log('✅ Got Zoho access token');

    // Get a product with images from your database
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, zoho_item_id')
      .not('zoho_item_id', 'is', null)
      .limit(5);

    if (error || !products || products.length === 0) {
      throw new Error('No products with Zoho IDs found');
    }

    console.log(`🔍 Testing with ${products.length} products...`);

    for (const product of products) {
      try {
        console.log(`\n📦 Testing product: ${product.name} (${product.sku})`);
        
        // Get detailed product info from Zoho
        const zohoProduct = await fetchZohoProductDetails(accessToken, product.zoho_item_id);
        
        if (!zohoProduct.images || zohoProduct.images.length === 0) {
          console.log(`⚠️ No images found for ${product.name}`);
          continue;
        }

        console.log(`📸 Found ${zohoProduct.images.length} images for ${product.name}`);

        // Test downloading the first image
        const firstImage = zohoProduct.images[0];
        console.log(`🔍 Testing image: ${JSON.stringify(firstImage, null, 2)}`);

        try {
          const imageBuffer = await downloadImageFixed(firstImage, product.zoho_item_id, accessToken);
          console.log(`✅ Successfully downloaded image! Size: ${imageBuffer.length} bytes`);

          // Test upload to Supabase
          const supabaseUrl = await uploadImageToSupabase(
            imageBuffer,
            product.sku,
            firstImage.image_name || 'test_image',
            firstImage.image_type
          );

          console.log(`🎉 SUCCESS! Image downloaded and uploaded: ${supabaseUrl}`);
          
          // Only test one successful image to avoid rate limits
          break;
          
        } catch (imageError) {
          console.error(`❌ Failed to download image for ${product.name}:`, imageError);
          continue;
        }

      } catch (productError) {
        console.error(`❌ Error processing product ${product.name}:`, productError);
        continue;
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

/**
 * Debug: Check what image data is actually in Zoho
 */
async function debugZohoImages() {
  try {
    console.log('🔍 Debugging Zoho image data...');
    
    const accessToken = await getZohoAccessToken();
    
    // Get first few products
    const url = `https://www.zohoapis.com/inventory/v1/items?organization_id=${ZOHO_ORG_ID}&page=1&per_page=5`;
    const response = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const items = data.items || [];

    console.log(`📊 Found ${items.length} products to check`);

    for (const item of items) {
      console.log(`\n📦 Product: ${item.name} (ID: ${item.item_id})`);
      
      // Get detailed info
      const detailed = await fetchZohoProductDetails(accessToken, item.item_id);
      
      if (detailed.images && detailed.images.length > 0) {
        console.log(`📸 Images found: ${detailed.images.length}`);
        detailed.images.forEach((img: ZohoImage, index: number) => {
          console.log(`  Image ${index + 1}:`);
          console.log(`    ID: ${img.image_id}`);
          console.log(`    URL: ${img.image_url || 'null'}`);
          console.log(`    Name: ${img.image_name || 'null'}`);
          console.log(`    Type: ${img.image_type || 'null'}`);
        });
      } else {
        console.log(`❌ No images found`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (command === 'debug') {
    await debugZohoImages();
  } else {
    await testImageDownload();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
