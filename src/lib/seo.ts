/**
 * SEO Utilities and Structured Data
 * Comprehensive SEO system for Ainan Studio photography business
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: any;
}

export interface BusinessInfo {
  name: string;
  description: string;
  url: string;
  logo: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  services: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Business information for structured data
export const BUSINESS_INFO: BusinessInfo = {
  name: "Ainan Studio",
  description: "Professional photography and live streaming services in Kuala Lumpur and Selangor. We bring the studio to you with our mobile setup for corporate headshots, event photography, and live streaming.",
  url: "https://ainan.studio",
  logo: "https://ainan.studio/Logo/AINAN-Logo-01.webp",
  phone: "+60123456789",
  email: "info@ainanstudio.com",
  address: {
    street: "Kuala Lumpur",
    city: "Kuala Lumpur",
    state: "Federal Territory of Kuala Lumpur",
    postalCode: "50000",
    country: "Malaysia"
  },
  coordinates: {
    latitude: 3.1390,
    longitude: 101.6869
  },
  openingHours: [
    "Mo-Fr 09:00-18:00",
    "Sa 09:00-15:00",
    "Su closed"
  ],
  services: [
    "Corporate Photography",
    "Professional Headshots",
    "Event Photography",
    "Live Streaming",
    "Wedding Photography",
    "Product Photography",
    "Team Building Photography"
  ],
  socialMedia: {
    instagram: "https://instagram.com/ainan_studio",
    facebook: "https://facebook.com/ainanstudio",
    linkedin: "https://linkedin.com/company/ainan-studio"
  }
};

/**
 * Generate Local Business structured data
 */
export function generateLocalBusinessSchema(): any {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BUSINESS_INFO.url}#business`,
    "name": BUSINESS_INFO.name,
    "description": BUSINESS_INFO.description,
    "url": BUSINESS_INFO.url,
    "logo": BUSINESS_INFO.logo,
    "image": [
      "https://ainan.studio/Logo/AINAN-Logo-01.webp",
      "https://ainan.studio/Logo/AINAN-Logo-02.webp"
    ],
    "telephone": BUSINESS_INFO.phone,
    "email": BUSINESS_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.street,
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.state,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_INFO.coordinates.latitude,
      "longitude": BUSINESS_INFO.coordinates.longitude
    },
    "openingHoursSpecification": BUSINESS_INFO.openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(' ')[0],
      "opens": hours.split(' ')[1].split('-')[0],
      "closes": hours.split(' ')[1].split('-')[1]
    })),
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": BUSINESS_INFO.coordinates.latitude,
        "longitude": BUSINESS_INFO.coordinates.longitude
      },
      "geoRadius": "50000" // 50km radius
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Photography Services",
      "itemListElement": BUSINESS_INFO.services.map((service, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "description": `Professional ${service.toLowerCase()} services in Kuala Lumpur and Selangor`
        },
        "position": index + 1
      }))
    },
    "sameAs": Object.values(BUSINESS_INFO.socialMedia).filter(Boolean),
    "priceRange": "$$",
    "currenciesAccepted": "MYR",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"]
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(): any {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BUSINESS_INFO.url}#organization`,
    "name": BUSINESS_INFO.name,
    "description": BUSINESS_INFO.description,
    "url": BUSINESS_INFO.url,
    "logo": BUSINESS_INFO.logo,
    "image": BUSINESS_INFO.logo,
    "telephone": BUSINESS_INFO.phone,
    "email": BUSINESS_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.street,
      "addressLocality": BUSINESS_INFO.address.city,
      "addressRegion": BUSINESS_INFO.address.state,
      "postalCode": BUSINESS_INFO.address.postalCode,
      "addressCountry": BUSINESS_INFO.address.country
    },
    "sameAs": Object.values(BUSINESS_INFO.socialMedia).filter(Boolean),
    "foundingDate": "2020",
    "numberOfEmployees": "1-10",
    "industry": "Photography Services"
  };
}

/**
 * Generate Service structured data
 */
export function generateServiceSchema(serviceName: string, description: string, price?: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": BUSINESS_INFO.name,
      "url": BUSINESS_INFO.url
    },
    "serviceType": "Photography Services",
    "areaServed": {
      "@type": "City",
      "name": "Kuala Lumpur"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": BUSINESS_INFO.url,
      "servicePhone": BUSINESS_INFO.phone
    },
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "MYR",
        "availability": "https://schema.org/InStock"
      }
    })
  };
}

/**
 * Generate Event structured data for portfolio items
 */
export function generateEventSchema(eventName: string, description: string, imageUrl: string, date?: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventName,
    "description": description,
    "image": imageUrl,
    "organizer": {
      "@type": "Organization",
      "name": BUSINESS_INFO.name,
      "url": BUSINESS_INFO.url
    },
    "location": {
      "@type": "Place",
      "name": "Kuala Lumpur",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kuala Lumpur",
        "addressCountry": "Malaysia"
      }
    },
    ...(date && {
      "startDate": date,
      "endDate": date
    })
  };
}

/**
 * Generate Image structured data
 */
