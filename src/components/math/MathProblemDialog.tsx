
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
  correctAnswers: number;
  wrongAnswers: number;
}

export const MathProblemDialog: React.FC<MathProblemDialogProps> = (props) => {
  // Calculate totals for ProblemDialog
  const totalAnswers = props.correctAnswers + props.wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((props.correctAnswers / totalAnswers) * 100) : 0;

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
      correctAnswers={props.correctAnswers}
      wrongAnswers={props.wrongAnswers}
      totalAnswers={totalAnswers}
      correctPercentage={correctPercentage}
    />
  );
};
