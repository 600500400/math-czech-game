
import React from "react";
import { formatDate } from "@/utils/dateUtils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

interface DetailedStatisticsTableProps {
  type: "math" | "spelling";
  data: MathStatistics[] | SpellingStatistics[];
}

const DetailedStatisticsTable: React.FC<DetailedStatisticsTableProps> = ({ type, data }) => {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Zatím nemáte žádné statistiky {type === "math" ? "matematiky" : "pravopisu"}.
      </p>
    );
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const formatMathDifficulty = (difficulty: any) => {
    if (!difficulty) return "N/A";
    return `±${difficulty.maxValue}, ×${difficulty.maxMultiplyValue}, ÷${difficulty.maxDivideValue}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Datum</TableHead>
            <TableHead className="min-w-[100px]">
              {type === "math" ? "Operace" : "Skupina slov"}
            </TableHead>
            <TableHead className="text-center">Správně</TableHead>
            <TableHead className="text-center">Špatně</TableHead>
            <TableHead className="text-center">Úspěšnost</TableHead>
            {type === "math" && (
              <TableHead className="min-w-[150px]">Obtížnost</TableHead>
            )}
            <TableHead className="text-center">Doba hry</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stat) => {
            const total = stat.correct_answers + stat.wrong_answers;
            const accuracy = total > 0 ? Math.round((stat.correct_answers / total) * 100) : 0;
            
            return (
              <TableRow key={stat.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(stat.created_at)}
                </TableCell>
                <TableCell>
                  {type === "math" 
                    ? (stat as MathStatistics).operation 
                    : (stat as SpellingStatistics).word_group}
                </TableCell>
                <TableCell className="text-center text-green-600 font-medium">
                  {stat.correct_answers}
                </TableCell>
                <TableCell className="text-center text-red-600 font-medium">
                  {stat.wrong_answers}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {accuracy}%
                </TableCell>
                {type === "math" && (
                  <TableCell className="text-sm">
                    {formatMathDifficulty((stat as MathStatistics).difficulty_level)}
                  </TableCell>
                )}
                <TableCell className="text-center text-sm">
                  {formatDuration((stat as any).game_duration)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailedStatisticsTable;
