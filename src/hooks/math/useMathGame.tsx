
import { useGameState } from "./useGameState";
import { useDifficultySettings } from "./useDifficultySettings";
import { useProblemGenerator } from "./useProblemGenerator";
import { useGameActions } from "./useGameActions";

export function useMathGame() {
  const gameState = useGameState();
  
  const problemGenerator = useProblemGenerator({ 
    maxValue: gameState.maxValue, 
    allowedOperations: gameState.allowedOperations 
  });
  
  const difficultySettings = useDifficultySettings({
    allowedOperations: gameState.allowedOperations,
    setAllowedOperations: gameState.setAllowedOperations,
    maxValue: gameState.maxValue,
    setDifficultySet: gameState.setDifficultySet,
    setShowDifficultyDialog: gameState.setShowDifficultyDialog,
  });
  
  const gameActions = useGameActions({
    difficultySet: gameState.difficultySet,
    setProblemCount: gameState.setProblemCount,
    setCurrentProblem: gameState.setCurrentProblem,
    setShowProblem: gameState.setShowProblem,
    setUserAnswer: gameState.setUserAnswer,
    setGameEnded: gameState.setGameEnded,
    setShowAnimation: gameState.setShowAnimation,
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    setLastAnswerCorrect: gameState.setLastAnswerCorrect,
    setCorrectAnswers: gameState.setCorrectAnswers,
    setWrongAnswers: gameState.setWrongAnswers,
    setShowConfetti: gameState.setShowConfetti,
    setShowProblem: gameState.setShowProblem,
    generateProblem: problemGenerator.generateProblem,
    correctAnswers: gameState.correctAnswers,
    setDifficultySet: gameState.setDifficultySet,
  });

  return {
    // Game state
    ...gameState,
    
    // Actions
    ...gameActions,
    ...difficultySettings,
  };
}
