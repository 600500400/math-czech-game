
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StatDisplayProps {
  title: string;
  accuracy: number;
  correct: number;
  wrong: number;
  total: number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({
  title,
  accuracy,
  correct,
  wrong,
  total
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Úspěšnost</span>
          <span className="font-medium">{accuracy}%</span>
        </div>
        <Progress value={accuracy} className="h-3" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-green-500">{correct}</p>
          <p className="text-sm text-gray-500">Správně</p>
        </div>
        <div>
          <p className="text-xl font-bold text-red-500">{wrong}</p>
          <p className="text-sm text-gray-500">Špatně</p>
        </div>
        <div>
          <p className="text-xl font-bold">{total}</p>
          <p className="text-sm text-gray-500">Celkem</p>
        </div>
      </div>
    </div>
  );
};

export default StatDisplay;
