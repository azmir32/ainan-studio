import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImageCache } from "@/lib/imageCache";

interface PerformanceMetrics {
  loadTime: number;
  imageCount: number;
  loadedImages: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkSpeed: string;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    imageCount: 0,
    loadedImages: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkSpeed: 'Unknown',
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const { getStats } = useImageCache();

  // Update metrics
  const updateMetrics = useCallback(() => {
    const cacheStats = getStats();
    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const loadTime = performanceEntries[0]?.loadEventEnd - performanceEntries[0]?.loadEventStart || 0;
    
    // Get memory usage (if available)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0;

    // Calculate network speed
    const connection = (navigator as any).connection;
    const networkSpeed = connection ? 
      `${connection.effectiveType || 'Unknown'} (${Math.round(connection.downlink || 0)} Mbps)` : 
      'Unknown';

    setMetrics(prev => ({
      ...prev,
      loadTime,
      cacheHitRate: cacheStats.items > 0 ? Math.round((cacheStats.items / (cacheStats.items + 10)) * 100) : 0,
      memoryUsage,
      networkSpeed,
    }));
  }, [getStats]);

  // Monitor performance
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [isVisible, updateMetrics]);

  // Monitor image loading
  useEffect(() => {
    if (!isVisible) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const imageEntries = entries.filter(entry => entry.name.includes('.webp') || entry.name.includes('.jpg'));
      
      setMetrics(prev => ({
        ...prev,
        imageCount: imageEntries.length,
        loadedImages: imageEntries.filter(entry => entry.duration > 0).length,
      }));
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm"
        >
          📊 Performance
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Load Time */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Load Time</span>
              <Badge variant={metrics.loadTime < 1000 ? "default" : metrics.loadTime < 3000 ? "secondary" : "destructive"}>
                {metrics.loadTime.toFixed(0)}ms
              </Badge>
            </div>
            <Progress 
              value={Math.min((metrics.loadTime / 5000) * 100, 100)} 
              className="h-1"
            />
          </div>

          {/* Images */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Images</span>
              <Badge variant="outline">
                {metrics.loadedImages}/{metrics.imageCount}
              </Badge>
            </div>
            <Progress 
              value={metrics.imageCount > 0 ? (metrics.loadedImages / metrics.imageCount) * 100 : 0} 
              className="h-1"
            />
          </div>

          {/* Cache Hit Rate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Cache Hit Rate</span>
              <Badge variant={metrics.cacheHitRate > 80 ? "default" : metrics.cacheHitRate > 50 ? "secondary" : "destructive"}>
                {metrics.cacheHitRate}%
              </Badge>
            </div>
            <Progress value={metrics.cacheHitRate} className="h-1" />
          </div>

          {/* Memory Usage */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Memory</span>
              <Badge variant={metrics.memoryUsage < 100 ? "default" : metrics.memoryUsage < 200 ? "secondary" : "destructive"}>
                {metrics.memoryUsage}MB
              </Badge>
            </div>
            <Progress 
              value={Math.min((metrics.memoryUsage / 500) * 100, 100)} 
              className="h-1"
            />
          </div>

          {/* Network Speed */}
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Network:</span>
              <span>{metrics.networkSpeed}</span>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              {metrics.loadTime > 3000 && (
                <p className="text-red-600">⚠️ Slow loading detected</p>
              )}
              {metrics.memoryUsage > 200 && (
                <p className="text-yellow-600">⚠️ High memory usage</p>
              )}
              {metrics.cacheHitRate < 50 && (
                <p className="text-blue-600">💡 Consider preloading images</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
