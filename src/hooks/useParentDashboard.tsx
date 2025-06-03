
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
        console.log("Fetching children for parent:", userId);
        
        // Get child IDs from parent_child relationships
        const { data: relationships, error: relError } = await supabase
          .from('parent_child')
          .select('child_id')
          .eq('parent_id', userId);
        
        if (relError) {
          console.error("Error fetching parent-child relationships:", relError);
          return;
        }
        
        if (!relationships || relationships.length === 0) {
          console.log("No children found for parent");
          setChildren([]);
          return;
        }
        
        // Get child profiles
        const childIds = relationships.map(rel => rel.child_id);
        const { data: childProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', childIds);
        
        if (profileError) {
          console.error("Error fetching child profiles:", profileError);
          return;
        }
        
        const transformedChildren = (childProfiles || []).map(profile => ({
          id: profile.id,
          username: profile.full_name || 'Dítě',
          full_name: profile.full_name,
          role: profile.role as 'child',
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }));
        
        console.log("Fetched children:", transformedChildren);
        setChildren(transformedChildren);
        
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    
    fetchChildren();
  }, [userId]);
  
  // Load statistics for the selected child
  useEffect(() => {
    const fetchChildStats = async () => {
      if (!selectedChild) {
        setChildMathStats([]);
        setChildSpellingStats([]);
        return;
      }
      
      try {
        console.log("Fetching statistics for child:", selectedChild);
        
        // Fetch math statistics
        const { data: mathData, error: mathError } = await supabase
          .from('math_statistics')
          .select('*')
          .eq('user_id', selectedChild)
          .order('created_at', { ascending: false });

        if (mathError) {
          console.error("Error fetching math statistics:", mathError);
        }

        // Fetch spelling statistics
        const { data: spellingData, error: spellingError } = await supabase
          .from('spelling_statistics')
          .select('*')
          .eq('user_id', selectedChild)
          .order('created_at', { ascending: false });

        if (spellingError) {
          console.error("Error fetching spelling statistics:", spellingError);
        }

        console.log("Math stats:", mathData || []);
        console.log("Spelling stats:", spellingData || []);
        
        setChildMathStats(mathData || []);
        setChildSpellingStats(spellingData || []);
        
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
