
import { useCallback, useEffect } from 'react';

export const useMobileInteractions = () => {
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    // Modern vibration API
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [15, 5, 15],
        heavy: [20, 10, 20]
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  const triggerSuccessHaptic = useCallback(() => {
    triggerHaptic('medium');
  }, [triggerHaptic]);

  const triggerErrorHaptic = useCallback(() => {
    triggerHaptic('heavy');
  }, [triggerHaptic]);

  const triggerTapHaptic = useCallback(() => {
    triggerHaptic('light');
  }, [triggerHaptic]);

  // Prevent zoom on double tap for better UX
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTabZoom = (e: TouchEvent) => {
      let t2 = e.timeStamp;
      let t1 = e.currentTarget?.getAttribute('data-lastTouch') || t2;
      let dt = t2 - parseInt(t1);
      let fingers = e.touches.length;
      
      e.currentTarget?.setAttribute('data-lastTouch', t2.toString());

      if (!dt || dt > 500 || fingers > 1) return; // not double-tap

      e.preventDefault(); // double tap - prevent zoom
      e.target?.dispatchEvent(new Event('click', { bubbles: true }));
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTabZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTabZoom);
    };
  }, []);

  return {
    triggerHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerTapHaptic
  };
};
