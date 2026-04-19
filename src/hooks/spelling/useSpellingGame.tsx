
import { useCallback } from "react";
import { useGameStatistics } from "./useGameStatistics";
import { useGroupSelection } from "./useGroupSelection";
import { useAnimationState } from "./useAnimationState";
import { useWordProblem } from "./useWordProblem";
import { useGameUI } from "./useGameUI";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";
import { useGameControls } from "./useGameControls";
import { useDetailedAnswers } from "../statistics/useDetailedAnswers";

export const useSpellingGame = () => {
  // Get user authentication state
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  
  // Get statistics mutation for saving game results
  const { saveSpellingStatistics } = useStatistics(userId);
  
  // Get detailed answers hook
  const { addSpellingAnswer } = useDetailedAnswers(userId);
  
  // Specialized hooks for different concerns
  const gameStats = useGameStatistics();
  const groupSelection = useGroupSelection();
  const animation = useAnimationState();
  const gameUI = useGameUI();
  
  // Enhanced addAnswer function that saves to both game stats and detailed answers
  const enhancedAddAnswer = useCallback((answer: any) => {
    console.log("🔍 useSpellingGame: Ukládám detailní odpověď:", answer);
    gameStats.addAnswer(answer);
    addSpellingAnswer(answer);
  }, [gameStats.addAnswer, addSpellingAnswer]);
  
  // Word problem handling with dependencies
  const wordProblem = useWordProblem({
    selectedGroups: groupSelection.selectedGroups,
    onCorrectAnswer: gameStats.incrementCorrect,
    onWrongAnswer: gameStats.incrementWrong,
    showAnimation: animation.showAnimation,
    setLastAnswerCorrect: animation.setLastAnswerCorrect,
    setShowAnimation: animation.setShowAnimation,
    addAnswer: enhancedAddAnswer // Using enhanced function
  });

  // Game controls with all necessary dependencies
  const gameControls = useGameControls({
    selectedGroups: groupSelection.selectedGroups,
    correctAnswers: gameStats.correctAnswers,
    wrongAnswers: gameStats.wrongAnswers,
    showProblem: gameUI.showProblem,
    setShowGroupDialog: groupSelection.setShowGroupDialog,
    setShowStatsDialog: gameStats.setShowStatsDialog,
    generateNewProblem: wordProblem.generateNewWord,
    incrementProblemCount: gameUI.incrementProblemCount,
    setCorrectAnswers: gameStats.setCorrectAnswers,
    setWrongAnswers: gameStats.setWrongAnswers,
    setShowProblem: gameUI.setShowProblem,
    saveSpellingStatistics: saveSpellingStatistics,
    userId: userId,
    startGameTimer: gameStats.startGameTimer,
    resetGameTimer: gameStats.resetGameTimer,
    getGameDuration: gameStats.getGameDuration
  });
  
  return {
    // Game statistics
    correctAnswers: gameStats.correctAnswers,
    wrongAnswers: gameStats.wrongAnswers,
    problemCount: gameUI.problemCount,
    
    // Word problem state
    currentWord: wordProblem.currentWord,
    displayedWord: wordProblem.displayedWord,
    wordGroup: wordProblem.wordGroup,
    wordType: wordProblem.wordType,
    isPhrase: wordProblem.isPhrase,
    correctLetters: wordProblem.correctLetters,
    missingPositions: wordProblem.missingPositions,
    currentPosition: wordProblem.currentPosition,
    
    // Dialog visibility
    showProblem: gameUI.showProblem,
    showGroupDialog: groupSelection.showGroupDialog,
    showStatsDialog: gameStats.showStatsDialog,
    
    // Animation state
    lastAnswerCorrect: animation.lastAnswerCorrect,
    showAnimation: animation.showAnimation,
    
    // Group selection
    selectedGroups: groupSelection.selectedGroups,
    allSelected: groupSelection.allSelected,
    
    // Handlers and actions
    totalAnswers: gameStats.totalAnswers,
    answers: gameStats.answers,
    setShowGroupDialog: groupSelection.setShowGroupDialog,
    setShowStatsDialog: gameStats.setShowStatsDialog,
    toggleGroup: groupSelection.toggleGroup,
    setGroups: groupSelection.setGroups,
    toggleAllGroups: groupSelection.toggleAllGroups,
    selectAll: groupSelection.selectAll,
    deselectAll: groupSelection.deselectAll,
    startNewGame: gameControls.startNewGame,
    handleAnswerI: wordProblem.handleAnswerI,
    handleAnswerY: wordProblem.handleAnswerY,
    endGame: gameControls.endGame,
  };
};
