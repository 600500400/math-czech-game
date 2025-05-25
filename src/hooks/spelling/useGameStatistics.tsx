
import { useState } from "react";

export const useGameStatistics = () => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  
  // Calculate total answers for statistics
  const totalAnswers = correctAnswers + wrongAnswers;
  
  // Determine if there are any stats to show
  const hasStats = correctAnswers > 0 || wrongAnswers > 0;
  
  // Calculate game duration in seconds
  const getGameDuration = () => {
    if (!gameStartTime) return 0;
    return Math.floor((Date.now() - gameStartTime) / 1000);
  };
  
  // Start game timer
  const startGameTimer = () => {
    setGameStartTime(Date.now());
  };
  
  // Reset game timer
  const resetGameTimer = () => {
    setGameStartTime(null);
  };
  
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
    gameStartTime,
    
    setCorrectAnswers,
    setWrongAnswers,
    setShowStatsDialog,
    setProblemCount,
    
    incrementCorrect,
    incrementWrong,
    incrementProblemCount,
    startGameTimer,
    resetGameTimer,
    getGameDuration
  };
};
