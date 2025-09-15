
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings() {
  const { toast } = useToast();
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(10);
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
        setMinValue(1);
        setMaxValue(10);
        setAllowedOperations(["+", "-"]);
        break;
      case "medium":
        setMinValue(5);
        setMaxValue(25);
        setAllowedOperations(["+", "-", "*"]);
        break;
      case "hard":
        setMinValue(10);
        setMaxValue(100);
        setAllowedOperations(["+", "-", "*", "/"]);
        break;
    }

    toast({
      title: "Obtížnost nastavena",
      description: `Úroveň ${level} byla nastavena.`,
    });
  }, [toast]);

  const setPreset = useCallback((preset: "easy" | "medium" | "hard") => {
    setDifficulty(preset);
  }, [setDifficulty]);

  return {
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    allowedOperations,
    setAllowedOperations,
    toggleOperation,
    setDifficulty,
    setPreset,
  };
}
