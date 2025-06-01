
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";

interface StatTotals {
  correct: number;
  wrong: number;
  total: number;
}

export function useParentDashboard(userId: string | undefined) {
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childMathStats, setChildMathStats] = useState([]);
  const [childSpellingStats, setChildSpellingStats] = useState([]);
  
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

  // Load children for the parent
  useEffect(() => {
    const fetchChildren = async () => {
      if (!userId) return;
      
      try {
        // Since there are no tables yet, we'll return empty array
        // This will be updated once the parent_child and profiles tables are created
        console.log("Parent dashboard fetch skipped - no tables exist yet");
        setChildren([]);
        
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    
    fetchChildren();
  }, [userId]);
  
  // Load statistics for the selected child
  useEffect(() => {
    const fetchChildStats = async () => {
      if (!selectedChild) return;
      
      try {
        // Since there are no tables yet, we'll return empty arrays
        // This will be updated once the statistics tables are created
        console.log("Child statistics fetch skipped - no tables exist yet");
        setChildMathStats([]);
        setChildSpellingStats([]);
        
      } catch (error) {
        console.error("Error fetching child statistics:", error);
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
    spellingAccuracy
  };
}
