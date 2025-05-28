
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { formatDate } from "@/utils/dateUtils";

interface ErrorsTooltipProps {
  wrongCount: number;
  answers: MathAnswer[] | SpellingAnswer[];
  type: "math" | "spelling";
}

const ErrorsTooltip: React.FC<ErrorsTooltipProps> = ({ wrongCount, answers, type }) => {
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);
  
  if (wrongCount === 0 || wrongAnswers.length === 0) {
    return <span className="text-red-600 font-medium">{wrongCount}</span>;
  }

  const formatOperation = (operation: string): string => {
    switch (operation) {
      case "*":
        return "·";
      case "/":
        return ":";
      default:
        return operation;
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="text-red-600 font-medium cursor-pointer hover:text-red-700 hover:underline">
          {wrongCount}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 max-h-60 overflow-y-auto">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Detaily chyb:</h4>
          <div className="space-y-1 text-xs">
            {wrongAnswers.slice(0, 10).map((answer, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div className="flex-1">
                  {type === "math" ? (
                    <span>
                      {(answer as MathAnswer).problem.num1} {formatOperation((answer as MathAnswer).problem.operation)} {(answer as MathAnswer).problem.num2} = ?
                    </span>
                  ) : (
                    <span>
                      {(answer as SpellingAnswer).word} (poz. {(answer as SpellingAnswer).position + 1})
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant="destructive" className="text-xs">{answer.userAnswer}</Badge>
                  <Badge variant="outline" className="text-xs">{answer.correctAnswer}</Badge>
                </div>
              </div>
            ))}
            {wrongAnswers.length > 10 && (
              <div className="text-center text-gray-500 text-xs">
                ... a dalších {wrongAnswers.length - 10} chyb
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ErrorsTooltip;
