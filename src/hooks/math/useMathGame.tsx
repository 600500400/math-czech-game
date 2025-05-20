import { useState, useCallback } from 'react';
import { Problem, Operation } from '@/types/mathTypes';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseMathGameProps {
  allowedOperations: Operation[];
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  problemCount: number;
  userId: string | null;
}

export function useMathGame({
  allowedOperations,
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
  problemCount,
  userId
}: UseMathGameProps) {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [showProblem, setShowProblem] = useState<boolean>(true);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showStatsDialog, setShowStatsDialog] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // Funkce pro generování matematických příkladů
  const generateProblem = useCallback(() => {
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
    let num1: number, num2: number, result: number;

    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        result = num1 + num2;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        result = num1 - num2;
        break;
      case 'multiplication':
        num1 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        num2 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        result = num1 * num2;
        break;
      case 'division':
        num2 = Math.floor(Math.random() * maxDivideValue) + 1;
        result = Math.floor(Math.random() * maxDivideValue) + 1;
        num1 = num2 * result;
        break;
      default:
        num1 = 0;
        num2 = 0;
        result = 0;
    }

    return {
      num1,
      num2,
      operation,
      result
    };
  }, [allowedOperations, maxValue, maxMultiplyValue, maxDivideValue]);

  // Inicializace mutace pro uložení statistik
  const mutate = useMutation(
    async (data: any) => {
      const { data: response, error } = await supabase
        .from('math_statistics')
        .insert([
          {
            user_id: userId,
            correct_answers: data.correctAnswers,
            wrong_answers: data.wrongAnswers,
            operation: data.operation,
            difficulty_level: data.difficultyLevel
          }
        ]);

      if (error) {
        throw new Error(error.message);
      }

      return response;
    }
  );

  // Update saveMathStatistics type to fix the type error
  const saveMathStatistics = (data: any) => {
    mutate.mutate(data);
  };

  return {
    currentProblem,
    userAnswer,
    correctAnswers,
    wrongAnswers,
    gameEnded,
    showProblem,
    showAnimation,
    showConfetti,
    showStatsDialog,
    lastAnswerCorrect,
    setCurrentProblem,
    setUserAnswer,
    setCorrectAnswers,
    setWrongAnswers,
    setGameEnded,
    setShowProblem,
    setShowAnimation,
    setShowConfetti,
    setShowStatsDialog,
    setLastAnswerCorrect,
    generateProblem,
    saveMathStatistics
  };
}
