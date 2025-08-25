import { APP_VERSION } from './version';

interface UpdateState {
  hasUpdate: boolean;
  isUpdating: boolean;
  error: string | null;
}

class PWAUpdater {
  private static instance: PWAUpdater | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: Array<(state: UpdateState) => void> = [];
  private state: UpdateState = {
    hasUpdate: false,
    isUpdating: false,
    error: null
  };
  private initialized = false;
  private lastUpdateCheck = 0;
  private readonly UPDATE_COOLDOWN = 30000; // 30 seconds
  private sessionNotificationShown = false;

  constructor() {
    if (PWAUpdater.instance) {
      return PWAUpdater.instance;
    }
    PWAUpdater.instance = this;
    this.initializeUpdater();
  }

  static getInstance(): PWAUpdater {
    if (!PWAUpdater.instance) {
      PWAUpdater.instance = new PWAUpdater();
    }
    return PWAUpdater.instance;
  }

  private async initializeUpdater() {
    if (this.initialized || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      this.initialized = true;
      
      // Register service worker with version query parameter
      const swUrl = `/sw.js?v=${APP_VERSION.build}`;
      this.registration = await navigator.serviceWorker.register(swUrl);
      
      // Listen for updates
      this.registration.addEventListener('updatefound', this.handleUpdateFound);
      
      // Check for existing waiting service worker
      if (this.registration.waiting) {
        this.setState({ hasUpdate: true, isUpdating: false, error: null });
      }

      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', this.handleControllerChange);
      
      console.log('🔄 PWA Updater initialized');
    } catch (error) {
      console.error('Failed to register service worker:', error);
      this.setState({ hasUpdate: false, isUpdating: false, error: 'Failed to initialize updater' });
    }
  }

  private handleUpdateFound = () => {
    if (!this.registration?.installing) return;

    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version is available
        console.log('🆕 New version available');
        this.setState({ hasUpdate: true, isUpdating: false, error: null });
      }
    });
  };

  private handleControllerChange = () => {
    console.log('🔄 App updated successfully');
    this.setState({ hasUpdate: false, isUpdating: false, error: null });
    window.location.reload();
  };

  private setState(newState: Partial<UpdateState>) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    // Only notify if there's a meaningful change and we haven't shown notification this session
    if (newState.hasUpdate && !this.sessionNotificationShown && prevState.hasUpdate !== newState.hasUpdate) {
      this.sessionNotificationShown = true;
      this.updateCallbacks.forEach(callback => callback(this.state));
    } else if (!newState.hasUpdate || newState.error || newState.isUpdating !== prevState.isUpdating) {
      this.updateCallbacks.forEach(callback => callback(this.state));
    }
  }

  public subscribe(callback: (state: UpdateState) => void) {
    this.updateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  public async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    // Implement cooldown to prevent excessive checks
    const now = Date.now();
    if (now - this.lastUpdateCheck < this.UPDATE_COOLDOWN) {
      console.log('🔄 Update check skipped - cooldown active');
      return false;
    }

    this.lastUpdateCheck = now;

    try {
      console.log('🔄 Checking for updates...');
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      this.setState({ hasUpdate: false, isUpdating: false, error: 'Failed to check for updates' });
      return false;
    }
  }

  public async applyUpdate(): Promise<void> {
    if (!this.registration?.waiting) return;

    this.setState({ hasUpdate: true, isUpdating: true, error: null });

    try {
      // Tell the waiting service worker to become active
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Force reload after a short delay to ensure SW activates
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to apply update:', error);
      this.setState({ hasUpdate: true, isUpdating: false, error: 'Failed to apply update' });
    }
  }

  public async forceUpdate(): Promise<void> {
    try {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      
      // Unregister service worker
      if (this.registration) {
        await this.registration.unregister();
      }
      
      // Clear localStorage version info
      localStorage.removeItem('app_version');
      localStorage.removeItem('app_last_update');
      
      console.log('🧹 Cache cleared, reloading...');
      window.location.reload();
    } catch (error) {
      console.error('Failed to force update:', error);
      this.setState({ hasUpdate: false, isUpdating: false, error: 'Failed to force update' });
    }
  }

  public getState(): UpdateState {
    return this.state;
  }

  public getCurrentVersion(): string {
    return APP_VERSION.getFullVersionWithBuild();
  }
}

export const pwaUpdater = PWAUpdater.getInstance();