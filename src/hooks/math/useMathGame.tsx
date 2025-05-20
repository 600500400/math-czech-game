
import { useState, useEffect, useCallback } from 'react';
import { useProblemGenerator } from './useProblemGenerator';
import { useDifficultySettings } from './useDifficultySettings';
import { useGameState } from './useGameState';
import { Problem, Operation } from '@/types/mathTypes';
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

  // Počítáme statistiky
  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Předdeklarace funkcí
  const checkAnswer = useCallback(() => { /* bude definováno později */ }, []);
  const endGame = useCallback(() => { /* bude definováno později */ }, []);
  
  // Akce hry
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

  // Implementace checkAnswer
  const actualCheckAnswer = useCallback(() => {
    if (!currentProblem) return;
    
    const parsedAnswer = parseFloat(userAnswer);
    const isCorrect = !isNaN(parsedAnswer) && parsedAnswer === currentProblem.result;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setLastAnswerCorrect(true);
    } else {
      setWrongAnswers(prev => prev + 1);
      setLastAnswerCorrect(false);
    }
    
    // Zobrazíme animaci
    setShowAnimation(true);
    if (isCorrect) setShowConfetti(true);
    
    // Časovač pro skrytí animace
    setTimeout(() => {
      setShowAnimation(false);
      setShowConfetti(false);
    }, 2000);
    
    // Posuneme se na další příklad nebo ukončíme hru
    setTimeout(() => {
      if (correctAnswers + wrongAnswers + 1 >= problemCount) {
        endGame();
      } else {
        setCurrentProblem(generateProblem());
        setUserAnswer("");
      }
    }, 1000);
  }, [
    correctAnswers, 
    currentProblem, 
    endGame, 
    generateProblem, 
    problemCount, 
    setCorrectAnswers, 
    setCurrentProblem, 
    setLastAnswerCorrect, 
    setShowAnimation, 
    setShowConfetti, 
    setUserAnswer, 
    setWrongAnswers, 
    userAnswer, 
    wrongAnswers
  ]);

  // Implementace endGame
  const actualEndGame = useCallback(() => {
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Pokud je uživatel přihlášený, uložíme statistiky
    if (userId && (correctAnswers > 0 || wrongAnswers > 0)) {
      const operations = allowedOperations.join(',');
      saveMathStatistics.mutate({
        correctAnswers,
        wrongAnswers,
        operation: operations,
        difficultyLevel: {
          maxValue,
          maxMultiplyValue,
          maxDivideValue
        }
      });
    }
  }, [
    allowedOperations,
    correctAnswers,
    maxDivideValue,
    maxMultiplyValue,
    maxValue,
    saveMathStatistics,
    setGameEnded,
    setShowProblem,
    setShowStatsDialog,
    userId,
    wrongAnswers
  ]);

  // Přiřazení implementací do předdeklarovaných funkcí
  Object.assign(checkAnswer, actualCheckAnswer);
  Object.assign(endGame, actualEndGame);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

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
