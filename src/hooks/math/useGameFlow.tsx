
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
    console.log("🎮 useGameFlow: Starting new game");
    const startTime = Date.now();
    setGameStartTime(startTime);
    console.log("🎮 useGameFlow: Game start time set to:", new Date(startTime).toLocaleTimeString());
    
    setCurrentProblem(generateProblem());
    setShowProblem(true);
    setGameEnded(false);
    resetUserAnswer();
  }, [generateProblem, setCurrentProblem, resetUserAnswer]);

  // End game flow
  const endGame = useCallback(() => {
    console.log("🎮 useGameFlow: Ending game");
    console.log("🎮 useGameFlow: Game start time was:", gameStartTime ? new Date(gameStartTime).toLocaleTimeString() : 'NULL');
    console.log("🎮 useGameFlow: Current time:", new Date().toLocaleTimeString());
    
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Save statistics if user is logged in and has game data
    if (userId && gameStartTime && (correctAnswers > 0 || wrongAnswers > 0)) {
      const endTime = Date.now();
      const gameDuration = Math.round((endTime - gameStartTime) / 1000);
      const operationString = allowedOperations.join(',');
      
      console.log("🎮 useGameFlow: Saving game statistics:");
      console.log("🎮 useGameFlow: - Start time:", new Date(gameStartTime).toLocaleTimeString());
      console.log("🎮 useGameFlow: - End time:", new Date(endTime).toLocaleTimeString());
      console.log("🎮 useGameFlow: - Duration in seconds:", gameDuration);
      console.log("🎮 useGameFlow: - Correct answers:", correctAnswers);
      console.log("🎮 useGameFlow: - Wrong answers:", wrongAnswers);
      
      if (gameDuration > 0) {
        console.log("🎮 useGameFlow: Calling saveMathStatistics.mutate with duration:", gameDuration);
        
        saveMathStatistics.mutate({
          correctAnswers,
          wrongAnswers,
          operation: operationString,
          gameDuration,
          difficultyLevel: {
            maxValue,
            maxMultiplyValue,
            maxDivideValue
          }
        });
      } else {
        console.warn("🎮 useGameFlow: Invalid game duration:", gameDuration);
      }
    } else {
      console.log("🎮 useGameFlow: Not saving statistics - missing requirements:", {
        userId: !!userId,
        gameStartTime: !!gameStartTime,
        hasAnswers: (correctAnswers > 0 || wrongAnswers > 0)
      });
    }
    
    // Reset game start time
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
