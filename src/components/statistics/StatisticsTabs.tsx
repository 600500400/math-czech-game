import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailedStatisticsTable from "./DetailedStatisticsTable";
import CumulativeChart from "./CumulativeChart";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { FileText, Calculator } from "lucide-react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";

interface StatisticsTabsProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
  mathAnswers?: MathAnswer[];
  spellingAnswers?: SpellingAnswer[];
}

const StatisticsTabs = ({ 
  mathStats, 
  spellingStats, 
  mathAnswers = [], 
  spellingAnswers = [] 
}: StatisticsTabsProps) => {
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

  // Calculate overall accuracy
  const spellingAccuracy = totalSpellingProblems > 0 
    ? Math.round((totalSpellingCorrect / totalSpellingProblems) * 100) 
    : 0;
  const mathAccuracy = totalMathProblems > 0 
    ? Math.round((totalMathCorrect / totalMathProblems) * 100) 
    : 0;

  return (
    <Tabs defaultValue="spelling" className="w-full">
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
      
      <TabsContent value="spelling" className="mt-4 space-y-6">
        <div className="mb-4 flex justify-between items-center bg-orange-50 px-4 py-3 rounded-lg">
          <div className="text-gray-700">
            <span className="font-medium">Počet slov:</span> <span className="text-blue-600 font-bold">{totalSpellingProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">Správně:</span> <span className="text-green-600 font-bold">{totalSpellingCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Špatně:</span> <span className="text-red-600 font-bold">{totalSpellingWrong}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Úspěšnost:</span> <span className="text-blue-600 font-bold">{spellingAccuracy}%</span>
            </div>
          </div>
        </div>
        
        <DetailedStatisticsTable 
          type="spelling" 
          data={spellingStats}
          spellingAnswers={spellingAnswers}
        />
        
        {spellingStats.length > 0 && (
          <CumulativeChart 
            data={spellingStats} 
            type="spelling" 
          />
        )}
      </TabsContent>
      
      <TabsContent value="math" className="mt-4 space-y-6">
        <div className="mb-4 flex justify-between items-center bg-blue-50 px-4 py-3 rounded-lg">
          <div className="text-gray-700">
            <span className="font-medium">Počet příkladů:</span> <span className="text-blue-600 font-bold">{totalMathProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">Správně:</span> <span className="text-green-600 font-bold">{totalMathCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Špatně:</span> <span className="text-red-600 font-bold">{totalMathWrong}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Úspěšnost:</span> <span className="text-blue-600 font-bold">{mathAccuracy}%</span>
            </div>
          </div>
        </div>
        
        <DetailedStatisticsTable 
          type="math" 
          data={mathStats}
          mathAnswers={mathAnswers}
        />
        
        {mathStats.length > 0 && (
          <CumulativeChart 
            data={mathStats} 
            type="math" 
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;
