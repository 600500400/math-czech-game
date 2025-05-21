
import { useCallback } from 'react';
import { Problem, Operation } from "@/types/mathTypes";

interface UseProblemGeneratorProps {
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  allowedOperations: Operation[];
}

export function useProblemGenerator({ 
  maxValue, 
  maxMultiplyValue, 
  maxDivideValue, 
  allowedOperations 
}: UseProblemGeneratorProps) {
  
  const generateProblem = useCallback((): Problem => {
    if (allowedOperations.length === 0) {
      // Default to addition if somehow no operations are selected
      return generateProblemForOperation("+");
    }
    
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
    return generateProblemForOperation(operation);
  }, [allowedOperations, maxValue, maxMultiplyValue, maxDivideValue]);
  
  const generateProblemForOperation = (operation: Operation): Problem => {
    let num1, num2, result;

    switch (operation) {
      case "*":
        num1 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        num2 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        result = num1 * num2;
        break;
      case "+":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        result = num1 + num2;
        break;
      case "/":
        num2 = Math.floor(Math.random() * maxDivideValue) + 1; // Ensure divisor is not zero
        // Pro dělení generujeme násobek divisoru pro zajištění celých výsledků
        num1 = num2 * (Math.floor(Math.random() * maxDivideValue) + 1); 
        result = num1 / num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        result = num1 - num2;
        break;
      default:
        num1 = 1;
        num2 = 1;
        result = 2;
    }

    return { num1, num2, operation, result };
  };

  return {
    generateProblem,
  };
}
