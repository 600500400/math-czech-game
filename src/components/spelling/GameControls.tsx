
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface GameControlsProps {
  selectedGroupsCount: number;
  hasStats: boolean;
  onShowGroupDialog: () => void;
  onStartGame: () => void;
  onShowStats: () => void;
}

export const GameControls = ({
  selectedGroupsCount,
  hasStats,
  onShowGroupDialog,
  onStartGame,
  onShowStats
}: GameControlsProps) => {
  return (
    <div className="space-y-2">
      {/* Primary action button - more prominent */}
      <Button 
        onClick={onStartGame} 
        className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6" 
        disabled={selectedGroupsCount === 0}
      >
        Spustit hru
      </Button>
      
      {/* Secondary action - less prominent */}
      <Button 
        onClick={onShowGroupDialog} 
        variant="outline"
        className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
      >
        <Settings size={16} className="mr-2" /> Vybrat skupiny slov
      </Button>
      
      {hasStats && (
        <Button 
          onClick={onShowStats} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Zobrazit statistiky
        </Button>
      )}
    </div>
  );
};
