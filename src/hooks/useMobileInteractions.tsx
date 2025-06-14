
import { useCallback, useEffect, useState } from 'react';
import { useEnhancedHaptics } from './useEnhancedHaptics';

interface MobileInteractionSettings {
  hapticsEnabled: boolean;
  preventZoom: boolean;
}

export const useMobileInteractions = (settings: MobileInteractionSettings = { hapticsEnabled: true, preventZoom: true }) => {
  const [interactionSettings, setInteractionSettings] = useState(settings);
  const {
    triggerTapHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerGameStartHaptic,
    triggerGameEndHaptic
  } = useEnhancedHaptics({ enabled: interactionSettings.hapticsEnabled, intensity: 'medium' });

  // Prevent zoom on double tap and pinch
  useEffect(() => {
    if (!interactionSettings.preventZoom) return;

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTabZoom = (e: TouchEvent) => {
      let t2 = e.timeStamp;
      const currentTarget = e.currentTarget as HTMLElement;
      let t1 = currentTarget?.getAttribute('data-lastTouch') || t2.toString();
      let dt = t2 - parseInt(t1);
      let fingers = e.touches.length;
      
      currentTarget?.setAttribute('data-lastTouch', t2.toString());

      if (!dt || dt > 500 || fingers > 1) return; // not double-tap

      e.preventDefault(); // double tap - prevent zoom
      const target = e.target as HTMLElement;
      target?.dispatchEvent(new Event('click', { bubbles: true }));
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTabZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchend', preventDoubleTabZoom);
    };
  }, [interactionSettings.preventZoom]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<MobileInteractionSettings>) => {
    setInteractionSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    // Haptic feedback methods
    triggerTapHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerGameStartHaptic,
    triggerGameEndHaptic,
    
    // Settings
    settings: interactionSettings,
    updateSettings
  };
};
