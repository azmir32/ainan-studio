import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, ArrowLeft, Eye, Heart, Play } from "lucide-react";

export interface VirtualGalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
}

interface VirtualGalleryProps {
  items: VirtualGalleryItem[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
}

interface VirtualItem {
  index: number;
  item: VirtualGalleryItem;
  top: number;
}

export const VirtualGallery: React.FC<VirtualGalleryProps> = ({
  items,
  itemHeight = 300,
  containerHeight = 600,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible items
  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems: VirtualItem[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        item: items[i],
        top: i * itemHeight,
      });
    }

    return virtualItems;
  }, [scrollTop, itemHeight, containerHeight, items, overscan]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Image loading handler
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  // Preload adjacent images
  useEffect(() => {
    if (currentIndex !== null) {
      const preloadIndices = [
        currentIndex - 1,
        currentIndex + 1,
        currentIndex - 2,
        currentIndex + 2,
      ].filter(i => i >= 0 && i < items.length);

      preloadIndices.forEach(index => {
        if (!loadedImages.has(index)) {
          const img = new Image();
          img.src = items[index].imageUrl;
          img.onload = () => handleImageLoad(index);
        }
      });
    }
  }, [currentIndex, items, loadedImages, handleImageLoad]);

  return (
    <div className="w-full">
      {/* Virtual container */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Total height spacer */}
        <div style={{ height: items.length * itemHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.map(({ index, item, top }) => (
            <VirtualGalleryItem
              key={item.id}
              item={item}
              index={index}
              top={top}
              height={itemHeight}
              isLoaded={loadedImages.has(index)}
              onLoad={() => handleImageLoad(index)}
              onOpen={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={currentIndex !== null} onOpenChange={(open) => setCurrentIndex(open ? (currentIndex ?? 0) : null)}>
        <DialogContent className="p-0 sm:max-w-5xl bg-black">
          {currentIndex !== null && items[currentIndex] && (
            <div className="relative">
              <img
                src={items[currentIndex].imageUrl}
                alt={items[currentIndex].title}
                className="w-full h-auto object-contain max-h-[80vh]"
                loading="eager"
              />
              {/* Navigation */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentIndex((i) => (i === null ? i : (i + items.length - 1) % items.length))}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setCurrentIndex((i) => (i === null ? i : (i + 1) % items.length))}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* Caption */}
              <div className="absolute bottom-3 left-4 right-4 text-white/90 text-sm">
                {items[currentIndex].title}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface VirtualGalleryItemProps {
  item: VirtualGalleryItem;
  index: number;
  top: number;
  height: number;
  isLoaded: boolean;
  onLoad: () => void;
  onOpen: () => void;
}

const VirtualGalleryItem: React.FC<VirtualGalleryItemProps> = ({
  item,
  index,
  top,
  height,
  isLoaded,
  onLoad,
  onOpen,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="absolute w-full px-2"
      style={{ top, height }}
    >
      <div className="group relative overflow-hidden bg-black/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ease-out transform-gpu hover:scale-[1.02] hover:z-10 h-full">
        <button
          type="button"
          className="block w-full h-full group"
          onClick={onOpen}
          aria-label={`Open ${item.title}`}
        >
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Image */}
          <img
            src={item.thumbnailUrl || item.imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 will-change-transform"
            style={{
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
            }}
            onLoad={() => {
              setImageLoaded(true);
              onLoad();
            }}
          />

          {/* Overlay */}
          {imageLoaded && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-white font-bold mb-1 drop-shadow-lg text-sm">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-2 left-2">
                <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 text-white px-2 py-1 rounded-full text-xs">
                  <Play className="w-3 h-3" />
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
