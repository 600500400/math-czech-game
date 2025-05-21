
import { useState } from "react";

export const useGameStatistics = () => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  
  // Calculate total answers for statistics
  const totalAnswers = correctAnswers + wrongAnswers;
  
  // Increment counters
  const incrementCorrect = () => {
    setCorrectAnswers(prev => prev + 1);
  };
  
  const incrementWrong = () => {
    setWrongAnswers(prev => prev + 1);
  };
  
  // Increment problem counter (implemented separately in useGameUI)
  const incrementProblemCount = () => {
    // This is a placeholder - actual implementation in useGameUI
  };
  
  return {
    correctAnswers,
    wrongAnswers,
    totalAnswers,
    showStatsDialog,
    
    setCorrectAnswers,
    setWrongAnswers,
    setShowStatsDialog,
    
    incrementCorrect,
    incrementWrong,
    incrementProblemCount
  };
};
