
import { useCallback } from "react";
import { Problem, Operation } from "@/types/mathTypes";

interface UseProblemGeneratorProps {
  allowedOperations: Operation[];
  minValue: number;
  maxValue: number;
  mulDivMin: number;
  mulDivMax: number;
  usedProblems: Set<string>;
  setUsedProblems: (problems: React.SetStateAction<Set<string>>) => void;
}

// Pomocné: náhodné celé číslo z rozsahu [min, max] včetně
function randInt(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

export function useProblemGenerator({
  allowedOperations,
  minValue,
  maxValue,
  mulDivMin,
  mulDivMax,
  usedProblems,
  setUsedProblems,
}: UseProblemGeneratorProps) {

  const generateUniqueProblem = useCallback((): Problem => {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
      let num1: number, num2: number, result: number;

      switch (operation) {
        case "+":
          num1 = randInt(minValue, maxValue);
          num2 = randInt(minValue, maxValue);
          result = num1 + num2;
          break;
        case "-":
          // Aby výsledek nebyl záporný: num1 ≥ num2.
          // Vybereme num1 z plného rozsahu a num2 z [minValue, num1].
          num1 = randInt(minValue, maxValue);
          num2 = randInt(minValue, num1);
          result = num1 - num2;
          break;
        case "*":
          num1 = randInt(mulDivMin, mulDivMax);
          num2 = randInt(mulDivMin, mulDivMax);
          result = num1 * num2;
          break;
        case "/":
          // Generujeme dělení beze zbytku: result a num2 z rozsahu, num1 = result * num2.
          result = randInt(mulDivMin, mulDivMax);
          num2 = randInt(Math.max(1, mulDivMin), mulDivMax);
          num1 = result * num2;
          break;
        default:
          throw new Error("Invalid operation");
      }

      const problemKey = `${num1}${operation}${num2}`;

      if (!usedProblems.has(problemKey)) {
        setUsedProblems(prev => new Set([...prev, problemKey]));
        return { num1, num2, operation, result };
      }

      attempts++;
    }

    // Reset historie a zkusit znovu
    setUsedProblems(new Set());
    return generateUniqueProblem();
  }, [allowedOperations, minValue, maxValue, mulDivMin, mulDivMax, usedProblems, setUsedProblems]);

  const generateProblem = useCallback((): Problem => {
    return generateUniqueProblem();
  }, [generateUniqueProblem]);

  const formatOperation = useCallback((operation: Operation): string => {
    switch (operation) {
      case "+": return "+";
      case "-": return "-";
      case "*": return "·";
      case "/": return ":";
      default: return operation;
    }
  }, []);

  return {
    generateProblem,
    formatOperation,
  };
}
