
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
        <Button 
          onClick={onSetDifficulty} 
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Nastavit obtížnost
        </Button>
        
        <Button 
          onClick={onStartGame} 
          className="w-full bg-orange-500 hover:bg-orange-600" 
          disabled={!difficultySet}
        >
          Spustit hru
        </Button>
        
        {totalAnswers > 0 && (
          <Button
            onClick={onShowStats}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Zobrazit statistiku
          </Button>
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
