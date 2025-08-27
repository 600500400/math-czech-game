
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface GameControlsProps {
  selectedGroupsCount: number;
  onShowGroupDialog: () => void;
  onStartGame: () => void;
}

export const GameControls = ({
  selectedGroupsCount,
  onShowGroupDialog,
  onStartGame
}: GameControlsProps) => {
  return (
    <div className="space-y-2">
      {/* Primary action button - unified blue-purple gradient */}
      <Button 
        onClick={onStartGame} 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-lg py-6" 
        disabled={selectedGroupsCount === 0}
      >
        Spustit hru
      </Button>
      
      {/* Secondary action - consistent styling */}
      <Button 
        onClick={onShowGroupDialog} 
        variant="outline"
        className="w-full py-2 border-subject-spelling-border text-subject-spelling hover:bg-subject-spelling-light dark:border-subject-spelling dark:text-subject-spelling dark:hover:bg-subject-spelling-light/10"
      >
        <Settings size={16} className="mr-2" /> Vybrat skupiny slov
      </Button>
    </div>
  );
};
