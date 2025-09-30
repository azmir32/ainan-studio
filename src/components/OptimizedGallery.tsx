import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Camera, Zap, Eye, Heart, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { ToPortfolioButton } from "@/components/ui/to-portfolio-button";
import { SkeletonGallery, LoadingStates } from "@/components/ui/skeleton-gallery";
import { useImageCache } from "@/lib/imageCache";

// Import images directly
import image1 from "@/assets/imagesCarousel/20191208-LAN_0281.webp";
import image2 from "@/assets/imagesCarousel/AIN00523.webp";
import image3 from "@/assets/imagesCarousel/AIN00718.webp";
import image4 from "@/assets/imagesCarousel/Amin-Rashidi-Studio-664.webp";
import image5 from "@/assets/imagesCarousel/DSC_3411.webp";
import image6 from "@/assets/imagesCarousel/FKP03731.webp";
import image7 from "@/assets/imagesCarousel/FKP03833.webp";
import image8 from "@/assets/imagesCarousel/FKP03935.webp";
import image9 from "@/assets/imagesCarousel/0FK_1526.webp";
import image10 from "@/assets/imagesCarousel/0FK_0696.webp";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  priority: 'high' | 'medium' | 'low';
}

interface OptimizedMasonryTileProps {
  work: GalleryItem;
  index: number;
  onOpen: () => void;
}

