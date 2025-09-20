import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ZohoImageAuditResult {
  success: boolean;
  stats: {
    totalProducts: number;
    productsWithImages: number;
    productsWithoutImages: number;
    totalImages: number;
    averageImagesPerProduct: number;
    sampleProductsWithImages: Array<{
      item_id: string;
      name: string;
      sku: string;
      imageCount: number;
      hasImageUrl: boolean;
      imageIds: string[];
    }>;
    sampleProductsWithoutImages: Array<{
      item_id: string;
      name: string;
      sku: string;
    }>;
  };
  message: string;
}

async function getZohoAccessToken(): Promise<string> {
  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  
  const { data: tokenRow, error } = await supabase
    .from('zoho_tokens')
    .select('*')
    .eq('org_id', orgId)
    .single();

  if (error || !tokenRow) {
    throw new Error('No Zoho access token found');
  }

  return tokenRow.access_token;
}

async function fetchZohoProductsWithImageInfo(accessToken: string, page = 1, perPage = 50) {
  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  const url = `https://www.zohoapis.com/inventory/v1/items?organization_id=${orgId}&page=${page}&per_page=${perPage}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

async function fetchZohoProductDetails(accessToken: string, itemId: string) {
  const orgId = process.env.ZOHO_ORGANIZATION_ID || process.env.ZOHO_ORG_ID;
  const url = `https://www.zohoapis.com/inventory/v1/items/${itemId}?organization_id=${orgId}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`Zoho API error for item ${itemId}: ${response.status}`);
  }

  const data = await response.json();
  return data.item;
}

export async function POST(req: NextRequest): Promise<NextResponse<ZohoImageAuditResult>> {
  try {
    console.log('[Zoho Image Audit] Starting audit...');

    // Get request parameters
    const { sampleSize = 100, detailedScan = false } = await req.json().catch(() => ({}));

    // Get Zoho access token
    const accessToken = await getZohoAccessToken();

    const stats = {
      totalProducts: 0,
      productsWithImages: 0,
      productsWithoutImages: 0,
      totalImages: 0,
      averageImagesPerProduct: 0,
      sampleProductsWithImages: [] as any[],
      sampleProductsWithoutImages: [] as any[]
    };

    let page = 1;
    let processedCount = 0;
    const maxPages = Math.ceil(sampleSize / 50); // 50 items per page

    console.log(`[Zoho Image Audit] Scanning up to ${sampleSize} products...`);

    while (page <= maxPages && processedCount < sampleSize) {
      try {
        const products = await fetchZohoProductsWithImageInfo(accessToken, page, 50);
        
        if (!products || products.length === 0) {
          console.log(`[Zoho Image Audit] No more products found at page ${page}`);
          break;
        }

        console.log(`[Zoho Image Audit] Processing page ${page} with ${products.length} products`);

        for (const product of products) {
          if (processedCount >= sampleSize) break;

          stats.totalProducts++;
          processedCount++;

          try {
            // Get detailed product info if requested or for first few products
            let detailedProduct = product;
            if (detailedScan || processedCount <= 10) {
              detailedProduct = await fetchZohoProductDetails(accessToken, product.item_id);
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            }

            const hasImages = detailedProduct.images && detailedProduct.images.length > 0;
            
            if (hasImages) {
              stats.productsWithImages++;
              stats.totalImages += detailedProduct.images.length;
              
              // Collect sample products with images
              if (stats.sampleProductsWithImages.length < 10) {
                stats.sampleProductsWithImages.push({
                  item_id: product.item_id,
                  name: product.name,
                  sku: product.sku,
                  imageCount: detailedProduct.images.length,
                  hasImageUrl: !!detailedProduct.images[0]?.image_url,
                  imageIds: detailedProduct.images.map((img: any) => img.image_id)
                });
              }
            } else {
              stats.productsWithoutImages++;
              
              // Collect sample products without images
              if (stats.sampleProductsWithoutImages.length < 10) {
                stats.sampleProductsWithoutImages.push({
                  item_id: product.item_id,
                  name: product.name,
                  sku: product.sku
                });
              }
            }

            if (processedCount % 10 === 0) {
              console.log(`[Zoho Image Audit] Processed ${processedCount}/${sampleSize} products...`);
            }

          } catch (productError) {
            console.error(`[Zoho Image Audit] Error processing product ${product.item_id}:`, productError);
            continue;
          }
        }

        page++;
      } catch (pageError) {
        console.error(`[Zoho Image Audit] Error processing page ${page}:`, pageError);
        break;
      }
    }

    // Calculate averages
    stats.averageImagesPerProduct = stats.productsWithImages > 0 
      ? Math.round((stats.totalImages / stats.productsWithImages) * 100) / 100 
      : 0;

    const imagePercentage = Math.round((stats.productsWithImages / stats.totalProducts) * 100);

    console.log(`[Zoho Image Audit] Audit completed:`);
    console.log(`  - Total products scanned: ${stats.totalProducts}`);
    console.log(`  - Products with images: ${stats.productsWithImages} (${imagePercentage}%)`);
    console.log(`  - Products without images: ${stats.productsWithoutImages}`);
    console.log(`  - Total images found: ${stats.totalImages}`);
    console.log(`  - Average images per product: ${stats.averageImagesPerProduct}`);

    return NextResponse.json({
      success: true,
      stats,
      message: `Audit completed: ${stats.productsWithImages}/${stats.totalProducts} products (${imagePercentage}%) have images in Zoho Inventory`
    });

  } catch (error) {
    console.error('[Zoho Image Audit] Error:', error);
    return NextResponse.json({
      success: false,
      stats: {
        totalProducts: 0,
        productsWithImages: 0,
        productsWithoutImages: 0,
        totalImages: 0,
        averageImagesPerProduct: 0,
        sampleProductsWithImages: [],
        sampleProductsWithoutImages: []
      },
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Zoho Image Audit',
    description: 'Audits Zoho Inventory to check how many products actually have images',
    method: 'POST',
    parameters: {
      sampleSize: 'Number of products to scan (default: 100)',
      detailedScan: 'Whether to fetch detailed product info for all products (slower but more accurate)'
    },
    usage: 'POST /api/admin/zoho-image-audit with { "sampleSize": 200, "detailedScan": true }'
  });
}
