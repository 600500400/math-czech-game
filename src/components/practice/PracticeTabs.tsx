
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import MathPractice from "@/components/MathPractice";
import SpellingPractice from "@/components/SpellingPractice";
import { Calculator, BookOpen, Brain } from "lucide-react";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";

interface PracticeTabsProps {
  defaultTab?: "spelling" | "math";
}

const PracticeTabs: React.FC<PracticeTabsProps> = ({ defaultTab = "spelling" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);

  // Update active tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Get recent errors for AI context
  const getRecentErrors = (subject: 'math' | 'spelling') => {
    // This would ideally come from detailed error tracking
    // For now, we'll return empty array but this could be enhanced
    return [];
  };

  const getSubjectStats = (subject: 'math' | 'spelling') => {
    return subject === 'math' ? mathStats : spellingStats;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Procvičování</h2>
        <p className="text-muted-foreground">
          Vyber si předmět a začni procvičovat!
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "spelling" | "math")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spelling" className="flex items-center gap-2">
            <BookOpen size={16} />
            Pravopis
          </TabsTrigger>
          <TabsTrigger value="math" className="flex items-center gap-2">
            <Calculator size={16} />
            Matematika
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spelling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Procvičování pravopisu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpellingPractice />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="math" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Procvičování matematiky
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MathPractice />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant with subject context */}
      <AIAssistantDrawer 
        subject={activeTab}
        context={{
          recentErrors: getRecentErrors(activeTab),
          userStats: getSubjectStats(activeTab)
        }}
        trigger={
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <Brain className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default PracticeTabs;
