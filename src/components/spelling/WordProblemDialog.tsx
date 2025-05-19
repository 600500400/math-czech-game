
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { renderWordWithCurrentGap } from "@/utils/spellingUtils";

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
  onEndGame
}: WordProblemDialogProps) => {
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onEndGame()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Doplňte správné i/y</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {displayedWord && (
            <div className="space-y-4">
              <p className="text-center font-medium">
                {isPhrase ? "Věta/spojení" : `Vyjmenované slovo po ${wordGroup}`}
              </p>
              <p className="text-2xl font-bold text-center mb-4 whitespace-pre-wrap">
                {renderWordWithCurrentGap(currentWord, missingPositions, correctLetters, currentPosition)}
              </p>
              <p className="text-center text-gray-600">
                Doplňte pouze písmeno i/y na zvýrazněné místo
              </p>
            </div>
          )}
          <div className="flex justify-center items-center gap-4">
            <Button 
              onClick={onAnswerI}
              className="text-2xl px-6 py-4 bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              i
            </Button>
            <Button 
              onClick={onAnswerY}
              className="text-2xl px-6 py-4 bg-green-500 hover:bg-green-600"
              size="lg"
            >
              y
            </Button>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onEndGame}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
          >
            Ukončit hru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
