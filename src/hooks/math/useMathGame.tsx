
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useGameState } from "./useGameState";
import { useProblemGenerator } from "./useProblemGenerator";
import { useAnswerHandler } from "./useAnswerHandler";
import { useDifficultySettings } from "./useDifficultySettings";
import { useGameFlow } from "./useGameFlow";

export function useMathGame() {
  const { authState } = useAuth();
  const userId = authState?.user?.id || null;
  const { saveMathStatistics } = useStatistics(userId);
  
  const gameState = useGameState();
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  
  const problemGenerator = useProblemGenerator({
    allowedOperations: gameState.allowedOperations,
    maxValue: gameState.maxValue,
    maxMultiplyValue: gameState.maxMultiplyValue,
    maxDivideValue: gameState.maxDivideValue,
  });

  const gameFlow = useGameFlow({
    allowedOperations: gameState.allowedOperations,
    maxValue: gameState.maxValue,
    maxMultiplyValue: gameState.maxMultiplyValue,
    maxDivideValue: gameState.maxDivideValue,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    generateProblem: problemGenerator.generateProblem,
    setCurrentProblem: gameState.setCurrentProblem,
    resetUserAnswer: () => gameState.setUserAnswer(""),
  });

  // Enhanced end game function with duration calculation
  const endGame = useCallback(() => {
    const gameDuration = gameStartTime 
      ? Math.round((new Date().getTime() - gameStartTime.getTime()) / 1000)
      : 0;

    gameFlow.setShowProblem(false);
    gameFlow.setGameEnded(true);
    gameFlow.setShowStatsDialog(true);
    
    // Save statistics with duration if user is logged in
    if (userId && (gameState.correctAnswers > 0 || gameState.wrongAnswers > 0)) {
      const operationString = gameState.allowedOperations.join(',');
      
      saveMathStatistics.mutate({
        correctAnswers: gameState.correctAnswers,
        wrongAnswers: gameState.wrongAnswers,
        operation: operationString,
        difficultyLevel: {
          maxValue: gameState.maxValue,
          maxMultiplyValue: gameState.maxMultiplyValue,
          maxDivideValue: gameState.maxDivideValue
        },
        gameDuration: gameDuration
      });
    }
  }, [
    gameState.correctAnswers, 
    gameState.wrongAnswers, 
    gameState.allowedOperations, 
    gameState.maxValue, 
    gameState.maxMultiplyValue, 
    gameState.maxDivideValue, 
    userId, 
    saveMathStatistics,
    gameStartTime,
    gameFlow
  ]);

  const answerHandler = useAnswerHandler({
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    problemCount: gameFlow.problemCount,
    setCorrectAnswers: gameState.setCorrectAnswers,
    setWrongAnswers: gameState.setWrongAnswers,
    setUserAnswer: gameState.setUserAnswer,
    setCurrentProblem: gameState.setCurrentProblem,
    setLastAnswerCorrect: gameState.setLastAnswerCorrect,
    setShowAnimation: gameState.setShowAnimation,
    setShowConfetti: gameState.setShowConfetti,
    generateProblem: problemGenerator.generateProblem,
    endGame: endGame,
  });

  const difficultySettings = useDifficultySettings();

  // Enhanced start game function with timer
  const startNewGame = useCallback(() => {
    setGameStartTime(new Date());
    gameFlow.startNewGame();
  }, [gameFlow]);

  const toggleOperation = useCallback((operation) => {
    difficultySettings.toggleOperation(
      operation, 
      gameState.allowedOperations, 
      gameState.setAllowedOperations
    );
  }, [difficultySettings, gameState.allowedOperations, gameState.setAllowedOperations]);

  const setDifficulty = useCallback(() => {
    difficultySettings.setDifficulty(
      gameState.maxValue,
      gameState.maxMultiplyValue,
      gameState.maxDivideValue,
      gameState.allowedOperations,
      gameState.setDifficultySet
    );
  }, [
    difficultySettings,
    gameState.maxValue,
    gameState.maxMultiplyValue,
    gameState.maxDivideValue,
    gameState.allowedOperations,
    gameState.setDifficultySet
  ]);

  return {
    // All existing game state
    ...gameState,
    
    // Game flow functions
    ...gameFlow,
    startNewGame, // Use our enhanced version
    endGame, // Use our enhanced version
    
    // Answer handling
    checkAnswer: answerHandler.checkAnswer,
    handleKeyPress: answerHandler.handleKeyPress,
    
    // Difficulty settings
    toggleOperation,
    setDifficulty,
    
    // Timer info
    gameStartTime,
  };
}
