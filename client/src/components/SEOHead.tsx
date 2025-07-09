import useSEO, { SEOData } from "@/hooks/useSEO";
import { createStructuredData } from "@/utils/structuredData";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: any[];
  noIndex?: boolean;
}

export default function SEOHead({
  title = "VIP Smoke - Premium Smoking Accessories & Paraphernalia",
  description = "Discover our curated collection of luxury smoking accessories, handcrafted for the discerning connoisseur. Age verification required - 21+ only.",
  keywords = "smoking accessories, paraphernalia, glass pipes, water pipes, vaporizers, CBD, premium smoking, luxury smoking accessories, VIP smoke",
  ogImage = "/og-image.jpg",
  canonical,
  structuredData = [],
  noIndex = false
}: SEOHeadProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://vipsmoke.com';
  
  const seoData: SEOData = {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: ogImage.startsWith('http') ? ogImage : `${currentUrl}${ogImage}`,
    ogUrl: currentUrl,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage.startsWith('http') ? ogImage : `${currentUrl}${ogImage}`,
    canonical: canonical || currentUrl,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    structuredData: structuredData.length > 0 ? createStructuredData(structuredData) : undefined
  };

  useSEO(seoData);

  return null; // This component doesn't render anything
}