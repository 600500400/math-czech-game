
import { useState } from "react";

export function useAnimationState() {
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  return {
    lastAnswerCorrect,
    showAnimation,
    setLastAnswerCorrect,
    setShowAnimation
  };
}
