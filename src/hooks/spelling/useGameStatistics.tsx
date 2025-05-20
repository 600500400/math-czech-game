
import { useState } from "react";

export function useGameStatistics() {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  
  const incrementProblemCount = () => setProblemCount(prev => prev + 1);
  const incrementCorrect = () => setCorrectAnswers(prev => prev + 1);
  const incrementWrong = () => setWrongAnswers(prev => prev + 1);
  
  const totalAnswers = correctAnswers + wrongAnswers;
  const hasStats = totalAnswers > 0;

  return {
    correctAnswers,
    wrongAnswers,
    problemCount,
    showStatsDialog,
    setShowStatsDialog,
    incrementProblemCount,
    incrementCorrect,
    incrementWrong,
    totalAnswers,
    hasStats
  };
}
