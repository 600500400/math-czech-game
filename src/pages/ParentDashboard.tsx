
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/hooks/useParentDashboard";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import { ChildSelection } from "@/components/dashboard/ChildSelection";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useDashboardFilters } from "@/components/dashboard/DashboardFilters";
import { Card, CardContent } from "@/components/ui/card";
import ModernHeader from "@/components/layout/ModernHeader";

const ParentDashboard = () => {
  const { authState } = useAuth();
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
    allChildrenStats,
    loading
  } = useParentDashboard(userId);

  // Get theme for selected child
  const { theme, getCSSVariables } = useUserTheme(selectedChild);
  
  // Get detailed answers for selected child
  const { mathAnswers, spellingAnswers } = useDetailedAnswers(selectedChild);

  const { filters, setFilters, getFilteredStats } = useDashboardFilters();

  // Check if the logged-in user is a parent
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);

  const filteredMathStats = getFilteredStats(childMathStats, 'math');
  const filteredSpellingStats = getFilteredStats(childSpellingStats, 'spelling');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ModernHeader />
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Rodičovský dashboard</h1>
            <p className="text-gray-600">Načítám data...</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p className="text-center text-muted-foreground">Načítám dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient}`}
      style={getCSSVariables}
    >
      <ModernHeader />
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
            Rodičovský dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Pokročilý přehled výsledků vašich dětí v aplikaci Procvička
          </p>
        </div>
        
        <div className="space-y-6">
          <ChildSelection 
            children={children} 
            selectedChild={selectedChild}
            setSelectedChild={setSelectedChild}
            loading={loading}
            selectedTheme={theme}
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
              mathAnswers={mathAnswers}
              spellingAnswers={spellingAnswers}
              selectedTheme={theme}
            />
          ) : (
            <EmptyDashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
