import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import StatisticsTabs from "@/components/statistics/StatisticsTabs";

import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";

const HomePage = () => {
  const { authState } = useAuth();
  const { mathStats, spellingStats, dictionaryStats } = useStatistics(authState.user?.id || null);
  const { mathAnswers, spellingAnswers, dictionaryAnswers } = useDetailedAnswers(authState.user?.id || null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleNavigateToTab = (tab: "statistics") => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ModernHeader />
      <div className="container mx-auto p-4 max-w-7xl flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="statistics">Statistiky</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <WelcomeDashboard onNavigateToTab={handleNavigateToTab} />
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
