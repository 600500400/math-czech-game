
import { useState, useCallback, useEffect } from 'react';
import { Problem, Operation } from '@/types/mathTypes';
import { toast } from "sonner";

interface UseGameMechanicsProps {
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  allowedOperations: Operation[];
  correctAnswers: number;
  wrongAnswers: number;
  problemCount: number;
  setCorrectAnswers: (value: number) => void;
  setWrongAnswers: (value: number) => void;
}

export function useGameMechanics({
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
  allowedOperations,
  correctAnswers,
  wrongAnswers,
  problemCount,
  setCorrectAnswers,
  setWrongAnswers
}: UseGameMechanicsProps) {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Generate a new problem based on the current settings
  const generateProblem = useCallback(() => {
    if (allowedOperations.length === 0) {
      toast.error("Nejprve vyberte alespoň jednu operaci");
      return null;
    }
    
    // Select a random operation from allowed ones
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
    let num1: number, num2: number;
    
    // Generate appropriate numbers based on operation and difficulty
    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure num2 <= num1 to avoid negative results
        break;
      case "*":
        num1 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        num2 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        break;
      case "/":
        num2 = Math.floor(Math.random() * maxDivideValue) + 1; // Divisor
        const multiplier = Math.floor(Math.random() * maxDivideValue) + 1;
        num1 = num2 * multiplier; // Ensure division results in an integer
        break;
      default:
        num1 = 0;
        num2 = 0;
    }
    
    return { num1, num2, operation };
  }, [allowedOperations, maxValue, maxMultiplyValue, maxDivideValue]);
  
  // Check if the user's answer is correct
  const checkAnswer = useCallback(() => {
    if (!currentProblem) return;
    
    const userNumericAnswer = Number(userAnswer);
    let correctAnswer: number;
    
    // Calculate the correct answer based on the problem
    switch (currentProblem.operation) {
      case "+":
        correctAnswer = currentProblem.num1 + currentProblem.num2;
        break;
      case "-":
        correctAnswer = currentProblem.num1 - currentProblem.num2;
        break;
      case "*":
        correctAnswer = currentProblem.num1 * currentProblem.num2;
        break;
      case "/":
        correctAnswer = currentProblem.num1 / currentProblem.num2;
        break;
      default:
        correctAnswer = 0;
    }
    
    const isCorrect = userNumericAnswer === correctAnswer;
    
    // Update statistics and feedback
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setLastAnswerCorrect(true);
      setShowAnimation(true);
      setShowConfetti(true);
      
      toast.success("Správně!");
      
      // Generate next problem
      setCurrentProblem(generateProblem());
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setLastAnswerCorrect(false);
      setShowAnimation(true);
      
      toast.error(`Špatně! Správná odpověď: ${correctAnswer}`);
      
      // Generate next problem after wrong answer too
      setCurrentProblem(generateProblem());
    }
    
    // Reset user input
    setUserAnswer("");
    
    // Hide animation after delay
    setTimeout(() => {
      setShowAnimation(false);
      setShowConfetti(false);
    }, 2000);
    
  }, [currentProblem, userAnswer, correctAnswers, wrongAnswers, generateProblem, setCorrectAnswers, setWrongAnswers]);
  
  // Handle keyboard input for answering
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  }, [checkAnswer]);
  
  return {
    currentProblem,
    userAnswer,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    
    setUserAnswer,
    setCurrentProblem,
    generateProblem,
    checkAnswer,
    handleKeyPress,
  };
}
