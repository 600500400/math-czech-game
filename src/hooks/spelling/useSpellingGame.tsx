
import { useState, useCallback } from "react";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";
import { useGroupSelection } from "./useGroupSelection";
import { useGameStatistics } from "./useGameStatistics";
import { useWordProblem } from "./useWordProblem";
import { useAnimationState } from "./useAnimationState";

export const useSpellingGame = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { saveSpellingStatistics } = useStatistics(userId);
  
  // Reuse existing hooks
  const groupSelection = useGroupSelection();
  const gameStats = useGameStatistics();
  
  // New specialized hooks
  const [problemCount, setProblemCount] = useState(10);
  const [showProblem, setShowProblem] = useState(false);
  const animation = useAnimationState();
  
  // Word problem handling
  const wordProblem = useWordProblem({
    selectedGroups: groupSelection.selectedGroups,
    onCorrectAnswer: gameStats.incrementCorrect,
    onWrongAnswer: gameStats.incrementWrong,
    showAnimation: animation.showAnimation,
    setLastAnswerCorrect: animation.setLastAnswerCorrect,
    setShowAnimation: animation.setShowAnimation
  });

  // End game handler
  const endGame = useCallback(() => {
    setShowProblem(false);
    gameStats.setShowStatsDialog(true);
    
    // Save statistics if user is logged in
    if (userId && (gameStats.correctAnswers > 0 || gameStats.wrongAnswers > 0)) {
      saveSpellingStatistics.mutate({
        correctAnswers: gameStats.correctAnswers,
        wrongAnswers: gameStats.wrongAnswers,
        wordGroup: groupSelection.selectedGroups.join(',')
      });
    }
  }, [
    gameStats.correctAnswers, 
    gameStats.wrongAnswers, 
    gameStats.setShowStatsDialog, 
    groupSelection.selectedGroups, 
    saveSpellingStatistics, 
    userId
  ]);

  // Start new game handler
  const startNewGame = useCallback(() => {
    if (groupSelection.selectedGroups.length === 0) {
      groupSelection.setShowGroupDialog(true);
      return;
    }
    
    gameStats.incrementProblemCount();
    gameStats.setCorrectAnswers(0);
    gameStats.setWrongAnswers(0);
    setProblemCount(10); // Reset problem count
    
    const problem = wordProblem.generateNewProblem();
    if (problem) {
      setShowProblem(true);
    }
  }, [gameStats, groupSelection, wordProblem]);

  return {
    // Game statistics
    correctAnswers: gameStats.correctAnswers,
    wrongAnswers: gameStats.wrongAnswers,
    problemCount,
    
    // Word problem state
    currentWord: wordProblem.currentWord,
    displayedWord: wordProblem.displayedWord,
    wordGroup: wordProblem.wordGroup,
    isPhrase: wordProblem.isPhrase,
    correctLetters: wordProblem.correctLetters,
    missingPositions: wordProblem.missingPositions,
    currentPosition: wordProblem.currentPosition,
    
    // Dialog visibility
    showProblem,
    showGroupDialog: groupSelection.showGroupDialog,
    showStatsDialog: gameStats.showStatsDialog,
    
    // Animation state
    lastAnswerCorrect: animation.lastAnswerCorrect,
    showAnimation: animation.showAnimation,
    
    // Group selection
    selectedGroups: groupSelection.selectedGroups,
    
    // Handlers and actions
    totalAnswers: gameStats.totalAnswers,
    setShowGroupDialog: groupSelection.setShowGroupDialog,
    setShowStatsDialog: gameStats.setShowStatsDialog,
    toggleGroup: groupSelection.toggleGroup,
    setGroups: groupSelection.setGroups,
    selectAll: groupSelection.selectAll,
    deselectAll: groupSelection.deselectAll,
    startNewGame,
    handleAnswerI: wordProblem.handleAnswerI,
    handleAnswerY: wordProblem.handleAnswerY,
    endGame,
  };
};
