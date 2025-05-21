
import { useAuth } from "@/hooks/useAuth";
import { useMathStatistics } from "./statistics/useMathStatistics";
import { useSpellingStatistics } from "./statistics/useSpellingStatistics";
import { useStatisticsCore } from "./statistics/useStatisticsCore";

/**
 * Main hook for statistics functionality that combines both math and spelling statistics
 */
export const useStatistics = (userId: string | null) => {
  // Použití specializovaných hooků
  const { mathStats, mathStatsLoading, saveMathStatistics } = useMathStatistics(userId);
  const { spellingStats, spellingStatsLoading, saveSpellingStatistics } = useSpellingStatistics(userId);
  const { getChildStatistics } = useStatisticsCore(userId);

  return {
    // Matematické statistiky
    mathStats,
    mathStatsLoading,
    saveMathStatistics,
    
    // Statistiky pravopisu
    spellingStats,
    spellingStatsLoading,
    saveSpellingStatistics,
    
    // Společné funkce
    getChildStatistics,
  };
};
