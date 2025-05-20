
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings() {
  const { toast } = useToast();
  const [maxValue, setMaxValue] = useState(10);
  const [maxMultiplyValue, setMaxMultiplyValue] = useState(10);
  const [maxDivideValue, setMaxDivideValue] = useState(10);
  const [difficultySet, setDifficultySet] = useState(false);
  const [allowedOperations, setAllowedOperations] = useState<Operation[]>(["+", "-", "*", "/"]);

  const toggleOperation = (operation: Operation) => {
    setAllowedOperations(current => {
      if (current.includes(operation)) {
        // Don't allow removing the last operation
        if (current.length === 1) {
          toast({
            title: "Upozornění",
            description: "Alespoň jedna operace musí být vybrána.",
            variant: "default",
          });
          return current;
        }
        return current.filter(op => op !== operation);
      } else {
        return [...current, operation];
      }
    });
  };

  const setDifficulty = () => {
    // Validace všech max. hodnot
    if (maxValue > 0 && maxMultiplyValue > 0 && maxDivideValue > 0) {
      setDifficultySet(true);
      
      const operationDescriptions = {
        "+": "sčítání",
        "-": "odčítání",
        "*": "násobení",
        "/": "dělení"
      };
      
      const selectedOps = allowedOperations.map(op => operationDescriptions[op]).join(", ");
      
      toast({
        title: "Obtížnost nastavena",
        description: `Maximální hodnoty: ${maxValue} (±), ${maxMultiplyValue} (×), ${maxDivideValue} (÷), Operace: ${selectedOps}`,
      });
    } else {
      toast({
        title: "Chyba",
        description: "Všechny hodnoty musí být větší než 0.",
        variant: "destructive",
      });
    }
  };

  return {
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    difficultySet,
    allowedOperations,
    setMaxValue,
    setMaxMultiplyValue,
    setMaxDivideValue,
    setDifficultySet,
    setAllowedOperations,
    toggleOperation,
    setDifficulty,
  };
}
