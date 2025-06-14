
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
import { GlassDialog } from "@/components/ui/glass-morphism";
import { HoverScale, GlowingElement } from "@/components/ui/microanimations";

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
  const { triggerTapHaptic } = useMobileInteractions({ hapticsEnabled: true, preventZoom: true });

  const handleKeyboardInput = (key: string) => {
    triggerTapHaptic();
    setUserAnswer(userAnswer + key);
  };

  const handleClear = () => {
    triggerTapHaptic();
    setUserAnswer("");
  };
  
  const handleTakeBreak = () => {
    triggerTapHaptic();
    endGame();
  };

  const handleCheckAnswer = () => {
    checkAnswer();
  };

  // Touch gestures for navigation
  const { elementRef } = useTouchGestures({
    onSwipeRight: () => {
      console.log('Swipe right detected');
    },
    onSwipeLeft: () => {
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

  // Check if milestone reached for celebration
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
        ref={elementRef}
        className={`z-[9000] touch-manipulation overflow-hidden ${isMobile ? 'max-w-[95vw] max-h-[95vh] overflow-y-auto' : ''}`}
      >
        <GlassDialog className="p-0 border-0 bg-transparent">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className={`text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Řeš příklad
              </DialogTitle>
              <DialogDescription className="sr-only">
                Zde můžete řešit matematické příklady
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {currentProblem && (
                <HoverScale>
                  <GlowingElement color="blue" className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-lg">
                    <p className={`font-bold text-center mb-4 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                      {currentProblem.num1} {formatOperation(currentProblem.operation)} {currentProblem.num2} = ?
                    </p>
                  </GlowingElement>
                </HoverScale>
              )}
              
              {/* Hidden input to prevent mobile keyboard */}
              <Input
                type="text"
                value={userAnswer}
                onChange={() => {}} // No-op since we use numeric keyboard
                onKeyDown={handleKeyPress}
                placeholder="Zadej odpověď"
                className={`text-lg touch-manipulation glass-light border-white/30 ${isMobile ? 'h-14 text-lg' : 'h-12'}`}
                readOnly={isMobile} // Prevent mobile keyboard
                inputMode={isMobile ? "none" : "numeric"} // Disable mobile keyboard
                style={{ caretColor: 'transparent' }} // Hide cursor on mobile
              />
              
              {/* Enhanced Numeric Keyboard */}
              <div className="mt-4">
                <NumericKeyboard 
                  onKeyPress={handleKeyboardInput}
                  onClear={handleClear}
                  onSubmit={handleCheckAnswer}
                  disabled={!userAnswer.trim()}
                />
              </div>
              
              {/* Milestone celebration */}
              {getMilestoneMessage() && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200 text-center">
                  <p className="text-lg font-semibold text-green-700">
                    {getMilestoneMessage()}
                  </p>
                </div>
              )}
              
              {/* Enhanced in-game statistics */}
              {totalAnswers > 0 && (
                <div className="mt-4 space-y-2 glass-light p-4 rounded-lg border border-white/20">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Správně: {correctAnswers}
                    </span>
                    <span className="text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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
              <HoverScale>
                <Button 
                  onClick={handleTakeBreak}
                  variant="outline"
                  className={`glass-light border-orange-200/50 text-orange-700 hover:bg-orange-100/50 active:scale-95 touch-manipulation transform transition-all duration-150 ${isMobile ? 'w-full h-14 text-lg' : 'w-auto h-12'}`}
                >
                  ⏸️ Přestávka
                </Button>
              </HoverScale>
            </DialogFooter>
          </div>
        </GlassDialog>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDialog;
