
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
  const [loading, setLoading] = useState(true);
  
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
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("Načítám děti pro rodiče:", userId);
        
        // Get child IDs from parent_child relationships
        const { data: relationships, error: relError } = await supabase
          .from('parent_child')
          .select('child_id')
          .eq('parent_id', userId);
        
        if (relError) {
          console.error("Chyba při načítání vztahů rodič-dítě:", relError);
          setLoading(false);
          return;
        }
        
        if (!relationships || relationships.length === 0) {
          console.log("Žádné děti nenalezeny pro rodiče");
          setChildren([]);
          setLoading(false);
          return;
        }
        
        // Get child profiles
        const childIds = relationships.map(rel => rel.child_id);
        const { data: childProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', childIds);
        
        if (profileError) {
          console.error("Chyba při načítání profilů dětí:", profileError);
          setLoading(false);
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
        
        console.log("Načtené děti:", transformedChildren);
        setChildren(transformedChildren);
        
        // Automatically select first child if available
        if (transformedChildren.length > 0 && !selectedChild) {
          setSelectedChild(transformedChildren[0].id);
        }
        
      } catch (error) {
        console.error("Chyba při načítání dětí:", error);
      } finally {
        setLoading(false);
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
        console.log("Načítám statistiky pro dítě:", selectedChild);
        
        // Fetch math statistics
        const { data: mathData, error: mathError } = await supabase
          .from('math_statistics')
          .select('*')
          .eq('user_id', selectedChild)
          .order('created_at', { ascending: false });

        if (mathError) {
          console.error("Chyba při načítání matematických statistik:", mathError);
        }

        // Fetch spelling statistics
        const { data: spellingData, error: spellingError } = await supabase
          .from('spelling_statistics')
          .select('*')
          .eq('user_id', selectedChild)
          .order('created_at', { ascending: false });

        if (spellingError) {
          console.error("Chyba při načítání statistik pravopisu:", spellingError);
        }

        console.log("Matematické statistiky:", mathData || []);
        console.log("Statistiky pravopisu:", spellingData || []);
        
        setChildMathStats(mathData || []);
        setChildSpellingStats(spellingData || []);
        
      } catch (error) {
        console.error("Chyba při načítání statistik dítěte:", error);
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
