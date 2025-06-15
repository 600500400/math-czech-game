
import React from "react";
import { Problem } from "@/types/mathTypes";
import ProblemDialog from "./ProblemDialog";

interface MathProblemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problem: Problem | null;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  checkAnswer: () => void;
  onEndGame: () => void;
  lastAnswerCorrect: boolean | null;
  showAnimation: boolean;
}

export const MathProblemDialog: React.FC<MathProblemDialogProps> = (props) => {
  // Calculate totals for ProblemDialog
  const correctAnswers = 0; // This will be passed from parent if needed
  const wrongAnswers = 0; // This will be passed from parent if needed
  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <ProblemDialog
      open={props.open}
      onOpenChange={props.onOpenChange}
      currentProblem={props.problem}
      userAnswer={props.userAnswer}
      setUserAnswer={props.setUserAnswer}
      handleKeyPress={props.handleKeyPress}
      checkAnswer={props.checkAnswer}
      endGame={props.onEndGame}
      correctAnswers={correctAnswers}
      wrongAnswers={wrongAnswers}
      totalAnswers={totalAnswers}
      correctPercentage={correctPercentage}
    />
  );
};
