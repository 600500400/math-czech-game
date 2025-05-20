
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Operation, Problem, MathGameState } from "@/types/mathTypes";

export function useMathGame() {
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
  const [allowedOperations, setAllowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);
  const [gameEnded, setGameEnded] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const toggleOperation = (operation: Operation) => {
    setAllowedOperations(current => {
      if (current.includes(operation)) {
        // Don't allow removing the last operation
        if (current.length === 1) {
          toast({
            title: "Upozornění",
            description: "Alespoň jedna operace musí být vybrána.",
            variant: "default",
          });
          return current;
        }
        return current.filter(op => op !== operation);
      } else {
        return [...current, operation];
      }
    });
  };

  const setDifficulty = () => {
    if (maxValue > 0) {
      setDifficultySet(true);
      setShowDifficultyDialog(false);
      
      const operationDescriptions = {
        "+": "sčítání",
        "-": "odčítání",
        "*": "násobení",
        "/": "dělení"
      };
      
      const selectedOps = allowedOperations.map(op => operationDescriptions[op]).join(", ");
      
      toast({
        title: "Obtížnost nastavena",
        description: `Maximální hodnota: ${maxValue}, Operace: ${selectedOps}`,
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
    if (allowedOperations.length === 0) {
      // Default to addition if somehow no operations are selected
      return generateProblemForOperation("+");
    }
    
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)] as Operation;
    return generateProblemForOperation(operation);
  };
  
  const generateProblemForOperation = (operation: Operation): Problem => {
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

  return {
    // Game state
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentProblem,
    userAnswer,
    showProblem,
    showDifficultyDialog,
    showStatsDialog,
    maxValue,
    difficultySet,
    gameEnded,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    totalAnswers,
    correctPercentage,
    allowedOperations,

    // Actions
    setUserAnswer,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setMaxValue,
    setDifficulty,
    toggleOperation,
    startNewGame,
    checkAnswer,
    endGame,
    resetGame,
    handleKeyPress,
  };
}
