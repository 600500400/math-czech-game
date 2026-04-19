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
  minValue: number;
  maxValue: number;
  mulDivMin: number;
  mulDivMax: number;
  allowedOperations: Operation[];
  toggleOperation: (operation: Operation) => void;
  setDifficulty: (level: "easy" | "medium" | "hard") => void;
  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
  setMulDivMin: (value: number) => void;
  setMulDivMax: (value: number) => void;
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({
  open,
  onOpenChange,
  minValue,
  maxValue,
  mulDivMin,
  mulDivMax,
  allowedOperations,
  toggleOperation,
  setDifficulty,
  setMinValue,
  setMaxValue,
  setMulDivMin,
  setMulDivMax,
}) => {
  // Local state for inputs
  const [localMinValue, setLocalMinValue] = useState(minValue);
  const [localMaxValue, setLocalMaxValue] = useState(maxValue);
  const [localMulDivMin, setLocalMulDivMin] = useState(mulDivMin);
  const [localMulDivMax, setLocalMulDivMax] = useState(mulDivMax);

  useEffect(() => {
    setLocalMinValue(minValue);
    setLocalMaxValue(maxValue);
    setLocalMulDivMin(mulDivMin);
    setLocalMulDivMax(mulDivMax);
  }, [minValue, maxValue, mulDivMin, mulDivMax]);

  const handleSaveDifficulty = () => {
    const finalMin = Math.min(localMinValue, localMaxValue);
    const finalMax = Math.max(localMinValue, localMaxValue);
    const finalMdMin = Math.min(localMulDivMin, localMulDivMax);
    const finalMdMax = Math.max(localMulDivMin, localMulDivMax);

    setMinValue(finalMin);
    setMaxValue(finalMax);
    setMulDivMin(Math.max(1, finalMdMin));
    setMulDivMax(Math.max(1, finalMdMax));
    onOpenChange(false);
  };

  const handlePreset = (level: "easy" | "medium" | "hard") => {
    setDifficulty(level);
    onOpenChange(false);
  };

  const operationInfo = [
    { operation: "+" as Operation, label: "Sčítání", icon: <Plus size={16} /> },
    { operation: "-" as Operation, label: "Odčítání", icon: <Minus size={16} /> },
    { operation: "*" as Operation, label: "Násobení", icon: <Multiply size={16} /> },
    { operation: "/" as Operation, label: "Dělení", icon: <Divide size={16} /> },
  ];

  const showMulDiv = allowedOperations.includes("*") || allowedOperations.includes("/");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nastavení obtížnosti</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {/* Preset buttons */}
          <div>
            <Label className="mb-3 block font-medium">Rychlé předvolby:</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePreset("easy")} className="text-xs">
                Lehké
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePreset("medium")} className="text-xs">
                Střední
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePreset("hard")} className="text-xs">
                Těžké
              </Button>
            </div>
          </div>

          {/* Range pro sčítání/odčítání */}
          <div className="space-y-3">
            <Label className="font-medium">Rozsah pro sčítání a odčítání:</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-value" className="text-sm text-muted-foreground">Od:</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={localMinValue || ''}
                  onChange={(e) => setLocalMinValue(parseInt(e.target.value) || 1)}
                  min={1}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="max-value" className="text-sm text-muted-foreground">Do:</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={localMaxValue || ''}
                  onChange={(e) => setLocalMaxValue(parseInt(e.target.value) || 1)}
                  min={1}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Range pro násobení/dělení – jen pokud je některé z nich povolené */}
          {showMulDiv && (
            <div className="space-y-3">
              <Label className="font-medium">Rozsah pro násobení a dělení:</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="mul-min" className="text-sm text-muted-foreground">Od:</Label>
                  <Input
                    id="mul-min"
                    type="number"
                    value={localMulDivMin || ''}
                    onChange={(e) => setLocalMulDivMin(parseInt(e.target.value) || 1)}
                    min={1}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="mul-max" className="text-sm text-muted-foreground">Do:</Label>
                  <Input
                    id="mul-max"
                    type="number"
                    value={localMulDivMax || ''}
                    onChange={(e) => setLocalMulDivMax(parseInt(e.target.value) || 1)}
                    min={1}
                    placeholder="10"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: pro malou násobilku použij 1–10, pro velkou až 1–100.
              </p>
            </div>
          )}

          {/* Operations selection */}
          <div className="space-y-3">
            <Label className="font-medium">Vyberte operace k procvičení:</Label>
            <div className="grid grid-cols-1 gap-2">
              {operationInfo.map(({ operation, label, icon }) => (
                <div
                  key={operation}
                  className={`flex items-center space-x-3 p-3 border rounded-lg transition-all duration-200 ${
                    allowedOperations.includes(operation)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    id={`operation-${operation}`}
                    checked={allowedOperations.includes(operation)}
                    onCheckedChange={() => toggleOperation(operation)}
                  />
                  <Label
                    htmlFor={`operation-${operation}`}
                    className="cursor-pointer font-medium flex items-center gap-2 flex-1"
                  >
                    {icon} {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Info text */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1">
            <p><strong>Dělení</strong> je vždy <em>beze zbytku</em> (vychází celé číslo).</p>
            <p><strong>Odčítání</strong> nedává záporné výsledky.</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Zrušit
          </Button>
          <Button onClick={handleSaveDifficulty}>
            Uložit nastavení
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DifficultyDialog;
