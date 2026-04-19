
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
    minValue: difficultySettings.minValue,
    maxValue: difficultySettings.maxValue,
    mulDivMin: difficultySettings.mulDivMin,
    mulDivMax: difficultySettings.mulDivMax,
    usedProblems: gameState.usedProblems,
    setUsedProblems: gameState.setUsedProblems
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
    minValue: difficultySettings.minValue,
    maxValue: difficultySettings.maxValue,
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
    
    // Use gameFlow to start the game properly
    gameFlow.startNewGame();
  }, [gameState, gameFlow]);

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
    gameFlow.setShowDifficultyDialog(false);
  }, [difficultySettings, gameFlow]);

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
    minValue: difficultySettings.minValue,
    maxValue: difficultySettings.maxValue,
    allowedOperations: difficultySettings.allowedOperations,
    
    // Actions
    setUserAnswer: gameState.setUserAnswer,
    setShowProblem: gameFlow.setShowProblem,
    setShowDifficultyDialog: gameFlow.setShowDifficultyDialog,
    setShowStatsDialog: gameFlow.setShowStatsDialog,
    checkAnswer: answerHandler.checkAnswer,
    handleKeyPress: answerHandler.handleKeyPress,
    startNewGame,
    endGame,
    toggleOperation,
    setDifficulty,
    setMinValue: difficultySettings.setMinValue,
    setMaxValue: difficultySettings.setMaxValue,
  };
};
