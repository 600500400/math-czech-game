import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FunGraphics } from "./spelling/FunGraphics";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";

type Operation = "+" | "-" | "*" | "/";
type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  result: number;
};

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const MathPractice = () => {
  const { toast } = useToast();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showProblem, setShowProblem] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [maxValue, setMaxValue] = useState(10);
  const [difficultySet, setDifficultySet] = useState(false);
  const [allowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);
  const [gameEnded, setGameEnded] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

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
    setShowAnimation(false);
  };

  const checkAnswer = () => {
    if (!currentProblem) return;

    const answer = parseFloat(userAnswer);
    const isCorrect = answer === currentProblem.result;
    
    // Set the result for animation
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);
    
    // Trigger confetti for correct answers
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
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
      setWrongAnswers((prev) => prev + 1);
    }
    
    // Hide animation after 1.5 seconds
    setTimeout(() => {
      setShowAnimation(false);
      // Generate new problem
      setCurrentProblem(generateProblem());
      setUserAnswer("");
    }, 1500);
  };

  const endGame = () => {
    setShowProblem(false);
    setGameEnded(true);
    toast({
      title: "Hra ukončena",
      description: `Počet správných odpovědí: ${correctAnswers}`,
    });
    // Don't reset the game stats so they can be viewed after the game
  };

  const resetGame = () => {
    // Reset game state
    setProblemCount(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setDifficultySet(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  // Chart data for statistics
  const chartData: ChartDataItem[] = [
    { name: "Správně", value: correctAnswers, color: "#4ade80" },
    { name: "Špatně", value: wrongAnswers, color: "#f87171" },
  ];

  return (
    <div className="space-y-4">
      {/* Confetti effect */}
      <ConfettiExplosion trigger={showConfetti} particleCount={30} />
      
      <h1 className="text-3xl font-bold text-center text-orange-500">Procvičování matematiky</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          Počet příkladů: <Badge variant="outline">{problemCount}</Badge>
        </p>
        <div className="flex gap-2">
          <p className="text-green-500 font-medium">
            Správné: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
          <p className="text-red-500 font-medium">
            Špatné: <Badge variant="outline">{wrongAnswers}</Badge>
          </p>
        </div>
      </div>

      {/* Progress bar for ongoing statistics */}
      {totalAnswers > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Úspěšnost</span>
            <span className="font-medium">{correctPercentage}%</span>
          </div>
          <Progress value={correctPercentage} className="h-3" />
        </div>
      )}
      
      {/* Fun Graphics Component */}
      <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />

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
        
        {totalAnswers > 0 && (
          <Button
            onClick={() => setShowStatsDialog(true)}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Zobrazit statistiku
          </Button>
        )}

        {gameEnded && (
          <Button
            onClick={resetGame}
            className="w-full bg-gray-500 hover:bg-gray-600"
          >
            Resetovat statistiky
          </Button>
        )}
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
              onClick={endGame}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              Ukončit hru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Statistika matematiky</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Úspěšnost</span>
                <span className="font-medium">{correctPercentage}%</span>
              </div>
              <Progress value={correctPercentage} className="h-3" />
            </div>
            
            {/* Detailed statistics table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Typ</TableHead>
                  <TableHead className="text-right">Počet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Správné odpovědi</TableCell>
                  <TableCell className="text-right font-medium text-green-500">{correctAnswers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Špatné odpovědi</TableCell>
                  <TableCell className="text-right font-medium text-red-500">{wrongAnswers}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Celkem</TableCell>
                  <TableCell className="text-right font-medium">{totalAnswers}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            {/* Graph */}
            {totalAnswers > 0 && (
              <div className="h-48">
                <ChartContainer config={{
                  correct: { color: "#4ade80" },
                  wrong: { color: "#f87171" }
                }}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar 
                      dataKey="value" 
                      fill="#4ade80"
                      stroke="#4ade80"
                      name="Hodnota"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowStatsDialog(false)}
              className="bg-orange-500 hover:bg-orange-600 w-full"
            >
              Zavřít
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MathPractice;
