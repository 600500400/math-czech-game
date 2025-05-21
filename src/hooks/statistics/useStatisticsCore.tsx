
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

/**
 * Core statistics loading functionality that can be shared between math and spelling
 */
export const useStatisticsCore = (userId: string | null) => {
  const [isLocalUser, setIsLocalUser] = useState(() => {
    const localUserStr = localStorage.getItem('localUser');
    return !!localUserStr;
  });

  /**
   * Helper function to check if using local user mode
   */
  const checkLocalUserMode = async () => {
    if (!userId) return false;
    
    // Check if local user
    if (isLocalUser) {
      return true;
    }
    
    // Check if a valid session exists
    try {
      const { data } = await supabase.auth.getSession();
      return !data.session;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  };

  /**
   * Loads statistics for a child user (used by parents)
   */
  const getChildStatistics = async (childId: string) => {
    try {
      const [mathResult, spellingResult] = await Promise.all([
        supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", childId)
          .order("created_at", { ascending: false }),
        supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", childId)
          .order("created_at", { ascending: false }),
      ]);

      if (mathResult.error) throw mathResult.error;
      if (spellingResult.error) throw spellingResult.error;

      // Format math statistics data
      const formattedMathStats = mathResult.data.map(item => ({
        ...item,
        difficulty_level: typeof item.difficulty_level === 'string'
          ? JSON.parse(item.difficulty_level)
          : item.difficulty_level
      }));

      return {
        mathStats: formattedMathStats as MathStatistics[],
        spellingStats: spellingResult.data as SpellingStatistics[],
      };
    } catch (error) {
      console.error("Chyba při načítání statistik dítěte:", error);
      toast.error("Nepodařilo se načíst statistiky dítěte");
      return { mathStats: [], spellingStats: [] };
    }
  };

  return {
    isLocalUser,
    checkLocalUserMode,
    getChildStatistics
  };
};
