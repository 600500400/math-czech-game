
import { useState } from "react";

export function useGameUI() {
  // UI visibility state
  const [showProblem, setShowProblem] = useState(false);
  const [problemCount, setProblemCount] = useState(10);
  
  // Game reset and start functions
  const resetGame = () => {
    setProblemCount(10);
  };
  
  // Export all the UI-related state and functions
  return {
    showProblem,
    setShowProblem,
    problemCount,
    setProblemCount,
    resetGame
  };
}
