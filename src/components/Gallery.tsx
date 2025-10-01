import React, { useMemo, useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Play, Camera, Zap, Eye, Heart, ArrowRight, ArrowLeft, Folder, Images } from "lucide-react";
import { ToPortfolioButton } from "@/components/ui/to-portfolio-button";

// Import corporate image albums
import CyncoImages from "@/assets/coporate-image/Cynco.io";
import AmranImages from "@/assets/coporate-image/Amran";
import BNIKarismaImages from "@/assets/coporate-image/BNI Karisma";
import DrAdamImages from "@/assets/coporate-image/Dr Adam Zubir Photoshoot";
import HazliImages from "@/assets/coporate-image/Hazli Johar Office Photoshoot";
import FarhanaImages from "@/assets/coporate-image/Jul -24 FREE Farhana Headshot";
import NabilahImages from "@/assets/coporate-image/Nabilah Photoshoot";

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  imageCount: number;
}

export interface GalleryItem {
  title: string;
  description: string;
  imageUrl?: string;
}

const AlbumTile = ({
  album,
  index,
  onOpen,
  onImageLoad,
}: {
  album: Album;
  index: number;
  onOpen: () => void;
  onImageLoad?: (imageUrl: string) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const tileRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );
    if (tileRef.current) observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [index]);

  // Set loading timeout to prevent infinite loading
  useEffect(() => {
    if (album.coverImage && !loaded && !imageError) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn(`Image loading timeout: ${album.coverImage}`);
        setImageError(true);
        setLoaded(true);
      }, 10000); // 10 second timeout
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [album.coverImage, loaded, imageError]);

  const handleImageLoad = () => {
    // Clear loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
    setLoaded(true);
    setImageError(false);
    setRetryCount(0);
    
    // Track loaded image
    if (onImageLoad && album.coverImage) {
      onImageLoad(album.coverImage);
    }
    
    // Hide skeleton after a short delay for smooth transition
    setTimeout(() => setShowSkeleton(false), 300);
    
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setImageDimensions({ width: naturalWidth, height: naturalHeight });
    }
  };

  const handleImageError = () => {
    // Clear loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    console.warn(`Failed to load image: ${album.coverImage} (attempt ${retryCount + 1})`);
    
    if (retryCount < 2) { // Reduced from 3 to 2 retries for faster failure
      // Auto-retry with shorter delays: 500ms, 1s
      const delay = retryCount === 0 ? 500 : 1000;
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
        setLoaded(false);
        setIsLoading(true);
        // Force image reload by updating src
        if (imgRef.current) {
          const currentSrc = imgRef.current.src;
          imgRef.current.src = '';
          imgRef.current.src = currentSrc;
        }
      }, delay);
    } else {
      // Max retries reached, show error state
      setImageError(true);
      setLoaded(true);
      setIsLoading(false);
      setShowSkeleton(false);
    }
  };

  const handleManualRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setRetryCount(0);
    setImageError(false);
    setLoaded(false);
    setIsLoading(true);
    setShowSkeleton(true);
    // Force image reload
    if (imgRef.current) {
      const currentSrc = imgRef.current.src;
      imgRef.current.src = '';
      imgRef.current.src = currentSrc;
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Simplified image loading without srcset for now
  // TODO: Implement proper image optimization later

  return (
    <div
      ref={tileRef}
      className="group relative overflow-hidden bg-black/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ease-out transform-gpu hover:scale-[1.02] hover:z-10 break-inside-avoid mb-6"
      style={{
        borderRadius: index % 3 === 0 ? "2rem 0.5rem 2rem 0.5rem" : index % 2 === 0 ? "0.5rem 2rem 0.5rem 2rem" : "1rem",
        transform: isVisible ? "translateY(0)" : "translateY(2rem)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {album.coverImage ? (
        <>
          {/* Enhanced Loading Skeleton */}
          {showSkeleton && (
            <div className="w-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse flex flex-col items-center justify-center relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              
              {/* Loading spinner */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-gray-500 font-medium">Loading...</div>
              </div>
              
              {/* Skeleton content */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Main Image */}
          <img
            ref={imgRef}
            src={album.coverImage}
            alt={album.title}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 will-change-transform"
            style={{ 
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.5s ease-in-out',
              display: loaded ? 'block' : 'none'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Loading indicator overlay */}
          {isLoading && !showSkeleton && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Clickable overlay - only when image is loaded */}
          {loaded && !imageError && (
            <button 
              type="button" 
              className="absolute inset-0 w-full h-full group" 
              onClick={onOpen} 
              aria-label={`Open ${album.title} album`}
            />
          )}
        </>
      ) : imageError ? (
        <div className="w-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
          <div className="text-center text-red-600 p-4">
            <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium mb-2">Failed to load image</p>
            <button
              onClick={handleManualRetry}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white/20">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      )}

      {/* Overlays - only show when image is loaded and not in error state */}
      {loaded && album.coverImage && !imageError && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10 mix-blend-overlay pointer-events-none" />

          {/* Album Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
              <Folder className="w-3 h-3" />
              <span>{album.imageCount} photos</span>
            </div>
          </div>

          {/* Icons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Images className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
            <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <h3 className="text-white font-bold mb-2 drop-shadow-lg text-lg">
                {album.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {album.description}
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-white/90 text-sm font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:text-white pointer-events-auto"
                onClick={onOpen}
              >
                <span>View Album</span>
                <ArrowRight className="w-4 h-4 transition-transform md:group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </>
      )}
    </div>
  );
};

export const Gallery = () => {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [totalImages, setTotalImages] = useState<number>(0);
  
  // Create albums from corporate image folders
  const albums = useMemo<Album[]>(() => {
    // Helper function to create image URLs with optimization
    const createImageUrl = (folder: string, filename: string) => {
      try {
        return new URL(`../assets/coporate-image/${folder}/${filename}`, import.meta.url).href;
      } catch (error) {
        console.warn(`Failed to create URL for ${folder}/${filename}:`, error);
        // Fallback to a relative path
        return `/src/assets/coporate-image/${folder}/${filename}`;
      }
    };

    const albumsData = [
      {
        id: "cynco",
        title: "Cynco.io Corporate Photography",
        description: "Comprehensive corporate photography session for Cynco.io, showcasing professional headshots and office environment",
        coverImage: createImageUrl("Cynco.io", CyncoImages[0]),
        images: CyncoImages.map(img => createImageUrl("Cynco.io", img)),
        imageCount: CyncoImages.length
      },
      {
        id: "amran",
        title: "Amran Professional Headshots",
        description: "Professional headshot session featuring high-quality corporate portraits",
        coverImage: createImageUrl("Amran", AmranImages[0]),
        images: AmranImages.map(img => createImageUrl("Amran", img)),
        imageCount: AmranImages.length
      },
      {
        id: "bni-karisma",
        title: "BNI Karisma Event Photography",
        description: "Complete coverage of BNI Karisma corporate event with professional photography",
        coverImage: createImageUrl("BNI Karisma", BNIKarismaImages[0]),
        images: BNIKarismaImages.map(img => createImageUrl("BNI Karisma", img)),
        imageCount: BNIKarismaImages.length
      },
      {
        id: "dr-adam",
        title: "Dr Adam Zubir Photoshoot",
        description: "Professional photography session for Dr Adam Zubir with corporate and portrait shots",
        coverImage: createImageUrl("Dr Adam Zubir Photoshoot", DrAdamImages[0]),
        images: DrAdamImages.map(img => createImageUrl("Dr Adam Zubir Photoshoot", img)),
        imageCount: DrAdamImages.length
      },
      {
        id: "hazli",
        title: "Hazli Johar Office Photoshoot",
        description: "Corporate office photography session for Hazli Johar with professional headshots",
        coverImage: createImageUrl("Hazli Johar Office Photoshoot", HazliImages[0]),
        images: HazliImages.map(img => createImageUrl("Hazli Johar Office Photoshoot", img)),
        imageCount: HazliImages.length
      },
      {
        id: "farhana",
        title: "Farhana Headshot Session",
        description: "Professional headshot photography session for Farhana",
        coverImage: createImageUrl("Jul -24 FREE Farhana Headshot", FarhanaImages[0]),
        images: FarhanaImages.map(img => createImageUrl("Jul -24 FREE Farhana Headshot", img)),
        imageCount: FarhanaImages.length
      },
      {
        id: "nabilah",
        title: "Nabilah Photoshoot",
        description: "Professional photography session for Nabilah with creative and corporate shots",
        coverImage: createImageUrl("Nabilah Photoshoot", NabilahImages[0]),
        images: NabilahImages.map(img => createImageUrl("Nabilah Photoshoot", img)),
        imageCount: NabilahImages.length
      }
    ];

    // Calculate total images for progress tracking
    const total = albumsData.reduce((sum, album) => sum + album.imageCount, 0);
    setTotalImages(total);

    return albumsData;
  }, []);

  // Calculate loading progress
  const loadingProgress = totalImages > 0 ? (loadedImages.size / totalImages) * 100 : 0;

  return (
    // Main section container with padding and background styling
    <section className="py-20 px-6 bg-[radial-gradient(1200px_800px_at_50%_-10%,hsl(var(--accent)/0.12),transparent_60%)]">
      {/* Centered container with max width for better readability */}
      <div className="max-w-7xl mx-auto">
        
        {/* Section header with title and description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Showcasing our expertise in delivering exceptional photography services across Malaysia
          </p>
          
          {/* Loading Progress Indicator */}
          {loadingProgress < 100 && totalImages > 0 && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Loading gallery...</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Masonry layout using CSS columns */}
        <div 
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 mb-16"
          style={{
            columnFill: 'balance',
            columnGap: '1.5rem'
          }}
        >
          {albums.map((album, index) => (
            <AlbumTile
              key={album.id}
              album={album}
              index={index}
              onOpen={() => {
                setCurrentAlbum(album);
                setCurrentImageIndex(0);
              }}
              onImageLoad={(imageUrl) => {
                setLoadedImages(prev => new Set([...prev, imageUrl]));
              }}
            />
          ))}
        </div>

        {/* Call-to-action button */}
        <div className="text-center">
          <ToPortfolioButton />
        </div>
      </div>

      {/* Album Lightbox dialog with navigation */}
      <Dialog open={currentAlbum !== null} onOpenChange={(open) => {
        if (!open) {
          setCurrentAlbum(null);
          setCurrentImageIndex(0);
        }
      }}>
        <DialogContent
          className="p-0 sm:max-w-5xl bg-black"
          onKeyDown={(e) => {
            if (currentAlbum === null) return;
            if (e.key === 'ArrowLeft') {
              setCurrentImageIndex((i) => (i + currentAlbum.images.length - 1) % currentAlbum.images.length);
            }
            if (e.key === 'ArrowRight') {
              setCurrentImageIndex((i) => (i + 1) % currentAlbum.images.length);
            }
          }}
          tabIndex={0}
        >
          <DialogTitle className="sr-only">
            {currentAlbum ? `${currentAlbum.title} - Image ${currentImageIndex + 1} of ${currentAlbum.images.length}` : 'Album Viewer'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {currentAlbum ? currentAlbum.description : 'Album image viewer'}
          </DialogDescription>
          {currentAlbum && (
            <div className="relative">
              {/* Lightbox Loading Indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-white text-sm">Loading image...</div>
                </div>
              </div>
              
              <img
                src={currentAlbum.images[currentImageIndex]}
                alt={`${currentAlbum.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-auto object-contain max-h-[80vh] transition-opacity duration-300"
                loading="eager"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto'
                }}
                onLoad={(e) => {
                  // Hide loading indicator when image loads
                  const loadingIndicator = e.currentTarget.parentElement?.querySelector('.absolute.inset-0.flex.items-center.justify-center') as HTMLElement;
                  if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                  }
                }}
              />
              {/* Prev/Next controls */}
              <button
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentImageIndex((i) => (i + currentAlbum.images.length - 1) % currentAlbum.images.length)}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentImageIndex((i) => (i + 1) % currentAlbum.images.length)}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* Album info and image counter */}
              <div className="absolute bottom-3 left-4 right-4 text-white/90 text-sm">
                <div className="flex justify-between items-center">
                  <span>{currentAlbum.title}</span>
                  <span>{currentImageIndex + 1} / {currentAlbum.images.length}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};