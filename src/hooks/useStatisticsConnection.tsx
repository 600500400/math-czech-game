
import { useEffect } from "react";
import { useStatistics } from "@/hooks/useStatistics";
import { useConnectionRetry } from "./connection/useConnectionRetry";
import { useNetworkEvents } from "./connection/useNetworkEvents";
import { useConnectionAnalysis } from "./connection/useConnectionAnalysis";
import { ConnectionHookResult } from "@/types/connectionTypes";

export const useStatisticsConnection = (userId: string | null): ConnectionHookResult => {
  const { checkLocalUserMode } = useStatistics(userId);
  
  const {
    status: dbConnectionStatus,
    isLocalMode: isLocalStorageMode,
    isRefreshing,
    retryCount,
    connectionHistory,
    checkConnection,
    handleRefreshData
  } = useConnectionRetry(userId, checkLocalUserMode);

  // Nastavit síťové event listenery
  useNetworkEvents(checkConnection);
  
  // Analýza připojení
  const { analyzeConnection } = useConnectionAnalysis(connectionHistory);
  
  // První kontrola připojení
  useEffect(() => {
    checkConnection();
  }, [userId, checkConnection]);
  
  return {
    dbConnectionStatus,
    isLocalStorageMode,
    isRefreshing,
    handleRefreshData,
    checkConnection,
    retryCount,
    connectionStatus: analyzeConnection()
  };
};
