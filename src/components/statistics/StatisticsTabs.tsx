
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticsTable from "./StatisticsTable";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { FileText, Calculator } from "lucide-react";

interface StatisticsTabsProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
}

const StatisticsTabs = ({ mathStats, spellingStats }: StatisticsTabsProps) => {
  // Calculate cumulative statistics for both categories
  const totalSpellingProblems = spellingStats.reduce((sum, stat) => 
    sum + stat.correct_answers + stat.wrong_answers, 0);
  const totalSpellingCorrect = spellingStats.reduce((sum, stat) => 
    sum + stat.correct_answers, 0);
  const totalSpellingWrong = spellingStats.reduce((sum, stat) => 
    sum + stat.wrong_answers, 0);
  
  const totalMathProblems = mathStats.reduce((sum, stat) => 
    sum + stat.correct_answers + stat.wrong_answers, 0);
  const totalMathCorrect = mathStats.reduce((sum, stat) => 
    sum + stat.correct_answers, 0);
  const totalMathWrong = mathStats.reduce((sum, stat) => 
    sum + stat.wrong_answers, 0);

  return (
    <Tabs defaultValue="spelling">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger 
          value="spelling" 
          className="text-base py-4 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
        >
          <FileText className="mr-2 h-5 w-5" /> Vyjmenovaná slova
        </TabsTrigger>
        <TabsTrigger 
          value="math" 
          className="text-base py-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
        >
          <Calculator className="mr-2 h-5 w-5" /> Matematika
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="spelling" className="mt-4">
        <div className="mb-4 flex justify-between items-center bg-orange-50 px-4 py-3 rounded-lg">
          <div className="text-gray-700">
            <span className="font-medium">Počet slov:</span> <span className="text-blue-600">{totalSpellingProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">Správně:</span> <span className="text-green-600">{totalSpellingCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Špatně:</span> <span className="text-red-600">{totalSpellingWrong}</span>
            </div>
          </div>
        </div>
        
        <StatisticsTable 
          type="spelling" 
          data={spellingStats} 
        />
      </TabsContent>
      
      <TabsContent value="math" className="mt-4">
        <div className="mb-4 flex justify-between items-center bg-blue-50 px-4 py-3 rounded-lg">
          <div className="text-gray-700">
            <span className="font-medium">Počet příkladů:</span> <span className="text-blue-600">{totalMathProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">Správně:</span> <span className="text-green-600">{totalMathCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Špatně:</span> <span className="text-red-600">{totalMathWrong}</span>
            </div>
          </div>
        </div>
        
        <StatisticsTable 
          type="math" 
          data={mathStats} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;
