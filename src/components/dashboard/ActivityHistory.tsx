
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

interface ActivityHistoryProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  mathStats,
  spellingStats
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historie cvičení</CardTitle>
        <CardDescription>
          Podrobný přehled všech cvičení
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
                      <TableHead>Datum</TableHead>
                      <TableHead>Operace</TableHead>
                      <TableHead>Obtížnost</TableHead>
                      <TableHead>Správně</TableHead>
                      <TableHead>Špatně</TableHead>
                      <TableHead>Úspěšnost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mathStats.map((stat) => {
                      const total = stat.correct_answers + stat.wrong_answers;
                      const accuracy = total > 0 
                        ? Math.round((stat.correct_answers / total) * 100) 
                        : 0;
                        
                      return (
                        <TableRow key={stat.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(stat.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>{stat.operation}</TableCell>
                          <TableCell>
                            Max: {stat.difficulty_level.maxValue}, 
                            Násobení: {stat.difficulty_level.maxMultiplyValue}, 
                            Dělení: {stat.difficulty_level.maxDivideValue}
                          </TableCell>
                          <TableCell className="font-medium text-green-500">
                            {stat.correct_answers}
                          </TableCell>
                          <TableCell className="font-medium text-red-500">
                            {stat.wrong_answers}
                          </TableCell>
                          <TableCell>{accuracy}%</TableCell>
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
                      <TableHead>Datum</TableHead>
                      <TableHead>Skupina slov</TableHead>
                      <TableHead>Správně</TableHead>
                      <TableHead>Špatně</TableHead>
                      <TableHead>Úspěšnost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spellingStats.map((stat) => {
                      const total = stat.correct_answers + stat.wrong_answers;
                      const accuracy = total > 0 
                        ? Math.round((stat.correct_answers / total) * 100) 
                        : 0;
                        
                      return (
                        <TableRow key={stat.id}>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(stat.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>{stat.word_group}</TableCell>
                          <TableCell className="font-medium text-green-500">
                            {stat.correct_answers}
                          </TableCell>
                          <TableCell className="font-medium text-red-500">
                            {stat.wrong_answers}
                          </TableCell>
                          <TableCell>{accuracy}%</TableCell>
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