export function generateImageSchema(imageUrl: string, caption: string, description?: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": imageUrl,
    "caption": caption,
    "description": description || caption,
    "creator": {
      "@type": "Organization",
      "name": BUSINESS_INFO.name
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": BUSINESS_INFO.name
    },
    "license": "https://creativecommons.org/licenses/by-nc-nd/4.0/"
  };
}

/**
 * Generate Review structured data
 */
export function generateReviewSchema(reviewerName: string, reviewText: string, rating: number, date: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": BUSINESS_INFO.name
    },
    "author": {
      "@type": "Person",
      "name": reviewerName
    },
    "reviewBody": reviewText,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rating,
      "bestRating": 5
    },
    "datePublished": date
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>): any {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): any {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

/**
 * Page-specific SEO data
 */
export const PAGE_SEO_DATA: Record<string, SEOData> = {
  home: {
    title: "Professional Photography & Live Streaming Services | Ainan Studio KL",
    description: "Professional photography and live streaming services in Kuala Lumpur and Selangor. Corporate headshots, event photography, and live streaming. We bring the studio to you!",
    keywords: [
      "professional photography Kuala Lumpur",
      "corporate headshots Malaysia",
      "event photography KL",
      "live streaming services Malaysia",
      "mobile photography studio",
      "on-site photography services"
    ],
    canonical: "https://ainan.studio",
    ogImage: "https://ainan.studio/Logo/AINAN-Logo-01.webp"
  },
  portfolio: {
    title: "Portfolio - Professional Photography Gallery | Ainan Studio",
    description: "View our professional photography portfolio featuring corporate events, headshots, weddings, and live streaming projects across Kuala Lumpur and Selangor.",
    keywords: [
      "photography portfolio Malaysia",
      "corporate photography examples",
      "event photography gallery",
      "professional headshots portfolio",
      "wedding photography Malaysia"
    ],
    canonical: "https://ainan.studio/portfolio",
    ogImage: "https://ainan.studio/assets/hero-image.webp"
  },
  livefeed: {
    title: "Live Streaming Services | Professional Event Streaming Malaysia",
    description: "Professional live streaming services for events, conferences, and corporate functions in Kuala Lumpur and Selangor. High-quality multi-camera setups.",
    keywords: [
      "live streaming services Malaysia",
      "event live streaming KL",
      "corporate live streaming",
      "professional streaming services",
      "multi-camera live streaming"
    ],
    canonical: "https://ainan.studio/livefeed",
    ogImage: "https://ainan.studio/assets/hero-image.webp"
  },
  packages: {
    title: "Photography Packages & Pricing | Ainan Studio Services",
    description: "Professional photography packages and pricing for corporate headshots, event photography, and live streaming services in Kuala Lumpur and Selangor.",
    keywords: [
      "photography packages Malaysia",
      "corporate photography pricing",
      "event photography rates",
      "professional headshot packages",
      "live streaming pricing"
    ],
    canonical: "https://ainan.studio/packages",
    ogImage: "https://ainan.studio/Logo/AINAN-Logo-01.webp"
  },
  contact: {
    title: "Contact Ainan Studio | Professional Photography Services KL",
    description: "Contact Ainan Studio for professional photography and live streaming services in Kuala Lumpur and Selangor. Get a quote for your next project.",
    keywords: [
      "contact photography studio Malaysia",
      "photography quote Kuala Lumpur",
      "book photography services",
      "professional photographer contact"
    ],
    canonical: "https://ainan.studio/contact",
    ogImage: "https://ainan.studio/Logo/AINAN-Logo-01.webp"
  }
};

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(seoData: SEOData): string {
  const tags = [
    `<title>${seoData.title}</title>`,
    `<meta name="description" content="${seoData.description}" />`,
    ...(seoData.keywords ? [`<meta name="keywords" content="${seoData.keywords.join(', ')}" />`] : []),
    `<meta name="robots" content="${seoData.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    ...(seoData.canonical ? [`<link rel="canonical" href="${seoData.canonical}" />`] : []),
    
    // Open Graph
    `<meta property="og:title" content="${seoData.title}" />`,
    `<meta property="og:description" content="${seoData.description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${seoData.canonical || 'https://ainan.studio'}" />`,
    `<meta property="og:image" content="${seoData.ogImage || 'https://ainan.studio/Logo/AINAN-Logo-01.webp'}" />`,
    `<meta property="og:site_name" content="Ainan Studio" />`,
    
    // Twitter Card
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@ainan_studio" />`,
    `<meta name="twitter:title" content="${seoData.title}" />`,
    `<meta name="twitter:description" content="${seoData.description}" />`,
    `<meta name="twitter:image" content="${seoData.ogImage || 'https://ainan.studio/Logo/AINAN-Logo-01.webp'}" />`,
    
    // Additional SEO
    `<meta name="author" content="Ainan Studio" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`,
    `<meta name="format-detection" content="telephone=no" />`,
    `<meta name="theme-color" content="#000000" />`
  ];
  
  return tags.join('\n');
}

/**
 * Generate structured data script tag
 */
export function generateStructuredDataScript(structuredData: any): string {
  return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}
