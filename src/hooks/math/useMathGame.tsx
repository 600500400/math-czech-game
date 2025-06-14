
import { useCallback } from "react";
import { Operation } from "@/types/mathTypes";
import { useGameState } from "./useGameState";
import { useProblemGenerator } from "./useProblemGenerator";
import { useAnswerHandler } from "./useAnswerHandler";
import { useDifficultySettings } from "./useDifficultySettings";
import { useGameFlow } from "./useGameFlow";

export const useMathGame = () => {
  const gameState = useGameState();
  const difficultySettings = useDifficultySettings();
  const problemGenerator = useProblemGenerator({
    allowedOperations: difficultySettings.allowedOperations,
    maxValue: difficultySettings.maxValue,
    maxMultiplyValue: difficultySettings.maxMultiplyValue,
    maxDivideValue: difficultySettings.maxDivideValue
  });
  
  const answerHandler = useAnswerHandler({
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    setUserAnswer: gameState.setUserAnswer,
    setLastAnswerCorrect: gameState.setLastAnswerCorrect,
    setShowAnimation: gameState.setShowAnimation,
    incrementCorrect: gameState.incrementCorrect,
    incrementWrong: gameState.incrementWrong,
    addAnswer: gameState.addAnswer,
    generateProblem: problemGenerator.generateProblem,
    setCurrentProblem: gameState.setCurrentProblem
  });

  const gameFlow = useGameFlow({
    allowedOperations: difficultySettings.allowedOperations,
    maxValue: difficultySettings.maxValue,
    maxMultiplyValue: difficultySettings.maxMultiplyValue,
    maxDivideValue: difficultySettings.maxDivideValue,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    generateProblem: problemGenerator.generateProblem,
    setCurrentProblem: gameState.setCurrentProblem,
    resetUserAnswer: () => gameState.setUserAnswer("")
  });

  // Start new game with progressive approach
  const startNewGame = useCallback(() => {
    // Reset game state but don't set automatic end
    gameState.setCorrectAnswers(0);
    gameState.setWrongAnswers(0);
    gameState.setGameEnded(false);
    gameState.setShowAnimation(false);
    gameState.setLastAnswerCorrect(null);
    gameState.resetAnswers();
    
    // Generate first problem
    const newProblem = problemGenerator.generateProblem();
    gameState.setCurrentProblem(newProblem);
    gameState.setUserAnswer("");
    
    // Show problem dialog
    gameFlow.setShowProblem(true);
    gameFlow.setGameEnded(false);
  }, [gameState, problemGenerator, gameFlow]);

  // End game (now called "take break")
  const endGame = useCallback(() => {
    gameFlow.endGame();
    gameState.setGameEnded(true);
  }, [gameFlow, gameState]);

  // Toggle operation
  const toggleOperation = useCallback((operation: Operation) => {
    difficultySettings.toggleOperation(operation);
  }, [difficultySettings]);

  // Set difficulty preset
  const setDifficulty = useCallback((level: "easy" | "medium" | "hard") => {
    difficultySettings.setDifficulty(level);
  }, [difficultySettings]);

  return {
    // Game state
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    showProblem: gameFlow.showProblem,
    showDifficultyDialog: gameFlow.showDifficultyDialog,
    showStatsDialog: gameFlow.showStatsDialog,
    lastAnswerCorrect: gameState.lastAnswerCorrect,
    showAnimation: gameState.showAnimation,
    answers: gameState.answers,
    difficultySet: gameFlow.difficultySet,
    
    // Difficulty settings
    maxValue: difficultySettings.maxValue,
    maxMultiplyValue: difficultySettings.maxMultiplyValue,
    maxDivideValue: difficultySettings.maxDivideValue,
    allowedOperations: difficultySettings.allowedOperations,
    
    // Actions
    setUserAnswer: gameState.setUserAnswer,
    setShowDifficultyDialog: gameFlow.setShowDifficultyDialog,
    checkAnswer: answerHandler.checkAnswer,
    handleKeyPress: answerHandler.handleKeyPress,
    startNewGame,
    endGame,
    toggleOperation,
    setDifficulty,
  };
};
