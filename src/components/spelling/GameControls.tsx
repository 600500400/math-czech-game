
import { Button } from "@/components/ui/button";

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
      <Button 
        onClick={onShowGroupDialog} 
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        Vybrat skupiny slov
      </Button>
      
      <Button 
        onClick={onStartGame} 
        className="w-full bg-orange-500 hover:bg-orange-600" 
        disabled={selectedGroupsCount === 0}
      >
        Spustit hru
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
