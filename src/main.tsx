
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './utils/pwaUtils'
import { APP_VERSION } from './utils/version'

// Initialize optional PWA features lazily

// Register service worker for PWA functionality
registerServiceWorker();

// Initialize versioning after DOM is ready
const requestIdle = (cb: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};

requestIdle(() => {
  APP_VERSION.initializeVersioning();
});

// Initialize performance optimizations
requestIdle(() => {
  // Preload critical images
  const criticalImages = [
    '/images/happy-kid.png',
    '/images/stars.png', 
    '/images/try-again.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
});

createRoot(document.getElementById("root")!).render(<App />);

// Lazy-initialize non-critical features after initial render
requestIdle(() => {
  import('./utils/webVitals'); // Initialize Web Vitals monitoring
  import('./utils/offlineManager'); // Initialize offline manager
});