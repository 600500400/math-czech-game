
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathPractice from "../MathPractice";
import SpellingPractice from "../SpellingPractice";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Badge } from "@/components/ui/badge";
import { FileText, Calculator } from "lucide-react";

interface PracticeTabsProps {
  defaultTab?: "spelling" | "math";
}

const PracticeTabs = ({ defaultTab = "spelling" }: PracticeTabsProps) => {
  const { t } = useLanguage();
  
  // Get user ID for statistics
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { theme, getCSSVariables } = useUserTheme(userId);
  
  // Get statistics for both game types
  const { mathStats, spellingStats } = useStatistics(userId);
  
  // Calculate cumulative statistics for spelling
  const totalSpellingProblems = spellingStats.reduce((sum, stat) => 
    sum + stat.correct_answers + stat.wrong_answers, 0);
  const totalSpellingCorrect = spellingStats.reduce((sum, stat) => 
    sum + stat.correct_answers, 0);
  const totalSpellingWrong = spellingStats.reduce((sum, stat) => 
    sum + stat.wrong_answers, 0);
  
  // Calculate cumulative statistics for math
  const totalMathProblems = mathStats.reduce((sum, stat) => 
    sum + stat.correct_answers + stat.wrong_answers, 0);
  const totalMathCorrect = mathStats.reduce((sum, stat) => 
    sum + stat.correct_answers, 0);
  const totalMathWrong = mathStats.reduce((sum, stat) => 
    sum + stat.wrong_answers, 0);

  return (
    <div style={getCSSVariables}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="spelling"
            className="text-base py-4 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
            style={{
              '--active-bg': `${theme.secondaryColor}44`,
              '--active-color': theme.accentColor
            } as React.CSSProperties}
          >
            <FileText className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm md:text-base">
              <span className="hidden sm:inline">{t('practice.spellingWords')}</span>
              <span className="sm:hidden">{t('practice.spelling')}</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="math"
            className="text-base py-4 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
            style={{
              '--active-bg': `${theme.primaryColor}22`,
              '--active-color': theme.accentColor
            } as React.CSSProperties}
          >
            <Calculator className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm md:text-base">{t('practice.mathematics')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spelling">
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium" style={{ color: theme.primaryColor }}>
              {t('practice.total')}: <Badge variant="outline">{totalSpellingProblems || 0}</Badge>
            </p>
            <div className="flex gap-2 items-center">
              <p className="text-green-500 font-medium">
                {t('practice.correct')}: <Badge variant="outline">{totalSpellingCorrect || 0}</Badge>
              </p>
              <p className="text-red-500 font-medium">
                {t('practice.wrong')}: <Badge variant="outline">{totalSpellingWrong || 0}</Badge>
              </p>
            </div>
          </div>
          <SpellingPractice />
        </TabsContent>
        
        <TabsContent value="math">
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium" style={{ color: theme.primaryColor }}>
              {t('practice.total')}: <Badge variant="outline">{totalMathProblems || 0}</Badge>
            </p>
            <div className="flex gap-2 items-center">
              <p className="text-green-500 font-medium">
                {t('practice.correct')}: <Badge variant="outline">{totalMathCorrect || 0}</Badge>
              </p>
              <p className="text-red-500 font-medium">
                {t('practice.wrong')}: <Badge variant="outline">{totalMathWrong || 0}</Badge>
              </p>
            </div>
          </div>
          <MathPractice />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PracticeTabs;
