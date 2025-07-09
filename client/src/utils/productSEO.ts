import type { Product, Brand, Category } from "@shared/schema";

// SEO template generators for imported products
export interface ProductSEOTemplate {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  structuredData: object;
}

export function generateProductSEO(
  product: Product, 
  brand?: Brand, 
  category?: Category
): ProductSEOTemplate {
  const brandName = brand?.name || "VIP Smoke";
  const categoryName = category?.name || "Smoking Accessories";
  
  // Generate SEO-friendly slug
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Generate title variations
  const title = `${product.name} - ${brandName}`;
  const metaTitle = `${product.name} - ${brandName} | Premium ${categoryName} | VIP Smoke`;
  
  // Generate description
  const baseDescription = product.description || 
    `Experience premium quality with this exceptional ${product.name.toLowerCase()}. Handcrafted by ${brandName} for the discerning connoisseur.`;
  
  const metaDescription = `${baseDescription} Shop premium ${categoryName.toLowerCase()} at VIP Smoke. Fast shipping, secure checkout. Age verification required - 21+ only.`;

  // Generate keywords
  const keywords = [
    product.name.toLowerCase(),
    brandName.toLowerCase(),
    categoryName.toLowerCase(),
    product.material?.toLowerCase(),
    "premium smoking accessories",
    "smoking paraphernalia",
    "luxury smoking",
    "vip smoke",
    "age restricted",
    "21+"
  ].filter(Boolean).join(", ");

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || baseDescription,
    image: product.imageUrl ? [product.imageUrl] : [],
    brand: {
      "@type": "Brand",
      name: brandName
    },
    category: categoryName,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "USD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "VIP Smoke"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 1
    }
  };

  return {
    title,
    description: baseDescription,
    keywords,
    slug,
    metaTitle,
    metaDescription,
    structuredData
  };
}

// Category page SEO template
export function generateCategorySEO(category: Category, productCount: number = 0): ProductSEOTemplate {
  const title = `${category.name} - Premium Smoking Accessories`;
  const metaTitle = `${category.name} - Premium Smoking Accessories | VIP Smoke`;
  
  const description = category.description || 
    `Discover our premium ${category.name.toLowerCase()} collection, carefully curated for the discerning connoisseur.`;
  
  const metaDescription = `${description} Shop ${productCount} premium ${category.name.toLowerCase()} at VIP Smoke. Fast shipping, secure checkout. Age verification required - 21+ only.`;

  const keywords = [
    category.name.toLowerCase(),
    "premium smoking accessories",
    "smoking paraphernalia",
    "luxury smoking",
    "vip smoke",
    "age restricted",
    "21+"
  ].join(", ");

  const slug = category.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: `https://vipsmoke.com/category/${category.id}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Collection`,
      numberOfItems: productCount
    }
  };

  return {
    title,
    description,
    keywords,
    slug,
    metaTitle,
    metaDescription,
    structuredData
  };
}

// Generate URL-friendly product URLs
export function generateProductURL(product: Product, brand?: Brand, category?: Category): string {
  const brandSlug = brand?.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || '';
  const categorySlug = category?.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || '';
  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  
  // Create SEO-friendly URL structure
  return `/product/${productSlug}-${product.id}`;
}

// Generate sitemap entries for products
export function generateProductSitemapEntry(product: Product): {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
} {
  return {
    url: `https://vipsmoke.com/product/${product.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: product.featured ? 0.9 : 0.8
  };
}

// Generate meta tags for product import
export function generateProductMetaTags(product: Product, brand?: Brand, category?: Category): Array<{
  name?: string;
  property?: string;
  content: string;
}> {
  const seo = generateProductSEO(product, brand, category);
  
  return [
    { name: "title", content: seo.metaTitle },
    { name: "description", content: seo.metaDescription },
    { name: "keywords", content: seo.keywords },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:type", content: "product" },
    { property: "og:image", content: product.imageUrl || "/default-product-image.jpg" },
    { property: "og:url", content: `https://vipsmoke.com/product/${product.id}` },
    { property: "product:price:amount", content: product.price.toString() },
    { property: "product:price:currency", content: "USD" },
    { property: "product:availability", content: product.inStock ? "instock" : "outofstock" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: product.imageUrl || "/default-product-image.jpg" }
  ];
}

// Age verification compliance for product SEO
export function addAgeVerificationToSEO(seo: ProductSEOTemplate): ProductSEOTemplate {
  return {
    ...seo,
    metaDescription: `${seo.metaDescription} Age verification required - 21+ only.`,
    keywords: `${seo.keywords}, age verification, 21+, adult only`,
    structuredData: {
      ...seo.structuredData,
      audience: {
        "@type": "PeopleAudience",
        requiredMinAge: 21,
        geographicArea: {
          "@type": "Country",
          name: "United States"
        }
      }
    }
  };
}