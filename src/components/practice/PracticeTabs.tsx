
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathPractice from "../MathPractice";
import SpellingPractice from "../SpellingPractice";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Badge } from "@/components/ui/badge";

interface PracticeTabsProps {
  defaultTab?: "spelling" | "math";
}

const PracticeTabs = ({ defaultTab = "spelling" }: PracticeTabsProps) => {
  // Get user ID for statistics
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  
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
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger 
          value="spelling"
          className="text-base py-4 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
        >
          Vyjmenovaná slova
        </TabsTrigger>
        <TabsTrigger 
          value="math"
          className="text-base py-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50"
        >
          Matematika
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="spelling">
        <div className="flex justify-between items-center mb-4">
          <p className="text-blue-500 font-medium">
            Počet slov: <Badge variant="outline">{totalSpellingProblems || 0}</Badge>
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-green-500 font-medium">
              Správně: <Badge variant="outline">{totalSpellingCorrect || 0}</Badge>
            </p>
            <p className="text-red-500 font-medium">
              Špatně: <Badge variant="outline">{totalSpellingWrong || 0}</Badge>
            </p>
          </div>
        </div>
        <SpellingPractice />
      </TabsContent>
      
      <TabsContent value="math">
        <div className="flex justify-between items-center mb-4">
          <p className="text-blue-500 font-medium">
            Počet příkladů: <Badge variant="outline">{totalMathProblems || 0}</Badge>
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-green-500 font-medium">
              Správně: <Badge variant="outline">{totalMathCorrect || 0}</Badge>
            </p>
            <p className="text-red-500 font-medium">
              Špatně: <Badge variant="outline">{totalMathWrong || 0}</Badge>
            </p>
          </div>
        </div>
        <MathPractice />
      </TabsContent>
    </Tabs>
  );
};

export default PracticeTabs;
