
import { useCallback } from "react";
import { Problem, Operation } from "@/types/mathTypes";

interface UseProblemGeneratorProps {
  allowedOperations: Operation[];
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
}

export function useProblemGenerator({
  allowedOperations,
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
}: UseProblemGeneratorProps) {
  
  const generateProblem = useCallback((): Problem => {
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)];
    let num1: number, num2: number, result: number;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        result = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * Math.min(num1, maxValue)) + 1;
        result = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        num2 = Math.floor(Math.random() * maxMultiplyValue) + 1;
        result = num1 * num2;
        break;
      case "/":
        // Generate a valid division problem
        result = Math.floor(Math.random() * maxDivideValue) + 1;
        num2 = Math.floor(Math.random() * maxDivideValue) + 1;
        num1 = result * num2;
        break;
      default:
        throw new Error("Invalid operation");
    }

    return { num1, num2, operation, result };
  }, [allowedOperations, maxValue, maxMultiplyValue, maxDivideValue]);

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
