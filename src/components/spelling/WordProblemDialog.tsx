
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";
import { GlassDialog } from "@/components/ui/glass-morphism";
import { HoverScale, GlowingElement } from "@/components/ui/microanimations";

interface WordProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEndGame: () => void;
  displayedWord: string;
  currentWord: string;
  isPhrase: boolean;
  wordGroup: string;
  missingPositions: number[];
  correctLetters: string[];
  currentPosition: number;
  handleAnswerI: () => void;
  handleAnswerY: () => void;
  correctAnswers: number;
  wrongAnswers: number;
}

const WordProblemDialog: React.FC<WordProblemDialogProps> = ({
  open,
  onOpenChange,
  onEndGame,
  displayedWord,
  currentWord,
  isPhrase,
  wordGroup,
  missingPositions,
  correctLetters,
  currentPosition,
  handleAnswerI,
  handleAnswerY,
  correctAnswers,
  wrongAnswers
}) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic } = useMobileInteractions({ hapticsEnabled: true, preventZoom: true });

  const handleTakeBreak = () => {
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
    <Dialog open={open} onOpenChange={(open) => !open && onEndGame()}>
      <DialogContent className={`z-[9000] touch-manipulation overflow-hidden ${isMobile ? 'max-w-[95vw] max-h-[95vh] overflow-y-auto' : ''}`}>
        <GlassDialog className="p-0 border-0 bg-transparent">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className={`text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Doplň správné písmeno
              </DialogTitle>
              <DialogDescription className="sr-only">
                Zde můžete doplňovat správná písmena do slov
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <HoverScale>
                <GlowingElement color="purple" className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-lg">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600 font-medium">
                      {wordGroup} • {isPhrase ? 'Spojení' : 'Slovo'}
                    </p>
                    <p className={`font-mono font-bold tracking-wider bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                      {displayedWord}
                    </p>
                  </div>
                </GlowingElement>
              </HoverScale>

              {/* Choice buttons */}
              <div className="flex justify-center gap-4">
                <HoverScale>
                  <Button
                    onClick={handleAnswerIWithHaptic}
                    className={`font-bold text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transform active:scale-95 transition-all duration-150 ${isMobile ? 'h-16 w-20 text-2xl' : 'h-14 w-16'}`}
                  >
                    I
                  </Button>
                </HoverScale>
                <HoverScale>
                  <Button
                    onClick={handleAnswerYWithHaptic}
                    className={`font-bold text-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white transform active:scale-95 transition-all duration-150 ${isMobile ? 'h-16 w-20 text-2xl' : 'h-14 w-16'}`}
                  >
                    Y
                  </Button>
                </HoverScale>
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

export default WordProblemDialog;
