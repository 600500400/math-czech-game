
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Minus, X as Multiply, Divide } from "lucide-react";
import { Operation } from "@/types/mathTypes";

interface DifficultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  allowedOperations: Operation[];
  toggleOperation: (operation: Operation) => void;
  setDifficulty: (level: "easy" | "medium" | "hard") => void;
  setMaxValue: (value: number) => void;
  setMaxMultiplyValue: (value: number) => void;
  setMaxDivideValue: (value: number) => void;
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({ 
  open, 
  onOpenChange, 
  maxValue, 
  maxMultiplyValue,
  maxDivideValue,
  allowedOperations,
  toggleOperation,
  setDifficulty,
  setMaxValue,
  setMaxMultiplyValue,
  setMaxDivideValue
}) => {
  // Local state for inputs
  const [localMaxValue, setLocalMaxValue] = useState(maxValue);
  const [localMaxMultiplyValue, setLocalMaxMultiplyValue] = useState(maxMultiplyValue);
  const [localMaxDivideValue, setLocalMaxDivideValue] = useState(maxDivideValue);

  // Update local state when props change
  useEffect(() => {
    setLocalMaxValue(maxValue);
    setLocalMaxMultiplyValue(maxMultiplyValue);
    setLocalMaxDivideValue(maxDivideValue);
  }, [maxValue, maxMultiplyValue, maxDivideValue]);

  const handleSaveDifficulty = () => {
    // Save the local values to the main state
    setMaxValue(localMaxValue);
    setMaxMultiplyValue(localMaxMultiplyValue);
    setMaxDivideValue(localMaxDivideValue);
    // Close dialog
    onOpenChange(false);
  };

  const operationInfo = [
    { operation: "+" as Operation, label: "Sčítání", icon: <Plus size={16} /> },
    { operation: "-" as Operation, label: "Odčítání", icon: <Minus size={16} /> },
    { operation: "*" as Operation, label: "Násobení", icon: <Multiply size={16} /> },
    { operation: "/" as Operation, label: "Dělení", icon: <Divide size={16} /> },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nastavení obtížnosti</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="max-value" className="mb-2 block">Maximální hodnota pro sčítání a odčítání:</Label>
            <Input
              id="max-value"
              type="number"
              value={localMaxValue}
              onChange={(e) => setLocalMaxValue(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>
          
          <div>
            <Label htmlFor="max-multiply-value" className="mb-2 block">Maximální hodnota pro násobení:</Label>
            <Input
              id="max-multiply-value"
              type="number"
              value={localMaxMultiplyValue}
              onChange={(e) => setLocalMaxMultiplyValue(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>
          
          <div>
            <Label htmlFor="max-divide-value" className="mb-2 block">Maximální hodnota pro dělení:</Label>
            <Input
              id="max-divide-value"
              type="number"
              value={localMaxDivideValue}
              onChange={(e) => setLocalMaxDivideValue(parseInt(e.target.value) || 1)}
              min={1}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Vyberte operace k procvičení:</h3>
            <div className="grid grid-cols-2 gap-2">
              {operationInfo.map(({ operation, label, icon }) => (
                <div 
                  key={operation}
                  className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    allowedOperations.includes(operation) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-600' 
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
                  }`}
                  onClick={() => toggleOperation(operation)}
                >
                  <Checkbox 
                    id={`operation-${operation}`} 
                    checked={allowedOperations.includes(operation)}
                    onCheckedChange={() => toggleOperation(operation)}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label 
                    htmlFor={`operation-${operation}`}
                    className="cursor-pointer font-medium flex items-center gap-1 flex-1"
                  >
                    {icon} {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSaveDifficulty}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            Nastavit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DifficultyDialog;
