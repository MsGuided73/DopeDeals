// Performance optimization utilities for SEO

export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

export function preloadCriticalImages(images: string[]): void {
  images.forEach(src => preloadImage(src));
}

export function lazyLoadImage(img: HTMLImageElement): void {
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  } else {
    // Fallback for older browsers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          lazyImage.src = lazyImage.dataset.src || '';
          lazyImage.classList.remove('lazy');
          observer.unobserve(lazyImage);
        }
      });
    });
    
    observer.observe(img);
  }
}

export function optimizeWebVitals(): void {
  // Preload critical resources
  const criticalImages = [
    '/hero-bg.jpg',
    '/logo.png',
    '/category-icons/glass-pipes.jpg',
    '/category-icons/water-pipes.jpg',
    '/category-icons/vaporizers.jpg',
    '/category-icons/accessories.jpg'
  ];
  
  preloadCriticalImages(criticalImages);
  
  // Prefetch likely navigation targets
  const prefetchLinks = [
    '/products',
    '/categories',
    '/vip-membership'
  ];
  
  prefetchLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });
}

export function reportWebVitals(metric: any): void {
  // Report Web Vitals to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Schema.org structured data helpers
export function generateProductJsonLd(product: any, brand?: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    brand: brand ? {
      "@type": "Brand",
      name: brand.name
    } : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "VIP Smoke"
      }
    }
  };
}

export function generateOrganizationJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VIP Smoke",
    url: "https://vipsmoke.com",
    logo: "https://vipsmoke.com/logo.png",
    description: "Premium e-commerce platform for smoking accessories, paraphernalia, nicotine, and CBD products.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "English"
    }
  };
}