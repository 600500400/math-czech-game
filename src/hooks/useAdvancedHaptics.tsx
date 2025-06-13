
import { useCallback } from 'react';

interface HapticPattern {
  pattern: number[];
  intensity?: 'light' | 'medium' | 'heavy';
}

interface HapticPatterns {
  success: HapticPattern;
  error: HapticPattern;
  celebration: HapticPattern;
  warning: HapticPattern;
  gameStart: HapticPattern;
  gameEnd: HapticPattern;
  buttonTap: HapticPattern;
  longPress: HapticPattern;
}

export const useAdvancedHaptics = () => {
  // Check for haptic support
  const isSupported = useCallback(() => {
    return !!(navigator.vibrate || (navigator as any).mozVibrate || (navigator as any).webkitVibrate);
  }, []);

  // Predefined haptic patterns
  const patterns: HapticPatterns = {
    success: {
      pattern: [50, 50, 100, 50, 150],
      intensity: 'medium'
    },
    error: {
      pattern: [100, 100, 100, 100, 100],
      intensity: 'heavy'
    },
    celebration: {
      pattern: [100, 50, 100, 50, 100, 50, 200, 50, 100, 50, 300],
      intensity: 'light'
    },
    warning: {
      pattern: [200, 100, 200],
      intensity: 'medium'
    },
    gameStart: {
      pattern: [50, 50, 50, 50, 100],
      intensity: 'light'
    },
    gameEnd: {
      pattern: [100, 100, 200, 100, 300],
      intensity: 'medium'
    },
    buttonTap: {
      pattern: [25],
      intensity: 'light'
    },
    longPress: {
      pattern: [100, 50, 100],
      intensity: 'medium'
    }
  };

  // Execute haptic feedback
  const vibrate = useCallback((pattern: number[] | number, force = false) => {
    if (!isSupported() && !force) return false;

    try {
      // Try modern vibrate API
      if (navigator.vibrate) {
        return navigator.vibrate(pattern);
      }
      
      // Try prefixed versions
      const vibrateFn = (navigator as any).mozVibrate || (navigator as any).webkitVibrate;
      if (vibrateFn) {
        return vibrateFn.call(navigator, pattern);
      }
      
      return false;
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }, []);

  // Play predefined pattern
  const playPattern = useCallback((patternName: keyof HapticPatterns) => {
    const pattern = patterns[patternName];
    if (!pattern) return false;
    
    return vibrate(pattern.pattern);
  }, [vibrate, patterns]);

  // Success feedback - ascending intensity
  const triggerSuccessHaptic = useCallback(() => {
    return playPattern('success');
  }, [playPattern]);

  // Error feedback - heavy shake
  const triggerErrorHaptic = useCallback(() => {
    return playPattern('error');
  }, [playPattern]);

  // Celebration feedback - complex joyful pattern
  const triggerCelebrationHaptic = useCallback(() => {
    return playPattern('celebration');
  }, [playPattern]);

  // Warning feedback - double pulse
  const triggerWarningHaptic = useCallback(() => {
    return playPattern('warning');
  }, [playPattern]);

  // Game start feedback
  const triggerGameStartHaptic = useCallback(() => {
    return playPattern('gameStart');
  }, [playPattern]);

  // Game end feedback
  const triggerGameEndHaptic = useCallback(() => {
    return playPattern('gameEnd');
  }, [playPattern]);

  // Light tap feedback
  const triggerTapHaptic = useCallback(() => {
    return playPattern('buttonTap');
  }, [playPattern]);

  // Long press feedback
  const triggerLongPressHaptic = useCallback(() => {
    return playPattern('longPress');
  }, [playPattern]);

  // Custom pattern
  const triggerCustomHaptic = useCallback((pattern: number[]) => {
    return vibrate(pattern);
  }, [vibrate]);

  // Stop all vibration
  const stopHaptic = useCallback(() => {
    return vibrate(0);
  }, [vibrate]);

  return {
    isSupported: isSupported(),
    patterns,
    
    // Basic controls
    vibrate,
    playPattern,
    stopHaptic,
    
    // Predefined patterns
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerWarningHaptic,
    triggerGameStartHaptic,
    triggerGameEndHaptic,
    triggerTapHaptic,
    triggerLongPressHaptic,
    triggerCustomHaptic,
  };
};
