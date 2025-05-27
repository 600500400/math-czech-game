
import { useCallback } from 'react';
import { Problem, MathAnswer } from '@/types/mathTypes';

interface UseAnswerHandlerProps {
  currentProblem: Problem | null;
  userAnswer: string;
  correctAnswers: number;
  wrongAnswers: number;
  problemCount: number;
  generateProblem: () => Problem;
  setCorrectAnswers: (value: React.SetStateAction<number>) => void;
  setWrongAnswers: (value: React.SetStateAction<number>) => void;
  setLastAnswerCorrect: (value: React.SetStateAction<boolean | null>) => void;
  setShowAnimation: (value: React.SetStateAction<boolean>) => void;
  setShowConfetti: (value: React.SetStateAction<boolean>) => void;
  setUserAnswer: (value: React.SetStateAction<string>) => void;
  setCurrentProblem: (value: React.SetStateAction<Problem | null>) => void;
  addAnswer: (answer: MathAnswer) => void;
  endGame: () => void;
}

export function useAnswerHandler({
  currentProblem,
  userAnswer,
  correctAnswers,
  wrongAnswers,
  problemCount,
  generateProblem,
  setCorrectAnswers,
  setWrongAnswers,
  setLastAnswerCorrect,
  setShowAnimation,
  setShowConfetti,
  setUserAnswer,
  setCurrentProblem,
  addAnswer,
  endGame
}: UseAnswerHandlerProps) {
  
  const checkAnswer = useCallback(() => {
    if (!currentProblem) return;
    
    const parsedAnswer = parseFloat(userAnswer);
    const isCorrect = !isNaN(parsedAnswer) && parsedAnswer === currentProblem.result;
    
    // Create detailed answer record
    const answerRecord: MathAnswer = {
      problem: currentProblem,
      userAnswer: parsedAnswer || 0,
      correctAnswer: currentProblem.result,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    
    // Add to answers array
    addAnswer(answerRecord);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setLastAnswerCorrect(true);
    } else {
      setWrongAnswers(prev => prev + 1);
      setLastAnswerCorrect(false);
    }
    
    // Zobrazíme animaci
    setShowAnimation(true);
    if (isCorrect) setShowConfetti(true);
    
    // Časovač pro skrytí animace
    setTimeout(() => {
      setShowAnimation(false);
      setShowConfetti(false);
    }, 2000);
    
    // Posuneme se na další příklad nebo ukončíme hru
    setTimeout(() => {
      if (correctAnswers + wrongAnswers + 1 >= problemCount) {
        endGame();
      } else {
        setCurrentProblem(generateProblem());
        setUserAnswer("");
      }
    }, 1000);
  }, [
    correctAnswers, 
    currentProblem, 
    endGame, 
    generateProblem, 
    problemCount, 
    setCorrectAnswers, 
    setCurrentProblem, 
    setLastAnswerCorrect, 
    setShowAnimation, 
    setShowConfetti, 
    setUserAnswer, 
    setWrongAnswers, 
    userAnswer, 
    wrongAnswers,
    addAnswer
  ]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  }, [checkAnswer]);

  return {
    checkAnswer,
    handleKeyPress
  };
}
