
import { useToast } from "@/components/ui/use-toast";

export function useGameActions({
  difficultySet,
  setProblemCount,
  setCurrentProblem,
  setShowProblem,
  setUserAnswer,
  setGameEnded,
  setShowAnimation,
  currentProblem,
  userAnswer,
  setLastAnswerCorrect,
  setShowAnimation: setShowAnim,
  setCorrectAnswers,
  setWrongAnswers,
  setShowConfetti,
  setShowProblem: setShowProb,
  generateProblem,
}) {
  const { toast } = useToast();

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
    setShowAnim(true);
    
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
      setShowAnim(false);
      // Generate new problem
      setCurrentProblem(generateProblem());
      setUserAnswer("");
    }, 1500);
  };

  const endGame = () => {
    setShowProb(false);
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
    startNewGame,
    checkAnswer,
    endGame,
    resetGame,
    handleKeyPress,
  };
}
