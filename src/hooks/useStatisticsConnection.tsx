
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
  const [connectionHistory, setConnectionHistory] = useState<{time: number, success: boolean}[]>([]);
  
  // Přidání do historie kontrol
  const addToHistory = (success: boolean) => {
    setConnectionHistory(prev => {
      const newHistory = [...prev, {time: Date.now(), success}];
      // Omezení velikosti historie
      if (newHistory.length > 10) {
        return newHistory.slice(-10);
      }
      return newHistory;
    });
  };
  
  // Vylepšená kontrola připojení s exponenciálním backoff
  const checkConnection = useCallback(async (forceCheck = false) => {
    const now = Date.now();
    
    // Omezení četnosti kontrol (ne častěji než každé 3 sekundy)
    if (!forceCheck && now - lastCheckTime < 3000) {
      console.log("Příliš časté kontroly spojení, přeskakuji...");
      return {
        success: false,
        skipped: true
      };
    }
    
    try {
      setLastCheckTime(now);
      setDbConnectionStatus("checking");
      console.log(`Kontrola připojení k databázi (pokus ${retryCount + 1})...`);
      
      // Přidání timeoutu pro případ, že by Supabase nereagoval
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setDbConnectionStatus("connected");
        setRetryCount(0); // Reset počtu pokusů při úspěchu
        console.log("Database connection verified:", result);
        addToHistory(true);
        
        // Zjistíme, zda jsme v lokálním režimu
        const localMode = await checkLocalUserMode();
        setIsLocalStorageMode(localMode);
        
        if (localMode) {
          console.log("Aplikace je v lokálním režimu pro statistiky");
        }
        
        return result;
      } else {
        setDbConnectionStatus("disconnected");
        setIsLocalStorageMode(true);
        setRetryCount(prev => prev + 1);
        console.error("Database connection problem:", result.error);
        addToHistory(false);
        
        return result;
      }
    } catch (error) {
      setDbConnectionStatus("error");
      setIsLocalStorageMode(true);
      setRetryCount(prev => prev + 1);
      console.error("Error checking database:", error);
      addToHistory(false);
      
      return {
        success: false,
        error
      };
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
      if (document.visibilityState === 'visible') {
        console.log("Uživatel se vrátil do aplikace, kontroluji připojení");
        
        // Při návratu do aplikace, počkáme 2 sekundy na ustálení síťového připojení
        setTimeout(() => {
          checkConnection(true);
        }, 2000);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkConnection]);
  
  // Kontrola při online/offline změnách
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Zařízení přešlo do online režimu, kontroluji připojení...");
      toast.info("Internetové připojení obnoveno, kontroluji připojení k databázi");
      
      // Počkáme 2 sekundy na ustálení síťového připojení
      setTimeout(() => {
        checkConnection(true);
      }, 2000);
    };
    
    const handleOffline = () => {
      console.log("⚠️ Zařízení přešlo do offline režimu");
      toast.warning("Internetové připojení ztraceno, přepínám do offline režimu");
      setDbConnectionStatus("disconnected");
      setIsLocalStorageMode(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);
  
  // Funkce pro ruční obnovení dat
  const handleRefreshData = async () => {
    if (isRefreshing) {
      console.log("Obnovení již probíhá, ignoruji požadavek");
      return;
    }
    
    setIsRefreshing(true);
    toast.info("Obnovuji statistiky a kontroluji připojení...");
    
    try {
      // Kontrola připojení k databázi
      const result = await checkConnection(true);
      
      setIsRefreshing(false);
      
      if (result.success) {
        toast.success(`Připojení k databázi funkční (${result.elapsed}ms)`);
        
        // Pokud jsme v lokálním režimu, zkontrolujeme znovu
        const localMode = await checkLocalUserMode();
        setIsLocalStorageMode(localMode);
        
        if (localMode) {
          toast.info("Používám lokální režim pro statistiky");
        } else {
          // Reload stránky pro načtení aktuálních dat z databáze
          window.location.reload();
        }
      } else if (result.offline) {
        toast.error("Internetové připojení není dostupné. Používám lokální režim.");
      } else if (result.timeout) {
        toast.error("Vypršel čas pro připojení k databázi. Používám lokální režim.");
      } else {
        toast.error("Problém s připojením k databázi. Používám lokální úložiště.");
      }
    } catch (err) {
      console.error("Chyba při obnovování dat:", err);
      toast.error("Chyba při obnovování dat. Zkuste to později.");
      setIsRefreshing(false);
    }
  };
  
  // Analýza připojení
  const analyzeConnection = () => {
    if (connectionHistory.length === 0) {
      return "Zatím neproběhly žádné kontroly připojení";
    }
    
    const successCount = connectionHistory.filter(h => h.success).length;
    const successRate = (successCount / connectionHistory.length) * 100;
    
    if (successRate === 0) {
      return "Všechny pokusy o připojení selhaly";
    } else if (successRate < 30) {
      return "Velmi nestabilní připojení";
    } else if (successRate < 70) {
      return "Nestabilní připojení";
    } else if (successRate < 100) {
      return "Občasné výpadky připojení";
    } else {
      return "Stabilní připojení";
    }
  };
  
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
