
import React from "react";
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
  setMaxValue: (value: number) => void;
  allowedOperations: Operation[];
  toggleOperation: (operation: Operation) => void;
  setDifficulty: () => void;
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({ 
  open, 
  onOpenChange, 
  maxValue, 
  setMaxValue,
  allowedOperations,
  toggleOperation,
  setDifficulty 
}) => {
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
              value={maxValue}
              onChange={(e) => setMaxValue(parseInt(e.target.value) || 0)}
              min={1}
            />
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Vyberte operace k procvičení:</h3>
            <div className="grid grid-cols-2 gap-2">
              {operationInfo.map(({ operation, label, icon }) => (
                <div 
                  key={operation}
                  className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all duration-200 ${
                    allowedOperations.includes(operation) 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => toggleOperation(operation)}
                >
                  <Checkbox 
                    id={`operation-${operation}`} 
                    checked={allowedOperations.includes(operation)}
                    onCheckedChange={() => toggleOperation(operation)}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
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
            onClick={setDifficulty}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Nastavit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DifficultyDialog;
