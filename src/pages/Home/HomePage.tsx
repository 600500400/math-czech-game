
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import PracticeTabs from "@/components/practice/PracticeTabs";
import StatisticsTabs from "@/components/statistics/StatisticsTabs";
import { useLanguage } from "@/hooks/useLanguage";

import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";



const HomePage = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);
  const { mathStats, spellingStats, dictionaryStats } = useStatistics(authState.user?.id || null);
  const { mathAnswers, spellingAnswers, dictionaryAnswers } = useDetailedAnswers(authState.user?.id || null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t } = useLanguage();

  const handleNavigateToTab = (tab: "statistics") => {
    setActiveTab(tab);
  };


  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex flex-col`}
      style={getCSSVariables}
    >
      <ModernHeader />
      <div className="container mx-auto p-4 max-w-7xl flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:shadow-sm"
              style={{
                '--active-bg': `${theme.primaryColor}22`,
                '--active-color': theme.accentColor
              } as React.CSSProperties}
            >
              {t('homePage.dashboard')}
            </TabsTrigger>
            <TabsTrigger 
              value="statistics"
              className="data-[state=active]:shadow-sm"
              style={{
                '--active-bg': `${theme.primaryColor}22`,
                '--active-color': theme.accentColor
              } as React.CSSProperties}
            >
              {t('homePage.statistics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <WelcomeDashboard 
              onNavigateToTab={handleNavigateToTab}
            />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsTabs 
              mathStats={mathStats} 
              spellingStats={spellingStats}
              dictionaryStats={dictionaryStats}
              mathAnswers={mathAnswers}
              spellingAnswers={spellingAnswers}
              dictionaryAnswers={dictionaryAnswers}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AppFooter />

    </div>
  );
};

export default HomePage;
