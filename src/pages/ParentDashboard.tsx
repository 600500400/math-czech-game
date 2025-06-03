
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/hooks/useParentDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildSelection } from "@/components/dashboard/ChildSelection";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { DashboardWizardManager } from "@/components/dashboard/DashboardWizardManager";
import { useDashboardFilters } from "@/components/dashboard/DashboardFilters";
import { Card, CardContent } from "@/components/ui/card";

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
    spellingAccuracy,
    loading
  } = useParentDashboard(userId);

  const { filters, setFilters, getFilteredStats } = useDashboardFilters();

  // Check if the logged-in user is a parent
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);

  // Load stats for all children for comparison
  const allChildrenStats = children.reduce((acc, child) => {
    if (child.id === selectedChild) {
      acc[child.id] = {
        mathStats: childMathStats,
        spellingStats: childSpellingStats
      };
    } else {
      // For now, use empty data for other children
      acc[child.id] = {
        mathStats: [],
        spellingStats: []
      };
    }
    return acc;
  }, {} as { [childId: string]: { mathStats: any[], spellingStats: any[] } });

  const filteredMathStats = getFilteredStats(childMathStats, 'math');
  const filteredSpellingStats = getFilteredStats(childSpellingStats, 'spelling');

  // Function to refresh children list
  const handleChildCreated = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <DashboardHeader 
          title="Rodičovský dashboard"
          description="Načítám data..." 
          onSignOut={signOut}
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-center text-muted-foreground">Načítám dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <DashboardHeader 
        title="Rodičovský dashboard"
        description="Pokročilý přehled výsledků vašich dětí v aplikaci Procvička" 
        onSignOut={signOut}
      />
      
      <div className="space-y-8">
        <ChildSelection 
          children={children} 
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          onChildCreated={handleChildCreated}
          loading={loading}
        />

        {children.length > 0 ? (
          <DashboardTabs
            selectedChild={selectedChild}
            children={children}
            childMathTotal={childMathTotal}
            childSpellingTotal={childSpellingTotal}
            mathAccuracy={mathAccuracy}
            spellingAccuracy={spellingAccuracy}
            filteredMathStats={filteredMathStats}
            filteredSpellingStats={filteredSpellingStats}
            allChildrenStats={allChildrenStats}
            filters={filters}
            onFilterChange={setFilters}
          />
        ) : (
          <EmptyDashboard onChildCreated={handleChildCreated} />
        )}
      </div>

      <DashboardWizardManager
        loading={loading}
        children={children}
        userId={userId}
        onChildCreated={handleChildCreated}
      />
    </div>
  );
};

export default ParentDashboard;
