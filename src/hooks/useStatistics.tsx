
import { useAuth } from "@/hooks/useAuth";
import { useMathStatistics } from "./statistics/useMathStatistics";
import { useSpellingStatistics } from "./statistics/useSpellingStatistics";
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
  
  const { getChildStatistics, checkLocalUserMode } = useStatisticsCore(effectiveUserId);
  
  // Efekt pro invalidaci query cache při změně uživatele
  useEffect(() => {
    if (effectiveUserId && effectiveUserId !== lastRefreshId) {
      console.log(`Nový uživatel detekován (${effectiveUserId}), přenačítám data...`);
      
      // Vynucené přenačtení dat při změně uživatele
      queryClient.invalidateQueries({ queryKey: ["mathStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
      
      // Zavoláme refetch funkce přímo
      refetchMathStats();
      refetchSpellingStats();
      
      // Inicializace prázdných polí pro statistiky, pokud neexistují
      const mathKey = `mathStats_${effectiveUserId}`;
      const spellingKey = `spellingStats_${effectiveUserId}`;
      
      if (!localStorage.getItem(mathKey)) {
        localStorage.setItem(mathKey, JSON.stringify([]));
      }
      
      if (!localStorage.getItem(spellingKey)) {
        localStorage.setItem(spellingKey, JSON.stringify([]));
      }
      
      console.log(`Statistiky pro uživatele ${effectiveUserId} inicializovány nebo zkontrolovány`);
      
      // Uložíme ID pro kontrolu další změny
      setLastRefreshId(effectiveUserId);
    }
  }, [effectiveUserId, queryClient, refetchMathStats, refetchSpellingStats, lastRefreshId]);
  
  // Funkce pro manuální přenačtení všech statistik
  const forceRefreshAllStatistics = () => {
    if (effectiveUserId) {
      console.log(`Manuální přenačtení statistik pro uživatele ${effectiveUserId}`);
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
    
    // Společné funkce
    getChildStatistics,
    checkLocalUserMode,
    forceRefreshAllStatistics,
    
    // Metadata
    currentUserId: effectiveUserId,
    isLoading: mathStatsLoading || spellingStatsLoading
  };
};
