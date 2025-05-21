
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "./ui/button";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { checkSupabaseConnection } from "@/integrations/supabase/client";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { mathStats, spellingStats, mathStatsLoading, spellingStatsLoading, checkLocalUserMode } = useStatistics(userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");
  const [isLocalStorageMode, setIsLocalStorageMode] = useState(false);
  
  // Kontrola připojení
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setDbConnectionStatus("checking");
        const result = await checkSupabaseConnection();
        
        if (result.success) {
          setDbConnectionStatus("connected");
          console.log("Database connection verified:", result);
          
          // Zjistíme, zda jsme v lokálním režimu
          const localMode = await checkLocalUserMode();
          setIsLocalStorageMode(localMode);
          
          if (localMode) {
            console.log("Aplikace je v lokálním režimu pro statistiky");
          }
        } else {
          setDbConnectionStatus("disconnected");
          setIsLocalStorageMode(true);
          console.error("Database connection problem:", result.error);
        }
      } catch (error) {
        setDbConnectionStatus("error");
        setIsLocalStorageMode(true);
        console.error("Error checking database:", error);
      }
    };
    
    checkConnection();
  }, [checkLocalUserMode]);
  
  useEffect(() => {
    // Debugging information
    console.log("StatisticsViewer - Auth State:", authState);
    console.log("StatisticsViewer - User ID:", userId);
    console.log("StatisticsViewer - Math Stats:", mathStats);
    console.log("StatisticsViewer - Spelling Stats:", spellingStats);
    console.log("StatisticsViewer - Is Local Storage Mode:", isLocalStorageMode);
  }, [authState, userId, mathStats, spellingStats, isLocalStorageMode]);

  // Funkce pro ruční obnovení dat
  const handleRefreshData = async () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    toast.info("Obnovuji statistiky a kontroluji připojení...");
    
    try {
      // Kontrola připojení k databázi
      const connectionResult = await checkSupabaseConnection();
      
      if (connectionResult.success) {
        setDbConnectionStatus("connected");
        toast.success(`Připojení k databázi funkční (${connectionResult.elapsed}ms)`);
      } else {
        setDbConnectionStatus("disconnected");
        toast.error("Problém s připojením k databázi. Používám lokální úložiště.");
      }
      
      // Obnovení dat pomocí reloadu stránky
      window.location.reload();
    } catch (err) {
      console.error("Chyba při obnovování dat:", err);
      toast.error("Chyba při obnovování dat");
      setIsRefreshing(false);
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-center text-gray-500">Pro zobrazení statistik se přihlaste.</p>
        </CardContent>
      </Card>
    );
  }

  if (mathStatsLoading || spellingStatsLoading) {
    return (
      <Card>
        <CardContent className="pt-4 flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
          <p className="text-center text-gray-500">Načítání statistik...</p>
        </CardContent>
      </Card>
    );
  }

  if (mathStats.length === 0 && spellingStats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-center text-gray-500">Zatím nemáte žádné statistiky. Zahrajte si hru!</p>
            
            {/* Indikátor stavu databáze */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Database className="h-4 w-4" />
              {dbConnectionStatus === "connected" ? (
                <span className="text-green-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                  Databáze připojena
                </span>
              ) : dbConnectionStatus === "checking" ? (
                <span className="text-amber-500 flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Kontroluji připojení...
                </span>
              ) : (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {isLocalStorageMode ? "Používám lokální úložiště" : "Problém s připojením"}
                </span>
              )}
              
              <Button 
                variant="ghost" 
                size="xs" 
                className="h-6 text-xs" 
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Ověřit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-center">Moje statistiky</CardTitle>
        <div className="flex items-center gap-2">
          {/* Indikátor stavu databáze */}
          <div className="flex items-center gap-1 text-sm text-gray-400">
            {dbConnectionStatus === "connected" ? (
              <span className="text-green-500 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                {isLocalStorageMode ? "Lokální režim" : "Online"}
              </span>
            ) : dbConnectionStatus === "checking" ? (
              <span className="text-amber-500 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Kontrola
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Offline
              </span>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Obnovit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spelling">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
            <TabsTrigger value="math">Matematika</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spelling" className="mt-4">
            {spellingStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Skupina slov</TableHead>
                    <TableHead>Správně</TableHead>
                    <TableHead>Špatně</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spellingStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{stat.word_group}</TableCell>
                      <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
                      <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Zatím nemáte žádné statistiky pravopisu.</p>
            )}
          </TabsContent>
          
          <TabsContent value="math" className="mt-4">
            {mathStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Operace</TableHead>
                    <TableHead>Správně</TableHead>
                    <TableHead>Špatně</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mathStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{stat.operation}</TableCell>
                      <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
                      <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Zatím nemáte žádné statistiky matematiky.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
