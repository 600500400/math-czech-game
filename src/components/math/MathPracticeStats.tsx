
import React from "react";
import { Card } from "@/components/ui/card";

interface MathPracticeStatsProps {
  correctAnswers: number;
  wrongAnswers: number;
}

export const MathPracticeStats: React.FC<MathPracticeStatsProps> = ({
  correctAnswers,
  wrongAnswers
}) => {
  const totalAnswers = correctAnswers + wrongAnswers;
  const successRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  if (totalAnswers === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
      <Card className="p-4 text-center glass-light border-white/30">
        <div className="text-2xl font-bold text-success-600">{correctAnswers}</div>
        <div className="text-sm text-gray-600">Správně</div>
      </Card>
      
      <Card className="p-4 text-center glass-light border-white/30">
        <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
        <div className="text-sm text-gray-600">Špatně</div>
      </Card>
      
      <Card className="p-4 text-center glass-light border-white/30">
        <div className="text-2xl font-bold text-subject-math">{successRate}%</div>
        <div className="text-sm text-gray-600">Úspěšnost</div>
      </Card>
    </div>
  );
};
