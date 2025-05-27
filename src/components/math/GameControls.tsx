
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, AlertCircle } from "lucide-react";

interface GameControlsProps {
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
  onShowErrors: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  problemCount,
  correctAnswers,
  wrongAnswers,
  totalAnswers,
  correctPercentage,
  difficultySet,
  gameEnded,
  onSetDifficulty,
  onStartGame,
  onShowStats,
  onResetGame,
  onShowErrors,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          Počet příkladů: <Badge variant="outline">{problemCount}</Badge>
        </p>
        <div className="flex gap-2">
          <p className="text-green-500 font-medium">
            Správné: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
          <p className="text-red-500 font-medium">
            Špatné: <Badge variant="outline">{wrongAnswers}</Badge>
          </p>
        </div>
      </div>

      {/* Progress bar for ongoing statistics */}
      {totalAnswers > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Úspěšnost</span>
            <span className="font-medium">{correctPercentage}%</span>
          </div>
          <Progress value={correctPercentage} className="h-3" />
        </div>
      )}

      <div className="space-y-2">
        {/* Main action button - more prominent */}
        <Button 
          onClick={onStartGame} 
          className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6" 
        >
          Spustit hru
        </Button>
        
        {/* Secondary action - less prominent */}
        <Button 
          onClick={onSetDifficulty} 
          variant="outline"
          className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          <Settings size={16} className="mr-2" /> Nastavit obtížnost
        </Button>
        
        {totalAnswers > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onShowStats}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Zobrazit statistiku
            </Button>
            
            <Button
              onClick={onShowErrors}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <AlertCircle size={16} className="mr-1" />
              Chyby
            </Button>
          </div>
        )}

        {gameEnded && (
          <Button
            onClick={onResetGame}
            className="w-full bg-gray-500 hover:bg-gray-600"
          >
            Resetovat statistiky
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameControls;
