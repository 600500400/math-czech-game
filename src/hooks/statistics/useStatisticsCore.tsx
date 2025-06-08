
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  const [isLocalMode, setIsLocalMode] = useState<boolean | null>(false); // Všichni používají databázi
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  
  // Efekt pro automatickou kontrolu režimu
  useEffect(() => {
    // Všichni uživatelé nyní používají databázi
    setIsLocalMode(false);
    console.log(`useStatisticsCore - Uživatel ${userId} používá databázi`);
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

  // Check if user is in local mode (nyní vždy false)
  const checkLocalUserMode = async () => {
    return false; // Všichni používají databázi
  };

  // Get a unique key for storing statistics for a specific user (pouze pro zálohu)
  const getLocalStorageKey = (baseKey: string) => {
    const storageKey = userId ? `${baseKey}_backup_${userId}` : baseKey;
    console.log(`Generovaný storage klíč pro zálohu: ${storageKey} pro uživatele ${userId || 'anonym'}`);
    return storageKey;
  };

  // Get statistics for children (for parents) from Supabase
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    try {
      console.log("Načítání statistik pro dítě z databáze:", childId);
      
      // Fetch math statistics
      const { data: mathData, error: mathError } = await supabase
        .from('math_statistics')
        .select('*')
        .eq('user_id', childId) // Nyní jako text - podporuje jak běžné uživatele tak lokální jako "gabi"
        .order('created_at', { ascending: false });

      if (mathError) {
        console.error("Error fetching math statistics:", mathError);
      }

      // Fetch spelling statistics
      const { data: spellingData, error: spellingError } = await supabase
        .from('spelling_statistics')
        .select('*')
        .eq('user_id', childId) // Nyní jako text - podporuje jak běžné uživatele tak lokální jako "gabi"
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

  // Funkce pro výpis všech lokálních klíčů (pro zálohu)
  const listAllLocalStatistics = () => {
    const stats = {};
    Object.keys(localStorage).forEach(key => {
      if (key.includes('Stats_backup_')) {
        try {
          stats[key] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
          stats[key] = 'Chyba při načítání';
        }
      }
    });
    console.log("Všechny lokální záložní statistiky:", stats);
    return stats;
  };

  return {
    checkLocalUserMode,
    getLocalStorageKey,
    getChildStatistics,
    resetUserStatistics,
    listAllLocalStatistics,
    isLocalMode, // Vždy false
    dbStatus
  };
};
