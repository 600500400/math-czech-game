
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { useStatistics } from "@/hooks/useStatistics";

export const useStatisticsConnection = (userId: string | null) => {
  const { checkLocalUserMode } = useStatistics(userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");
  const [isLocalStorageMode, setIsLocalStorageMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  
  // Vylepšená kontrola připojení s exponenciálním backoff
  const checkConnection = useCallback(async (forceCheck = false) => {
    const now = Date.now();
    
    // Omezení četnosti kontrol (ne častěji než každých 5 sekund)
    if (!forceCheck && now - lastCheckTime < 5000) {
      console.log("Příliš časté kontroly spojení, přeskakuji...");
      return;
    }
    
    try {
      setLastCheckTime(now);
      setDbConnectionStatus("checking");
      console.log(`Kontrola připojení k databázi (pokus ${retryCount + 1})...`);
      
      // Přidání timeoutu pro případ, že by Supabase nereagoval
      const connectionPromise = checkSupabaseConnection();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout při kontrole spojení")), 5000);
      });
      
      const result = await Promise.race([connectionPromise, timeoutPromise]) as any;
      
      if (result.success) {
        setDbConnectionStatus("connected");
        setRetryCount(0); // Reset počtu pokusů při úspěchu
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
        setRetryCount(prev => prev + 1);
        console.error("Database connection problem:", result.error);
      }
    } catch (error) {
      setDbConnectionStatus("error");
      setIsLocalStorageMode(true);
      setRetryCount(prev => prev + 1);
      console.error("Error checking database:", error);
    }
  }, [checkLocalUserMode, retryCount, lastCheckTime]);
  
  // První kontrola připojení
  useEffect(() => {
    checkConnection();
  }, [userId, checkLocalUserMode, checkConnection]);
  
  // Automatické pokusy o znovupřipojení s rostoucími intervaly
  useEffect(() => {
    if (dbConnectionStatus !== "connected" && retryCount > 0) {
      // Exponenciální backoff (max 30 sekund)
      const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
      console.log(`Naplánování automatického pokusu o připojení za ${delay/1000} sekund...`);
      
      const timer = setTimeout(() => {
        console.log("Automatický pokus o připojení...");
        checkConnection(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [dbConnectionStatus, retryCount, checkConnection]);
  
  // Kontrola při návratu do aplikace (když uživatel přepne zpět z jiné záložky)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && dbConnectionStatus !== "connected") {
        console.log("Uživatel se vrátil do aplikace, kontroluji připojení");
        checkConnection(true);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [dbConnectionStatus, checkConnection]);
  
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
        setRetryCount(0);
        toast.success(`Připojení k databázi funkční (${connectionResult.elapsed}ms)`);
        
        // Pokud jsme v lokálním režimu, zkontrolujeme znovu
        const localMode = await checkLocalUserMode();
        setIsLocalStorageMode(localMode);
        
        // Reset stránky pro načtení aktuálních dat
        window.location.reload();
      } else {
        setDbConnectionStatus("disconnected");
        setRetryCount(prev => prev + 1);
        toast.error("Problém s připojením k databázi. Používám lokální úložiště.");
      }
    } catch (err) {
      console.error("Chyba při obnovování dat:", err);
      toast.error("Chyba při obnovování dat. Zkuste to později.");
      setIsRefreshing(false);
    }
  };
  
  return {
    dbConnectionStatus,
    isLocalStorageMode,
    isRefreshing,
    handleRefreshData,
    checkConnection,
    retryCount
  };
};
