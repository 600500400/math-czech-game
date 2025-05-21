
import { useAuth } from "@/hooks/useAuth";
import { useMathStatistics } from "./statistics/useMathStatistics";
import { useSpellingStatistics } from "./statistics/useSpellingStatistics";
import { useStatisticsCore } from "./statistics/useStatisticsCore";

/**
 * Main hook for statistics functionality that combines both math and spelling statistics
 */
export const useStatistics = (userId: string | null) => {
  const { authState } = useAuth(); // Získáme aktuální stav autentizace
  
  // Použijeme userId z parametru nebo z authState (pojistka)
  const effectiveUserId = userId || authState.user?.id || null;
  
  console.log("useStatistics - Používám ID:", effectiveUserId, "původní ID:", userId);
  
  // Použití specializovaných hooků s ověřeným userId
  const { mathStats, mathStatsLoading, saveMathStatistics } = useMathStatistics(effectiveUserId);
  const { spellingStats, spellingStatsLoading, saveSpellingStatistics } = useSpellingStatistics(effectiveUserId);
  const { getChildStatistics, checkLocalUserMode } = useStatisticsCore(effectiveUserId);
  
  // Kontrola režimu
  checkLocalUserMode().then(isLocalMode => {
    console.log(`useStatistics - Local mode: ${isLocalMode ? 'ANO' : 'NE'} pro uživatele ${effectiveUserId}`);
  });

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
    checkLocalUserMode,
    
    // Metadata
    currentUserId: effectiveUserId,
  };
};
