
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

    // Show animation
    setShowAnimation(true);
    
    // Hide animation and generate next problem after shorter delay
    setTimeout(() => {
      // First hide animation and reset answer state
      setShowAnimation(false);
      setLastAnswerCorrect(null);
      
      // Then generate next problem after animation cleanup
      setTimeout(() => {
        const nextProblem = generateProblem();
        setCurrentProblem(nextProblem);
        setUserAnswer("");
      }, 100); // Small delay to ensure animation cleanup
      
    }, 800); // Extended to 800ms to show progress bar feedback

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
