import React, { useState, useRef, useEffect } from 'react';
import { generateImageSchema } from '@/lib/seo';

interface OptimizedImageProps {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  title,
  caption,
  description,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  srcSet,
  onLoad,
  onError
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate structured data for image
  useEffect(() => {
    if (loaded && (caption || description)) {
      const structuredData = generateImageSchema(
        src,
        caption || alt,
        description || caption
      );
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData, null, 2);
      script.id = `image-schema-${src.replace(/[^a-zA-Z0-9]/g, '')}`;
      
      // Remove existing script if it exists
      const existingScript = document.getElementById(script.id);
      if (existingScript) {
        existingScript.remove();
      }
      
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById(script.id);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [loaded, src, caption, description, alt]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  // Generate responsive srcSet if not provided
  const generateSrcSet = () => {
    if (srcSet) return srcSet;
    
    const baseUrl = src.split('?')[0];
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ');
  };

  // Generate sizes attribute if not provided
  const generateSizes = () => {
    if (sizes) return sizes;
    
    return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {!loaded && !error && (
        <div 
          className="w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center"
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : '16/9',
            minHeight: '200px'
          }}
        >
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div 
          className="w-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center"
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : '16/9',
            minHeight: '200px'
          }}
        >
          <div className="text-center text-red-600">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Optimized image */}
      {!error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          title={title || alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          srcSet={generateSrcSet()}
          sizes={generateSizes()}
          className={`w-full h-auto transition-all duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            display: loaded ? 'block' : 'none'
          }}
          onLoad={handleLoad}
          onError={handleError}
          // Additional SEO attributes
          itemProp="image"
          role="img"
          aria-label={alt}
        />
      )}

      {/* Caption */}
      {caption && loaded && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </div>
  );
};

// Gallery-specific optimized image component
interface GalleryImageProps extends OptimizedImageProps {
  index: number;
  totalImages: number;
  category?: string;
}

export const GalleryImage: React.FC<GalleryImageProps> = ({
  index,
  totalImages,
  category,
  ...props
}) => {
  // Enhanced alt text for gallery images
  const enhancedAlt = category 
    ? `${props.alt} - ${category} Photography by Ainan Studio`
    : `${props.alt} - Professional Photography by Ainan Studio`;

  // Enhanced caption for gallery images
  const enhancedCaption = props.caption 
    ? `${props.caption} | Ainan Studio Photography Services`
    : `${props.alt} | Professional Photography Services in Kuala Lumpur`;

  return (
    <OptimizedImage
      {...props}
      alt={enhancedAlt}
      caption={enhancedCaption}
      priority={index < 3} // First 3 images load with priority
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
};
