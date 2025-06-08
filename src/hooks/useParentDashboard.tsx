
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/authTypes";
import { useStatistics } from "@/hooks/useStatistics";

interface StatTotals {
  correct: number;
  wrong: number;
  total: number;
}

// Přednastavené dětské profily (bez databáze)
const CHILDREN_PROFILES: UserProfile[] = [
  {
    id: 'gabi',
    username: 'Gabi',
    full_name: 'Gabi',
    role: 'child',
    created_at: new Date().toISOString()
  },
  {
    id: 'misa',
    username: 'Míša',
    full_name: 'Míša',
    role: 'child',
    created_at: new Date().toISOString()
  },
  {
    id: 'ada',
    username: 'Áďa',
    full_name: 'Áďa',
    role: 'child',
    created_at: new Date().toISOString()
  },
  {
    id: 'host',
    username: 'Host',
    full_name: 'Host',
    role: 'child',
    created_at: new Date().toISOString()
  }
];

export function useParentDashboard(userId: string | undefined) {
  const [children] = useState<UserProfile[]>(CHILDREN_PROFILES);
  const [selectedChild, setSelectedChild] = useState<string | null>('gabi');
  
  // Použití centralizovaného hook pro statistiky s databází
  const { 
    mathStats, 
    spellingStats, 
    isLoading: statsLoading 
  } = useStatistics(selectedChild);
  
  // Calculate summary statistics for selected child z databázových dat
  const childMathTotal = mathStats.reduce(
    (acc, stat: any) => {
      acc.correct += stat.correct_answers || 0;
      acc.wrong += stat.wrong_answers || 0;
      acc.total += (stat.correct_answers || 0) + (stat.wrong_answers || 0);
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 } as StatTotals
  );
  
  const childSpellingTotal = spellingStats.reduce(
    (acc, stat: any) => {
      acc.correct += stat.correct_answers || 0;
      acc.wrong += stat.wrong_answers || 0;
      acc.total += (stat.correct_answers || 0) + (stat.wrong_answers || 0);
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 } as StatTotals
  );
  
  const mathAccuracy = childMathTotal.total > 0 
    ? Math.round((childMathTotal.correct / childMathTotal.total) * 100) 
    : 0;
    
  const spellingAccuracy = childSpellingTotal.total > 0 
    ? Math.round((childSpellingTotal.correct / childSpellingTotal.total) * 100) 
    : 0;

  return {
    children,
    selectedChild,
    setSelectedChild,
    childMathStats: mathStats, // Nyní z databáze
    childSpellingStats: spellingStats, // Nyní z databáze
    childMathTotal,
    childSpellingTotal,
    mathAccuracy,
    spellingAccuracy,
    loading: statsLoading
  };
}
