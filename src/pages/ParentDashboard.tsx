
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/hooks/useParentDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildSelection } from "@/components/dashboard/ChildSelection";
import { SummaryStatistics } from "@/components/dashboard/SummaryStatistics";
import { ActivityHistory } from "@/components/dashboard/ActivityHistory";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";

const ParentDashboard = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();
  const userId = authState.user?.id;
  
  const {
    children,
    selectedChild,
    setSelectedChild,
    childMathStats,
    childSpellingStats,
    childMathTotal,
    childSpellingTotal,
    mathAccuracy,
    spellingAccuracy
  } = useParentDashboard(userId);
  
  // Check if the logged-in user is a parent
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <DashboardHeader 
        title="Rodičovský dashboard"
        description="Přehled výsledků vašich dětí v aplikaci Procvička" 
        onSignOut={signOut}
      />
      
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
