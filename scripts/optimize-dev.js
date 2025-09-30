#!/usr/bin/env node

/**
 * Development Performance Optimization Script
 * 
 * This script helps optimize your development environment for faster Vite startup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing development environment...\n');

// 1. Clear Vite cache
const viteCacheDir = path.join(process.cwd(), 'node_modules', '.vite');
if (fs.existsSync(viteCacheDir)) {
  console.log('🧹 Clearing Vite cache...');
  fs.rmSync(viteCacheDir, { recursive: true, force: true });
  console.log('✅ Vite cache cleared');
}

// 2. Clear TypeScript build info
const tsBuildInfo = path.join(process.cwd(), '.tsbuildinfo');
if (fs.existsSync(tsBuildInfo)) {
  console.log('🧹 Clearing TypeScript build info...');
  fs.unlinkSync(tsBuildInfo);
  console.log('✅ TypeScript build info cleared');
}

// 3. Clear node_modules/.cache
const nodeCacheDir = path.join(process.cwd(), 'node_modules', '.cache');
if (fs.existsSync(nodeCacheDir)) {
  console.log('🧹 Clearing node_modules cache...');
  fs.rmSync(nodeCacheDir, { recursive: true, force: true });
  console.log('✅ Node modules cache cleared');
}

// 4. Create .gitignore entries for cache files
const gitignorePath = path.join(process.cwd(), '.gitignore');
const cacheEntries = [
  '',
  '# Performance optimization cache files',
  '.tsbuildinfo',
  'node_modules/.vite',
  'node_modules/.cache',
  '.vite',
];

if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const newEntries = cacheEntries.filter(entry => !gitignoreContent.includes(entry));
  
  if (newEntries.length > 0) {
    fs.appendFileSync(gitignorePath, newEntries.join('\n'));
    console.log('✅ Updated .gitignore with cache entries');
  }
} else {
  fs.writeFileSync(gitignorePath, cacheEntries.join('\n'));
  console.log('✅ Created .gitignore with cache entries');
}

console.log('\n🎉 Development environment optimized!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run dev" to start the optimized dev server');
console.log('2. First startup may still be slow (cold start)');
console.log('3. Subsequent startups should be much faster');
console.log('4. Consider using "npm run dev -- --force" if issues persist');

// 5. Performance tips
console.log('\n💡 Performance Tips:');
console.log('- Use lazy loading for heavy components');
console.log('- Keep node_modules on SSD for faster I/O');
console.log('- Close unnecessary applications to free up RAM');
console.log('- Consider using pnpm instead of npm for faster installs');
console.log('- Use --force flag if Vite cache gets corrupted');
