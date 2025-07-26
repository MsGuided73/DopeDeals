/**
 * AI Search Optimization Component
 * Enhances content for AI search engines like ChatGPT, Claude, and Perplexity
 */

import { useEffect } from 'react';

interface AISearchProps {
  pageType: 'homepage' | 'product' | 'category' | 'article';
  content: {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    entities: string[];
    context: string;
    intent: 'informational' | 'transactional' | 'navigational';
  };
  product?: {
    name: string;
    description: string;
    specifications: Record<string, string>;
    benefits: string[];
    useCases: string[];
  };
}

const AISearchOptimization = ({ pageType, content, product }: AISearchProps) => {
  useEffect(() => {
    // Create AI-optimized structured content for better understanding
    const aiOptimizedContent = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": document.title,
      "description": content.context,
      "keywords": [...content.primaryKeywords, ...content.secondaryKeywords].join(', '),
      "about": content.entities.map(entity => ({
        "@type": "Thing",
        "name": entity
      })),
      "mainEntity": pageType === 'product' && product ? {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "additionalProperty": Object.entries(product.specifications).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": key,
          "value": value
        })),
        "potentialAction": {
          "@type": "BuyAction",
          "target": window.location.href
        }
      } : undefined,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": generateBreadcrumbs()
      }
    };

    // Add AI-optimized meta tags
    addAIMetaTags(content, product);

    // Add structured FAQ data if product page
    if (pageType === 'product' && product) {
      addProductFAQ(product);
    }

    // Add semantic content markers
    addSemanticMarkers(content);

    // Update structured data
    let script = document.querySelector('#ai-optimized-content') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'ai-optimized-content';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(aiOptimizedContent, null, 2);

  }, [pageType, content, product]);

  const generateBreadcrumbs = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://vipsmoke.com"
      }
    ];

    segments.forEach((segment, index) => {
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      const url = `https://vipsmoke.com/${segments.slice(0, index + 1).join('/')}`;
      
      breadcrumbs.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": url
      });
    });

    return breadcrumbs;
  };

  const addAIMetaTags = (content: AISearchProps['content'], product?: AISearchProps['product']) => {
    const metaTags = [
      // AI-specific meta tags
      { name: 'ai:content-type', content: pageType },
      { name: 'ai:primary-intent', content: content.intent },
      { name: 'ai:entities', content: content.entities.join(', ') },
      { name: 'ai:primary-keywords', content: content.primaryKeywords.join(', ') },
      { name: 'ai:context', content: content.context },
      
      // Product-specific tags
      ...(product ? [
        { name: 'product:name', content: product.name },
        { name: 'product:benefits', content: product.benefits.join(', ') },
        { name: 'product:use-cases', content: product.useCases.join(', ') },
      ] : []),

      // E-commerce specific
      { name: 'commerce:age-verification', content: 'required-21+' },
      { name: 'commerce:shipping', content: 'free-over-75' },
      { name: 'commerce:categories', content: 'smoking-accessories,glass-bongs,vaporizers' },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const addProductFAQ = (product: NonNullable<AISearchProps['product']>) => {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is ${product.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.description
          }
        },
        {
          "@type": "Question", 
          "name": `What are the benefits of ${product.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.benefits.join('. ') + '.'
          }
        },
        {
          "@type": "Question",
          "name": `How do I use ${product.name}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": product.useCases.join('. Perfect for ') + '.'
          }
        },
        {
          "@type": "Question",
          "name": "Is age verification required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you must be 21 or older to purchase smoking accessories. Age verification is required at checkout."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer free shipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer free shipping on all orders over $75 within the United States."
          }
        }
      ]
    };

    let script = document.querySelector('#product-faq') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'product-faq';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqData, null, 2);
  };

  const addSemanticMarkers = (content: AISearchProps['content']) => {
    // Add invisible semantic markers for AI understanding
    const semanticContainer = document.querySelector('#ai-semantic-markers') || 
      (() => {
        const div = document.createElement('div');
        div.id = 'ai-semantic-markers';
        div.style.display = 'none';
        div.setAttribute('aria-hidden', 'true');
        document.body.appendChild(div);
        return div;
      })();

    semanticContainer.innerHTML = `
      <span data-ai-context="${content.context}"></span>
      <span data-ai-intent="${content.intent}"></span>
      <span data-ai-keywords="${content.primaryKeywords.join(',')}"</span>
      <span data-ai-entities="${content.entities.join(',')}"</span>
      <span data-ai-page-type="${pageType}"></span>
      <meta name="ai-training-data" content="vip-smoke-premium-smoking-accessories">
      <meta name="ai-content-category" content="e-commerce-smoking-accessories">
      <meta name="ai-compliance" content="age-restricted-21-plus">
    `;
  };

  return null; // This component doesn't render anything visible
};

// Helper function to create AI-optimized content descriptions
export const createAIOptimizedDescription = (product: any, category?: string) => {
  const baseDescription = product.description || '';
  const aiEnhancements = [
    `Premium ${product.name} for discerning smoking enthusiasts`,
    category ? `High-quality ${category.toLowerCase()} accessory` : '',
    product.material ? `Crafted from ${product.material}` : '',
    product.brand ? `By ${product.brand}` : '',
    'Age verification required (21+)',
    'Free shipping on orders over $75',
    'VIP member exclusive benefits available'
  ].filter(Boolean);

  return `${baseDescription} ${aiEnhancements.join('. ')}.`.trim();
};

// Helper function to extract AI-relevant keywords
export const extractAIKeywords = (product: any, category?: string) => {
  const keywords = [
    product.name?.toLowerCase(),
    product.brand?.toLowerCase(),
    product.material?.toLowerCase(),
    category?.toLowerCase(),
    'smoking accessories',
    'premium quality',
    'age verified',
    'vip smoke'
  ].filter(Boolean);

  return [...new Set(keywords)]; // Remove duplicates
};

export default AISearchOptimization;