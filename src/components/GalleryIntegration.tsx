import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedGallery } from "./OptimizedGallery";
import { VirtualGallery } from "./VirtualGallery";
import { PerformanceMonitor } from "./PerformanceMonitor";

// Example of how to integrate the new gallery components
export const GalleryIntegration: React.FC = () => {
  const [galleryType, setGalleryType] = useState<'optimized' | 'virtual'>('optimized');
  const [showMonitor, setShowMonitor] = useState(false);

  return (
    <div className="w-full">
      {/* Gallery Type Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gallery Performance Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={galleryType === 'optimized' ? 'default' : 'outline'}
              onClick={() => setGalleryType('optimized')}
            >
              Optimized Gallery (10-50 images)
            </Button>
            <Button
              variant={galleryType === 'virtual' ? 'default' : 'outline'}
              onClick={() => setGalleryType('virtual')}
            >
              Virtual Gallery (100+ images)
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowMonitor(!showMonitor)}
            >
              {showMonitor ? 'Hide' : 'Show'} Performance Monitor
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Optimized Gallery:</strong> Best for 10-50 images with masonry layout</p>
            <p><strong>Virtual Gallery:</strong> Best for 100+ images with smooth scrolling</p>
          </div>
        </CardContent>
      </Card>

      {/* Render Selected Gallery */}
      {galleryType === 'optimized' ? (
        <OptimizedGallery />
      ) : (
        <VirtualGallery
          items={[]} // You would populate this with your image data
          itemHeight={300}
          containerHeight={600}
          overscan={5}
        />
      )}

      {/* Performance Monitor */}
      {showMonitor && <PerformanceMonitor />}
    </div>
  );
};
