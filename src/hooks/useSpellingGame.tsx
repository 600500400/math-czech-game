
import { useGroupSelection } from "./spelling/useGroupSelection";
import { useGameStatistics } from "./spelling/useGameStatistics";
import { useGameMechanics } from "./spelling/useGameMechanics";
import { SpellingGameState } from "@/types/spellingTypes";

export type { SpellingGameState };

export function useSpellingGame() {
  const {
    selectedGroups,
    showGroupDialog,
    setShowGroupDialog,
    toggleGroup,
    setGroups
  } = useGroupSelection();

  const {
    correctAnswers,
    wrongAnswers,
    problemCount,
    showStatsDialog,
    setShowStatsDialog,
    incrementProblemCount,
    incrementCorrect,
    incrementWrong,
    totalAnswers,
    hasStats
  } = useGameStatistics();

  const {
    currentWord,
    displayedWord,
    userAnswer,
    showProblem,
    gameEnded,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    lastAnswerCorrect,
    showAnimation,
    
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  } = useGameMechanics({
    selectedGroups,
    incrementProblemCount,
    incrementCorrect,
    incrementWrong
  });

  return {
    // Game state
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentWord,
    displayedWord,
    userAnswer,
    showProblem,
    showGroupDialog,
    showStatsDialog,
    selectedGroups,
    gameEnded,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    lastAnswerCorrect,
    showAnimation,
    totalAnswers,
    
    // Actions
    setShowGroupDialog,
    setShowStatsDialog,
    toggleGroup,
    setGroups,
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  };
}
