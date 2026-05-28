
import React, { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { useIsMobile } from "@/hooks/use-mobile";

import { logger } from "@/utils/logger";
interface ErrorsTooltipProps {
  wrongCount: number;
  answers: MathAnswer[] | SpellingAnswer[];
  type: "math" | "spelling";
}

const ErrorsTooltip: React.FC<ErrorsTooltipProps> = ({ wrongCount, answers, type }) => {
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  logger.log("ErrorsTooltip - props:", { wrongCount, answersCount: answers.length, type });
  
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);
  
  logger.log("ErrorsTooltip - wrongAnswers:", wrongAnswers);
  
  if (wrongCount === 0) {
    return <span className="text-red-600 font-medium">{wrongCount}</span>;
  }

  if (wrongAnswers.length === 0) {
    return (
      <span className="text-red-600 font-medium" title="Žádné detaily chyb nejsou k dispozici">
        {wrongCount}
      </span>
    );
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

  const ErrorsContent = () => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-800">
        Detaily chyb ({wrongAnswers.length}):
      </h4>
      <div className="space-y-2 text-xs">
        {wrongAnswers.slice(0, 15).map((answer, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded-md border border-red-100">
            <div className="flex-1 font-mono text-gray-700">
              {type === "math" ? (
                <span>
                  {(answer as MathAnswer).problem.num1} {formatOperation((answer as MathAnswer).problem.operation)} {(answer as MathAnswer).problem.num2} = ?
                </span>
              ) : (
                <span>
                  {(answer as SpellingAnswer).word} (pozice {(answer as SpellingAnswer).position + 1})
                </span>
              )}
            </div>
            <div className="flex gap-2 text-xs">
              <Badge variant="destructive" className="text-xs px-2">
                {answer.userAnswer}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 bg-green-50 border-green-200">
                {answer.correctAnswer}
              </Badge>
            </div>
          </div>
        ))}
        {wrongAnswers.length > 15 && (
          <div className="text-center text-gray-500 text-xs py-2">
            ... a dalších {wrongAnswers.length - 15} chyb
          </div>
        )}
      </div>
    </div>
  );

  // Na mobilu použijeme dialog místo hover karty
  if (isMobile) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-red-600 font-medium hover:text-red-700 hover:underline transition-colors p-0 h-auto"
          >
            {wrongCount}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailní přehled chyb</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ErrorsContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Na desktopu použijeme hover kartu
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="text-red-600 font-medium cursor-pointer hover:text-red-700 hover:underline transition-colors">
          {wrongCount}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 max-h-72 overflow-y-auto" side="top" align="center">
        <ErrorsContent />
      </HoverCardContent>
    </HoverCard>
  );
};

export default ErrorsTooltip;
