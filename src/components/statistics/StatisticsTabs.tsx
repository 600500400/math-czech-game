import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText, BookOpen } from "lucide-react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { DictionaryStatistics, DictionaryAnswer } from "@/types/dictionaryTypes";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import DetailedStatisticsTable from "./DetailedStatisticsTable";
import CumulativeChart from "./CumulativeChart";
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
              data={spellingStats}
              type="spelling"
              spellingAnswers={spellingAnswers}
            />
          </CardContent>
        </Card>
        {spellingAnswers && spellingAnswers.length > 0 && (
          <CumulativeChart data={spellingStats} type="spelling" />
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
              data={mathStats}
              type="math"
              mathAnswers={mathAnswers}
            />
          </CardContent>
        </Card>
        {mathAnswers && mathAnswers.length > 0 && (
          <CumulativeChart data={mathStats} type="math" />
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{dictionaryTotal}</div>
                  <div className="text-sm text-muted-foreground">Celkem</div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{dictionaryCorrect}</div>
                  <div className="text-sm text-muted-foreground">Správně</div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{dictionaryWrong}</div>
                  <div className="text-sm text-muted-foreground">Špatně</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{dictionaryAccuracy}%</div>
                  <div className="text-sm text-muted-foreground">Úspěšnost</div>
                </div>
              </div>
              
              {dictionaryStats.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Nedávné hry</h3>
                  <div className="space-y-2">
                    {dictionaryStats.slice(0, 5).map((stat) => (
                      <div key={stat.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <span className="font-medium">
                            Slovník ({stat.direction === 'en_to_cz' ? 'EN → CZ' : 'CZ → EN'})
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {new Date(stat.created_at).toLocaleDateString('cs-CZ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            <span className="text-green-600">{stat.correct_answers}</span> / 
                            <span className="text-red-600">{stat.wrong_answers}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((stat.correct_answers / (stat.correct_answers + stat.wrong_answers)) * 100)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;