const OptimizedMasonryTile: React.FC<OptimizedMasonryTileProps> = ({
  work,
  index,
  onOpen,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { getImage } = useImageCache();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 50); // Reduced delay
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before visible
      }
    );
    
    if (tileRef.current) observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [index]);

  // Load image from cache
  useEffect(() => {
    if (isVisible && !cachedUrl) {
      getImage(work.imageUrl, work.priority)
        .then(url => setCachedUrl(url))
        .catch(() => setImageError(true));
    }
  }, [isVisible, cachedUrl, work.imageUrl, work.priority, getImage]);

  const handleImageLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setLoaded(true);
  }, []);

  // Calculate responsive image sizes
  const getResponsiveSrcSet = useCallback(() => {
    if (!cachedUrl) return '';
    
    const sizes = [300, 400, 500, 600, 800];
    return sizes.map(size => `${cachedUrl}?w=${size} ${size}w`).join(', ');
  }, [cachedUrl]);

  const getSizes = () => {
    return '(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 25vw, 300px';
  };

  return (
    <div
      ref={tileRef}
      className="group relative overflow-hidden bg-black/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ease-out transform-gpu hover:scale-[1.02] hover:z-10 break-inside-avoid mb-6"
      style={{
        borderRadius: index % 3 === 0 ? "2rem 0.5rem 2rem 0.5rem" : index % 2 === 0 ? "0.5rem 2rem 0.5rem 2rem" : "1rem",
        transform: isVisible ? "translateY(0)" : "translateY(2rem)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <button 
        type="button" 
        className="block w-full group" 
        onClick={onOpen} 
        aria-label={`Open ${work.title}`}
        disabled={!loaded}
      >
        {/* Loading skeleton */}
        {!loaded && !imageError && (
          <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Error state */}
        {imageError && (
          <div className="w-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
            <div className="text-center text-red-600">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}

        {/* Image */}
        {cachedUrl && !imageError && (
          <img
            ref={imgRef}
            src={cachedUrl}
            srcSet={getResponsiveSrcSet()}
            sizes={getSizes()}
            alt={work.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 will-change-transform"
            style={{ 
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
              display: loaded ? 'block' : 'none'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Overlays - only show when image is loaded */}
        {loaded && !imageError && cachedUrl && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10 mix-blend-overlay pointer-events-none" />

            {/* Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
                <Play className="w-3 h-3" />
              </div>
            </div>

            {/* Icons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Eye className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
              <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-white font-bold mb-2 drop-shadow-lg text-lg">
                  {work.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {work.description}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-white/90 text-sm font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:text-white pointer-events-auto"
                  onClick={onOpen}
                >
                  <span>View More</span>
                  <ArrowRight className="w-4 h-4 transition-transform md:group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </>
        )}
      </button>
    </div>
  );
};

export const OptimizedGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { preloadImages, getStats } = useImageCache();

  // Enhanced gallery data with priorities
  const galleryData = useMemo<GalleryItem[]>(() => [
    { 
      id: '1',
      title: "Tech Conference Live Stream", 
      description: "Multi-camera setup for 1,000+ attendees with real-time streaming", 
      imageUrl: image1,
      width: 1920,
      height: 1080,
      priority: 'high'
    },
    { 
      id: '2',
      title: "Corporate Headshot Session", 
      description: "Professional headshots for 50+ executives in a single day", 
      imageUrl: image2,
      width: 1920,
      height: 1080,
      priority: 'high'
    },
    { 
      id: '3',
      title: "Wedding Live Coverage", 
      description: "Complete ceremony and reception with cinematic highlights", 
      imageUrl: image3,
      width: 1920,
      height: 1080,
      priority: 'high'
    },
    { 
      id: '4',
      title: "Product Launch Event", 
      description: "High-end product photography and live streaming for brand launch", 
      imageUrl: image4,
      width: 1920,
      height: 1080,
      priority: 'medium'
    },
    { 
      id: '5',
      title: "Corporate Training Session", 
      description: "Multi-location training session with interactive Q&A", 
      imageUrl: image5,
      width: 1920,
      height: 1080,
      priority: 'medium'
    },
    { 
      id: '6',
      title: "Award Ceremony Coverage", 
      description: "Red carpet photography and live award ceremony streaming", 
      imageUrl: image6,
      width: 1920,
      height: 1080,
      priority: 'medium'
    },
    { 
      id: '7',
      title: "Team Building Event", 
      description: "Dynamic coverage of corporate team building activities", 
      imageUrl: image7,
      width: 1920,
      height: 1080,
      priority: 'low'
    },
    { 
      id: '8',
      title: "Intimate Wedding Ceremony", 
      description: "Breathtaking coverage of intimate wedding ceremonies", 
      imageUrl: image8,
      width: 1920,
      height: 1080,
      priority: 'low'
    },
    { 
      id: '9',
      title: "Corporate Event Photography", 
      description: "Comprehensive coverage of corporate events, conferences, and business meetings", 
      imageUrl: image9,
      width: 1920,
      height: 1080,
      priority: 'low'
    },
    { 
      id: '10',
      title: "Corporate Event Photography", 
      description: "Comprehensive coverage of corporate events, conferences, and business meetings", 
      imageUrl: image10,
      width: 1920,
      height: 1080,
      priority: 'low'
    },
  ], []);

  // Preload high priority images
  useEffect(() => {
    const highPriorityImages = galleryData
      .filter(item => item.priority === 'high')
      .map(item => item.imageUrl);
    
    preloadImages(highPriorityImages, 'high').then(() => {
      setIsLoading(false);
    });
  }, [galleryData, preloadImages]);

  // Preload medium priority images in background
  useEffect(() => {
    if (!isLoading) {
      const mediumPriorityImages = galleryData
        .filter(item => item.priority === 'medium')
        .map(item => item.imageUrl);
      
      preloadImages(mediumPriorityImages, 'medium');
    }
  }, [isLoading, galleryData, preloadImages]);

  if (isLoading) {
    return <LoadingStates.Initial />;
  }

  return (
    <section className="py-20 px-6 bg-[radial-gradient(1200px_800px_at_50%_-10%,hsl(var(--accent)/0.12),transparent_60%)]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our expertise in delivering exceptional photography services across Malaysia
          </p>
        </div>

        {/* Optimized masonry layout */}
        <div 
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 mb-16"
          style={{
            columnFill: 'balance',
            columnGap: '1.5rem'
          }}
        >
          {galleryData.map((work, index) => (
            <OptimizedMasonryTile
              key={work.id}
              work={work}
              index={index}
              onOpen={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Call-to-action */}
        <div className="text-center">
          <ToPortfolioButton />
        </div>

        {/* Cache stats (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
            <h3 className="font-bold mb-2">Cache Stats:</h3>
            <pre>{JSON.stringify(getStats(), null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={currentIndex !== null} onOpenChange={(open) => setCurrentIndex(open ? (currentIndex ?? 0) : null)}>
        <DialogContent className="p-0 sm:max-w-5xl bg-black">
          {currentIndex !== null && galleryData[currentIndex] && (
            <div className="relative">
              <img
                src={galleryData[currentIndex].imageUrl}
                srcSet={`${galleryData[currentIndex].imageUrl}?w=1280 1280w, ${galleryData[currentIndex].imageUrl}?w=1920 1920w`}
                sizes="(max-width: 1280px) 100vw, 1920px"
                alt={galleryData[currentIndex].title}
                className="w-full h-auto object-contain max-h-[80vh]"
                loading="eager"
              />
              {/* Navigation */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentIndex((i) => (i === null ? i : (i + galleryData.length - 1) % galleryData.length))}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentIndex((i) => (i === null ? i : (i + 1) % galleryData.length))}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* Caption */}
              <div className="absolute bottom-3 left-4 right-4 text-white/90 text-sm">
                {galleryData[currentIndex].title}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
