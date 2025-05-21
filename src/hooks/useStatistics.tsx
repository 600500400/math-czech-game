
import { useAuth } from "@/hooks/useAuth";
import { useMathStatistics } from "./statistics/useMathStatistics";
import { useSpellingStatistics } from "./statistics/useSpellingStatistics";
import { useStatisticsCore } from "./statistics/useStatisticsCore";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Main hook for statistics functionality that combines both math and spelling statistics
 */
export const useStatistics = (userId: string | null) => {
  const { authState } = useAuth(); // Získáme aktuální stav autentizace
  const queryClient = useQueryClient();
  
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
    if (effectiveUserId) {
      // Vynucené přenačtení dat při změně uživatele
      queryClient.invalidateQueries({ queryKey: ["mathStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
      
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
    }
  }, [effectiveUserId, queryClient]);
  
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
    
    // Metadata
    currentUserId: effectiveUserId,
  };
};
