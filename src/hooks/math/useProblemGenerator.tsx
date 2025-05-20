
import { Problem, Operation } from "@/types/mathTypes";

export function useProblemGenerator({ maxValue, maxMultiplyValue, maxDivideValue, allowedOperations }) {
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
        // Použijeme maxMultiplyValue místo pevné hodnoty 10
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
        // Použijeme maxDivideValue místo pevné hodnoty 10
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
    }

    return { num1, num2, operation, result };
  };

  return {
    generateProblem,
  };
}
