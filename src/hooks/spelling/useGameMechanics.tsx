
import { useCallback } from "react";
import { useWordProblem } from "./useWordProblem";
import { useGroupSelection } from "./useGroupSelection";
import { useGameStatistics } from "./useGameStatistics";
import { useAnimationState } from "./useAnimationState";
import { useGameUI } from "./useGameUI";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";

export const useGameMechanics = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { saveSpellingStatistics } = useStatistics(userId);
  
  // Specialized hooks for different concerns
  const groupSelection = useGroupSelection();
  const gameStats = useGameStatistics();
  const animation = useAnimationState();
  const gameUI = useGameUI();
  
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
    gameUI.setShowProblem(false);
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
    userId,
    gameUI
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
    gameUI.resetGame();
    
    const problem = wordProblem.generateNewProblem();
    if (problem) {
      gameUI.setShowProblem(true);
    }
  }, [gameStats, groupSelection, wordProblem, gameUI]);

  return {
    // Game control functions
    startNewGame,
    endGame,
    
    // Components from individual hooks
    ...gameStats,
    ...groupSelection,
    ...animation,
    ...wordProblem,
    ...gameUI
  };
};
