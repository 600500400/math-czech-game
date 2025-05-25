
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

  const formatDifficulty = (difficulty: any) => {
    if (!difficulty) return "N/A";
    return `±${difficulty.maxValue}, ×${difficulty.maxMultiplyValue}, ÷${difficulty.maxDivideValue}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>
            {type === "math" ? "Operace" : "Skupina slov"}
          </TableHead>
          <TableHead>Správně</TableHead>
          <TableHead>Špatně</TableHead>
          <TableHead>Úspěšnost</TableHead>
          {type === "math" && (
            <>
              <TableHead>Obtížnost</TableHead>
              <TableHead>Doba hry</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((stat) => {
          const total = stat.correct_answers + stat.wrong_answers;
          const accuracy = total > 0 ? Math.round((stat.correct_answers / total) * 100) : 0;
          
          return (
            <TableRow key={stat.id}>
              <TableCell>{formatDate(stat.created_at)}</TableCell>
              <TableCell>
                {type === "math" 
                  ? (stat as MathStatistics).operation 
                  : (stat as SpellingStatistics).word_group}
              </TableCell>
              <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
              <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
              <TableCell className="font-medium">{accuracy}%</TableCell>
              {type === "math" && (
                <>
                  <TableCell className="text-sm">
                    {formatDifficulty((stat as MathStatistics).difficulty_level)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDuration((stat as MathStatistics).game_duration)}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DetailedStatisticsTable;
