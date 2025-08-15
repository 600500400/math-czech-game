import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText, BookOpen } from "lucide-react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { DictionaryStatistics, DictionaryAnswer } from "@/types/dictionaryTypes";
import DetailedStatisticsTable from "./DetailedStatisticsTable";
import CumulativeChart from "./CumulativeChart";

interface MathStatistics {
  id: string;
  correct_answers: number;
  wrong_answers: number;
  operation: string;
  game_duration?: number;
  created_at: string;
}

interface SpellingStatistics {
  id: string;
  correct_answers: number;
  wrong_answers: number;
  word_group: string;
  game_duration?: number;
  created_at: string;
}
import { useLanguage } from "@/hooks/useLanguage";

interface StatisticsTabsProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
  dictionaryStats: DictionaryStatistics[];
  mathAnswers?: MathAnswer[];
  spellingAnswers?: SpellingAnswer[];
  dictionaryAnswers?: DictionaryAnswer[];
}

const StatisticsTabs: React.FC<StatisticsTabsProps> = ({ 
  mathStats, 
  spellingStats,
  dictionaryStats,
  mathAnswers, 
  spellingAnswers,
  dictionaryAnswers
}) => {
  const { t } = useLanguage();

  // Calculate summary statistics for math
  const mathTotal = mathStats.reduce((sum, stat) => sum + stat.correct_answers + stat.wrong_answers, 0);
  const mathCorrect = mathStats.reduce((sum, stat) => sum + stat.correct_answers, 0);
  const mathWrong = mathStats.reduce((sum, stat) => sum + stat.wrong_answers, 0);
  const mathAccuracy = mathTotal > 0 ? Math.round((mathCorrect / mathTotal) * 100) : 0;

  // Calculate summary statistics for spelling
  const spellingTotal = spellingStats.reduce((sum, stat) => sum + stat.correct_answers + stat.wrong_answers, 0);
  const spellingCorrect = spellingStats.reduce((sum, stat) => sum + stat.correct_answers, 0);
  const spellingWrong = spellingStats.reduce((sum, stat) => sum + stat.wrong_answers, 0);
  const spellingAccuracy = spellingTotal > 0 ? Math.round((spellingCorrect / spellingTotal) * 100) : 0;

  // Calculate summary statistics for dictionary
  const dictionaryTotal = dictionaryStats.reduce((sum, stat) => sum + stat.correct_answers + stat.wrong_answers, 0);
  const dictionaryCorrect = dictionaryStats.reduce((sum, stat) => sum + stat.correct_answers, 0);
  const dictionaryWrong = dictionaryStats.reduce((sum, stat) => sum + stat.wrong_answers, 0);
  const dictionaryAccuracy = dictionaryTotal > 0 ? Math.round((dictionaryCorrect / dictionaryTotal) * 100) : 0;

  return (
    <Tabs defaultValue="spelling" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6"
        aria-label="Výběr typu statistik"
      >
        <TabsTrigger 
          value="spelling" 
          className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4"
          aria-label="Statistiky pravopisu"
        >
          <FileText className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Pravopis</span>
            <span className="sm:hidden">{t('practice.spelling')}</span>
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="math" 
          className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4"
          aria-label="Statistiky matematiky"
        >
          <Calculator className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">{t('practice.math')}</span>
            <span className="sm:hidden">{t('practice.math')}</span>
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="dictionary" 
          className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4"
          aria-label="Statistiky slovníku"
        >
          <BookOpen className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm md:text-base">
            <span className="hidden sm:inline">Slovník</span>
            <span className="sm:hidden">Slovník</span>
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="spelling" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('practice.spelling')} - Přehled
            </CardTitle>
            <CardDescription>
              Celkem problémů: {spellingTotal} | Správně: {spellingCorrect} | Špatně: {spellingWrong} | Úspěšnost: {spellingAccuracy}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetailedStatisticsTable 
              statistics={spellingStats.map(stat => ({
                id: stat.id,
                created_at: stat.created_at,
                correct_answers: stat.correct_answers,
                wrong_answers: stat.wrong_answers,
                type: stat.word_group,
                game_duration: stat.game_duration
              }))} 
              type="spelling"
            />
          </CardContent>
        </Card>
        {spellingAnswers && spellingAnswers.length > 0 && (
          <CumulativeChart answers={spellingAnswers} type="spelling" />
        )}
      </TabsContent>

      <TabsContent value="math" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {t('practice.math')} - Přehled
            </CardTitle>
            <CardDescription>
              Celkem problémů: {mathTotal} | Správně: {mathCorrect} | Špatně: {mathWrong} | Úspěšnost: {mathAccuracy}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetailedStatisticsTable 
              statistics={mathStats.map(stat => ({
                id: stat.id,
                created_at: stat.created_at,
                correct_answers: stat.correct_answers,
                wrong_answers: stat.wrong_answers,
                type: stat.operation,
                game_duration: stat.game_duration
              }))} 
              type="math"
            />
          </CardContent>
        </Card>
        {mathAnswers && mathAnswers.length > 0 && (
          <CumulativeChart answers={mathAnswers} type="math" />
        )}
      </TabsContent>

      <TabsContent value="dictionary" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Přehled slovníku
            </CardTitle>
            <CardDescription>
              Celkem problémů: {dictionaryTotal} | Správně: {dictionaryCorrect} | Špatně: {dictionaryWrong} | Úspěšnost: {dictionaryAccuracy}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DetailedStatisticsTable 
              statistics={dictionaryStats.map(stat => ({
                id: stat.id,
                created_at: stat.created_at,
                correct_answers: stat.correct_answers,
                wrong_answers: stat.wrong_answers,
                type: `${stat.mode} (${stat.direction === 'en_to_cz' ? 'EN → CZ' : 'CZ → EN'})`,
                game_duration: stat.game_duration
              }))} 
              type="dictionary"
            />
          </CardContent>
        </Card>
        {dictionaryAnswers && dictionaryAnswers.length > 0 && (
          <CumulativeChart answers={dictionaryAnswers.map(answer => ({
            id: answer.id,
            isCorrect: answer.is_correct,
            created_at: answer.created_at,
            userAnswer: answer.user_answer,
            correctAnswer: answer.czech_translation
          }))} type="dictionary" />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;