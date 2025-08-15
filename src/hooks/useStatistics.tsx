
import { useAuth } from "@/hooks/useAuth";
import { useMathStatistics } from "./statistics/useMathStatistics";
import { useSpellingStatistics } from "./statistics/useSpellingStatistics";
import { useDictionaryStatistics } from "./dictionary/useDictionaryStatistics";
import { useStatisticsCore } from "./statistics/useStatisticsCore";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Main hook for statistics functionality that combines both math and spelling statistics
 */
export const useStatistics = (userId: string | null) => {
  const { authState } = useAuth();
  const queryClient = useQueryClient();
  const [lastRefreshId, setLastRefreshId] = useState("");
  
  // Použijeme userId z parametru nebo z authState (pojistka)
  const effectiveUserId = userId || authState.user?.id || null;
  
  console.log("useStatistics - Používám ID:", effectiveUserId, "původní ID:", userId);
  
  // Použití specializovaných hooků s ověřeným userId
  const { 
    mathStats, 
    mathStatsLoading, 
    saveMathStatistics, 
    refetchMathStats 
  } = useMathStatistics(effectiveUserId);
  
  const { 
    spellingStats, 
    spellingStatsLoading, 
    saveSpellingStatistics, 
    refetchSpellingStats 
  } = useSpellingStatistics(effectiveUserId);

  const {
    stats: dictionaryStats,
    isLoading: dictionaryStatsLoading,
    saveStatistics: saveDictionaryStatistics,
  } = useDictionaryStatistics(effectiveUserId);
  
  const { getChildStatistics, checkLocalUserMode, resetUserStatistics } = useStatisticsCore(effectiveUserId);
  
  // Efekt pro invalidaci query cache při změně uživatele
  useEffect(() => {
    if (effectiveUserId && effectiveUserId !== lastRefreshId) {
      console.log(`Nový uživatel detekován (${effectiveUserId}), přenačítám data z databáze...`);
      
      // Vynucené přenačtení dat při změně uživatele
      queryClient.invalidateQueries({ queryKey: ["mathStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["dictionaryStatistics"] });
      
      // Zavoláme refetch funkce přímo
      refetchMathStats();
      refetchSpellingStats();
      
      console.log(`Statistiky pro uživatele ${effectiveUserId} načítány z databáze`);
      
      // Uložíme ID pro kontrolu další změny
      setLastRefreshId(effectiveUserId);
    }
  }, [effectiveUserId, queryClient, refetchMathStats, refetchSpellingStats, lastRefreshId]);
  
  // Funkce pro manuální přenačtení všech statistik
  const forceRefreshAllStatistics = () => {
    if (effectiveUserId) {
      console.log(`Manuální přenačtení statistik z databáze pro uživatele ${effectiveUserId}`);
      refetchMathStats();
      refetchSpellingStats();
      return true;
    }
    return false;
  };
  
  // Kontrola režimu
  checkLocalUserMode().then(isLocalMode => {
    console.log(`useStatistics - Local mode: ${isLocalMode ? 'ANO' : 'NE'} pro uživatele ${effectiveUserId}`);
  });

  return {
    // Matematické statistiky
    mathStats,
    mathStatsLoading,
    saveMathStatistics,
    refetchMathStats,
    
    // Statistiky pravopisu
    spellingStats,
    spellingStatsLoading,
    saveSpellingStatistics,
    refetchSpellingStats,

    // Statistiky slovníku
    dictionaryStats,
    dictionaryStatsLoading,
    saveDictionaryStatistics,
    
    // Společné funkce
    getChildStatistics,
    checkLocalUserMode,
    forceRefreshAllStatistics,
    resetUserStatistics,
    
    // Metadata
    currentUserId: effectiveUserId,
    isLoading: mathStatsLoading || spellingStatsLoading || dictionaryStatsLoading
  };
};
