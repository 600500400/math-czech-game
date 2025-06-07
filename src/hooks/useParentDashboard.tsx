
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/authTypes";

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
  const [childMathStats, setChildMathStats] = useState([]);
  const [childSpellingStats, setChildSpellingStats] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Calculate summary statistics for selected child
  const childMathTotal = childMathStats.reduce(
    (acc, stat: any) => {
      acc.correct += stat.correct_answers || 0;
      acc.wrong += stat.wrong_answers || 0;
      acc.total += (stat.correct_answers || 0) + (stat.wrong_answers || 0);
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 } as StatTotals
  );
  
  const childSpellingTotal = childSpellingStats.reduce(
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

  // Load statistics from localStorage for the selected child
  useEffect(() => {
    const fetchChildStats = async () => {
      if (!selectedChild) {
        setChildMathStats([]);
        setChildSpellingStats([]);
        return;
      }
      
      setLoading(true);
      
      try {
        console.log("Načítám lokální statistiky pro dítě:", selectedChild);
        
        // Load from localStorage
        const mathStatsKey = `mathStats_${selectedChild}`;
        const spellingStatsKey = `spellingStats_${selectedChild}`;
        
        const mathStats = JSON.parse(localStorage.getItem(mathStatsKey) || '[]');
        const spellingStats = JSON.parse(localStorage.getItem(spellingStatsKey) || '[]');

        console.log("Matematické statistiky:", mathStats);
        console.log("Statistiky pravopisu:", spellingStats);
        
        setChildMathStats(mathStats);
        setChildSpellingStats(spellingStats);
        
      } catch (error) {
        console.error("Chyba při načítání statistik dítěte:", error);
        setChildMathStats([]);
        setChildSpellingStats([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChildStats();
  }, [selectedChild]);

  return {
    children,
    selectedChild,
    setSelectedChild,
    childMathStats,
    childSpellingStats,
    childMathTotal,
    childSpellingTotal,
    mathAccuracy,
    spellingAccuracy,
    loading
  };
}
