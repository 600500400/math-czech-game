
import { useState } from "react";

export const useGameStatistics = () => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  
  // Calculate total answers for statistics
  const totalAnswers = correctAnswers + wrongAnswers;
  
  // Determine if there are any stats to show
  const hasStats = correctAnswers > 0 || wrongAnswers > 0;
  
  // Increment counters
  const incrementCorrect = () => {
    setCorrectAnswers(prev => prev + 1);
  };
  
  const incrementWrong = () => {
    setWrongAnswers(prev => prev + 1);
  };
  
  // Increment problem counter
  const incrementProblemCount = () => {
    setProblemCount(prev => prev + 1);
  };
  
  return {
    correctAnswers,
    wrongAnswers,
    totalAnswers,
    problemCount,
    showStatsDialog,
    hasStats,
    
    setCorrectAnswers,
    setWrongAnswers,
    setShowStatsDialog,
    setProblemCount,
    
    incrementCorrect,
    incrementWrong,
    incrementProblemCount
  };
};
