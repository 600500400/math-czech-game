
import { useState, useEffect, useCallback } from "react";
import { ConnectionStatus, ConnectionHistoryEntry } from "@/types/connectionTypes";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useConnectionRetry = (
  userId: string | null,
  checkLocalUserMode: () => Promise<boolean>
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [connectionHistory, setConnectionHistory] = useState<ConnectionHistoryEntry[]>([]);
  
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
      setStatus("checking");
      console.log(`Kontrola připojení k databázi (pokus ${retryCount + 1})...`);
      
      // Přidání timeoutu pro případ, že by Supabase nereagoval
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setStatus("connected");
        setRetryCount(0); // Reset počtu pokusů při úspěchu
        console.log("Database connection verified:", result);
        addToHistory(true);
        
        // Zjistíme, zda jsme v lokálním režimu
        const localMode = await checkLocalUserMode();
        setIsLocalMode(localMode);
        
        if (localMode) {
          console.log("Aplikace je v lokálním režimu pro fallback");
        }
        
        return result;
      } else {
        setStatus("disconnected");
        setIsLocalMode(true);
        setRetryCount(prev => prev + 1);
        console.error("Database connection problem:", result.error);
        addToHistory(false);
        
        return result;
      }
    } catch (error) {
      setStatus("error");
      setIsLocalMode(true);
      setRetryCount(prev => prev + 1);
      console.error("Error checking database:", error);
      addToHistory(false);
      
      return {
        success: false,
        error
      };
    }
  }, [checkLocalUserMode, retryCount, lastCheckTime]);
  
  // Automatické pokusy o znovupřipojení s rostoucími intervaly
  useEffect(() => {
    if (status !== "connected" && retryCount > 0) {
      // Exponenciální backoff (max 30 sekund)
      const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000);
      console.log(`Naplánování automatického pokusu o připojení za ${delay/1000} sekund...`);
      
      const timer = setTimeout(() => {
        console.log("Automatický pokus o připojení...");
        checkConnection(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [status, retryCount, checkConnection]);
  
  // Funkce pro ruční obnovení dat
  const handleRefreshData = async () => {
    if (isRefreshing) {
      console.log("Obnovení již probíhá, ignoruji požadavek");
      return;
    }
    
    setIsRefreshing(true);
    toast.info("Obnovuji statistiky a kontroluji připojení k databázi...");
    
    try {
      // Kontrola připojení k databázi
      const result = await checkConnection(true);
      
      setIsRefreshing(false);
      
      if (result.success) {
        const elapsed = 'elapsed' in result ? result.elapsed : 0;
        toast.success(`Připojení k databázi funkční (${elapsed}ms)`);
        
        // Pokud jsme v lokálním režimu, zkontrolujeme znovu
        const localMode = await checkLocalUserMode();
        setIsLocalMode(localMode);
        
        if (localMode) {
          toast.info("Používám lokální režim jako fallback");
        } else {
          // Reload stránky pro načtení aktuálních dat z databáze
          window.location.reload();
        }
      } else if ('offline' in result && result.offline) {
        toast.error("Internetové připojení není dostupné. Používám lokální režim.");
      } else if ('timeout' in result && result.timeout) {
        toast.error("Vypršel čas pro připojení k databázi. Používám lokální režim.");
      } else {
        toast.error("Problém s připojením k databázi. Zkouším lokální fallback.");
      }
    } catch (err) {
      console.error("Chyba při obnovování dat:", err);
      toast.error("Chyba při obnovování dat. Zkuste to později.");
      setIsRefreshing(false);
    }
  };

  return {
    status,
    isLocalMode,
    isRefreshing,
    retryCount,
    connectionHistory,
    checkConnection,
    handleRefreshData,
    setIsRefreshing
  };
};
