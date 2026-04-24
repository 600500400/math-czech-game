import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";

interface WordProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndGame: () => void;
  displayedWord: string;
  currentWord: string;
  isPhrase: boolean;
  wordGroup: string;
  wordType?: string;
  missingPositions: number[];
  correctLetters: string[];
  currentPosition: number;
  handleAnswerI: () => void;
  handleAnswerY: () => void;
  correctAnswers: number;
  wrongAnswers: number;
  lastAnswerCorrect?: boolean | null;
}

const WordProblemDialog: React.FC<WordProblemDialogProps> = ({
  open,
  onOpenChange,
  onEndGame,
  displayedWord,
  currentWord,
  isPhrase,
  wordGroup,
  wordType,
  missingPositions,
  correctLetters,
  currentPosition,
  handleAnswerI,
  handleAnswerY,
  correctAnswers,
  wrongAnswers,
  lastAnswerCorrect,
}) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic } = useMobileInteractions({ hapticsEnabled: true, preventZoom: true });

  const handleEndGame = () => {
    triggerTapHaptic();
    onEndGame();
  };

  const handleAnswerIWithHaptic = () => {
    triggerTapHaptic();
    handleAnswerI();
  };

  const handleAnswerYWithHaptic = () => {
    triggerTapHaptic();
    handleAnswerY();
  };

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const getMilestoneMessage = () => {
    const milestones = [5, 10, 15, 20, 25, 30, 50, 100];
    const currentMilestone = milestones.find(m => correctAnswers === m);
    if (currentMilestone) {
      return `🎉 Skvělé! Máš ${currentMilestone} správných odpovědí!`;
    }
    return null;
  };

  const isAnswered = lastAnswerCorrect !== null && lastAnswerCorrect !== undefined;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onEndGame()}>
      <DialogContent className={`z-[9000] touch-manipulation ${isMobile ? 'max-w-[95vw] max-h-[95vh] overflow-y-auto' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-center text-subject-spelling ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Doplň správné písmeno
          </DialogTitle>
          <DialogDescription className="sr-only">
            Zde můžete doplňovat správná písmena do slov
          </DialogDescription>
          {wordGroup && (
            <p className="text-center text-xs text-muted-foreground mt-1">
              Skupina: <span className="font-semibold">{wordGroup}</span>
              {isPhrase && <span className="ml-1">· věta</span>}
            </p>
          )}
        </DialogHeader>

        {/* Hint po správné odpovědi */}
        {lastAnswerCorrect === true && wordType && !isPhrase && (
          <div className={`mt-2 p-2 rounded-lg text-center border ${
            wordType === "kontrastní"
              ? "bg-subject-math-light border-subject-math-border"
              : "bg-subject-spelling-light border-subject-spelling-border"
          }`}>
            <p className={`text-sm ${
              wordType === "kontrastní" ? "text-subject-math" : "text-subject-spelling"
            }`}>
              ✓ <span className="font-semibold">{currentWord}</span>
              {" — "}
              {wordType === "vyjmenované" && `vyjmenované slovo po ${wordGroup} → tvrdé Y`}
              {wordType === "příbuzné" && `příbuzné slovo k vyjmenovaným po ${wordGroup} → tvrdé Y`}
              {wordType === "odvozené" && `slovo s tvrdým Y po ${wordGroup}`}
              {wordType === "kontrastní" && `NENÍ vyjmenované slovo → měkké I`}
            </p>
          </div>
        )}

        <div className="py-4 space-y-4">
          <div className="bg-muted/40 p-6 rounded-xl border border-border">
            <div className="text-center">
              <p className={`font-mono font-bold tracking-wider text-foreground ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {displayedWord.split(/([IY])/g).filter(Boolean).map((part, index) => {
                  if (part === 'I') {
                    return <span key={index} className="text-subject-math">i</span>;
                  }
                  if (part === 'Y') {
                    return <span key={index} className="text-warning-600">y</span>;
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
            </div>
          </div>

          {/* Choice buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleAnswerIWithHaptic}
              disabled={isAnswered}
              className={`font-bold text-xl bg-subject-math hover:opacity-90 active:scale-95 text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'h-16 w-20 text-2xl' : 'h-14 w-16'}`}
            >
              I
            </Button>
            <Button
              onClick={handleAnswerYWithHaptic}
              disabled={isAnswered}
              className={`font-bold text-xl bg-warning-500 hover:opacity-90 active:scale-95 text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'h-16 w-20 text-2xl' : 'h-14 w-16'}`}
            >
              Y
            </Button>
          </div>

          {/* Milestone celebration */}
          {getMilestoneMessage() && (
            <div className="mt-4 p-4 bg-success-50 rounded-lg border border-success-100 text-center animate-scale-in">
              <p className="text-lg font-semibold text-success-600">
                {getMilestoneMessage()}
              </p>
            </div>
          )}

          {/* In-game statistics */}
          {totalAnswers > 0 && (
            <div className="mt-4 space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-success-600">Správně: {correctAnswers}</span>
                <span className="text-destructive">Špatně: {wrongAnswers}</span>
              </div>
              <Progress value={correctPercentage} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">
                {correctPercentage}% úspěšnost
              </p>
            </div>
          )}
        </div>

        <DialogFooter className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <Button
            onClick={handleEndGame}
            variant="outline"
            className={`active:scale-95 touch-manipulation transition-all duration-150 ${isMobile ? 'w-full h-14 text-lg' : 'w-auto h-12'}`}
          >
            Ukončit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WordProblemDialog;
