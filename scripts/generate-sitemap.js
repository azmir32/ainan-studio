#!/usr/bin/env node

/**
 * XML Sitemap Generator
 * Generates sitemap.xml and robots.txt for SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Site configuration
const SITE_CONFIG = {
  baseUrl: 'https://ainan.studio',
  lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  changefreq: 'weekly',
  priority: 0.8
};

// Pages configuration
const PAGES = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: SITE_CONFIG.lastmod
  },
  {
    url: '/portfolio',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: SITE_CONFIG.lastmod
  },
  {
    url: '/livefeed',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: SITE_CONFIG.lastmod
  },
  {
    url: '/livefeed-portfolio',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: SITE_CONFIG.lastmod
  },
  {
    url: '/packages',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: SITE_CONFIG.lastmod
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: SITE_CONFIG.lastmod
  }
];

// Image sitemap data (based on your gallery)
const IMAGES = [
  {
    url: '/Logo/AINAN-Logo-01.webp',
    caption: 'Ainan Studio Logo',
    title: 'Ainan Studio - Professional Photography Services'
  },
  {
    url: '/Logo/AINAN-Logo-02.webp',
    caption: 'Ainan Studio Logo Alternative',
    title: 'Ainan Studio - Professional Photography Services'
  },
  {
    url: '/assets/hero-image.webp',
    caption: 'Professional Photography Services in Kuala Lumpur',
    title: 'Professional Photography and Live Streaming Services'
  },
  {
    url: '/assets/imagesCarousel/20191208-LAN_0281.webp',
    caption: 'Tech Conference Live Stream - Multi-camera setup for 1,000+ attendees',
    title: 'Professional Live Streaming Services'
  },
  {
    url: '/assets/imagesCarousel/AIN00523.webp',
    caption: 'Corporate Headshot Session - Professional headshots for executives',
    title: 'Corporate Headshot Photography Services'
  },
  {
    url: '/assets/imagesCarousel/AIN00718.webp',
    caption: 'Wedding Live Coverage - Complete ceremony and reception coverage',
    title: 'Wedding Photography and Live Streaming'
  },
  {
    url: '/assets/imagesCarousel/Amin-Rashidi-Studio-664.webp',
    caption: 'Product Launch Event - High-end product photography and live streaming',
    title: 'Event Photography and Live Streaming Services'
  },
  {
    url: '/assets/imagesCarousel/DSC_3411.webp',
    caption: 'Corporate Training Session - Multi-location training with interactive Q&A',
    title: 'Corporate Event Photography Services'
  },
  {
    url: '/assets/imagesCarousel/FKP03731.webp',
    caption: 'Award Ceremony Coverage - Red carpet photography and live streaming',
    title: 'Award Ceremony Photography Services'
  },
  {
    url: '/assets/imagesCarousel/FKP03833.webp',
    caption: 'Team Building Event - Dynamic coverage of corporate activities',
    title: 'Team Building Event Photography'
  },
  {
    url: '/assets/imagesCarousel/FKP03935.webp',
    caption: 'Intimate Wedding Ceremony - Breathtaking coverage of intimate ceremonies',
    title: 'Intimate Wedding Photography Services'
  },
  {
    url: '/assets/imagesCarousel/0FK_1526.webp',
    caption: 'Corporate Event Photography - Comprehensive coverage of business meetings',
    title: 'Corporate Event Photography Malaysia'
  },
  {
    url: '/assets/imagesCarousel/0FK_0696.webp',
    caption: 'Corporate Event Photography - Professional business event coverage',
    title: 'Professional Business Event Photography'
  }
];

/**
 * Generate XML sitemap
 */
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${PAGES.map(page => {
  const pageImages = IMAGES.filter(img => 
    page.url === '/' || 
    (page.url === '/portfolio' && img.url.includes('imagesCarousel')) ||
    (page.url === '/livefeed' && img.url.includes('imagesCarousel'))
  );
  
  return `  <url>
    <loc>${SITE_CONFIG.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${pageImages.map(img => `    <image:image>
      <image:loc>${SITE_CONFIG.baseUrl}${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>`).join('\n')}
  </url>`;
}).join('\n')}
</urlset>`;

  return sitemap;
}

/**
 * Generate image sitemap
 */
function generateImageSitemap() {
  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_CONFIG.baseUrl}/</loc>
    <lastmod>${SITE_CONFIG.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${IMAGES.map(img => `    <image:image>
      <image:loc>${SITE_CONFIG.baseUrl}${img.url}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>`).join('\n')}
  </url>
</urlset>`;

  return imageSitemap;
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_CONFIG.baseUrl}/sitemap.xml
Sitemap: ${SITE_CONFIG.baseUrl}/sitemap-images.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow all images
Allow: /assets/
Allow: /Logo/
Allow: /*.webp
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png

# Crawl delay (optional)
Crawl-delay: 1`;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating SEO files...\n');
  
  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('📁 Created public directory');
  }
  
  // Generate sitemap.xml
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
  
  // Generate image sitemap
  const imageSitemap = generateImageSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), imageSitemap);
  console.log('✅ Generated sitemap-images.xml');
  
  // Generate robots.txt
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt');
  
  // Also generate for dist directory (for build)
  const distDir = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
    fs.writeFileSync(path.join(distDir, 'sitemap-images.xml'), imageSitemap);
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
    console.log('✅ Generated SEO files in dist directory');
  }
  
  console.log('\n🎉 SEO files generated successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Submit sitemap to Google Search Console');
  console.log('2. Submit sitemap to Bing Webmaster Tools');
  console.log('3. Test robots.txt with Google Search Console');
  console.log('4. Monitor indexing status');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateSitemap,
  generateImageSitemap,
  generateRobotsTxt,
  SITE_CONFIG,
  PAGES,
  IMAGES
};
