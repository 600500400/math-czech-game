
import { Problem, Operation } from "@/types/mathTypes";

export function useProblemGenerator({ maxValue, allowedOperations }) {
  const generateProblem = (): Problem => {
    if (allowedOperations.length === 0) {
      // Default to addition if somehow no operations are selected
      return generateProblemForOperation("+");
    }
    
    const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)] as Operation;
    return generateProblemForOperation(operation);
  };
  
  const generateProblemForOperation = (operation: Operation): Problem => {
    let num1, num2, result;

    switch (operation) {
      case "*":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        result = num1 * num2;
        break;
      case "+":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * maxValue) + 1;
        result = num1 + num2;
        break;
      case "/":
        num2 = Math.floor(Math.random() * 10) + 1; // Ensure divisor is not zero
        num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Ensure clean division
        result = num1 / num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxValue) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        result = num1 - num2;
        break;
    }

    return { num1, num2, operation, result };
  };

  return {
    generateProblem,
  };
}
