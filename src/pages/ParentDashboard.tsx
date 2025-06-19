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
import AppFooter from "@/components/layout/AppFooter";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
        <ModernHeader />
        <div className="container mx-auto p-4 max-w-7xl flex-1">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Rodičovský dashboard</h1>
            <p className="text-gray-600">Načítám data...</p>
          </div>
          
          {/* Use enhanced loading skeleton */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-blue-200 animate-pulse"></div>
                    <div className="absolute inset-0 h-12 w-12 border-4 border-blue-300 rounded-full animate-spin border-t-blue-500"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-blue-700 font-medium">Načítám rodičovský dashboard...</p>
                    <p className="text-sm text-blue-600">Připravuji přehled vašich dětí</p>
                  </div>
                  <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4 transition-all duration-1000"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Skeleton for child selection */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex flex-col`}
      style={getCSSVariables}
    >
      <ModernHeader />
      <div className="container mx-auto p-4 max-w-7xl flex-1">
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
      
      <AppFooter />
    </div>
  );
};

export default ParentDashboard;
