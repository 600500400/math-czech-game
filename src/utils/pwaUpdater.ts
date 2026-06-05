import { APP_VERSION } from './version';

import { logger } from "@/utils/logger";
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
  private readonly UPDATE_COOLDOWN = 10000; // 10 seconds (více agresivní)
  private sessionNotificationShown = false;
  private updateCheckInterval: number | null = null;
  private backgroundUpdateEnabled = true;

  private isPreviewOrDevContext(): boolean {
    const { hostname, search } = window.location;

    return (
      !import.meta.env.PROD ||
      window.self !== window.top ||
      search.includes("sw=off") ||
      hostname.startsWith("id-preview--") ||
      hostname.startsWith("preview--") ||
      hostname === "lovableproject.com" ||
      hostname.endsWith(".lovableproject.com") ||
      hostname === "lovableproject-dev.com" ||
      hostname.endsWith(".lovableproject-dev.com") ||
      hostname === "beta.lovable.dev" ||
      hostname.endsWith(".beta.lovable.dev")
    );
  }

  private async unregisterAppServiceWorkers() {
    if (!("serviceWorker" in navigator)) return;

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.allSettled(
      registrations
        .filter((registration) => registration.active?.scriptURL.includes("/sw.js"))
        .map((registration) => registration.unregister())
    );
  }

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

      if (this.isPreviewOrDevContext()) {
        await this.unregisterAppServiceWorkers();
        return;
      }
      
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
      
      // Spustit pravidelné kontroly aktualizací
      this.startBackgroundUpdateChecks();
      
      // Přidat listenery pro focus/visibility změny
      this.setupVisibilityListeners();
      
      logger.log('🔄 PWA Updater initialized with version:', APP_VERSION.getFullVersionWithBuild());
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
        logger.log('🆕 New version available');
        this.setState({ hasUpdate: true, isUpdating: false, error: null });
      }
    });
  };

  private handleControllerChange = () => {
    logger.log('🔄 App updated successfully');
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
      logger.log('🔄 Update check skipped - cooldown active');
      return false;
    }

    this.lastUpdateCheck = now;

    try {
      logger.log('🔄 Checking for updates...');
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
      
      logger.log('🧹 Cache cleared, reloading...');
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

  private startBackgroundUpdateChecks() {
    if (!this.backgroundUpdateEnabled) return;
    
    // Kontrola každých 5 minut
    this.updateCheckInterval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        logger.log('🔄 Background update check triggered');
        this.checkForUpdates();
      }
    }, 5 * 60 * 1000);
  }

  private setupVisibilityListeners() {
    // Kontrola při změně viditelnosti (návrat z jiné záložky)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        logger.log('🔄 Page visible - checking for updates');
        setTimeout(() => this.checkForUpdates(), 1000);
      }
    });

    // Kontrola při focus okna
    window.addEventListener('focus', () => {
      logger.log('🔄 Window focused - checking for updates');
      setTimeout(() => this.checkForUpdates(), 1000);
    });
  }

  public enableBackgroundUpdates(enabled: boolean) {
    this.backgroundUpdateEnabled = enabled;
    if (!enabled && this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    } else if (enabled && !this.updateCheckInterval) {
      this.startBackgroundUpdateChecks();
    }
  }

  public async debugInfo(): Promise<any> {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      currentVersion: this.getCurrentVersion(),
      registrationState: registration ? {
        active: registration.active?.state,
        waiting: registration.waiting?.state,
        installing: registration.installing?.state,
        scope: registration.scope
      } : null,
      cacheNames: await caches.keys(),
      state: this.state,
      lastUpdateCheck: new Date(this.lastUpdateCheck).toISOString(),
      backgroundUpdatesEnabled: this.backgroundUpdateEnabled
    };
  }
}

export const pwaUpdater = PWAUpdater.getInstance();