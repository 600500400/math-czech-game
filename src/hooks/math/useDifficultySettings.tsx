
import { useToast } from "@/components/ui/use-toast";
import { Operation } from "@/types/mathTypes";

export function useDifficultySettings({
  allowedOperations,
  setAllowedOperations,
  maxValue,
  setDifficultySet,
  setShowDifficultyDialog,
}) {
  const { toast } = useToast();

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
    if (maxValue > 0) {
      setDifficultySet(true);
      setShowDifficultyDialog(false);
      
      const operationDescriptions = {
        "+": "sčítání",
        "-": "odčítání",
        "*": "násobení",
        "/": "dělení"
      };
      
      const selectedOps = allowedOperations.map(op => operationDescriptions[op]).join(", ");
      
      toast({
        title: "Obtížnost nastavena",
        description: `Maximální hodnota: ${maxValue}, Operace: ${selectedOps}`,
      });
    } else {
      toast({
        title: "Chyba",
        description: "Zadejte platnou hodnotu větší než 0.",
        variant: "destructive",
      });
    }
  };

  return {
    toggleOperation,
    setDifficulty,
  };
}
