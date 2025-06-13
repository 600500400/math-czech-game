
// Progressive Enhancement Utilities for Advanced PWA Features

interface CacheStrategy {
  name: string;
  version: string;
  resources: string[];
}

class ProgressiveEnhancementManager {
  private cacheStrategy: CacheStrategy;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.cacheStrategy = {
      name: 'math-czech-practice',
      version: '1.0.0',
      resources: [
        '/',
        '/index.html',
        '/src/main.tsx',
        // Add other critical resources
      ]
    };

    this.initializeEnhancedFeatures();
  }

  // Initialize progressive enhancement features
  private async initializeEnhancedFeatures() {
    await this.setupAdvancedCaching();
    this.setupNetworkStatusTracking();
    this.setupPerformanceOptimizations();
  }

  // Enhanced caching strategy
  private async setupAdvancedCaching() {
    if ('caches' in window) {
      try {
        const cache = await caches.open(`${this.cacheStrategy.name}-v${this.cacheStrategy.version}`);
        
        // Preload critical resources
        await cache.addAll(this.cacheStrategy.resources);
        
        // Setup dynamic caching for API responses
        self.addEventListener('fetch', (event: any) => {
          if (event.request.url.includes('/api/')) {
            event.respondWith(
              this.handleApiRequest(event.request)
            );
          }
        });
        
        console.log('✅ Advanced caching initialized');
      } catch (error) {
        console.warn('⚠️ Advanced caching failed:', error);
      }
    }
  }

  // Smart API request handling with fallback
  private async handleApiRequest(request: Request): Promise<Response> {
    try {
      // Try network first
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses
        const cache = await caches.open(`${this.cacheStrategy.name}-v${this.cacheStrategy.version}`);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      
      throw new Error('Network response not ok');
    } catch (error) {
      // Fallback to cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline fallback
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'Tato funkce není dostupná offline' 
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Network status tracking
  private setupNetworkStatusTracking() {
    const updateOnlineStatus = () => {
      this.isOnline = navigator.onLine;
      this.notifyNetworkChange();
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  // Notify app about network changes
  private notifyNetworkChange() {
    const event = new CustomEvent('networkStatusChange', {
      detail: { isOnline: this.isOnline }
    });
    window.dispatchEvent(event);
  }

  // Performance optimizations
  private setupPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    }

    // Preload critical resources
    this.preloadCriticalResources();

    // Resource hints
    this.addResourceHints();
  }

  // Setup lazy loading for images
  private setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  private preloadCriticalResources() {
    const criticalResources = [
      '/public/images/happy-kid.png',
      '/public/images/stars.png',
      '/public/images/try-again.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }

  // Add resource hints for performance
  private addResourceHints() {
    // DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // Public methods
  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public async clearOldCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.startsWith(this.cacheStrategy.name) && 
        !name.includes(this.cacheStrategy.version)
      );

      await Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  public async getCacheInfo(): Promise<any> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async name => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, resourceCount: keys.length };
        })
      );
      return cacheInfo;
    }
    return [];
  }
}

// Initialize progressive enhancement
export const progressiveEnhancementManager = new ProgressiveEnhancementManager();

// Export utilities
export const getNetworkStatus = () => progressiveEnhancementManager.getNetworkStatus();
export const clearOldCaches = () => progressiveEnhancementManager.clearOldCaches();
export const getCacheInfo = () => progressiveEnhancementManager.getCacheInfo();
