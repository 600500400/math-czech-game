
import { Button } from "@/components/ui/button";
import { Settings, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onResetGame: () => void;
}

const CustomGameControls = ({
  difficultySet,
  gameEnded,
  onSetDifficulty,
  onStartGame,
  onResetGame
}: CustomGameControlsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Action Button */}
      <Button 
        onClick={onStartGame} 
        className={`bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-lg touch-manipulation ${isMobile ? 'h-16' : 'h-14'}`}
        disabled={!difficultySet}
      >
        <Play className="mr-2 h-5 w-5" /> 
        Spustit hru
      </Button>
        
      {/* Secondary Actions */}
      <Button
        variant="outline"
        className={`text-orange-500 border-orange-500 hover:bg-orange-50 active:bg-orange-100 touch-manipulation ${isMobile ? 'h-12' : ''}`}
        onClick={onSetDifficulty}
      >
        <Settings className="mr-2 h-5 w-5" />
        Nastavit obtížnost
      </Button>
    </div>
  );
};

export default CustomGameControls;
