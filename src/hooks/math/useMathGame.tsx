
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

  // Enhanced addAnswer function that saves detailed answers
  const enhancedAddAnswer = useCallback((answer: any) => {
    console.log("🔍 useMathGame: Ukládám detailní odpověď:", answer);
    gameState.addAnswer(answer);
    addMathAnswer(answer);
  }, [gameState.addAnswer, addMathAnswer]);
  
  const answerHandler = useAnswerHandler({
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    problemCount: gameFlow.problemCount,
    generateProblem: problemGenerator.generateProblem,
    setCorrectAnswers: gameState.setCorrectAnswers,
    setWrongAnswers: gameState.setWrongAnswers,
    setLastAnswerCorrect: gameState.setLastAnswerCorrect,
    setShowAnimation: gameState.setShowAnimation,
    setShowConfetti: gameState.setShowConfetti,
    setUserAnswer: gameState.setUserAnswer,
    setCurrentProblem: gameState.setCurrentProblem,
    addAnswer: enhancedAddAnswer, // Using enhanced function
    endGame: gameFlow.endGame
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
      gameFlow.setDifficultySet
    );
  }, [difficultySettings, gameState, gameFlow.setDifficultySet]);

  return {
    // Game state properties from gameState
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    lastAnswerCorrect: gameState.lastAnswerCorrect,
    showAnimation: gameState.showAnimation,
    answers: gameState.answers,
    maxValue: gameState.maxValue,
    maxMultiplyValue: gameState.maxMultiplyValue,
    maxDivideValue: gameState.maxDivideValue,
    allowedOperations: gameState.allowedOperations,
    
    // Game flow properties from gameFlow (these override gameState where needed)
    showProblem: gameFlow.showProblem,
    showDifficultyDialog: gameFlow.showDifficultyDialog,
    difficultySet: gameFlow.difficultySet,
    
    // State setters
    setUserAnswer: gameState.setUserAnswer,
    setShowDifficultyDialog: gameFlow.setShowDifficultyDialog,
    
    // Problem generator
    generateProblem: problemGenerator.generateProblem,
    
    // Answer handler methods
    checkAnswer: answerHandler.checkAnswer,
    handleKeyPress: answerHandler.handleKeyPress,
    
    // Game flow methods
    startNewGame: gameFlow.startNewGame,
    endGame: gameFlow.endGame,
    resetGame: gameFlow.resetGame,
    
    // Difficulty management
    toggleOperation,
    setDifficulty,
  };
};
