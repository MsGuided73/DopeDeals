import type { Product, Category, Brand } from "@shared/schema";

export interface Organization {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType: string;
    availableLanguage: string;
  };
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
}

export interface WebSite {
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface ProductSchema {
  "@type": "Product";
  name: string;
  description?: string;
  image?: string[];
  brand?: {
    "@type": "Brand";
    name: string;
  };
  category?: string;
  sku?: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}

export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

export function createOrganizationSchema(): Organization {
  return {
    "@type": "Organization",
    name: "VIP Smoke",
    url: "https://vipsmoke.com",
    description: "Premium e-commerce platform for smoking accessories, paraphernalia, nicotine, and CBD products.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "English"
    }
  };
}

export function createWebsiteSchema(): WebSite {
  return {
    "@type": "WebSite",
    name: "VIP Smoke - Premium Smoking Accessories",
    url: "https://vipsmoke.com",
    description: "Discover our curated collection of luxury smoking accessories, handcrafted for the discerning connoisseur.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vipsmoke.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function createProductSchema(product: Product, brand?: Brand): ProductSchema {
  return {
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.imageUrl ? [product.imageUrl] : undefined,
    brand: brand ? {
      "@type": "Brand",
      name: brand.name
    } : undefined,
    category: product.material || undefined,
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
    }
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function createStructuredData(schemas: any[]): object {
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

// Age verification compliance schema
export function createAgeVerificationSchema(): object {
  return {
    "@type": "WebPage",
    name: "Age Verification Required",
    description: "Age verification is required to access this content. You must be 21 or older.",
    audience: {
      "@type": "PeopleAudience",
      requiredMinAge: 21,
      geographicArea: {
        "@type": "Country",
        name: "United States"
      }
    }
  };
}

// E-commerce specific schemas
export function createOfferCatalogSchema(products: Product[]): object {
  return {
    "@type": "OfferCatalog",
    name: "VIP Smoke Product Catalog",
    description: "Premium smoking accessories and paraphernalia",
    itemListElement: products.map(product => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.name,
        description: product.description
      },
      price: product.price.toString(),
      priceCurrency: "USD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }))
  };
}