
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MathAnswer } from "@/types/mathTypes";

interface StatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correctAnswers: number;
  wrongAnswers: number;
  answers: MathAnswer[];
}

export const StatisticsDialog: React.FC<StatisticsDialogProps> = ({
  open,
  onOpenChange,
  correctAnswers,
  wrongAnswers,
  answers
}) => {
  const totalAnswers = correctAnswers + wrongAnswers;
  const successRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Statistiky hry</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Správných odpovědí</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
            <div className="text-sm text-gray-600">Chybných odpovědí</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">{successRate}%</div>
            <div className="text-sm text-gray-600">Úspěšnost</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
