
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useStatisticsConnection } from "@/hooks/useStatisticsConnection";
import DatabaseConnectionStatus from "./statistics/DatabaseConnectionStatus";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";
import StatisticsTabs from "./statistics/StatisticsTabs";
import DiagnosticsPanel from "./statistics/DiagnosticsPanel";
import { useDiagnostics } from "@/hooks/statistics/useDiagnostics";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { mathStats, spellingStats, mathStatsLoading, spellingStatsLoading } = useStatistics(userId);
  const { 
    dbConnectionStatus, 
    isLocalStorageMode, 
    isRefreshing, 
    handleRefreshData,
    connectionStatus,
    retryCount
  } = useStatisticsConnection(userId);
  
  // Diagnostic tools
  const { testSupabaseConnection, exportLocalStatistics } = useDiagnostics(
    userId, 
    mathStats, 
    spellingStats
  );
  
  // Přidáme stav pro dlouhé načítání
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  
  // Pokud načítání trvá příliš dlouho, ukážeme možnost zkusit to znovu
  useEffect(() => {
    if (mathStatsLoading || spellingStatsLoading) {
      const timer = setTimeout(() => {
        setLoadingTooLong(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTooLong(false);
    }
  }, [mathStatsLoading, spellingStatsLoading]);
  
  useEffect(() => {
    // Debugging information
    console.log("StatisticsViewer - Auth State:", authState);
    console.log("StatisticsViewer - User ID:", userId);
    console.log("StatisticsViewer - Math Stats:", mathStats);
    console.log("StatisticsViewer - Spelling Stats:", spellingStats);
    console.log("StatisticsViewer - Is Local Storage Mode:", isLocalStorageMode);

    // Výpis všech klíčů v localStorage pro diagnostiku
    console.log("Aktuální localStorage klíče:");
    Object.keys(localStorage).forEach(key => {
      console.log(` - ${key}: ${localStorage.getItem(key)?.substring(0, 30)}...`);
    });
  }, [authState, userId, mathStats, spellingStats, isLocalStorageMode]);

  if (!authState.isAuthenticated) {
    return (
      <Card>
        <CardContent>
          <UnauthenticatedState 
            dbConnectionStatus={dbConnectionStatus}
            isRefreshing={isRefreshing}
            onRefresh={handleRefreshData}
          />
        </CardContent>
      </Card>
    );
  }

  if (mathStatsLoading || spellingStatsLoading) {
    return (
      <Card>
        <CardContent>
          <LoadingStatisticsState 
            retryConnection={loadingTooLong ? handleRefreshData : undefined}
            hasRetried={loadingTooLong}
          />
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
        <StatisticsTabs
          mathStats={mathStats}
          spellingStats={spellingStats}
        />
        
        {/* Diagnostické informace a nástroje */}
        <DiagnosticsPanel
          isLocalStorageMode={isLocalStorageMode}
          connectionStatus={connectionStatus}
          userId={userId}
          statsCount={mathStats.length + spellingStats.length}
          onTestConnection={testSupabaseConnection}
          onRefreshData={handleRefreshData}
          onExportStatistics={exportLocalStatistics}
          isRefreshing={isRefreshing}
        />
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
