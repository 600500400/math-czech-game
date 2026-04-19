
import { useState, useCallback } from 'react';
import { Operation } from '@/types/mathTypes';
import { useAuth } from '@/hooks/useAuth';
import { useStatistics } from '@/hooks/useStatistics';
import { logger } from "@/utils/logger";

interface UseGameFlowProps {
  allowedOperations: Operation[];
  minValue: number;
  maxValue: number;
  correctAnswers: number;
  wrongAnswers: number;
  generateProblem: () => any;
  setCurrentProblem: (problem: any) => void;
  resetUserAnswer: () => void;
}

export function useGameFlow({
  allowedOperations,
  minValue,
  maxValue,
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
    logger.debug("🎮 useGameFlow: Starting new game");
    const startTime = Date.now();
    setGameStartTime(startTime);
    logger.debug("🎮 useGameFlow: Game start time set to:", new Date(startTime).toLocaleTimeString());
    
    setCurrentProblem(generateProblem());
    setShowProblem(true);
    setGameEnded(false);
    resetUserAnswer();
  }, [generateProblem, setCurrentProblem, resetUserAnswer]);

  // End game flow
  const endGame = useCallback(() => {
    logger.debug("🎮 useGameFlow: Ending game");
    logger.debug("🎮 useGameFlow: Game start time was:", gameStartTime ? new Date(gameStartTime).toLocaleTimeString() : 'NULL');
    logger.debug("🎮 useGameFlow: Current time:", new Date().toLocaleTimeString());
    
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Save statistics if user is logged in and has game data
    if (userId && gameStartTime && (correctAnswers > 0 || wrongAnswers > 0)) {
      const endTime = Date.now();
      const gameDuration = Math.round((endTime - gameStartTime) / 1000);
      const operationString = allowedOperations.join(',');
      
      logger.debug("🎮 useGameFlow: Saving game statistics:");
      logger.debug("🎮 useGameFlow: - Start time:", new Date(gameStartTime).toLocaleTimeString());
      logger.debug("🎮 useGameFlow: - End time:", new Date(endTime).toLocaleTimeString());
      logger.debug("🎮 useGameFlow: - Duration in seconds:", gameDuration);
      logger.debug("🎮 useGameFlow: - Correct answers:", correctAnswers);
      logger.debug("🎮 useGameFlow: - Wrong answers:", wrongAnswers);
      
      if (gameDuration > 0) {
        logger.debug("🎮 useGameFlow: Calling saveMathStatistics.mutate with duration:", gameDuration);
        
        saveMathStatistics.mutate({
          correctAnswers,
          wrongAnswers,
          operation: operationString,
          gameDuration,
          difficultyLevel: {
            minValue,
            maxValue
          }
        });
      } else {
        console.warn("🎮 useGameFlow: Invalid game duration:", gameDuration);
      }
    } else {
      logger.debug("🎮 useGameFlow: Not saving statistics - missing requirements:", {
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
    minValue, 
    maxValue, 
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
