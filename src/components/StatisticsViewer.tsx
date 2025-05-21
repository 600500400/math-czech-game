
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
import { AlertCircle, Database, Download } from "lucide-react";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

    // Výpis všech klíčů v localStorage pro diagnostiku
    console.log("Aktuální localStorage klíče:");
    Object.keys(localStorage).forEach(key => {
      console.log(` - ${key}: ${localStorage.getItem(key)?.substring(0, 30)}...`);
    });
  }, [authState, userId, mathStats, spellingStats, isLocalStorageMode]);

  // Funkce pro vynucené testování připojení k Supabase
  const testSupabaseConnection = async () => {
    toast.info("Testuji přímé připojení k Supabase...");
    
    try {
      const result = await checkSupabaseConnection();
      if (result.success) {
        toast.success(`Přímé připojení k Supabase úspěšné (${result.elapsed}ms)`);
        
        // Zkusíme načíst profily
        const { data, error } = await supabase.from('profiles').select('*').limit(5);
        
        if (error) {
          toast.error(`Chyba při načítání profilů: ${error.message}`);
        } else {
          toast.success(`Načteno ${data?.length || 0} profilů z databáze`);
          console.log("Profily:", data);
        }
        
      } else {
        toast.error(`Problém s připojením k Supabase: ${result.error?.message || 'Neznámá chyba'}`);
      }
    } catch (error: any) {
      console.error("Chyba při testování Supabase:", error);
      toast.error(`Neočekávaná chyba: ${error.message || 'Neznámá chyba'}`);
    }
  };

  // Funkce pro export lokálních statistik
  const exportLocalStatistics = () => {
    const statsData = {
      user: userId,
      timestamp: new Date().toISOString(),
      mathStats: mathStats,
      spellingStats: spellingStats,
      localStorage: {}
    };
    
    // Přidáme obsah localStorage (pouze statistiky)
    Object.keys(localStorage).forEach(key => {
      if (key.includes('Stats_') || key.startsWith('mathStats_') || key.startsWith('spellingStats_')) {
        try {
          statsData.localStorage[key] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
          statsData.localStorage[key] = localStorage.getItem(key);
        }
      }
    });
    
    // Vytvoříme a stáhneme soubor
    const dataStr = JSON.stringify(statsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `procvicka-stats-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Statistiky exportovány do JSON souboru");
  };

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
        
        {/* Diagnostické informace a nástroje */}
        <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Diagnostické informace</h4>
              <p className="text-xs text-amber-600 mt-1">
                {isLocalStorageMode 
                  ? "Aplikace běží v offline režimu. Vaše statistiky jsou ukládány lokálně."
                  : "Aplikace je připojena k databázi Supabase."}
              </p>
              
              <div className="mt-2 text-xs text-amber-600">
                <p>Status připojení: {connectionStatus}</p>
                <p>Režim: {isLocalStorageMode ? 'Lokální úložiště' : 'Online databáze'}</p>
                <p>Uživatelské ID: {userId || 'Neuvedeno'}</p>
                <p>Počet uložených statistik: {mathStats.length + spellingStats.length}</p>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                >
                  <Database className="h-4 w-4 mr-1" />
                  Zkontrolovat připojení
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={testSupabaseConnection}
                >
                  <Database className="h-4 w-4 mr-1" />
                  Test Supabase
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportLocalStatistics}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportovat statistiky
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
