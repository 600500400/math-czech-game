
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Operation = "+" | "-" | "*" | "/";
type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  result: number;
};

const MathPractice = () => {
  const { toast } = useToast();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showProblem, setShowProblem] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [maxValue, setMaxValue] = useState(10);
  const [difficultySet, setDifficultySet] = useState(false);
  const [allowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);
  const [gameEnded, setGameEnded] = useState(false);

  const setDifficulty = () => {
    if (maxValue > 0) {
      setDifficultySet(true);
      setShowDifficultyDialog(false);
      toast({
        title: "Obtížnost nastavena",
        description: `Maximální hodnota pro sčítání a odčítání: ${maxValue}`,
      });
    } else {
      toast({
        title: "Chyba",
        description: "Zadejte platnou hodnotu větší než 0.",
        variant: "destructive",
      });
    }
  };

  const generateProblem = (): Problem => {
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)] as Operation;
    let num1, num2, result;

    switch (operation) {
      case "*":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 * num2;
        break;
      case "+":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        result = num1 + num2;
        break;
      case "/":
        num2 = Math.floor(Math.random() * 10) + 1; // Ensure divisor is not zero
        num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Ensure clean division
        result = num1 / num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        result = num1 - num2;
        break;
    }

    return { num1, num2, operation, result };
  };

  const startNewGame = () => {
    if (!difficultySet) {
      toast({
        title: "Chyba",
        description: "Nejdříve nastavte obtížnost.",
        variant: "destructive",
      });
      return;
    }

    setProblemCount((prev) => prev + 1);
    setCurrentProblem(generateProblem());
    setShowProblem(true);
    setUserAnswer("");
    setGameEnded(false);
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    const answer = parseFloat(userAnswer);
    
    if (answer === currentProblem.result) {
      toast({
        title: "Správně!",
        variant: "default",
      });
      setCorrectAnswers((prev) => prev + 1);
    } else {
      toast({
        title: "Špatně!",
        description: `Správná odpověď byla: ${currentProblem.result}`,
        variant: "destructive",
      });
    }
    
    startNewGame();
  };

  const endGame = () => {
    setShowProblem(false);
    setGameEnded(true);
    toast({
      title: "Hra ukončena",
      description: `Počet správných odpovědí: ${correctAnswers}`,
    });
    // Reset game state
    setProblemCount(0);
    setCorrectAnswers(0);
    setDifficultySet(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-center text-orange-500">Procvičování matematiky</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          Počet příkladů: <Badge variant="outline">{problemCount}</Badge>
        </p>
        {gameEnded && (
          <p className="text-green-500 font-medium">
            Správné odpovědi: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button 
          onClick={() => setShowDifficultyDialog(true)} 
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Nastavit obtížnost
        </Button>
        
        <Button 
          onClick={startNewGame} 
          className="w-full bg-orange-500 hover:bg-orange-600" 
          disabled={!difficultySet}
        >
          Spustit hru
        </Button>
      </div>

      {/* Difficulty Dialog */}
      <Dialog open={showDifficultyDialog} onOpenChange={setShowDifficultyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nastavení obtížnosti</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">Zadej max hodnotu (+,-)</p>
            <Input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(parseInt(e.target.value) || 0)}
              min={1}
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={setDifficulty}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Nastavit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Problem Dialog */}
      <Dialog open={showProblem} onOpenChange={(open) => !open && endGame()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Řeš příklad</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {currentProblem && (
              <p className="text-2xl font-bold text-center mb-4">
                {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
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
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={checkAnswer}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            >
              Odpovědět
            </Button>
            <Button 
              onClick={endGame}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              Ukončit hru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MathPractice;
