
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface UseGameControlsProps {
  selectedGroups: string[];
  correctAnswers: number;
  wrongAnswers: number;
  showProblem: boolean;
  setShowGroupDialog: (show: boolean) => void;
  setShowStatsDialog: (show: boolean) => void;
  generateNewProblem: () => any;
  incrementProblemCount: () => void;
  setCorrectAnswers: (count: number) => void;
  setWrongAnswers: (count: number) => void;
  setShowProblem: (show: boolean) => void;
  saveSpellingStatistics?: any;
  userId?: string | null;
}

export const useGameControls = ({
  selectedGroups,
  correctAnswers,
  wrongAnswers,
  showProblem,
  setShowGroupDialog,
  setShowStatsDialog,
  generateNewProblem,
  incrementProblemCount,
  setCorrectAnswers,
  setWrongAnswers,
  setShowProblem,
  saveSpellingStatistics,
  userId
}: UseGameControlsProps) => {
  const { toast } = useToast();

  // Start new game handler
  const startNewGame = useCallback(() => {
    if (selectedGroups.length === 0) {
      setShowGroupDialog(true);
      return;
    }
    
    incrementProblemCount();
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setShowProblem(false);
    
    const problem = generateNewProblem();
    if (problem) {
      setShowProblem(true);
    }
  }, [
    selectedGroups, 
    generateNewProblem, 
    incrementProblemCount, 
    setCorrectAnswers, 
    setWrongAnswers, 
    setShowProblem, 
    setShowGroupDialog
  ]);

  // End game handler
  const endGame = useCallback(() => {
    setShowProblem(false);
    setShowStatsDialog(true);
    
    // Save statistics if user is logged in
    if (userId && saveSpellingStatistics && (correctAnswers > 0 || wrongAnswers > 0)) {
      saveSpellingStatistics.mutate({
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        wordGroup: selectedGroups.join(',')
      });
    }
  }, [
    correctAnswers, 
    wrongAnswers, 
    setShowStatsDialog, 
    selectedGroups, 
    saveSpellingStatistics, 
    userId,
    setShowProblem
  ]);

  return {
    startNewGame,
    endGame
  };
};
