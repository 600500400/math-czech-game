
import { useCallback, useEffect } from "react";
import { Problem, MathAnswer } from "@/types/mathTypes";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";

interface UseAnswerHandlerProps {
  currentProblem: Problem | null;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  setLastAnswerCorrect: (correct: boolean | null) => void;
  setShowAnimation: (show: boolean) => void;
  incrementCorrect: () => void;
  incrementWrong: () => void;
  addAnswer: (answer: MathAnswer) => void;
  generateProblem: () => Problem;
  setCurrentProblem: (problem: Problem) => void;
}

export function useAnswerHandler({
  currentProblem,
  userAnswer,
  setUserAnswer,
  setLastAnswerCorrect,
  setShowAnimation,
  incrementCorrect,
  incrementWrong,
  addAnswer,
  generateProblem,
  setCurrentProblem
}: UseAnswerHandlerProps) {
  
  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerMilestoneFeedback
  } = useEnhancedMobileInteractions();

  const checkAnswer = useCallback(() => {
    if (!currentProblem || !userAnswer.trim()) return;

    const userNum = parseFloat(userAnswer);
    const correctAnswer = currentProblem.result;
    const isCorrect = Math.abs(userNum - correctAnswer) < 0.01;

    // Create detailed answer record
    const answerRecord: MathAnswer = {
      problem: currentProblem,
      userAnswer: userNum,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      timestamp: new Date().toISOString()
    };

    addAnswer(answerRecord);

    // Update statistics and show feedback
    if (isCorrect) {
      incrementCorrect();
      setLastAnswerCorrect(true);
      triggerCorrectFeedback();
    } else {
      incrementWrong();
      setLastAnswerCorrect(false);
      triggerIncorrectFeedback();
    }

    // Show animation and generate next problem
    setShowAnimation(true);
    
    setTimeout(() => {
      setShowAnimation(false);
      setLastAnswerCorrect(null);
      
      // Generate next problem
      const nextProblem = generateProblem();
      setCurrentProblem(nextProblem);
      setUserAnswer("");
    }, 1500);

  }, [
    currentProblem,
    userAnswer,
    incrementCorrect,
    incrementWrong,
    addAnswer,
    setLastAnswerCorrect,
    setShowAnimation,
    generateProblem,
    setCurrentProblem,
    setUserAnswer,
    triggerCorrectFeedback,
    triggerIncorrectFeedback
  ]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  }, [checkAnswer]);

  return {
    checkAnswer,
    handleKeyPress
  };
}
