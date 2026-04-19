
import { useState, useCallback, useRef, useEffect } from "react";
import { logger } from "@/utils/logger";

export function useAnimationState() {
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationId, setAnimationId] = useState(0); // Unique ID for each animation
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationActiveRef = useRef(false);
  const forceCleanupRef = useRef<(() => void) | null>(null);
  
  // Emergency cleanup function
  const emergencyCleanup = useCallback(() => {
    logger.debug("🚨 useAnimationState: EMERGENCY CLEANUP triggered");
    
    // Clear all timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // Reset all states immediately
    setShowAnimation(false);
    setLastAnswerCorrect(null);
    animationActiveRef.current = false;
    
    // Increment animation ID to invalidate any pending operations
    setAnimationId(prev => prev + 1);
    
    // Call force cleanup if available
    if (forceCleanupRef.current) {
      forceCleanupRef.current();
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      emergencyCleanup();
    };
  }, [emergencyCleanup]);
  
  const setLastAnswerCorrectSafe = useCallback((value: boolean | null) => {
    logger.debug("🎬 useAnimationState: Setting lastAnswerCorrect to:", value);
    setLastAnswerCorrect(value);
  }, []);
  
  const setShowAnimationSafe = useCallback((value: boolean) => {
    const currentAnimationId = animationId;
    logger.debug("🎬 useAnimationState: Setting showAnimation to:", value, "ID:", currentAnimationId, "Currently active:", animationActiveRef.current);
    
    // If trying to show new animation, always do emergency cleanup first
    if (value) {
      logger.debug("🎬 useAnimationState: Starting new animation - doing emergency cleanup first");
      emergencyCleanup();
      
      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        // Only proceed if this animation ID is still current
        if (currentAnimationId === animationId) {
          setShowAnimation(true);
          animationActiveRef.current = true;
          setAnimationId(prev => prev + 1); // New animation gets new ID
        }
      }, 50);
      return;
    }
    
    // Hide animation
    setShowAnimation(false);
    animationActiveRef.current = false;
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, [animationId, emergencyCleanup]);
  
  const scheduleAnimationHide = useCallback((delay: number = 1500) => {
    const currentAnimationId = animationId;
    logger.debug("🎬 useAnimationState: Scheduling animation hide in", delay, "ms, ID:", currentAnimationId);
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = setTimeout(() => {
      // Only hide if this is still the current animation
      if (currentAnimationId === animationId) {
        logger.debug("🎬 useAnimationState: Auto-hiding animation after timeout, ID:", currentAnimationId);
        setShowAnimation(false);
        animationActiveRef.current = false;
        animationTimeoutRef.current = null;
        
        // Reset correct state after short delay
        setTimeout(() => {
          if (currentAnimationId === animationId) {
            setLastAnswerCorrect(null);
          }
        }, 100);
      }
    }, delay);
  }, [animationId]);
  
  const resetAnimation = useCallback(() => {
    logger.debug("🎬 useAnimationState: Manual reset animation");
    emergencyCleanup();
  }, [emergencyCleanup]);
  
  // Register force cleanup function
  const registerForceCleanup = useCallback((cleanupFn: () => void) => {
    forceCleanupRef.current = cleanupFn;
  }, []);
  
  return {
    lastAnswerCorrect,
    showAnimation,
    animationId,
    setLastAnswerCorrect: setLastAnswerCorrectSafe,
    setShowAnimation: setShowAnimationSafe,
    scheduleAnimationHide,
    resetAnimation,
    emergencyCleanup,
    registerForceCleanup,
    isAnimationActive: () => animationActiveRef.current
  };
}
