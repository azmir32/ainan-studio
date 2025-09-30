import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonGalleryProps {
  count?: number;
  columns?: number;
  className?: string;
}

export const SkeletonGallery: React.FC<SkeletonGalleryProps> = ({
  count = 12,
  columns = 4,
  className,
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
        style={{
          columnFill: 'balance',
          columnGap: '1.5rem'
        }}
      >
        {skeletons.map((index) => (
          <SkeletonItem key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

const SkeletonItem: React.FC<{ index: number }> = ({ index }) => {
  // Vary heights for more realistic masonry effect
  const heights = [200, 250, 300, 350, 400];
  const height = heights[index % heights.length];
  
  // Vary border radius
  const borderRadius = index % 3 === 0 ? "2rem 0.5rem 2rem 0.5rem" : 
                      index % 2 === 0 ? "0.5rem 2rem 0.5rem 2rem" : "1rem";

  return (
    <div
      className="group relative overflow-hidden bg-black/5 backdrop-blur-sm border border-white/10 break-inside-avoid mb-6 animate-pulse"
      style={{
        height: `${height}px`,
        borderRadius,
      }}
    >
      {/* Main skeleton */}
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 relative">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        
        {/* Content skeleton */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-300 rounded mb-2 w-3/4" />
          
          {/* Description skeleton */}
          <div className="space-y-1 mb-4">
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-2/3" />
          </div>
          
          {/* Button skeleton */}
          <div className="h-6 bg-gray-300 rounded w-20" />
        </div>

        {/* Badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded-full" />
        </div>

        {/* Icons skeleton */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-gray-300 opacity-30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-gray-300 opacity-30" />
      </div>
    </div>
  );
};

// Shimmer animation CSS (add to your global CSS)
export const shimmerCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

// Loading states for different scenarios
export const LoadingStates = {
  // Initial page load
  Initial: () => (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-300 rounded w-64 mx-auto mb-6 animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse" />
        </div>
        <SkeletonGallery count={12} />
      </div>
    </div>
  ),

  // Loading more items
  More: () => (
    <div className="py-8">
      <SkeletonGallery count={6} />
    </div>
  ),

  // Single item loading
  Single: () => (
    <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  ),

  // Grid loading
  Grid: ({ count = 8 }: { count?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  ),
};
