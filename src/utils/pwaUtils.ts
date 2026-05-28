import { logger } from "@/utils/logger";

// Register service worker
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.log('SW registered: ', registration);
      
      // Update service worker when new version is available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              if (confirm('Nová verze aplikace je k dispozici. Obnovit stránku?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      logger.log('SW registration failed: ', error);
    }
  }
};

// Unregister service worker
export const unregisterServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      logger.log('All service workers unregistered');
    } catch (error) {
      logger.log('Failed to unregister service workers:', error);
    }
  }
};

// Check if app is running in standalone mode
export const isStandaloneMode = (): boolean => {
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  const standaloneWebkit = (window.navigator as any).standalone;
  return standalone || standaloneWebkit;
};

// Get installation prompt
export const getInstallPrompt = (): Promise<Event | null> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 5000);
    
    const handler = (e: Event) => {
      clearTimeout(timeout);
      window.removeEventListener('beforeinstallprompt', handler);
      resolve(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
  });
};
