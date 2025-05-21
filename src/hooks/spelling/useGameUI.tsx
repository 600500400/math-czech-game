
import { useState, useCallback } from "react";

export const useGameUI = () => {
  const [problemCount, setProblemCount] = useState(0);
  const [showProblem, setShowProblem] = useState(false);
  
  // Increment problem count
  const incrementProblemCount = useCallback(() => {
    setProblemCount(prev => prev + 1);
  }, []);
  
  // Reset game UI
  const resetGame = useCallback(() => {
    setShowProblem(false);
  }, []);
  
  return {
    problemCount,
    showProblem,
    
    setProblemCount,
    setShowProblem,
    incrementProblemCount,
    resetGame
  };
};
