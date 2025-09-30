import React, { useEffect } from 'react';
import { SEOData, generateMetaTags, generateStructuredDataScript } from '@/lib/seo';

interface SEOHeadProps {
  seoData: SEOData;
  structuredData?: any[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seoData, structuredData = [] }) => {
  useEffect(() => {
    // Update document title
    document.title = seoData.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoData.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = seoData.description;
      document.head.appendChild(meta);
    }
    
    // Update canonical URL
    if (seoData.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', seoData.canonical);
      } else {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = seoData.canonical;
        document.head.appendChild(canonical);
      }
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };
    
    updateOGTag('og:title', seoData.title);
    updateOGTag('og:description', seoData.description);
    updateOGTag('og:url', seoData.canonical || window.location.href);
    updateOGTag('og:image', seoData.ogImage || 'https://ainan.studio/Logo/AINAN-Logo-01.webp');
    
    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (twitterTag) {
        twitterTag.setAttribute('content', content);
      } else {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        twitterTag.setAttribute('content', content);
        document.head.appendChild(twitterTag);
      }
    };
    
    updateTwitterTag('twitter:title', seoData.title);
    updateTwitterTag('twitter:description', seoData.description);
    updateTwitterTag('twitter:image', seoData.ogImage || 'https://ainan.studio/Logo/AINAN-Logo-01.webp');
    
    // Add structured data
    structuredData.forEach((data, index) => {
      const scriptId = `structured-data-${index}`;
      let existingScript = document.getElementById(scriptId);
      
      if (existingScript) {
        existingScript.textContent = JSON.stringify(data, null, 2);
      } else {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
      }
    });
    
    // Add robots meta tag
    const robotsContent = seoData.noindex ? 'noindex, nofollow' : 'index, follow';
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag) {
      robotsTag.setAttribute('content', robotsContent);
    } else {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      robotsTag.setAttribute('content', robotsContent);
      document.head.appendChild(robotsTag);
    }
    
  }, [seoData, structuredData]);
  
  return null; // This component doesn't render anything
};
