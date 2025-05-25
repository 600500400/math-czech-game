
import { useCallback } from "react";
import { useWordProblem } from "./useWordProblem";
import { useGroupSelection } from "./useGroupSelection";
import { useGameStatistics } from "./useGameStatistics";
import { useAnimationState } from "./useAnimationState";
import { useGameUI } from "./useGameUI";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";
import { useGameControls } from "./useGameControls";

export const useGameMechanics = () => {
  // Core authentication and statistics
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

  // Game control functions
  const gameControls = useGameControls({
    selectedGroups: groupSelection.selectedGroups,
    correctAnswers: gameStats.correctAnswers,
    wrongAnswers: gameStats.wrongAnswers,
    showProblem: gameUI.showProblem,
    setShowGroupDialog: groupSelection.setShowGroupDialog,
    setShowStatsDialog: gameStats.setShowStatsDialog,
    generateNewProblem: wordProblem.generateNewProblem,
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
    // Game control functions
    startNewGame: gameControls.startNewGame,
    endGame: gameControls.endGame,
    
    // Components from individual hooks
    ...gameStats,
    ...groupSelection,
    ...animation,
    ...wordProblem,
    ...gameUI
  };
};
