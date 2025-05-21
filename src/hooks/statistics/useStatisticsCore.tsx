
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  const [isLocalMode, setIsLocalMode] = useState<boolean | null>(null);
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
        const { data: testData, error } = await supabase
          .from("profiles")
          .select("count")
          .limit(1);
          
        if (error) {
          console.error("Database check failed:", error);
          setDbStatus("disconnected");
        } else {
          console.log("Database check succeeded:", testData);
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
    if (!userId) {
      return true; // Pokud nemáme userId, defaultně používáme lokální režim
    }
    
    try {
      // Kontrola, zda je uživatel "local user"
      const localUserStr = localStorage.getItem('localUser');
      if (localUserStr) {
        console.log("Detekován lokální uživatel:", localUserStr);
        return true;
      }
      
      // Kontrola připojení k Supabase
      try {
        const session = await supabase.auth.getSession();
        console.log("Kontrola Supabase session:", session);
        
        if (!session.data.session) {
          console.log("Nejsou aktivní session data - používám lokální režim");
          return true;
        }
        
        // Ověříme existenci uživatelského profilu
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .single();
          
        if (error || !data) {
          console.log("Profil nenalezen - používám lokální režim:", error);
          return true;
        }
        
        console.log("Supabase profil nalezen:", data);
        return false; // Můžeme použít Supabase
      } catch (error) {
        console.error("Chyba při kontrole Supabase:", error);
        return true; // Při chybě použijeme lokální režim
      }
    } catch (e) {
      console.error("Neočekávaná chyba při kontrole režimu:", e);
      return true; // Při jakékoliv chybě defaultně lokální
    }
  };

  // Get a unique key for storing statistics for a specific user
  const getLocalStorageKey = (baseKey: string) => {
    const storageKey = userId ? `${baseKey}_${userId}` : baseKey;
    console.log(`Generovaný storage klíč: ${storageKey} pro uživatele ${userId || 'anonym'}`);
    return storageKey;
  };

  // Get statistics for children (for parents)
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    try {
      console.log("Fetching statistics for child ID:", childId);
      
      // Ověříme, jestli musíme používat lokální data
      const mustUseLocal = await checkLocalUserMode();
      
      if (mustUseLocal) {
        console.log("Používám lokální data pro dítě:", childId);
        const mathKey = `mathStats_${childId}`;
        const spellingKey = `spellingStats_${childId}`;
        
        const mathData = localStorage.getItem(mathKey);
        const spellingData = localStorage.getItem(spellingKey);
        
        return {
          mathStats: mathData ? JSON.parse(mathData) : [],
          spellingStats: spellingData ? JSON.parse(spellingData) : []
        };
      }
      
      // Try to load from Supabase first
      const { data: mathStats, error: mathError } = await supabase
        .from("math_statistics")
        .select("*")
        .eq("user_id", childId)
        .order("created_at", { ascending: false });

      if (mathError) {
        console.error("Error loading math statistics from Supabase:", mathError);
        // Fall back to local storage if Supabase fails
        const localMathKey = `mathStats_${childId}`;
        const localMathStats = localStorage.getItem(localMathKey);
        
        return {
          mathStats: localMathStats ? JSON.parse(localMathStats) : [],
          spellingStats: []
        };
      }

      const { data: spellingStats, error: spellingError } = await supabase
        .from("spelling_statistics")
        .select("*")
        .eq("user_id", childId)
        .order("created_at", { ascending: false });

      if (spellingError) {
        console.error("Error loading spelling statistics from Supabase:", spellingError);
        // Fall back to local storage for spelling stats
        const localSpellingKey = `spellingStats_${childId}`;
        const localSpellingStats = localStorage.getItem(localSpellingKey);
        
        return {
          mathStats: mathStats || [],
          spellingStats: localSpellingStats ? JSON.parse(localSpellingStats) : []
        };
      }

      console.log("Statistics loaded successfully:", {
        mathStats: mathStats || [],
        spellingStats: spellingStats || []
      });

      return {
        mathStats: mathStats || [],
        spellingStats: spellingStats || []
      };
    } catch (error) {
      console.error("Unexpected error fetching child statistics:", error);
      return { mathStats: [], spellingStats: [] };
    }
  };

  return {
    checkLocalUserMode,
    getLocalStorageKey,
    getChildStatistics,
    isLocalMode,
    dbStatus
  };
};
