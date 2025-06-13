
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Problem } from "@/types/mathTypes";
import NumericKeyboard from "./NumericKeyboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTouchGestures } from "@/hooks/useTouchGestures";
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
  correctPercentage
}) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic, triggerSuccessHaptic } = useMobileInteractions();

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
    triggerSuccessHaptic();
    checkAnswer();
  };

  // Touch gestures for navigation
  const { elementRef } = useTouchGestures({
    onSwipeRight: () => {
      // Could be used for navigation between problems in the future
      console.log('Swipe right detected');
    },
    onSwipeLeft: () => {
      // Could be used for navigation between problems in the future  
      console.log('Swipe left detected');
    },
    hapticFeedback: true
  });

  // Function to format operation display
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && endGame()}>
      <DialogContent 
        ref={elementRef}
        className={`z-[9000] touch-manipulation ${isMobile ? 'max-w-[95vw] max-h-[95vh] overflow-y-auto' : ''}`}
      >
        <DialogHeader>
          <DialogTitle className={isMobile ? "text-lg" : ""}>Řeš příklad</DialogTitle>
          <DialogDescription className="sr-only">
            Zde můžete řešit matematické příklady
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {currentProblem && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-dashed border-blue-200">
              <p className={`font-bold text-center mb-4 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {currentProblem.num1} {formatOperation(currentProblem.operation)} {currentProblem.num2} = ?
              </p>
            </div>
          )}
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Zadej odpověď"
            className={`text-lg touch-manipulation ${isMobile ? 'h-14 text-lg' : 'h-12'}`}
            autoFocus={!isMobile}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          
          {/* Enhanced Numeric Keyboard with better touch targets */}
          <div className="mt-4">
            <NumericKeyboard 
              onKeyPress={handleKeyboardInput}
              onClear={handleClear}
              onSubmit={handleCheckAnswer}
            />
          </div>
          
          {/* In-game statistics */}
          {totalAnswers > 0 && (
            <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Správně: {correctAnswers}
                </span>
                <span className="text-red-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Špatně: {wrongAnswers}
                </span>
              </div>
              <Progress value={correctPercentage} className="h-3" />
              <p className="text-xs text-center text-gray-600">
                {correctPercentage}% úspěšnost
              </p>
            </div>
          )}
        </div>
        <DialogFooter className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <Button 
            onClick={handleCheckAnswer}
            className={`bg-orange-500 hover:bg-orange-600 active:bg-orange-700 touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'w-full h-14 text-lg' : 'w-auto h-12'}`}
            disabled={!userAnswer.trim()}
          >
            ✓ Odpovědět
          </Button>
          <Button 
            onClick={handleEndGame}
            variant="outline"
            className={`bg-red-50 hover:bg-red-100 active:bg-red-200 border-red-200 text-red-700 touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'w-full h-14 text-lg' : 'w-auto h-12'}`}
          >
            ✕ Ukončit hru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDialog;
