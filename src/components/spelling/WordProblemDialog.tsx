
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { renderWordWithCurrentGap } from "@/utils/spellingUtils";
import { Star } from "lucide-react";

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
  
  const handleEndGame = () => {
    onEndGame();
    onOpenChange(false);
  };

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleEndGame()}>
      <DialogContent className="z-[8000] bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Doplňte správné i/y
            <Star className="h-5 w-5 text-yellow-400" />
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {displayedWord && (
            <div className="space-y-4">
              <p className="text-center font-medium bg-yellow-100 py-2 px-4 rounded-lg border border-yellow-200 shadow-sm">
                {isPhrase ? "Věta/spojení" : `Vyjmenované slovo po ${wordGroup}`}
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300 shadow-inner">
                <p className="text-2xl font-bold text-center mb-4 whitespace-pre-wrap">
                  {renderWordWithCurrentGap(currentWord, missingPositions, correctLetters, currentPosition)}
                </p>
              </div>
              <p className="text-center text-gray-600 italic">
                Doplňte pouze písmeno i/y na zvýrazněné místo
              </p>

              {/* In-game statistics - same as math game */}
              {totalAnswers > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-500">Správně: {correctAnswers}</span>
                    <span className="text-red-500">Špatně: {wrongAnswers}</span>
                  </div>
                  <Progress value={correctPercentage} className="h-2" />
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center items-center gap-6 mt-6">
            <Button 
              onClick={onAnswerI}
              className="text-3xl px-8 py-6 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform"
              size="lg"
            >
              i
            </Button>
            <Button 
              onClick={onAnswerY}
              className="text-3xl px-8 py-6 bg-green-500 hover:bg-green-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform"
              size="lg"
            >
              y
            </Button>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleEndGame}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 rounded-lg shadow-md"
          >
            Ukončit hru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
