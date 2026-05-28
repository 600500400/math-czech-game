
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import EmptyStatisticsState from "./statistics/EmptyStatisticsState";
import LoadingStatisticsState from "./statistics/LoadingStatisticsState";
import UnauthenticatedState from "./statistics/UnauthenticatedState";
import StatisticsTabs from "./statistics/StatisticsTabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/useLanguage";

import { logger } from "@/utils/logger";
const StatisticsViewer = () => {
  const { t } = useLanguage();
  const { authState } = useAuth();
  const {
    mathStats,
    spellingStats,
    dictionaryStats,
    isLoading,
    currentUserId,
    resetUserStatistics,
    forceRefreshAllStatistics
  } = useStatistics(authState.user?.id || null);
  
  const { mathAnswers, spellingAnswers, dictionaryAnswers, clearAllAnswers } = useDetailedAnswers(currentUserId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Debug logging
  useEffect(() => {
    logger.log("📊 StatisticsViewer - render s parametry:", {
      authUserId: authState.user?.id,
      currentUserId,
      mathStatsCount: mathStats?.length || 0,
      spellingStatsCount: spellingStats?.length || 0,
      mathAnswersCount: mathAnswers.length,
      spellingAnswersCount: spellingAnswers.length,
      mathWrongCount: mathAnswers.filter(a => !a.isCorrect).length,
      spellingWrongCount: spellingAnswers.filter(a => !a.isCorrect).length
    });
  }, [authState.user?.id, currentUserId, mathStats, spellingStats, mathAnswers, spellingAnswers]);
  
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
        toast.success(t('statistics.statisticsDeleted'));
        forceRefreshAllStatistics();
      } else {
        toast.error(t('statistics.deleteFailed'));
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
        <CardTitle className="text-xl">{t('statistics.detailedStatistics')}</CardTitle>
        <div className="flex items-center gap-2">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-400 text-sm font-normal">
                <Trash2 className="h-4 w-4 mr-1" />
                {t('statistics.reset')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('statistics.confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('statistics.deleteConfirmation')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetStatistics}>
                  {t('statistics.yesDelete')}
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
          dictionaryStats={dictionaryStats}
          mathAnswers={mathAnswers}
          spellingAnswers={spellingAnswers}
          dictionaryAnswers={dictionaryAnswers}
        />
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;
