
import { useState, useCallback } from 'react';
import { useProblemGenerator } from './useProblemGenerator';
import { useDifficultySettings } from './useDifficultySettings';
import { useGameState } from './useGameState';
import { useAnswerHandler } from './useAnswerHandler';
import { useGameFinisher } from './useGameFinisher';
import { useAuth } from '@/hooks/useAuth';
import { useStatistics } from '@/hooks/useStatistics';

export function useMathGame() {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { saveMathStatistics } = useStatistics(userId);

  const {
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    difficultySet,
    allowedOperations,
    setMaxValue,
    setMaxMultiplyValue,
    setMaxDivideValue,
    setDifficultySet,
    toggleOperation,
    setDifficulty,
  } = useDifficultySettings();

  const {
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentProblem,
    userAnswer,
    showProblem,
    showDifficultyDialog,
    showStatsDialog,
    gameEnded,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    
    setCorrectAnswers,
    setWrongAnswers,
    setProblemCount,
    setCurrentProblem,
    setUserAnswer,
    setShowProblem,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setGameEnded,
    setLastAnswerCorrect,
    setShowAnimation,
    setShowConfetti,
  } = useGameState();

  const { generateProblem } = useProblemGenerator({ 
    maxValue, 
    maxMultiplyValue, 
    maxDivideValue, 
    allowedOperations 
  });

  // Calculate statistics
  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  // Initialize game finisher hook
  const { endGame } = useGameFinisher({
    setShowProblem,
    setGameEnded,
    setShowStatsDialog,
    userId,
    correctAnswers,
    wrongAnswers,
    allowedOperations,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    saveMathStatistics
  });

  // Initialize answer handler hook (must be after endGame is defined)
  const { checkAnswer, handleKeyPress } = useAnswerHandler({
    currentProblem,
    userAnswer,
    correctAnswers,
    wrongAnswers,
    problemCount,
    generateProblem,
    setCorrectAnswers,
    setWrongAnswers,
    setLastAnswerCorrect,
    setShowAnimation,
    setShowConfetti,
    setUserAnswer,
    setCurrentProblem,
    endGame
  });
  
  // Game actions
  const startNewGame = useCallback(() => {
    if(!difficultySet) {
      setShowDifficultyDialog(true);
      return;
    }
    
    setProblemCount(10); // Default počet problémů
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setUserAnswer("");
    setGameEnded(false);
    setCurrentProblem(generateProblem());
    setShowProblem(true);
  }, [
    difficultySet,
    generateProblem,
    setCorrectAnswers,
    setCurrentProblem,
    setGameEnded,
    setProblemCount,
    setShowDifficultyDialog,
    setShowProblem,
    setUserAnswer,
    setWrongAnswers
  ]);

  const resetGame = useCallback(() => {
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setProblemCount(10);
    setUserAnswer("");
    setCurrentProblem(null);
    setShowProblem(false);
    setGameEnded(false);
    setLastAnswerCorrect(null);
    setShowAnimation(false);
    setShowConfetti(false);
  }, [
    setCorrectAnswers,
    setCurrentProblem,
    setGameEnded,
    setLastAnswerCorrect,
    setProblemCount,
    setShowAnimation,
    setShowConfetti,
    setShowProblem,
    setUserAnswer,
    setWrongAnswers
  ]);

  // Vrátíme vše co potřebujeme
  return {
    // Stav hry
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
    gameEnded,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    totalAnswers,
    correctPercentage,
    allowedOperations,
    
    // Settery
    setUserAnswer,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setMaxValue,
    setMaxMultiplyValue,
    setMaxDivideValue,
    setDifficulty,
    toggleOperation,
    
    // Akce
    startNewGame,
    checkAnswer,
    endGame,
    resetGame,
    handleKeyPress,
  };
}
