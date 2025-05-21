
import { useGameMechanics } from "./useGameMechanics";

export const useSpellingGame = () => {
  const gameMechanics = useGameMechanics();
  
  return {
    // Game statistics
    correctAnswers: gameMechanics.correctAnswers,
    wrongAnswers: gameMechanics.wrongAnswers,
    problemCount: gameMechanics.problemCount,
    
    // Word problem state
    currentWord: gameMechanics.currentWord,
    displayedWord: gameMechanics.displayedWord,
    wordGroup: gameMechanics.wordGroup,
    isPhrase: gameMechanics.isPhrase,
    correctLetters: gameMechanics.correctLetters,
    missingPositions: gameMechanics.missingPositions,
    currentPosition: gameMechanics.currentPosition,
    
    // Dialog visibility
    showProblem: gameMechanics.showProblem,
    showGroupDialog: gameMechanics.showGroupDialog,
    showStatsDialog: gameMechanics.showStatsDialog,
    
    // Animation state
    lastAnswerCorrect: gameMechanics.lastAnswerCorrect,
    showAnimation: gameMechanics.showAnimation,
    
    // Group selection
    selectedGroups: gameMechanics.selectedGroups,
    
    // Handlers and actions
    totalAnswers: gameMechanics.totalAnswers,
    setShowGroupDialog: gameMechanics.setShowGroupDialog,
    setShowStatsDialog: gameMechanics.setShowStatsDialog,
    toggleGroup: gameMechanics.toggleGroup,
    setGroups: gameMechanics.setGroups,
    selectAll: gameMechanics.selectAll,
    deselectAll: gameMechanics.deselectAll,
    startNewGame: gameMechanics.startNewGame,
    handleAnswerI: gameMechanics.handleAnswerI,
    handleAnswerY: gameMechanics.handleAnswerY,
    endGame: gameMechanics.endGame,
  };
};
