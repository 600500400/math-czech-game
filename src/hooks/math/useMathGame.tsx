
import { useState, useCallback } from 'react';
import { Operation } from '@/types/mathTypes';
import { useAuth } from '@/hooks/useAuth';
import { useStatistics } from '@/hooks/useStatistics';
import { useDifficultySettings } from './useDifficultySettings';
import { useGameMechanics } from './useGameMechanics';
import { useGameFlow } from './useGameFlow';

export function useMathGame() {
  // Core state
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  
  // Game difficulty settings
  const [maxValue, setMaxValue] = useState(20);
  const [maxMultiplyValue, setMaxMultiplyValue] = useState(10);
  const [maxDivideValue, setMaxDivideValue] = useState(10);
  // Set all operations selected by default
  const [allowedOperations, setAllowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);
  
  // Calculate derived statistics
  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Use our specialized hooks
  const {
    toggleOperation: difficultyToggleOperation,
    setDifficulty: difficultySetDifficulty
  } = useDifficultySettings();
  
  const {
    currentProblem,
    userAnswer,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    setUserAnswer,
    setCurrentProblem,
    generateProblem,
    checkAnswer,
    handleKeyPress,
  } = useGameMechanics({
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    allowedOperations,
    correctAnswers,
    wrongAnswers,
    problemCount: 10,
    setCorrectAnswers,
    setWrongAnswers
  });
  
  const {
    showProblem,
    showDifficultyDialog,
    showStatsDialog,
    difficultySet,
    gameEnded,
    problemCount,
    setShowProblem,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setDifficultySet,
    setProblemCount,
    startNewGame: startGame,
    endGame,
    resetGame,
  } = useGameFlow({
    allowedOperations,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    correctAnswers,
    wrongAnswers,
    generateProblem,
    setCurrentProblem,
    resetUserAnswer: () => setUserAnswer("")
  });

  // Wrapper for toggleOperation
  const toggleOperation = useCallback((operation: Operation) => {
    difficultyToggleOperation(operation, allowedOperations, setAllowedOperations);
  }, [difficultyToggleOperation, allowedOperations, setAllowedOperations]);

  // Wrapper for setDifficulty
  const setDifficulty = useCallback(() => {
    difficultySetDifficulty(
      maxValue,
      maxMultiplyValue,
      maxDivideValue,
      allowedOperations,
      setDifficultySet
    );
    
    // Close the difficulty dialog when set
    setShowDifficultyDialog(false);
  }, [
    difficultySetDifficulty,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    allowedOperations,
    setDifficultySet,
    setShowDifficultyDialog
  ]);
  
  // Wrapper for start new game to properly initialize
  const startNewGame = useCallback(() => {
    setCorrectAnswers(0);
    setWrongAnswers(0);
    startGame();
  }, [startGame]);

  return {
    // State
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentProblem,
    userAnswer,
    showProblem,
    showDifficultyDialog,
    showStatsDialog,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    difficultySet,
    allowedOperations,
    gameEnded,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    totalAnswers,
    correctPercentage,
    
    // State setters
    setUserAnswer,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setMaxValue,
    setMaxMultiplyValue,
    setMaxDivideValue,
    setAllowedOperations,
    
    // Actions
    setDifficulty,
    toggleOperation,
    startNewGame,
    checkAnswer,
    endGame,
    resetGame,
    handleKeyPress,
  };
}
