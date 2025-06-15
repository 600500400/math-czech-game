
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { HoverScale } from "@/components/ui/microanimations";
import { GlassCard } from "@/components/ui/glass-morphism";

interface MathPracticeControlsProps {
  onShowDifficultyDialog: () => void;
  onStartNewGame: () => void;
}

export const MathPracticeControls: React.FC<MathPracticeControlsProps> = ({
  onShowDifficultyDialog,
  onStartNewGame,
}) => {
  return (
    <HoverScale>
      <GlassCard className="hover:bg-white/25 dark:hover:bg-white/10 transition-all duration-500">
        <div className="space-y-2">
          <Button
            onClick={onStartNewGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-lg py-6"
          >
            Spustit hru
          </Button>
          <Button
            onClick={onShowDifficultyDialog}
            variant="outline"
            className="w-full py-2"
          >
            <Settings size={16} className="mr-2" />
            Nastavení obtížnosti
          </Button>
        </div>
      </GlassCard>
    </HoverScale>
  );
};
