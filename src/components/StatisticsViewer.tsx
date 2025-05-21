
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { useStatisticsConnection } from "@/hooks/useStatisticsConnection";
import DatabaseConnectionStatus from "./statistics/DatabaseConnectionStatus";
import StatisticsTable from "./statistics/StatisticsTable";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { mathStats, spellingStats, mathStatsLoading, spellingStatsLoading } = useStatistics(userId);
  const { 
    dbConnectionStatus, 
    isLocalStorageMode, 
    isRefreshing, 
    handleRefreshData 
  } = useStatisticsConnection(userId);
  
  useEffect(() => {
    // Debugging information
    console.log("StatisticsViewer - Auth State:", authState);
    console.log("StatisticsViewer - User ID:", userId);
    console.log("StatisticsViewer - Math Stats:", mathStats);
    console.log("StatisticsViewer - Spelling Stats:", spellingStats);
    console.log("StatisticsViewer - Is Local Storage Mode:", isLocalStorageMode);
  }, [authState, userId, mathStats, spellingStats, isLocalStorageMode]);

  if (!authState.isAuthenticated) {
    return (
      <Card>
        <CardContent>
          <UnauthenticatedState />
        </CardContent>
      </Card>
    );
  }

  if (mathStatsLoading || spellingStatsLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingStatisticsState />
        </CardContent>
      </Card>
    );
  }

  if (mathStats.length === 0 && spellingStats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <EmptyStatisticsState 
            dbConnectionStatus={dbConnectionStatus}
            isLocalStorageMode={isLocalStorageMode}
            isRefreshing={isRefreshing}
            onRefresh={handleRefreshData}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-center">Moje statistiky</CardTitle>
        <DatabaseConnectionStatus 
          status={dbConnectionStatus} 
          isRefreshing={isRefreshing}
          onRefresh={handleRefreshData}
          isLocalStorageMode={isLocalStorageMode}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spelling">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
            <TabsTrigger value="math">Matematika</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spelling" className="mt-4">
            <StatisticsTable 
              type="spelling" 
              data={spellingStats} 
            />
          </TabsContent>
          
          <TabsContent value="math" className="mt-4">
            <StatisticsTable 
              type="math" 
              data={mathStats} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
