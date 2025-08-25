import { APP_VERSION } from './version';

interface UpdateState {
  hasUpdate: boolean;
  isUpdating: boolean;
  error: string | null;
}

class PWAUpdater {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: Array<(state: UpdateState) => void> = [];
  private state: UpdateState = {
    hasUpdate: false,
    isUpdating: false,
    error: null
  };

  constructor() {
    this.initializeUpdater();
  }

  private async initializeUpdater() {
    if ('serviceWorker' in navigator) {
      try {
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
    this.state = { ...this.state, ...newState };
    this.updateCallbacks.forEach(callback => callback(this.state));
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

    try {
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
    } catch (error) {
      console.error('Failed to apply update:', error);
      this.setState({ hasUpdate: true, isUpdating: false, error: 'Failed to apply update' });
    }
  }

  public getState(): UpdateState {
    return this.state;
  }

  public getCurrentVersion(): string {
    return APP_VERSION.getFullVersionWithBuild();
  }
}

export const pwaUpdater = new PWAUpdater();