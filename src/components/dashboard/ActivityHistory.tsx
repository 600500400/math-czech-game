
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import ErrorsTooltip from "@/components/statistics/ErrorsTooltip";

interface ActivityHistoryProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
  mathAnswers?: MathAnswer[];
  spellingAnswers?: SpellingAnswer[];
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  mathStats,
  spellingStats,
  mathAnswers = [],
  spellingAnswers = []
}) => {
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Function to get answers for a specific session
  const getAnswersForSession = (stat: any, type: 'math' | 'spelling') => {
    const sessionTime = new Date(stat.created_at).getTime();
    const sessionWindowMs = 10 * 60 * 1000; // 10 minutes window
    
    if (type === 'math') {
      return mathAnswers.filter(answer => {
        const answerTime = new Date(answer.timestamp).getTime();
        const timeDiff = Math.abs(answerTime - sessionTime);
        return timeDiff < sessionWindowMs;
      });
    } else {
      return spellingAnswers.filter(answer => {
        const answerTime = new Date(answer.timestamp).getTime();
        const timeDiff = Math.abs(answerTime - sessionTime);
        return timeDiff < sessionWindowMs;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historie cvičení</CardTitle>
        <CardDescription>
          Podrobný přehled všech cvičení s detailními chybami
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="math">
          <TabsList className="mb-4">
            <TabsTrigger value="math">Matematika</TabsTrigger>
            <TabsTrigger value="spelling">Pravopis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="math">
            {mathStats.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[160px]">Datum</TableHead>
                      <TableHead>Operace</TableHead>
                      <TableHead className="min-w-[200px]">Obtížnost</TableHead>
                      <TableHead className="text-center">Správně</TableHead>
                      <TableHead className="text-center">Špatně</TableHead>
                      <TableHead className="text-center">Úspěšnost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mathStats.map((stat) => {
                      const total = stat.correct_answers + stat.wrong_answers;
                      const accuracy = total > 0 
                        ? Math.round((stat.correct_answers / total) * 100) 
                        : 0;
                      const sessionAnswers = getAnswersForSession(stat, 'math');
                        
                      return (
                        <TableRow key={stat.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(stat.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>{stat.operation}</TableCell>
                          <TableCell className="text-sm">
                            Max: {stat.difficulty_level.maxValue}, 
                            Násobení: {stat.difficulty_level.maxMultiplyValue}, 
                            Dělení: {stat.difficulty_level.maxDivideValue}
                          </TableCell>
                          <TableCell className="text-center font-medium text-green-500">
                            {stat.correct_answers}
                          </TableCell>
                          <TableCell className="text-center">
                            <ErrorsTooltip 
                              wrongCount={stat.wrong_answers}
                              answers={sessionAnswers}
                              type="math"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">{accuracy}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                Zatím nejsou k dispozici žádné statistiky pro matematiku
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="spelling">
            {spellingStats.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[160px]">Datum</TableHead>
                      <TableHead>Skupina slov</TableHead>
                      <TableHead className="text-center">Správně</TableHead>
                      <TableHead className="text-center">Špatně</TableHead>
                      <TableHead className="text-center">Úspěšnost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spellingStats.map((stat) => {
                      const total = stat.correct_answers + stat.wrong_answers;
                      const accuracy = total > 0 
                        ? Math.round((stat.correct_answers / total) * 100) 
                        : 0;
                      const sessionAnswers = getAnswersForSession(stat, 'spelling');
                        
                      return (
                        <TableRow key={stat.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(stat.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>{stat.word_group}</TableCell>
                          <TableCell className="text-center font-medium text-green-500">
                            {stat.correct_answers}
                          </TableCell>
                          <TableCell className="text-center">
                            <ErrorsTooltip 
                              wrongCount={stat.wrong_answers}
                              answers={sessionAnswers}
                              type="spelling"
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold">{accuracy}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                Zatím nejsou k dispozici žádné statistiky pro pravopis
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
