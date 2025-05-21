
import { Button } from "@/components/ui/button";
import { Settings, BarChart3, RotateCcw, Play } from "lucide-react";

interface CustomGameControlsProps {
  problemCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  correctPercentage: number;
  difficultySet: boolean;
  gameEnded: boolean;
  onSetDifficulty: () => void;
  onStartGame: () => void;
  onShowStats: () => void;
  onResetGame: () => void;
}

const CustomGameControls = ({
  difficultySet,
  gameEnded,
  onSetDifficulty,
  onStartGame,
  onShowStats,
  onResetGame
}: CustomGameControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Primary Action Button */}
      <Button 
        onClick={onStartGame} 
        className="bg-orange-500 hover:bg-orange-600 h-14 text-lg"
        disabled={!difficultySet}
      >
        <Play className="mr-2 h-5 w-5" /> 
        Spustit hru
      </Button>
        
      {/* Secondary Actions */}
      <Button
        variant="outline"
        className="text-orange-500 border-orange-500 hover:bg-orange-50"
        onClick={onSetDifficulty}
      >
        <Settings className="mr-2 h-5 w-5" />
        Nastavit obtížnost
      </Button>
      
      {/* Additional Controls Row */}
      <div className="flex gap-2 justify-between">
        <Button 
          variant="ghost" 
          className="flex-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          onClick={onShowStats}
        >
          <BarChart3 className="mr-2 h-5 w-5" />
          Statistiky
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex-1 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          onClick={onResetGame}
          disabled={!gameEnded}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CustomGameControls;
