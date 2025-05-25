
import { useState, useCallback } from 'react';
import { Operation } from '@/types/mathTypes';
import { useAuth } from '@/hooks/useAuth';
import { useStatistics } from '@/hooks/useStatistics';

interface UseGameFlowProps {
  allowedOperations: Operation[];
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  correctAnswers: number;
  wrongAnswers: number;
  generateProblem: () => any;
  setCurrentProblem: (problem: any) => void;
  resetUserAnswer: () => void;
}

export function useGameFlow({
  allowedOperations,
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
  correctAnswers,
  wrongAnswers,
  generateProblem,
  setCurrentProblem,
  resetUserAnswer,
}: UseGameFlowProps) {
  const { authState } = useAuth();
  const userId = authState?.user?.id || null;
  const { saveMathStatistics } = useStatistics(userId);

  const [showProblem, setShowProblem] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [difficultySet, setDifficultySet] = useState(true); // Default to true so game can start immediately
  const [gameEnded, setGameEnded] = useState(false);
  const [problemCount, setProblemCount] = useState(10);

  // Start new game flow
  const startNewGame = useCallback(() => {
    // Set the default number of problems
    setProblemCount(10);
    // Generate first problem
    setCurrentProblem(generateProblem());
    // Show the problem dialog
    setShowProblem(true);
    // Reset game ended state
    setGameEnded(false);
    // Reset user answer
    resetUserAnswer();
  }, [generateProblem, setCurrentProblem, setProblemCount, setShowProblem, resetUserAnswer]);

  // End game flow
  const endGame = useCallback(() => {
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Save statistics if user is logged in
    if (userId && (correctAnswers > 0 || wrongAnswers > 0)) {
      const operationString = allowedOperations.join(',');
      
      saveMathStatistics.mutate({
        correctAnswers,
        wrongAnswers,
        operation: operationString,
        difficultyLevel: {
          maxValue,
          maxMultiplyValue,
          maxDivideValue
        }
      });
    }
  }, [
    correctAnswers, 
    wrongAnswers, 
    allowedOperations, 
    maxValue, 
    maxMultiplyValue, 
    maxDivideValue, 
    userId, 
    saveMathStatistics
  ]);

  // Reset game state
  const resetGame = useCallback(() => {
    setGameEnded(false);
    setShowStatsDialog(false);
  }, []);

  return {
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
    setGameEnded,
    setProblemCount,
    
    startNewGame,
    endGame,
    resetGame,
  };
}
