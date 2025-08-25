
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { APP_VERSION } from './utils/version'
import { pwaUpdater } from './utils/pwaUpdater'

// Initialize versioning and PWA updater
APP_VERSION.initializeVersioning();

// Initialize optional PWA features lazily
const requestIdle = (cb: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(cb);
  } else {
    setTimeout(cb, 0);
  }
};

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