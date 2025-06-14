
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import PracticeTabs from "@/components/practice/PracticeTabs";
import StatisticsTabs from "@/components/statistics/StatisticsTabs";
import ModernHeader from "@/components/layout/ModernHeader";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";

const HomePage = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);
  const { mathAnswers, spellingAnswers } = useDetailedAnswers(authState.user?.id || null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [practiceDefaultTab, setPracticeDefaultTab] = useState<"spelling" | "math">("spelling");

  const handleNavigateToTab = (tab: "practice" | "statistics") => {
    setActiveTab(tab);
  };

  const handleNavigateToPractice = (defaultTab: "spelling" | "math") => {
    setPracticeDefaultTab(defaultTab); // Nastavím správnou záložku
    setActiveTab("practice"); // Přejdu na procvičování
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient}`}
      style={getCSSVariables}
    >
      <ModernHeader />
      <div className="container mx-auto p-4 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:shadow-sm"
              style={{
                '--active-bg': `${theme.primaryColor}22`,
                '--active-color': theme.accentColor
              } as React.CSSProperties}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="practice"
              className="data-[state=active]:shadow-sm"
              style={{
                '--active-bg': `${theme.primaryColor}22`,
                '--active-color': theme.accentColor
              } as React.CSSProperties}
            >
              Procvičování
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:shadow-sm"
              style={{
                '--active-bg': `${theme.primaryColor}22`,
                '--active-color': theme.accentColor
              } as React.CSSProperties}
            >
              Statistiky
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <WelcomeDashboard 
              onNavigateToTab={handleNavigateToTab}
              onNavigateToPractice={handleNavigateToPractice}
            />
          </TabsContent>

          <TabsContent value="practice">
            <PracticeTabs defaultTab={practiceDefaultTab} />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTabs 
              mathStats={mathStats} 
              spellingStats={spellingStats}
              mathAnswers={mathAnswers}
              spellingAnswers={spellingAnswers}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant available on all tabs */}
      <AIAssistantDrawer 
        subject={activeTab === 'practice' ? practiceDefaultTab : undefined}
        context={{
          recentErrors: [],
          userStats: activeTab === 'practice' && practiceDefaultTab === 'math' ? mathStats : spellingStats
        }}
      />
    </div>
  );
};

export default HomePage;
