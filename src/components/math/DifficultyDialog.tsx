
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DifficultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxValue: number;
  setMaxValue: (value: number) => void;
  setDifficulty: () => void;
}

const DifficultyDialog: React.FC<DifficultyDialogProps> = ({ 
  open, 
  onOpenChange, 
  maxValue, 
  setMaxValue, 
  setDifficulty 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nastavení obtížnosti</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Zadej max hodnotu (+,-)</p>
          <Input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(parseInt(e.target.value) || 0)}
            min={1}
          />
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
