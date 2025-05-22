
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";
import StatisticsTabs from "./statistics/StatisticsTabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { 
    mathStats, 
    spellingStats, 
    mathStatsLoading, 
    spellingStatsLoading,
    forceRefreshAllStatistics,
    resetUserStatistics,
    isLoading
  } = useStatistics(userId);
  
  // Přidáme stav pro dlouhé načítání
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Efekt pro kontrolu dlouhého načítání
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTooLong(true);
      }, 3000); // Po 3 sekundách označíme načítání jako dlouhé
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTooLong(false);
    }
  }, [isLoading]);
  
  // Funkce pro ruční znovunačtení statistik
  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    if (forceRefreshAllStatistics()) {
      toast.info(`Přenačítání statistik pro uživatele ${userId}...`);
    } else {
      toast.error("Nelze přenačíst statistiky - žádný uživatel není přihlášen");
    }
  };

  // Funkce pro resetování statistik
  const handleResetStatistics = () => {
    if (!userId) {
      toast.error("Nelze resetovat statistiky - žádný uživatel není přihlášen");
      return;
    }

    if (resetUserStatistics(userId)) {
      toast.success(`Statistiky pro uživatele ${authState.profile?.username || userId} byly resetovány`);
      forceRefreshAllStatistics();
    } else {
      toast.error("Resetování statistik se nezdařilo");
    }
  };
  
  // Efekt pro kontrolu, zda statistiky byly správně načteny
  useEffect(() => {
    if (userId && !mathStatsLoading && !spellingStatsLoading) {
      console.log("Statistiky zkontrolovány po přihlášení:", {
        mathStatsCount: mathStats?.length || 0,
        spellingStatsCount: spellingStats?.length || 0,
        userId
      });
    }
  }, [userId, mathStatsLoading, spellingStatsLoading, mathStats, spellingStats, refreshTrigger]);
  
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
          <LoadingStatisticsState 
            hasRetried={loadingTooLong}
          />
        </CardContent>
      </Card>
    );
  }

  const hasStats = mathStats.length > 0 || spellingStats.length > 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-center">Moje statistiky</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              className="text-xs flex items-center gap-1"
            >
              <RefreshCcw className="h-3 w-3" />
              Obnovit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!hasStats}
                  className="text-xs flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                  Resetovat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resetovat statistiky</AlertDialogTitle>
                  <AlertDialogDescription>
                    Opravdu chcete smazat všechny statistiky? Tato akce je nevratná a odstraní všechny záznamy o matematice i pravopisu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetStatistics} className="bg-red-500 hover:bg-red-600">
                    Resetovat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          {mathStats.length === 0 && spellingStats.length === 0 ? (
            <EmptyStatisticsState />
          ) : (
            <StatisticsTabs
              mathStats={mathStats}
              spellingStats={spellingStats}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default StatisticsViewer;
