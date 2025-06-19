
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './utils/pwaUtils'
import { APP_VERSION } from './utils/version'

// Import and initialize new PWA features
import './utils/webVitals' // Initialize Web Vitals monitoring
import './utils/offlineManager' // Initialize offline manager

// Register service worker for PWA functionality
registerServiceWorker();

// Initialize versioning after DOM is ready
requestIdleCallback(() => {
  APP_VERSION.initializeVersioning();
});

// Initialize performance optimizations
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload critical images
    const criticalImages = [
      '/public/images/happy-kid.png',
      '/public/images/stars.png', 
      '/public/images/try-again.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
