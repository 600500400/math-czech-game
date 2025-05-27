
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SpellingAnswer } from "@/types/spellingTypes";
import { formatDate } from "@/utils/dateUtils";

interface SpellingErrorsSectionProps {
  answers: SpellingAnswer[];
}

const SpellingErrorsSection: React.FC<SpellingErrorsSectionProps> = ({ answers }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);

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
                Detailní přehled chyb v pravopisu
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SpellingErrorsSection;
