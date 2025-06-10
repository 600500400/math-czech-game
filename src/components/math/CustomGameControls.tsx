
import { Button } from "@/components/ui/button";
import { Settings, Target } from "lucide-react";

interface CustomGameControlsProps {
  onShowDifficultyDialog: () => void;
  onStartGame: () => void;
  onShowDetailedErrors: () => void;
  hasDetailedErrors: boolean;
  difficultySettings: any;
}

export const CustomGameControls = ({
  onShowDifficultyDialog,
  onStartGame,
  onShowDetailedErrors,
  hasDetailedErrors,
  difficultySettings
}: CustomGameControlsProps) => {
  const hasValidSettings = difficultySettings && 
    Object.values(difficultySettings.operations).some((enabled: any) => enabled);

  return (
    <div className="space-y-2">
      {/* Primary action button - more prominent */}
      <Button 
        onClick={onStartGame} 
        className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6" 
        disabled={!hasValidSettings}
      >
        Spustit hru
      </Button>
      
      {/* Secondary actions - less prominent */}
      <div className="flex gap-2">
        <Button 
          onClick={onShowDifficultyDialog} 
          variant="outline"
          className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 py-2"
        >
          <Settings size={16} className="mr-2" /> Nastavení obtížnosti
        </Button>
        
        {hasDetailedErrors && (
          <Button 
            onClick={onShowDetailedErrors} 
            variant="outline"
            className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 py-2"
          >
            <Target size={16} className="mr-2" /> Detailní chyby
          </Button>
        )}
      </div>
    </div>
  );
};
