
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  const [isLocalMode, setIsLocalMode] = useState<boolean | null>(false); // Změněno na false, protože nyní používáme databázi
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
        // Test connection by trying to query profiles table
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
          
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

  // Check if user is in local mode (fallback when database is not available)
  const checkLocalUserMode = async () => {
    try {
      // Try to connect to database
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      // If no error, we can use database mode
      return error ? true : false;
    } catch {
      // If connection fails, use local mode
      return true;
    }
  };

  // Get a unique key for storing statistics for a specific user (backup for local mode)
  const getLocalStorageKey = (baseKey: string) => {
    const storageKey = userId ? `${baseKey}_${userId}` : baseKey;
    console.log(`Generovaný storage klíč: ${storageKey} pro uživatele ${userId || 'anonym'}`);
    return storageKey;
  };

  // Get statistics for children (for parents) from Supabase
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    try {
      console.log("Fetching statistics for child ID from database:", childId);
      
      // Fetch math statistics
      const { data: mathData, error: mathError } = await supabase
        .from('math_statistics')
        .select('*')
        .eq('user_id', childId)
        .order('created_at', { ascending: false });

      if (mathError) {
        console.error("Error fetching math statistics:", mathError);
      }

      // Fetch spelling statistics
      const { data: spellingData, error: spellingError } = await supabase
        .from('spelling_statistics')
        .select('*')
        .eq('user_id', childId)
        .order('created_at', { ascending: false });

      if (spellingError) {
        console.error("Error fetching spelling statistics:", spellingError);
      }

      console.log("Načtená matematická data z databáze:", mathData || []);
      console.log("Načtená data pravopisu z databáze:", spellingData || []);
      
      return {
        mathStats: mathData || [],
        spellingStats: spellingData || []
      };
    } catch (error) {
      console.error("Unexpected error fetching child statistics:", error);
      return { mathStats: [], spellingStats: [] };
    }
  };

  // Reset user statistics in database
  const resetUserStatistics = async (specificUserId: string) => {
    try {
      // Delete from Supabase
      await supabase
        .from('math_statistics')
        .delete()
        .eq('user_id', specificUserId);

      await supabase
        .from('spelling_statistics')
        .delete()
        .eq('user_id', specificUserId);

      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', specificUserId);

      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', specificUserId);

      console.log(`Statistiky pro uživatele ${specificUserId} byly resetovány v databázi`);
      return true;
    } catch (error) {
      console.error(`Chyba při resetování statistik uživatele ${specificUserId}:`, error);
      return false;
    }
  };

  // Nová funkce pro výpis všech lokálních klíčů (backup function)
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
    console.log("Všechny lokální statistiky (backup):", stats);
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
