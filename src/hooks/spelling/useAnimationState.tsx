
import { useState, useCallback, useRef } from "react";

export function useAnimationState() {
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationActiveRef = useRef(false);
  
  const setLastAnswerCorrectSafe = useCallback((value: boolean | null) => {
    console.log("🎬 useAnimationState: Setting lastAnswerCorrect to:", value);
    setLastAnswerCorrect(value);
  }, []);
  
  const setShowAnimationSafe = useCallback((value: boolean) => {
    console.log("🎬 useAnimationState: Setting showAnimation to:", value, "Currently active:", animationActiveRef.current);
    
    // If trying to show new animation while one is active, clear the previous one first
    if (value && animationActiveRef.current) {
      console.log("🎬 useAnimationState: Clearing previous animation before starting new one");
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      setShowAnimation(false);
      animationActiveRef.current = false;
      
      // Small delay before starting new animation
      setTimeout(() => {
        setShowAnimation(true);
        animationActiveRef.current = true;
      }, 100);
      return;
    }
    
    setShowAnimation(value);
    animationActiveRef.current = value;
    
    // Clear any existing timeout when manually setting animation state
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);
  
  const scheduleAnimationHide = useCallback((delay: number = 2000) => {
    console.log("🎬 useAnimationState: Scheduling animation hide in", delay, "ms");
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = setTimeout(() => {
      console.log("🎬 useAnimationState: Auto-hiding animation after timeout");
      setShowAnimation(false);
      animationActiveRef.current = false;
      animationTimeoutRef.current = null;
    }, delay);
  }, []);
  
  const resetAnimation = useCallback(() => {
    console.log("🎬 useAnimationState: Resetting animation state");
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    setShowAnimation(false);
    setLastAnswerCorrect(null);
    animationActiveRef.current = false;
  }, []);
  
  return {
    lastAnswerCorrect,
    showAnimation,
    setLastAnswerCorrect: setLastAnswerCorrectSafe,
    setShowAnimation: setShowAnimationSafe,
    scheduleAnimationHide,
    resetAnimation,
    isAnimationActive: () => animationActiveRef.current
  };
}
