
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";
import { ChildSelection } from "@/components/dashboard/ChildSelection";
import { SummaryStatistics } from "@/components/dashboard/SummaryStatistics";
import { ActivityHistory } from "@/components/dashboard/ActivityHistory";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";

const ParentDashboard = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();
  const { userId } = { userId: authState.user?.id };
  const { mathStats, spellingStats } = useStatistics(userId);
  
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childMathStats, setChildMathStats] = useState([]);
  const [childSpellingStats, setChildSpellingStats] = useState([]);
  
  // Check if the logged-in user is a parent
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);
  
  // Load children for the parent
  useEffect(() => {
    const fetchChildren = async () => {
      if (!userId) return;
      
      try {
        // First get child IDs from parent_child table
        const { data: childRelations, error: relationsError } = await supabase
          .from("parent_child")
          .select("child_id")
          .eq("parent_id", userId);
          
        if (relationsError) throw relationsError;
        
        if (childRelations && childRelations.length > 0) {
          const childIds = childRelations.map(relation => relation.child_id);
          
          // Then get child profiles
          const { data: childProfiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", childIds);
            
          if (profilesError) throw profilesError;
          
          setChildren(childProfiles as UserProfile[]);
          if (childProfiles && childProfiles.length > 0) {
            setSelectedChild(childProfiles[0].id);
          }
        }
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
        // Load math statistics
        const { data: mathData, error: mathError } = await supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", selectedChild)
          .order("created_at", { ascending: false });
          
        if (mathError) throw mathError;
        
        // Load spelling statistics
        const { data: spellingData, error: spellingError } = await supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", selectedChild)
          .order("created_at", { ascending: false });
          
        if (spellingError) throw spellingError;
        
        // Format JSON data for math
        const formattedMathStats = mathData.map(item => ({
          ...item,
          difficulty_level: typeof item.difficulty_level === 'string'
            ? JSON.parse(item.difficulty_level)
            : item.difficulty_level
        }));
        
        setChildMathStats(formattedMathStats);
        setChildSpellingStats(spellingData);
      } catch (error) {
        console.error("Error fetching child statistics:", error);
      }
    };
    
    fetchChildStats();
  }, [selectedChild]);
  
  // Calculate summary statistics for selected child
  const childMathTotal = childMathStats.reduce(
    (acc, stat) => {
      acc.correct += stat.correct_answers;
      acc.wrong += stat.wrong_answers;
      acc.total += stat.correct_answers + stat.wrong_answers;
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 }
  );
  
  const childSpellingTotal = childSpellingStats.reduce(
    (acc, stat) => {
      acc.correct += stat.correct_answers;
      acc.wrong += stat.wrong_answers;
      acc.total += stat.correct_answers + stat.wrong_answers;
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 }
  );
  
  const mathAccuracy = childMathTotal.total > 0 
    ? Math.round((childMathTotal.correct / childMathTotal.total) * 100) 
    : 0;
    
  const spellingAccuracy = childSpellingTotal.total > 0 
    ? Math.round((childSpellingTotal.correct / childSpellingTotal.total) * 100) 
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rodičovský dashboard</h1>
          <p className="text-gray-600">
            Přehled výsledků vašich dětí v aplikaci Procvička
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/")} variant="outline">
            Zpět na aplikaci
          </Button>
          <Button onClick={() => signOut()} variant="destructive">
            Odhlásit se
          </Button>
        </div>
      </div>
      
      {children.length > 0 ? (
        <div className="space-y-8">
          {/* Child Selection Component */}
          <ChildSelection 
            children={children} 
            selectedChild={selectedChild}
            setSelectedChild={setSelectedChild}
          />
          
          {selectedChild && (
            <>
              {/* Summary Statistics Component */}
              <SummaryStatistics 
                mathTotal={childMathTotal}
                spellingTotal={childSpellingTotal}
                mathAccuracy={mathAccuracy}
                spellingAccuracy={spellingAccuracy}
              />
              
              {/* Activity History Component */}
              <ActivityHistory 
                mathStats={childMathStats} 
                spellingStats={childSpellingStats} 
              />
            </>
          )}
        </div>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
};

export default ParentDashboard;
