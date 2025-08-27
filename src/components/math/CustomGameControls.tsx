
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface CustomGameControlsProps {
  onShowDifficultyDialog: () => void;
  onStartGame: () => void;
  difficultySettings: any;
}

export const CustomGameControls = ({
  onShowDifficultyDialog,
  onStartGame,
  difficultySettings
}: CustomGameControlsProps) => {
  const hasValidSettings = difficultySettings && 
    Object.values(difficultySettings.operations).some((enabled: any) => enabled);

  return (
    <div className="space-y-2">
      {/* Primary action button - more prominent */}
      <Button 
        onClick={onStartGame} 
        className="w-full bg-subject-math hover:opacity-90 text-white text-lg py-6" 
        disabled={!hasValidSettings}
      >
        Spustit hru
      </Button>
      
      {/* Secondary actions - less prominent */}
      <div className="flex gap-2">
        <Button 
          onClick={onShowDifficultyDialog} 
          variant="outline"
          className="flex-1 border-subject-math-border text-subject-math hover:bg-subject-math-light py-2"
        >
          <Settings size={16} className="mr-2" /> Nastavení obtížnosti
        </Button>
      </div>
    </div>
  );
};
