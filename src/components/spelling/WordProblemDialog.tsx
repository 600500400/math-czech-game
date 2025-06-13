
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { renderWordWithCurrentGap } from "@/utils/spellingUtils";
import { Star } from "lucide-react";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";
import { useIsMobile } from "@/hooks/use-mobile";

interface WordProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayedWord: string;
  currentWord: string;
  isPhrase: boolean;
  wordGroup: string;
  missingPositions: number[];
  correctLetters: string[];
  currentPosition: number;
  onAnswerI: () => void;
  onAnswerY: () => void;
  onEndGame: () => void;
  correctAnswers?: number;
  wrongAnswers?: number;
}

export const WordProblemDialog = ({
  open,
  onOpenChange,
  displayedWord,
  currentWord,
  isPhrase,
  wordGroup,
  missingPositions,
  correctLetters,
  currentPosition,
  onAnswerI,
  onAnswerY,
  onEndGame,
  correctAnswers = 0,
  wrongAnswers = 0
}: WordProblemDialogProps) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic, triggerSuccessHaptic } = useMobileInteractions();
  
  const handleEndGame = () => {
    triggerTapHaptic();
    onEndGame();
    onOpenChange(false);
  };

  const handleAnswerI = () => {
    triggerSuccessHaptic();
    onAnswerI();
  };

  const handleAnswerY = () => {
    triggerSuccessHaptic();
    onAnswerY();
  };

  // Touch gestures for answer selection
  const { elementRef } = useTouchGestures({
    onSwipeLeft: handleAnswerI,
    onSwipeRight: handleAnswerY,
    hapticFeedback: true,
    threshold: 60
  });

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleEndGame()}>
      <DialogContent 
        ref={elementRef}
        className={`z-[8000] bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 rounded-xl shadow-xl touch-manipulation ${isMobile ? 'max-w-[95vw] max-h-[95vh]' : ''}`}
      >
        <DialogHeader>
          <DialogTitle className={`text-center font-bold text-blue-600 flex items-center justify-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Star className="h-5 w-5 text-yellow-400" />
            Doplňte správné i/y
            <Star className="h-5 w-5 text-yellow-400" />
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {displayedWord && (
            <div className="space-y-4">
              <p className={`text-center font-medium bg-yellow-100 py-3 px-4 rounded-lg border border-yellow-200 shadow-sm ${isMobile ? 'text-sm' : ''}`}>
                {isPhrase ? "Věta/spojení" : `Vyjmenované slovo po ${wordGroup}`}
              </p>
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-blue-300 shadow-inner">
                <p className={`font-bold text-center mb-4 whitespace-pre-wrap ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  {renderWordWithCurrentGap(currentWord, missingPositions, correctLetters, currentPosition)}
                </p>
              </div>
              
              {/* Mobile swipe instructions */}
              {isMobile && (
                <div className="text-center text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  💡 Tip: Můžete přejet doleva pro "i" nebo doprava pro "y"
                </div>
              )}
              
              <p className="text-center text-gray-600 italic text-sm">
                Doplňte pouze písmeno i/y na zvýrazněné místo
              </p>

              {/* Enhanced in-game statistics */}
              {totalAnswers > 0 && (
                <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between font-medium">
                    <span className="text-green-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Správně: {correctAnswers}
                    </span>
                    <span className="text-red-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
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
          )}
          
          {/* Enhanced answer buttons with better touch targets */}
          <div className={`flex justify-center items-center gap-8 mt-6 ${isMobile ? 'gap-6' : ''}`}>
            <Button 
              onClick={handleAnswerI}
              className={`font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150 touch-manipulation ${isMobile ? 'text-4xl px-12 py-8' : 'text-3xl px-8 py-6'}`}
              size="lg"
            >
              i
            </Button>
            <Button 
              onClick={handleAnswerY}
              className={`font-bold bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150 touch-manipulation ${isMobile ? 'text-4xl px-12 py-8' : 'text-3xl px-8 py-6'}`}
              size="lg"
            >
              y
            </Button>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleEndGame}
            variant="outline"
            className={`bg-red-50 hover:bg-red-100 active:bg-red-200 border-red-200 text-red-700 rounded-lg shadow-md touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'w-full h-12' : 'w-auto'}`}
          >
            ✕ Ukončit hru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
