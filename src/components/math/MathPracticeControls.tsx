
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Play } from "lucide-react";
import { Operation } from "@/types/mathTypes";

interface MathPracticeControlsProps {
  allowedOperations: Operation[];
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
  onShowDifficultyDialog: () => void;
  onStartNewGame: () => void;
  toggleOperation: (operation: Operation) => void;
}

export const MathPracticeControls: React.FC<MathPracticeControlsProps> = ({
  allowedOperations,
  maxValue,
  maxMultiplyValue,
  maxDivideValue,
  onShowDifficultyDialog,
  onStartNewGame,
  toggleOperation
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button
        onClick={onShowDifficultyDialog}
        variant="outline"
        className="flex items-center gap-2 glass-light border-white/30"
      >
        <Settings size={16} />
        Nastavení obtížnosti
      </Button>
      
      <Button
        onClick={onStartNewGame}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Play size={16} />
        Začít hru
      </Button>
    </div>
  );
};
