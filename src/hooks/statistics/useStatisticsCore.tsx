
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  const [isLocalMode, setIsLocalMode] = useState<boolean | null>(true); // Nastaveno jako true pro výchozí hodnotu
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  
  // Efekt pro automatickou kontrolu režimu
  useEffect(() => {
    const checkMode = async () => {
      const mode = await checkLocalUserMode();
      setIsLocalMode(mode);
    };
    
    if (userId) {
      checkMode();
    }
  }, [userId]);
  
  // Efekt pro kontrolu připojení databáze
  useEffect(() => {
    const checkDb = async () => {
      try {
        // Since there are no tables yet, we'll just check basic connectivity
        const { error } = await supabase.auth.getSession();
          
        if (error) {
          console.error("Database check failed:", error);
          setDbStatus("disconnected");
        } else {
          console.log("Database check succeeded - connection is working");
          setDbStatus("connected");
        }
      } catch (err) {
        console.error("Database check error:", err);
        setDbStatus("disconnected");
      }
    };
    
    checkDb();
  }, []);

  // Check if user is in local mode (without Supabase authentication)
  const checkLocalUserMode = async () => {
    // Vždy používáme lokální režim, dokud není explicitně prokázáno jinak
    return true;
  };

  // Get a unique key for storing statistics for a specific user
  const getLocalStorageKey = (baseKey: string) => {
    // Zajištění jedinečného klíče pro každého uživatele
    const storageKey = userId ? `${baseKey}_${userId}` : baseKey;
    console.log(`Generovaný storage klíč: ${storageKey} pro uživatele ${userId || 'anonym'}`);
    return storageKey;
  };

  // Get statistics for children (for parents)
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    try {
      console.log("Fetching statistics for child ID:", childId);
      
      // Vždy používáme lokální data
      console.log("Používám lokální data pro dítě:", childId);
      const mathKey = `mathStats_${childId}`;
      const spellingKey = `spellingStats_${childId}`;
      
      const mathData = localStorage.getItem(mathKey);
      const spellingData = localStorage.getItem(spellingKey);
      
      console.log("Načtená matematická data:", mathData ? JSON.parse(mathData) : []);
      console.log("Načtená data pravopisu:", spellingData ? JSON.parse(spellingData) : []);
      
      return {
        mathStats: mathData ? JSON.parse(mathData) : [],
        spellingStats: spellingData ? JSON.parse(spellingData) : []
      };
    } catch (error) {
      console.error("Unexpected error fetching child statistics:", error);
      return { mathStats: [], spellingStats: [] };
    }
  };

  // Nová funkce pro resetování statistik konkrétního uživatele
  const resetUserStatistics = (specificUserId: string) => {
    try {
      localStorage.removeItem(`mathStats_${specificUserId}`);
      localStorage.removeItem(`spellingStats_${specificUserId}`);
      console.log(`Statistiky pro uživatele ${specificUserId} byly resetovány`);
      return true;
    } catch (error) {
      console.error(`Chyba při resetování statistik uživatele ${specificUserId}:`, error);
      return false;
    }
  };

  // Nová funkce pro výpis všech lokálních klíčů
  const listAllLocalStatistics = () => {
    const stats = {};
    Object.keys(localStorage).forEach(key => {
      if (key.includes('Stats_')) {
        try {
          stats[key] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
          stats[key] = 'Chyba při načítání';
        }
      }
    });
    console.log("Všechny lokální statistiky:", stats);
    return stats;
  };

  return {
    checkLocalUserMode,
    getLocalStorageKey,
    getChildStatistics,
    resetUserStatistics,
    listAllLocalStatistics,
    isLocalMode,
    dbStatus
  };
};
