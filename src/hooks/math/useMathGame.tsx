
import { useCallback } from "react";
import { useGameState } from "./useGameState";
import { useDifficultySettings } from "./useDifficultySettings";
import { useProblemGenerator } from "./useProblemGenerator";
import { useAnswerHandler } from "./useAnswerHandler";
import { useGameFlow } from "./useGameFlow";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";
import { useDetailedAnswers } from "../statistics/useDetailedAnswers";

export const useMathGame = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  
  const { saveMathStatistics } = useStatistics(userId);
  const { addMathAnswer } = useDetailedAnswers(userId);
  
  const gameState = useGameState();
  const difficultySettings = useDifficultySettings();
  const problemGenerator = useProblemGenerator({
    allowedOperations: gameState.allowedOperations,
    maxValue: gameState.maxValue,
    maxMultiplyValue: gameState.maxMultiplyValue,
    maxDivideValue: gameState.maxDivideValue,
  });
  
  // Enhanced addAnswer function
  const enhancedAddAnswer = useCallback((answer: any) => {
    gameState.addAnswer(answer);
    addMathAnswer(answer);
  }, [gameState.addAnswer, addMathAnswer]);
  
  const answerHandler = useAnswerHandler({
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    problemCount: gameState.problemCount,
    generateProblem: problemGenerator.generateProblem,
    setCorrectAnswers: gameState.setCorrectAnswers,
    setWrongAnswers: gameState.setWrongAnswers,
    setLastAnswerCorrect: gameState.setLastAnswerCorrect,
    setShowAnimation: gameState.setShowAnimation,
    setShowConfetti: gameState.setShowConfetti,
    setUserAnswer: gameState.setUserAnswer,
    setCurrentProblem: gameState.setCurrentProblem,
    addAnswer: enhancedAddAnswer,
    endGame: () => {} // Will be set by gameFlow
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

  // Helper functions for the component
  const toggleOperation = useCallback((operation: any) => {
    difficultySettings.toggleOperation(operation, gameState.allowedOperations, gameState.setAllowedOperations);
  }, [difficultySettings, gameState.allowedOperations, gameState.setAllowedOperations]);

  const setDifficulty = useCallback(() => {
    difficultySettings.setDifficulty(
      gameState.maxValue,
      gameState.maxMultiplyValue,
      gameState.maxDivideValue,
      gameState.allowedOperations,
      gameState.setDifficultySet
    );
  }, [difficultySettings, gameState]);

  return {
    ...gameState,
    ...problemGenerator,
    ...answerHandler,
    ...gameFlow,
    
    toggleOperation,
    setDifficulty,
    startNewGame: gameFlow.startNewGame,
    endGame: gameFlow.endGame,
    resetGame: gameFlow.resetGame,
  };
};
