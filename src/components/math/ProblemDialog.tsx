import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Problem } from "@/types/mathTypes";
import NumericKeyboard from "./NumericKeyboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";

interface ProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProblem: Problem | null;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  checkAnswer: () => void;
  endGame: () => void;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  correctPercentage: number;
}

const ProblemDialog: React.FC<ProblemDialogProps> = ({
  open,
  onOpenChange,
  currentProblem,
  userAnswer,
  setUserAnswer,
  handleKeyPress,
  checkAnswer,
  endGame,
  correctAnswers,
  wrongAnswers,
  totalAnswers,
  correctPercentage,
}) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic } = useMobileInteractions({ hapticsEnabled: true, preventZoom: true });

  const handleKeyboardInput = (key: string) => {
    triggerTapHaptic();
    setUserAnswer(userAnswer + key);
  };

  const handleClear = () => {
    triggerTapHaptic();
    setUserAnswer("");
  };

  const handleEndGame = () => {
    triggerTapHaptic();
    endGame();
  };

  const handleCheckAnswer = () => {
    checkAnswer();
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      triggerTapHaptic();
      setUserAnswer(userAnswer + e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      triggerTapHaptic();
      setUserAnswer(userAnswer.slice(0, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (userAnswer.trim()) {
        handleCheckAnswer();
      }
    }
  };

  const formatOperation = (operation: string): string => {
    switch (operation) {
      case "*":
        return "·";
      case "/":
        return ":";
      default:
        return operation;
    }
  };

  const getMilestoneMessage = () => {
    const milestones = [5, 10, 15, 20, 25, 30, 50, 100];
    const currentMilestone = milestones.find(m => correctAnswers === m);
    if (currentMilestone) {
      return `🎉 Skvělé! Máš ${currentMilestone} správných odpovědí!`;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && endGame()}>
      <DialogContent
        className={`z-[9000] touch-manipulation ${isMobile ? 'max-w-[95vw] max-h-[95vh] overflow-y-auto' : ''}`}
      >
        <DialogHeader>
          <DialogTitle className={`text-center text-subject-math ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Řeš příklad
          </DialogTitle>
          <DialogDescription className="sr-only">
            Zde můžete řešit matematické příklady
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {currentProblem && (
            <div className="bg-muted/40 p-6 rounded-xl border border-border">
              <p className={`font-bold text-center text-foreground ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {currentProblem.num1} {formatOperation(currentProblem.operation)} {currentProblem.num2} = ?
              </p>
            </div>
          )}

          <Input
            type="text"
            value={userAnswer}
            onChange={() => {}}
            onKeyDown={handleNumericKeyDown}
            placeholder="Zadej odpověď"
            className={`text-lg touch-manipulation ${isMobile ? 'h-14 text-lg' : 'h-12'}`}
            readOnly={isMobile}
            inputMode={isMobile ? "none" : "numeric"}
            style={{ caretColor: 'transparent' }}
          />

          <div className="mt-4">
            <NumericKeyboard
              onKeyPress={handleKeyboardInput}
              onClear={handleClear}
              onSubmit={handleCheckAnswer}
              disabled={!userAnswer.trim()}
            />
          </div>

          {getMilestoneMessage() && (
            <div className="mt-4 p-4 bg-success-50 rounded-lg border border-success-100 text-center animate-scale-in">
              <p className="text-lg font-semibold text-success-600">
                {getMilestoneMessage()}
              </p>
            </div>
          )}

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

export default ProblemDialog;
