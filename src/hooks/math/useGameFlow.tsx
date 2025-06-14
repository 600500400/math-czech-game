
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
  const [difficultySet, setDifficultySet] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Start new game flow
  const startNewGame = useCallback(() => {
    console.log("🎮 useGameFlow: Starting new game, recording start time");
    setGameStartTime(Date.now());
    setCurrentProblem(generateProblem());
    setShowProblem(true);
    setGameEnded(false);
    resetUserAnswer();
  }, [generateProblem, setCurrentProblem, resetUserAnswer]);

  // End game flow (now "take break")
  const endGame = useCallback(() => {
    console.log("🎮 useGameFlow: Ending game");
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Save statistics if user is logged in and has game data
    if (userId && gameStartTime && (correctAnswers > 0 || wrongAnswers > 0)) {
      const gameDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const operationString = allowedOperations.join(',');
      
      console.log("🎮 useGameFlow: Saving statistics with game duration:", gameDuration, "seconds");
      
      saveMathStatistics.mutate({
        correctAnswers,
        wrongAnswers,
        operation: operationString,
        gameDuration, // Properly calculated game duration
        difficultyLevel: {
          maxValue,
          maxMultiplyValue,
          maxDivideValue
        }
      });
    } else {
      console.log("🎮 useGameFlow: Not saving statistics - userId:", userId, "gameStartTime:", gameStartTime, "hasAnswers:", (correctAnswers > 0 || wrongAnswers > 0));
    }
    
    setGameStartTime(null);
  }, [
    correctAnswers, 
    wrongAnswers, 
    allowedOperations, 
    maxValue, 
    maxMultiplyValue, 
    maxDivideValue, 
    userId, 
    saveMathStatistics,
    gameStartTime
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
    
    setShowProblem,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setDifficultySet,
    setGameEnded,
    
    startNewGame,
    endGame,
    resetGame,
  };
}
