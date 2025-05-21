
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  // Kontrola, zda je uživatel v lokálním režimu (bez Supabase autentizace)
  const checkLocalUserMode = async () => {
    if (!userId) return true;
    
    const localUserStr = localStorage.getItem('localUser');
    return !!localUserStr;
  };

  // Získání unikátního klíče pro ukládání statistik konkrétního uživatele
  const getLocalStorageKey = (baseKey: string) => {
    return userId ? `${baseKey}_${userId}` : baseKey;
  };

  // Získání statistik dětí (pro rodiče)
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    // Načtení matematických statistik
    const { data: mathStats, error: mathError } = await supabase
      .from("math_statistics")
      .select("*")
      .eq("user_id", childId)
      .order("created_at", { ascending: false });

    if (mathError) {
      console.error("Error loading math statistics:", mathError);
      throw mathError;
    }

    // Načtení statistik pravopisu
    const { data: spellingStats, error: spellingError } = await supabase
      .from("spelling_statistics")
      .select("*")
      .eq("user_id", childId)
      .order("created_at", { ascending: false });

    if (spellingError) {
      console.error("Error loading spelling statistics:", spellingError);
      throw spellingError;
    }

    return {
      mathStats: mathStats || [],
      spellingStats: spellingStats || []
    };
  };

  return {
    checkLocalUserMode,
    getLocalStorageKey,
    getChildStatistics
  };
};
