
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Problem, Operation } from "@/types/mathTypes";

export function useGameState() {
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

  return {
    // State
    correctAnswers,
    setCorrectAnswers,
    wrongAnswers,
    setWrongAnswers,
    problemCount,
    setProblemCount,
    currentProblem,
    setCurrentProblem,
    userAnswer,
    setUserAnswer,
    showProblem,
    setShowProblem,
    showDifficultyDialog,
    setShowDifficultyDialog,
    showStatsDialog,
    setShowStatsDialog,
    maxValue,
    setMaxValue,
    difficultySet,
    setDifficultySet,
    allowedOperations,
    setAllowedOperations,
    gameEnded,
    setGameEnded,
    lastAnswerCorrect,
    setLastAnswerCorrect,
    showAnimation,
    setShowAnimation,
    showConfetti,
    setShowConfetti,
    totalAnswers,
    correctPercentage,
  };
}
