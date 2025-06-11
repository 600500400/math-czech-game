
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

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
  startGameTimer: () => void;
  resetGameTimer: () => void;
  getGameDuration: () => number;
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
  userId,
  startGameTimer,
  resetGameTimer,
  getGameDuration
}: UseGameControlsProps) => {
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
    resetGameTimer();
    startGameTimer();
    
    // Generate new problem and start the game
    generateNewProblem();
    setShowProblem(true);
  }, [
    selectedGroups, 
    generateNewProblem, 
    incrementProblemCount, 
    setCorrectAnswers, 
    setWrongAnswers, 
    setShowProblem, 
    setShowGroupDialog,
    startGameTimer,
    resetGameTimer
  ]);

  // End game handler - with single toast notification
  const endGame = useCallback(() => {
    const gameDuration = getGameDuration();
    setShowProblem(false);
    
    // Save statistics if user is logged in and there are some results
    if (userId && saveSpellingStatistics && (correctAnswers > 0 || wrongAnswers > 0)) {
      console.log("Ukládám statistiky na konci hry:", {
        correctAnswers,
        wrongAnswers,
        wordGroups: selectedGroups,
        gameDuration
      });
      
      try {
        // Pokus o uložení statistik - bez vlastní toast notifikace
        saveSpellingStatistics.mutate({
          correctAnswers: correctAnswers,
          wrongAnswers: wrongAnswers,
          wordGroup: selectedGroups.join(','),
          gameDuration: gameDuration,
          difficulty: {
            selectedGroups: selectedGroups,
            wordCount: correctAnswers + wrongAnswers
          }
        }, {
          onSuccess: () => {
            console.log("Statistiky úspěšně uloženy");
            // Nezobrazeit toast zde - už se zobrazí v useSpellingStatistics
          },
          onError: (error: any) => {
            console.error("Chyba při ukládání statistik:", error);
            // Zobrazit toast pouze při chybě
            toast.error("Statistiky nemohly být uloženy do databáze");
            
            // Záložní uložení do localStorage
            try {
              const backupKey = `emergency_spellingStats_${userId}`;
              const existingBackup = localStorage.getItem(backupKey);
              const backupArray = existingBackup ? JSON.parse(existingBackup) : [];
              
              backupArray.push({
                id: "emergency-" + Date.now(),
                correct_answers: correctAnswers,
                wrong_answers: wrongAnswers,
                word_group: selectedGroups.join(','),
                game_duration: gameDuration,
                difficulty_level: {
                  selectedGroups: selectedGroups,
                  wordCount: correctAnswers + wrongAnswers
                },
                created_at: new Date().toISOString(),
                error: error.message || "Unknown error"
              });
              
              localStorage.setItem(backupKey, JSON.stringify(backupArray));
            } catch (backupError) {
              console.error("Ani záložní uložení se nepodařilo:", backupError);
            }
          }
        });
      } catch (error) {
        console.error("Neočekávaná chyba při volání mutace:", error);
        toast.error("Nastala chyba při ukládání statistik");
      }
    }
    
    resetGameTimer();
  }, [
    correctAnswers, 
    wrongAnswers, 
    selectedGroups, 
    saveSpellingStatistics, 
    userId,
    setShowProblem,
    getGameDuration,
    resetGameTimer
  ]);

  return {
    startNewGame,
    endGame
  };
};
