/**
 * SEO Head Component for Dynamic Meta Tags
 * Optimized for e-commerce and AI search engines
 */

import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    price?: string;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
  };
}

const SEOHead = ({
  title,
  description,
  keywords = '',
  image = '/logo.png',
  url = '',
  type = 'website',
  product
}: SEOHeadProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMeta = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'VIP Smoke', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Product-specific structured data
    if (type === 'product' && product) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title,
        "description": description,
        "image": image,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "VIP Smoke"
        },
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": product.currency || "USD",
          "availability": `https://schema.org/${product.availability || 'InStock'}`,
          "seller": {
            "@type": "Organization",
            "name": "VIP Smoke"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "100"
        }
      };

      let script = document.querySelector('#product-schema') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'product-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(productSchema);
    }

    // Website/Organization structured data
    if (type === 'website') {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "OnlineStore"],
        "name": "VIP Smoke",
        "description": "Premium smoking accessories and glass for discerning enthusiasts",
        "url": "https://vipsmoke.com",
        "logo": "https://vipsmoke.com/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "1-800-VIP-SMOKE",
          "contactType": "customer service",
          "areaServed": "US",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://facebook.com/vipsmoke",
          "https://instagram.com/vipsmoke",
          "https://twitter.com/vipsmoke"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Smoking Accessories",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Glass Bongs",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Glass Bongs",
                    "category": "Smoking Accessories"
                  }
                }
              ]
            }
          ]
        }
      };

      let script = document.querySelector('#website-schema') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'website-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(websiteSchema);
    }

    // Breadcrumb structured data
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://vipsmoke.com"
        }
      ]
    };

    let breadcrumbScript = document.querySelector('#breadcrumb-schema') as HTMLScriptElement;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'breadcrumb-schema';
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || window.location.href);

  }, [title, description, keywords, image, url, type, product]);

  return null; // This component doesn't render anything
};

export default SEOHead;