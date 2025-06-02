
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailedStatisticsTable from "./DetailedStatisticsTable";
import CumulativeChart from "./CumulativeChart";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { FileText, Calculator } from "lucide-react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
  
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
          <FileText className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">{t('practice.spellingWords')}</span>
            <span className="sm:hidden">{t('practice.spelling')}</span>
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="math" 
          className="text-base py-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
        >
          <Calculator className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm md:text-base">{t('practice.mathematics')}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="spelling" className="mt-4 space-y-6">
        <div className="mb-4 flex justify-between items-center bg-orange-50 px-4 py-3 rounded-lg">
          <div className="text-gray-700 hidden sm:block">
            <span className="font-medium">{t('statistics.total')}:</span> <span className="text-blue-600 font-bold">{totalSpellingProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">{t('statistics.correct')}:</span> <span className="text-green-600 font-bold">{totalSpellingCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">{t('statistics.wrong')}:</span> <span className="text-red-600 font-bold">{totalSpellingWrong}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">
                <span className="hidden sm:inline">{t('statistics.accuracy')}:</span>
                <span className="sm:hidden">{t('statistics.success')}:</span>
              </span> <span className="text-blue-600 font-bold">{spellingAccuracy}%</span>
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
          <div className="text-gray-700 hidden sm:block">
            <span className="font-medium">{t('statistics.total')}:</span> <span className="text-blue-600 font-bold">{totalMathProblems}</span>
          </div>
          <div className="flex gap-4">
            <div className="text-gray-700">
              <span className="font-medium">{t('statistics.correct')}:</span> <span className="text-green-600 font-bold">{totalMathCorrect}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">{t('statistics.wrong')}:</span> <span className="text-red-600 font-bold">{totalMathWrong}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">
                <span className="hidden sm:inline">{t('statistics.accuracy')}:</span>
                <span className="sm:hidden">{t('statistics.success')}:</span>
              </span> <span className="text-blue-600 font-bold">{mathAccuracy}%</span>
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
