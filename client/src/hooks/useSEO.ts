import { useEffect } from "react";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;
  structuredData?: object;
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    // Set document title
    document.title = data.title;

    // Function to update or create meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', data.description);
    if (data.keywords) {
      updateMeta('keywords', data.keywords);
    }
    if (data.robots) {
      updateMeta('robots', data.robots);
    }

    // Open Graph tags
    updateMeta('og:title', data.ogTitle || data.title, true);
    updateMeta('og:description', data.ogDescription || data.description, true);
    updateMeta('og:type', 'website', true);
    
    if (data.ogImage) {
      updateMeta('og:image', data.ogImage, true);
    }
    if (data.ogUrl) {
      updateMeta('og:url', data.ogUrl, true);
    }

    // Twitter Card tags
    updateMeta('twitter:card', data.twitterCard || 'summary_large_image');
    updateMeta('twitter:title', data.twitterTitle || data.title);
    updateMeta('twitter:description', data.twitterDescription || data.description);
    if (data.twitterImage) {
      updateMeta('twitter:image', data.twitterImage);
    }

    // Canonical URL
    if (data.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', data.canonical);
    }

    // Structured Data (JSON-LD)
    if (data.structuredData) {
      let structuredDataElement = document.querySelector('script[type="application/ld+json"]');
      if (!structuredDataElement) {
        structuredDataElement = document.createElement('script');
        structuredDataElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataElement);
      }
      structuredDataElement.textContent = JSON.stringify(data.structuredData);
    }

    // Cleanup function
    return () => {
      // Remove any dynamically added meta tags if needed
      // This is optional and depends on your specific requirements
    };
  }, [data]);
}

export default useSEO;