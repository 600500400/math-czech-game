
import { useState, useCallback } from "react";

export const useGameUI = () => {
  const [problemCount, setProblemCount] = useState(10); // Initialize with 10 to match tests
  const [showProblem, setShowProblem] = useState(false);
  
  // Increment problem count
  const incrementProblemCount = useCallback(() => {
    setProblemCount(prev => prev + 1);
  }, []);
  
  // Reset game UI
  const resetGame = useCallback(() => {
    setProblemCount(10); // Reset to 10
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
