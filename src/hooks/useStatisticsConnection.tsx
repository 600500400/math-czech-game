
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { useStatistics } from "@/hooks/useStatistics";

export const useStatisticsConnection = (userId: string | null) => {
  const { checkLocalUserMode } = useStatistics(userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");
  const [isLocalStorageMode, setIsLocalStorageMode] = useState(false);
  
  // Kontrola připojení
  useEffect(() => {
    checkConnection();
  }, [userId, checkLocalUserMode]);
  
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
  
  return {
    dbConnectionStatus,
    isLocalStorageMode,
    isRefreshing,
    handleRefreshData,
    checkConnection
  };
};
