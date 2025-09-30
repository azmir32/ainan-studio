import fs from 'fs';
import path from 'path';

console.log('🚀 Generating SEO files...');

const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('📁 Created public directory');
}

// Generate sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://ainan.studio/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ainan.studio/portfolio</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ainan.studio/livefeed</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ainan.studio/packages</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ainan.studio/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Generated sitemap.xml');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://ainan.studio/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow all images
Allow: /assets/
Allow: /Logo/
Allow: /*.webp
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('✅ Generated robots.txt');

console.log('🎉 SEO files generated successfully!');
