
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings() {
  const { toast } = useToast();
  // Rozsah pro sčítání / odčítání
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(10);
  // Rozsah pro násobení / dělení (samostatný)
  const [mulDivMin, setMulDivMin] = useState(1);
  const [mulDivMax, setMulDivMax] = useState(10);
  const [allowedOperations, setAllowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);

  const toggleOperation = useCallback((operation: Operation) => {
    if (allowedOperations.includes(operation)) {
      if (allowedOperations.length === 1) {
        toast({
          title: "Upozornění",
          description: "Alespoň jedna operace musí být vybrána.",
          variant: "default",
        });
        return;
      }
      setAllowedOperations(allowedOperations.filter(op => op !== operation));
    } else {
      setAllowedOperations([...allowedOperations, operation]);
    }
  }, [allowedOperations, toast]);

  const setDifficulty = useCallback((level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        setMinValue(1);
        setMaxValue(10);
        setMulDivMin(1);
        setMulDivMax(5);
        setAllowedOperations(["+", "-"]);
        break;
      case "medium":
        setMinValue(5);
        setMaxValue(25);
        setMulDivMin(1);
        setMulDivMax(10);
        setAllowedOperations(["+", "-", "*"]);
        break;
      case "hard":
        setMinValue(10);
        setMaxValue(100);
        setMulDivMin(2);
        setMulDivMax(12);
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
    mulDivMin,
    setMulDivMin,
    mulDivMax,
    setMulDivMax,
    allowedOperations,
    setAllowedOperations,
    toggleOperation,
    setDifficulty,
    setPreset,
  };
}
