
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useParentDashboard } from "@/hooks/useParentDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildSelection } from "@/components/dashboard/ChildSelection";
import { SummaryStatistics } from "@/components/dashboard/SummaryStatistics";
import { ActivityHistory } from "@/components/dashboard/ActivityHistory";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { AdvancedCharts } from "@/components/dashboard/AdvancedCharts";
import { ExportControls } from "@/components/dashboard/ExportControls";
import { ChildComparison } from "@/components/dashboard/ChildComparison";
import { TimeFilters, FilterState } from "@/components/dashboard/TimeFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    subject: 'all',
    searchTerm: '',
    startDate: undefined,
    endDate: undefined
  });

  // For child comparison - simulate getting stats for all children
  const [allChildrenStats, setAllChildrenStats] = useState<{ [childId: string]: { mathStats: any[], spellingStats: any[] } }>({});
  
  // Check if the logged-in user is a parent
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);

  // Load stats for all children for comparison
  useEffect(() => {
    if (children.length > 0) {
      const statsMap: { [childId: string]: { mathStats: any[], spellingStats: any[] } } = {};
      
      children.forEach(child => {
        if (child.id === selectedChild) {
          statsMap[child.id] = {
            mathStats: childMathStats,
            spellingStats: childSpellingStats
          };
        } else {
          // For now, use empty data for other children
          statsMap[child.id] = {
            mathStats: [],
            spellingStats: []
          };
        }
      });
      
      setAllChildrenStats(statsMap);
    }
  }, [children, selectedChild, childMathStats, childSpellingStats]);

  // Filter statistics based on current filters
  const getFilteredStats = (stats: any[], type: 'math' | 'spelling') => {
    let filtered = [...stats];

    // Subject filter
    if (filters.subject !== 'all') {
      if ((filters.subject === 'math' && type !== 'math') || 
          (filters.subject === 'spelling' && type !== 'spelling')) {
        return [];
      }
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(stat => {
        const statDate = new Date(stat.created_at);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        
        if (start && statDate < start) return false;
        if (end && statDate > end) return false;
        return true;
      });
    }

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(stat => {
        const searchFields = [
          stat.operation || '',
          stat.word_group || '',
          new Date(stat.created_at).toLocaleDateString('cs-CZ')
        ];
        
        return searchFields.some(field => 
          field.toLowerCase().includes(searchTerm)
        );
      });
    }

    return filtered;
  };

  const filteredMathStats = getFilteredStats(childMathStats, 'math');
  const filteredSpellingStats = getFilteredStats(childSpellingStats, 'spelling');

  const selectedChildName = children.find(child => child.id === selectedChild)?.username || '';

  // Function to refresh children list
  const handleChildCreated = () => {
    // Trigger re-fetch by refreshing the page or implementing refresh logic
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
            <p className="text-center text-muted-foreground">Načítám dashboard...</p>
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
        {/* Child Selection Component */}
        <ChildSelection 
          children={children} 
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          onChildCreated={handleChildCreated}
          loading={loading}
        />

        {children.length > 0 ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Přehled</TabsTrigger>
              <TabsTrigger value="charts">Grafy</TabsTrigger>
              <TabsTrigger value="comparison">Porovnání</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Time Filters */}
              <TimeFilters 
                filters={filters}
                onFilterChange={setFilters}
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
                    mathStats={filteredMathStats} 
                    spellingStats={filteredSpellingStats} 
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              {selectedChild ? (
                <AdvancedCharts 
                  mathStats={filteredMathStats}
                  spellingStats={filteredSpellingStats}
                  selectedChild={selectedChild}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      Vyberte dítě pro zobrazení pokročilých grafů
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <ChildComparison 
                children={children}
                childStats={allChildrenStats}
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportControls 
                selectedChild={selectedChild}
                childName={selectedChildName}
                mathStats={filteredMathStats}
                spellingStats={filteredSpellingStats}
              />
              
              {selectedChild && (
                <Card>
                  <CardHeader>
                    <CardTitle>Náhled dat pro export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Matematika</h4>
                        <p>Celkem her: {filteredMathStats.length}</p>
                        <p>Správné odpovědi: {childMathTotal.correct}</p>
                        <p>Špatné odpovědi: {childMathTotal.wrong}</p>
                        <p>Úspěšnost: {mathAccuracy}%</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pravopis</h4>
                        <p>Celkem her: {filteredSpellingStats.length}</p>
                        <p>Správné odpovědi: {childSpellingTotal.correct}</p>
                        <p>Špatné odpovědi: {childSpellingTotal.wrong}</p>
                        <p>Úspěšnost: {spellingAccuracy}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyDashboard />
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
