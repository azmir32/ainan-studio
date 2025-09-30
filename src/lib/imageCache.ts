/**
 * Intelligent Image Caching System
 * Handles image preloading, caching, and memory management
 */

export interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  size: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CacheConfig {
  maxSize: number; // Max cache size in bytes
  maxAge: number; // Max age in milliseconds
  maxItems: number; // Max number of cached items
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 100 * 1024 * 1024, // 100MB
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxItems: 200,
};

class ImageCache {
  private cache = new Map<string, CachedImage>();
  private config: CacheConfig;
  private currentSize = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanupInterval();
  }

  /**
   * Get cached image or load it
   */
  async getImage(url: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<string> {
    // Check if already cached
    const cached = this.cache.get(url);
    if (cached && this.isValid(cached)) {
      return URL.createObjectURL(cached.blob);
    }

    // Load and cache the image
    return this.loadAndCache(url, priority);
  }

  /**
   * Preload images in background
   */
  async preloadImages(urls: string[], priority: 'high' | 'medium' | 'low' = 'low'): Promise<void> {
    const promises = urls.map(url => this.loadAndCache(url, priority));
    await Promise.allSettled(promises);
  }

  /**
   * Load and cache an image
   */
  private async loadAndCache(url: string, priority: 'high' | 'medium' | 'low'): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load image: ${response.statusText}`);
      
      const blob = await response.blob();
      const size = blob.size;

      // Check if we need to make space
      this.makeSpace(size);

      // Cache the image
      const cachedImage: CachedImage = {
        url,
        blob,
        timestamp: Date.now(),
        size,
        priority,
      };

      this.cache.set(url, cachedImage);
      this.currentSize += size;

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Failed to cache image:', url, error);
      return url; // Fallback to original URL
    }
  }

  /**
   * Check if cached image is still valid
   */
  private isValid(cached: CachedImage): boolean {
    const age = Date.now() - cached.timestamp;
    return age < this.config.maxAge;
  }

  /**
   * Make space in cache if needed
   */
  private makeSpace(requiredSize: number): void {
    // Remove expired items first
    this.removeExpired();

    // Check if we need more space
    if (this.currentSize + requiredSize <= this.config.maxSize && 
        this.cache.size < this.config.maxItems) {
      return;
    }

    // Remove low priority items first
    const sortedItems = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => {
        // Sort by priority (high first) then by timestamp (oldest first)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.timestamp - b.timestamp;
      });

    // Remove items until we have enough space
    for (const [url, cached] of sortedItems) {
      if (cached.priority === 'low' || 
          this.currentSize + requiredSize > this.config.maxSize ||
          this.cache.size >= this.config.maxItems) {
        this.removeFromCache(url);
        if (this.currentSize + requiredSize <= this.config.maxSize && 
            this.cache.size < this.config.maxItems) {
          break;
        }
      }
    }
  }

  /**
   * Remove expired items from cache
   */
  private removeExpired(): void {
    const now = Date.now();
    for (const [url, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.config.maxAge) {
        this.removeFromCache(url);
      }
    }
  }

  /**
   * Remove item from cache
   */
  private removeFromCache(url: string): void {
    const cached = this.cache.get(url);
    if (cached) {
      URL.revokeObjectURL(URL.createObjectURL(cached.blob));
      this.currentSize -= cached.size;
      this.cache.delete(url);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.removeExpired();
    }, 5 * 60 * 1000); // Clean up every 5 minutes
  }

  /**
   * Clear all cache
   */
  clear(): void {
    for (const [url] of this.cache) {
      this.removeFromCache(url);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.currentSize,
      items: this.cache.size,
      maxSize: this.config.maxSize,
      maxItems: this.config.maxItems,
    };
  }
}

// Global cache instance
export const imageCache = new ImageCache();

/**
 * Hook for using image cache
 */
export function useImageCache() {
  const getImage = useCallback(async (url: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    return imageCache.getImage(url, priority);
  }, []);

  const preloadImages = useCallback(async (urls: string[], priority: 'high' | 'medium' | 'low' = 'low') => {
    return imageCache.preloadImages(urls, priority);
  }, []);

  const clearCache = useCallback(() => {
    imageCache.clear();
  }, []);

  const getStats = useCallback(() => {
    return imageCache.getStats();
  }, []);

  return {
    getImage,
    preloadImages,
    clearCache,
    getStats,
  };
}

/**
 * Progressive image loading with blur placeholder
 */
export function createProgressiveImage(
  lowQualityUrl: string,
  highQualityUrl: string,
  onLoad?: () => void
): { src: string; srcSet: string; onLoad: () => void } {
  return {
    src: lowQualityUrl,
    srcSet: `${lowQualityUrl} 1x, ${highQualityUrl} 2x`,
    onLoad: () => {
      // Load high quality image in background
      const img = new Image();
      img.src = highQualityUrl;
      img.onload = () => {
        onLoad?.();
      };
    },
  };
}

/**
 * Generate low-quality placeholder
 */
export function generatePlaceholder(width: number, height: number, color: string = '#f3f4f6'): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
}
