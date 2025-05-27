
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MathAnswer } from "@/types/mathTypes";
import { formatDate } from "@/utils/dateUtils";

interface MathErrorsSectionProps {
  answers: MathAnswer[];
}

const MathErrorsSection: React.FC<MathErrorsSectionProps> = ({ answers }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);
  
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

  if (wrongAnswers.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Detailní přehled chyb
                <Badge variant="destructive">{wrongAnswers.length}</Badge>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Příklad</TableHead>
                  <TableHead>Vaše odpověď</TableHead>
                  <TableHead>Správná odpověď</TableHead>
                  <TableHead>Čas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wrongAnswers.map((answer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {answer.problem.num1} {formatOperation(answer.problem.operation)} {answer.problem.num2} = ?
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default MathErrorsSection;
