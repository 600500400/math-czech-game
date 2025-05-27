
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SpellingAnswer } from "@/types/spellingTypes";
import { formatDate } from "@/utils/dateUtils";

interface SpellingDetailedErrorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answers: SpellingAnswer[];
}

const SpellingDetailedErrorsDialog: React.FC<SpellingDetailedErrorsDialogProps> = ({
  open,
  onOpenChange,
  answers
}) => {
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detailní přehled chyb v pravopisu</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {wrongAnswers.length === 0 ? (
            <p className="text-center text-green-600 font-medium">
              Skvělé! Neudělali jste žádnou chybu! 🎉
            </p>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                Počet chyb: <Badge variant="destructive">{wrongAnswers.length}</Badge>
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slovo</TableHead>
                    <TableHead>Skupina</TableHead>
                    <TableHead>Pozice</TableHead>
                    <TableHead>Vaše odpověď</TableHead>
                    <TableHead>Správná odpověď</TableHead>
                    <TableHead>Čas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrongAnswers.map((answer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {answer.word}
                      </TableCell>
                      <TableCell>
                        {answer.wordGroup}
                      </TableCell>
                      <TableCell>
                        {answer.position + 1}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {answer.userAnswer}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {answer.correctAnswer}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(answer.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Zavřít
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpellingDetailedErrorsDialog;
