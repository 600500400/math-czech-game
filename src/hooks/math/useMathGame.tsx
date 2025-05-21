
import { useState, useCallback, useEffect } from 'react';
import { Problem, Operation } from '@/types/mathTypes';
import { useAuth } from '@/hooks/useAuth';
import { useStatistics } from '@/hooks/useStatistics';
import { useDifficultySettings } from './useDifficultySettings';
import { useProblemGenerator } from './useProblemGenerator';
import { useGameState } from './useGameState';
import { useAnswerHandler } from './useAnswerHandler';
import { useGameFinisher } from './useGameFinisher';

export function useMathGame() {
  const { authState } = useAuth();
  const userId = authState?.user?.id || null;
  const { saveMathStatistics: saveStats } = useStatistics(userId);
  
  // Function to wrap the mutation.mutate function to match expected signature
  const saveMathStatistics = (data: any) => {
    if (saveStats && typeof saveStats === 'function') {
      saveStats(data);
    }
  };
  
  // Use our modular hooks
  const {
    correctAnswers,
    setCorrectAnswers,
    wrongAnswers,
    setWrongAnswers,
    problemCount,
    setProblemCount,
    currentProblem,
    setCurrentProblem,
    userAnswer,
    setUserAnswer,
    showProblem,
    setShowProblem,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showStatsDialog,
    setShowStatsDialog,
    difficultySet,
    setDifficultySet,
    gameEnded,
    setGameEnded,
    lastAnswerCorrect,
    setLastAnswerCorrect,
    showAnimation,
    setShowAnimation,
    showConfetti,
    setShowConfetti,
    totalAnswers,
    correctPercentage,
    maxValue,
    setMaxValue,
    maxMultiplyValue,
    setMaxMultiplyValue,
    maxDivideValue,
    setMaxDivideValue,
    allowedOperations,
    setAllowedOperations
  } = useGameState();

  // Difficulty settings
  const {
    toggleOperation: difficultyToggleOperation,
    setDifficulty: difficultySetDifficulty
  } = useDifficultySettings();

  // Problem generator
  const { generateProblem } = useProblemGenerator({ 
    maxValue, 
    maxMultiplyValue, 
    maxDivideValue, 
    allowedOperations 
  });

  // Game finisher logic
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

  // Answer handling
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
  }, [
    difficultySetDifficulty,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    allowedOperations,
    setDifficultySet
  ]);

  // Start a new game
  const startNewGame = useCallback(() => {
    // Set the default number of problems
    setProblemCount(10);
    // Reset stats
    setCorrectAnswers(0);
    setWrongAnswers(0);
    // Generate first problem
    setCurrentProblem(generateProblem());
    // Show the problem dialog
    setShowProblem(true);
    // Reset game ended state
    setGameEnded(false);
    // Reset user answer
    setUserAnswer("");
  }, [
    generateProblem, 
    setCorrectAnswers, 
    setCurrentProblem, 
    setGameEnded, 
    setProblemCount, 
    setShowProblem, 
    setUserAnswer, 
    setWrongAnswers
  ]);

  // Reset game stats
  const resetGame = useCallback(() => {
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setGameEnded(false);
    setShowStatsDialog(false);
  }, [setCorrectAnswers, setGameEnded, setShowStatsDialog, setWrongAnswers]);

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
