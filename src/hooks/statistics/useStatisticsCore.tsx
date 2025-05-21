
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useStatisticsCore = (userId: string | null) => {
  // Check if user is in local mode (without Supabase authentication)
  const checkLocalUserMode = async () => {
    if (!userId) return true;
    
    const localUserStr = localStorage.getItem('localUser');
    return !!localUserStr;
  };

  // Get a unique key for storing statistics for a specific user
  const getLocalStorageKey = (baseKey: string) => {
    return userId ? `${baseKey}_${userId}` : baseKey;
  };

  // Get statistics for children (for parents)
  const getChildStatistics = async (childId: string) => {
    if (!childId) return { mathStats: [], spellingStats: [] };
    
    try {
      console.log("Fetching statistics for child ID:", childId);
      
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
    getChildStatistics
  };
};
