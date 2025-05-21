
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings() {
  const { toast } = useToast();

  const toggleOperation = useCallback((operation: Operation, allowedOperations: Operation[], setAllowedOperations: (ops: Operation[]) => void) => {
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
  }, [toast]);

  const setDifficulty = useCallback((
    maxValue: number, 
    maxMultiplyValue: number, 
    maxDivideValue: number,
    allowedOperations: Operation[],
    setDifficultySet: (value: boolean) => void
  ) => {
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
  }, [toast]);

  return {
    toggleOperation,
    setDifficulty,
  };
}
