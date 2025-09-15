
import { useCallback } from "react";
import { Problem, Operation } from "@/types/mathTypes";

interface UseProblemGeneratorProps {
  allowedOperations: Operation[];
  minValue: number;
  maxValue: number;
  usedProblems: Set<string>;
  setUsedProblems: (problems: React.SetStateAction<Set<string>>) => void;
}

export function useProblemGenerator({
  allowedOperations,
  minValue,
  maxValue,
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
          num1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
          num2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
          result = num1 + num2;
          break;
        case "-":
          num1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
          num2 = Math.floor(Math.random() * (Math.min(num1, maxValue) - minValue + 1)) + minValue;
          result = num1 - num2;
          break;
        case "*":
          num1 = Math.floor(Math.random() * 10) + 1; // Fixed 1-10 for multiplication
          num2 = Math.floor(Math.random() * 10) + 1;
          result = num1 * num2;
          break;
        case "/":
          // Generate a valid division problem (1-10 range)
          result = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          num1 = result * num2;
          break;
        default:
          throw new Error("Invalid operation");
      }

      const problemKey = `${num1}${operation}${num2}`;
      
      // Check if this problem has been used before
      if (!usedProblems.has(problemKey)) {
        // Add to used problems
        setUsedProblems(prev => new Set([...prev, problemKey]));
        return { num1, num2, operation, result };
      }
      
      attempts++;
    }
    
    // If we can't find a unique problem after max attempts, reset used problems and generate new one
    setUsedProblems(new Set());
    return generateUniqueProblem();
  }, [allowedOperations, minValue, maxValue, usedProblems, setUsedProblems]);

  const generateProblem = useCallback((): Problem => {
    return generateUniqueProblem();
  }, [generateUniqueProblem]);

  // Function to format operation display
  const formatOperation = useCallback((operation: Operation): string => {
    switch (operation) {
      case "+":
        return "+";
      case "-":
        return "-";
      case "*":
        return "·";  // Changed from * to ·
      case "/":
        return ":";  // Changed from / to :
      default:
        return operation;
    }
  }, []);

  return {
    generateProblem,
    formatOperation,
  };
}
