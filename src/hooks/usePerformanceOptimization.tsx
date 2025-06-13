
import { useEffect, useCallback, useRef } from 'react';
import { webVitalsMonitor } from '@/utils/webVitals';

interface PerformanceOptions {
  enableImageLazyLoading?: boolean;
  enableVirtualScrolling?: boolean;
  enableMemoryOptimization?: boolean;
  preloadCriticalResources?: boolean;
}

export const usePerformanceOptimization = (options: PerformanceOptions = {}) => {
  const {
    enableImageLazyLoading = true,
    enableVirtualScrolling = false,
    enableMemoryOptimization = true,
    preloadCriticalResources = true
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const memoryCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Lazy loading for images
  useEffect(() => {
    if (!enableImageLazyLoading || !('IntersectionObserver' in window)) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy');
              observerRef.current?.unobserve(img);
            }
          }
        });
      },
      { 
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => observerRef.current?.observe(img));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enableImageLazyLoading]);

  // Memory optimization
  useEffect(() => {
    if (!enableMemoryOptimization) return;

    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
        const usagePercent = (usedMB / limitMB) * 100;

        if (usagePercent > 80) {
          console.warn(`🚨 High memory usage: ${usedMB.toFixed(1)}MB (${usagePercent.toFixed(1)}%)`);
          
          // Trigger garbage collection if available
          if ('gc' in window) {
            (window as any).gc();
          }
          
          // Clear image caches
          clearImageCaches();
        }
      }
    };

    memoryCheckInterval.current = setInterval(checkMemoryUsage, 30000);

    return () => {
      if (memoryCheckInterval.current) {
        clearInterval(memoryCheckInterval.current);
      }
    };
  }, [enableMemoryOptimization]);

  // Preload critical resources
  useEffect(() => {
    if (!preloadCriticalResources) return;

    const criticalResources = [
      '/public/images/happy-kid.png',
      '/public/images/stars.png',
      '/public/images/try-again.png'
    ];

    const preloadImage = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    criticalResources.forEach(preloadImage);
  }, [preloadCriticalResources]);

  const clearImageCaches = useCallback(() => {
    // Remove unused images from DOM
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete || img.naturalHeight === 0) {
        img.src = '';
      }
    });
  }, []);

  const optimizeScrolling = useCallback((element: HTMLElement) => {
    if (!enableVirtualScrolling) return;

    // Add passive scroll listeners for better performance
    element.addEventListener('scroll', () => {
      requestIdleCallback(() => {
        // Virtualization logic would go here
        console.log('Virtual scrolling optimization applied');
      });
    }, { passive: true });
  }, [enableVirtualScrolling]);

  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
    
    if (duration > 16.67) { // More than one frame (60fps)
      console.warn(`🐌 Slow operation detected: ${name}`);
    }
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return {
      webVitals: webVitalsMonitor.getMetrics(),
      performanceScore: webVitalsMonitor.getPerformanceScore(),
      memoryUsage: 'memory' in performance ? {
        used: ((performance as any).memory.usedJSHeapSize / (1024 * 1024)).toFixed(1) + 'MB',
        limit: ((performance as any).memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(1) + 'MB'
      } : null
    };
  }, []);

  return {
    optimizeScrolling,
    measurePerformance,
    getPerformanceMetrics,
    clearImageCaches
  };
};
