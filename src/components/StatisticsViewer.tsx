
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useStatisticsConnection } from "@/hooks/useStatisticsConnection";
import DatabaseConnectionStatus from "./statistics/DatabaseConnectionStatus";
import StatisticsTable from "./statistics/StatisticsTable";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";
import { Button } from "./ui/button";
import { AlertCircle, Database } from "lucide-react";

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
        
        {/* Diagnostické informace pro lokální režim */}
        {isLocalStorageMode && retryCount > 3 && (
          <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Diagnostické informace</h4>
                <p className="text-xs text-amber-600 mt-1">
                  Aplikace běží v offline režimu. Vaše statistiky jsou ukládány lokálně a budou synchronizovány, až bude k dispozici připojení.
                </p>
                <div className="mt-2 text-xs text-amber-600">
                  <p>Status připojení: {connectionStatus}</p>
                  <p>Počet pokusů o připojení: {retryCount}</p>
                </div>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshData}
                    disabled={isRefreshing}
                  >
                    <Database className="h-4 w-4 mr-1" />
                    Diagnostikovat připojení
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
