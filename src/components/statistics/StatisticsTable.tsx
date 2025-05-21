
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

interface StatisticsTableProps {
  type: "math" | "spelling";
  data: MathStatistics[] | SpellingStatistics[];
}

const StatisticsTable = ({ type, data }: StatisticsTableProps) => {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Zatím nemáte žádné statistiky {type === "math" ? "matematiky" : "pravopisu"}.
      </p>
    );
  }

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((stat) => (
          <TableRow key={stat.id}>
            <TableCell>{formatDate(stat.created_at)}</TableCell>
            <TableCell>
              {type === "math" 
                ? (stat as MathStatistics).operation 
                : (stat as SpellingStatistics).word_group}
            </TableCell>
            <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
            <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StatisticsTable;
