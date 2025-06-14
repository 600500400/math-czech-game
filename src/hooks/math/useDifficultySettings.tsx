
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings() {
  const { toast } = useToast();
  const [maxValue, setMaxValue] = useState(10);
  const [maxMultiplyValue, setMaxMultiplyValue] = useState(10);
  const [maxDivideValue, setMaxDivideValue] = useState(10);
  const [allowedOperations, setAllowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);

  const toggleOperation = useCallback((operation: Operation) => {
    if (allowedOperations.includes(operation)) {
      // Don't allow removing the last operation
      if (allowedOperations.length === 1) {
        toast({
          title: "Upozornění",
          description: "Alespoň jedna operace musí být vybrána.",
          variant: "default",
        });
        return;
      }
      // Remove the operation
      setAllowedOperations(allowedOperations.filter(op => op !== operation));
    } else {
      // Add the operation
      setAllowedOperations([...allowedOperations, operation]);
    }
  }, [allowedOperations, toast]);

  const setDifficulty = useCallback((level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        setMaxValue(10);
        setMaxMultiplyValue(5);
        setMaxDivideValue(5);
        setAllowedOperations(["+", "-"]);
        break;
      case "medium":
        setMaxValue(20);
        setMaxMultiplyValue(10);
        setMaxDivideValue(10);
        setAllowedOperations(["+", "-", "*"]);
        break;
      case "hard":
        setMaxValue(50);
        setMaxMultiplyValue(15);
        setMaxDivideValue(15);
        setAllowedOperations(["+", "-", "*", "/"]);
        break;
    }

    toast({
      title: "Obtížnost nastavena",
      description: `Úroveň ${level} byla nastavena.`,
    });
  }, [toast]);

  return {
    maxValue,
    setMaxValue,
    maxMultiplyValue,
    setMaxMultiplyValue,
    maxDivideValue,
    setMaxDivideValue,
    allowedOperations,
    setAllowedOperations,
    toggleOperation,
    setDifficulty,
  };
}
