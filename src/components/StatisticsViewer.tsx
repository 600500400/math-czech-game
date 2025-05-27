
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";
import StatisticsTabs from "./statistics/StatisticsTabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const {
    mathStats,
    spellingStats,
    isLoading,
    currentUserId,
    resetUserStatistics,
    forceRefreshAllStatistics
  } = useStatistics(authState.user?.id || null);
  
  const { mathAnswers, spellingAnswers, clearAllAnswers } = useDetailedAnswers(currentUserId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  if (!authState.isAuthenticated) {
    return <UnauthenticatedState />;
  }
  
  if (isLoading) {
    return <LoadingStatisticsState />;
  }
  
  const handleResetStatistics = () => {
    if (currentUserId) {
      const success = resetUserStatistics(currentUserId);
      if (success) {
        clearAllAnswers(); // Also clear detailed answers
        toast.success("Statistiky byly úspěšně vymazány");
        forceRefreshAllStatistics();
      } else {
        toast.error("Nepodařilo se vymazat statistiky");
      }
      setShowDeleteDialog(false);
    }
  };
  
  const hasAnyStats = mathStats && mathStats.length > 0 || spellingStats && spellingStats.length > 0;
  
  if (!hasAnyStats) {
    return <EmptyStatisticsState />;
  }
  
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Podrobné statistiky</CardTitle>
        <div className="flex items-center gap-2">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-400 text-sm font-normal">
                <Trash2 className="h-4 w-4 mr-1" />
                Resetovat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Opravdu chcete smazat všechny statistiky?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tato akce je nevratná. Všechny vaše statistiky budou trvale vymazány.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetStatistics}>
                  Ano, smazat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <StatisticsTabs 
          mathStats={mathStats} 
          spellingStats={spellingStats}
          mathAnswers={mathAnswers}
          spellingAnswers={spellingAnswers}
        />
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
