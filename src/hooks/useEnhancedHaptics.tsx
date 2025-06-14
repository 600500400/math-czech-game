
import { useCallback, useEffect, useState } from 'react';
import { useHapticDebugger } from './useHapticDebugger';

interface HapticSettings {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'heavy';
}

export const useEnhancedHaptics = (settings: HapticSettings = { enabled: true, intensity: 'medium' }) => {
  const { logTrigger, testVibration } = useHapticDebugger();
  const [userInteracted, setUserInteracted] = useState(false);

  // Enhanced haptic patterns with better mobile support
  const patterns = {
    tap: [25],
    success: [50, 50, 100],
    error: [100, 100, 100],
    celebration: [100, 50, 100, 50, 200],
    warning: [200, 100, 200],
    gameStart: [50, 50, 100],
    gameEnd: [100, 50, 200]
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      console.log('🔧 Haptic Debug: First user interaction detected');
      setUserInteracted(true);
      
      // Test vibration capability on first interaction
      if (settings.enabled) {
        testVibration([50]);
      }
    };

    // Listen for various user interaction events
    const events = ['touchstart', 'touchend', 'click', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [settings.enabled, testVibration]);

  const triggerHaptic = useCallback((patternName: keyof typeof patterns) => {
    if (!settings.enabled || !userInteracted) {
      logTrigger(`HAPTIC_${patternName.toUpperCase()}`, false, 'Disabled or no user interaction yet');
      return false;
    }

    const pattern = patterns[patternName];
    if (!pattern) {
      logTrigger(`HAPTIC_${patternName.toUpperCase()}`, false, 'Unknown pattern');
      return false;
    }

    console.log(`🔧 Haptic Debug: Triggering ${patternName} pattern:`, pattern);

    try {
      // Try modern Vibration API first
      if (navigator.vibrate) {
        const result = navigator.vibrate(pattern);
        logTrigger(`HAPTIC_${patternName.toUpperCase()}`, result);
        return result;
      }
      
      // Try Mozilla prefix
      if ((navigator as any).mozVibrate) {
        const result = (navigator as any).mozVibrate(pattern);
        logTrigger(`HAPTIC_${patternName.toUpperCase()}_MOZ`, result);
        return result;
      }
      
      // Try WebKit prefix
      if ((navigator as any).webkitVibrate) {
        const result = (navigator as any).webkitVibrate(pattern);
        logTrigger(`HAPTIC_${patternName.toUpperCase()}_WEBKIT`, result);
        return result;
      }

      logTrigger(`HAPTIC_${patternName.toUpperCase()}`, false, 'No vibration API available');
      return false;
      
    } catch (error) {
      logTrigger(`HAPTIC_${patternName.toUpperCase()}`, false, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [settings.enabled, userInteracted, logTrigger]);

  // Convenience methods
  const triggerTapHaptic = useCallback(() => triggerHaptic('tap'), [triggerHaptic]);
  const triggerSuccessHaptic = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const triggerErrorHaptic = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const triggerCelebrationHaptic = useCallback(() => triggerHaptic('celebration'), [triggerHaptic]);
  const triggerGameStartHaptic = useCallback(() => triggerHaptic('gameStart'), [triggerHaptic]);
  const triggerGameEndHaptic = useCallback(() => triggerHaptic('gameEnd'), [triggerHaptic]);

  const stopVibration = useCallback(() => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(0);
        logTrigger('STOP_VIBRATION', true);
      }
    } catch (error) {
      logTrigger('STOP_VIBRATION', false, error instanceof Error ? error.message : 'Unknown error');
    }
  }, [logTrigger]);

  return {
    triggerHaptic,
    triggerTapHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerGameStartHaptic,
    triggerGameEndHaptic,
    stopVibration,
    userInteracted,
    patterns
  };
};
