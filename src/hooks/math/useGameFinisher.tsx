
import { useCallback } from 'react';
import { Operation } from '@/types/mathTypes';
import { UseMutateFunction } from '@tanstack/react-query';

interface UseGameFinisherProps {
  setShowProblem: (value: React.SetStateAction<boolean>) => void;
  setGameEnded: (value: React.SetStateAction<boolean>) => void;
  setShowStatsDialog: (value: React.SetStateAction<boolean>) => void;
  userId: string | null;
  correctAnswers: number;
  wrongAnswers: number;
  allowedOperations: Operation[];
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  saveMathStatistics: UseMutateFunction<any, Error, any, unknown>;
}

export function useGameFinisher({
  setShowProblem,
  setGameEnded,
  setShowStatsDialog,
  userId,
  correctAnswers,
  wrongAnswers,
  allowedOperations,
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
  saveMathStatistics
}: UseGameFinisherProps) {
  
  const endGame = useCallback(() => {
    setShowProblem(false);
    setGameEnded(true);
    setShowStatsDialog(true);
    
    // Pokud je uživatel přihlášený, uložíme statistiky
    if (userId && (correctAnswers > 0 || wrongAnswers > 0)) {
      const operations = allowedOperations.join(',');
      saveMathStatistics.mutate({
        correctAnswers,
        wrongAnswers,
        operation: operations,
        difficultyLevel: {
          maxValue,
          maxMultiplyValue,
          maxDivideValue
        }
      });
    }
  }, [
    allowedOperations,
    correctAnswers,
    maxDivideValue,
    maxMultiplyValue,
    maxValue,
    saveMathStatistics,
    setGameEnded,
    setShowProblem,
    setShowStatsDialog,
    userId,
    wrongAnswers
  ]);

  return {
    endGame
  };
}
