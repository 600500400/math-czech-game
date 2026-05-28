
import { useState, useEffect, useCallback } from 'react';

import { logger } from "@/utils/logger";
interface HapticDebugInfo {
  isSupported: boolean;
  userAgent: string;
  lastTrigger: string | null;
  triggerCount: number;
  errors: string[];
}

export const useHapticDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<HapticDebugInfo>({
    isSupported: false,
    userAgent: '',
    lastTrigger: null,
    triggerCount: 0,
    errors: []
  });

  useEffect(() => {
    const checkSupport = () => {
      const supported = !!(
        navigator.vibrate || 
        (navigator as any).mozVibrate || 
        (navigator as any).webkitVibrate
      );
      
      setDebugInfo(prev => ({
        ...prev,
        isSupported: supported,
        userAgent: navigator.userAgent
      }));
      
      logger.log('🔧 Haptic Debug: Support detected:', supported);
      logger.log('🔧 Haptic Debug: User Agent:', navigator.userAgent);
    };

    checkSupport();
  }, []);

  const logTrigger = useCallback((type: string, success: boolean, error?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    logger.log(`🔧 Haptic Debug [${timestamp}]: ${type} - ${success ? 'SUCCESS' : 'FAILED'}`);
    
    if (error) {
      console.error('🔧 Haptic Debug Error:', error);
    }

    setDebugInfo(prev => ({
      ...prev,
      lastTrigger: `${type} at ${timestamp}`,
      triggerCount: prev.triggerCount + 1,
      errors: error ? [...prev.errors.slice(-4), error] : prev.errors
    }));
  }, []);

  const testVibration = useCallback(async (pattern: number[] = [200]) => {
    logger.log('🔧 Haptic Debug: Testing vibration with pattern:', pattern);
    
    try {
      if (navigator.vibrate) {
        const result = navigator.vibrate(pattern);
        logTrigger('TEST_VIBRATION', result);
        return result;
      } else if ((navigator as any).mozVibrate) {
        const result = (navigator as any).mozVibrate(pattern);
        logTrigger('TEST_VIBRATION_MOZ', result);
        return result;
      } else if ((navigator as any).webkitVibrate) {
        const result = (navigator as any).webkitVibrate(pattern);
        logTrigger('TEST_VIBRATION_WEBKIT', result);
        return result;
      } else {
        logTrigger('TEST_VIBRATION', false, 'No vibration API available');
        return false;
      }
    } catch (error) {
      logTrigger('TEST_VIBRATION', false, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [logTrigger]);

  const clearDebugInfo = useCallback(() => {
    setDebugInfo(prev => ({
      ...prev,
      lastTrigger: null,
      triggerCount: 0,
      errors: []
    }));
  }, []);

  return {
    debugInfo,
    logTrigger,
    testVibration,
    clearDebugInfo
  };
};
