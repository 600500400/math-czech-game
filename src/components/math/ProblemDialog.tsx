
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Problem } from "@/types/mathTypes";
import NumericKeyboard from "./NumericKeyboard";

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
  const handleKeyboardInput = (key: string) => {
    setUserAnswer(userAnswer + key);
  };

  const handleClear = () => {
    setUserAnswer("");
  };
  
  const handleEndGame = () => {
    endGame();
  };

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
      <DialogContent className="z-[9000]">
        <DialogHeader>
          <DialogTitle>Řeš příklad</DialogTitle>
          <DialogDescription className="sr-only">
            Zde můžete řešit matematické příklady
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {currentProblem && (
            <p className="text-2xl font-bold text-center mb-4">
              {currentProblem.num1} {formatOperation(currentProblem.operation)} {currentProblem.num2} = ?
            </p>
          )}
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Zadej odpověď"
            className="text-lg"
            autoFocus
          />
          
          {/* Numeric Keyboard */}
          <div className="mt-4">
            <NumericKeyboard 
              onKeyPress={handleKeyboardInput}
              onClear={handleClear}
              onSubmit={checkAnswer}
            />
          </div>
          
          {/* In-game statistics */}
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
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={checkAnswer}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
          >
            Odpovědět
          </Button>
          <Button 
            onClick={handleEndGame}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
          >
            Ukončit hru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDialog;
