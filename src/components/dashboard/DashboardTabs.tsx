
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SummaryStatistics } from "./SummaryStatistics";
import { ActivityHistory } from "./ActivityHistory";
import { AdvancedCharts } from "./AdvancedCharts";
import { ChildComparison } from "./ChildComparison";
import { ExportControls } from "./ExportControls";
import { TimeFilters, FilterState } from "./TimeFilters";
import { UserProfile } from "@/types/authTypes";

interface DashboardTabsProps {
  selectedChild: string | null;
  children: UserProfile[];
  childMathTotal: { correct: number; wrong: number; total: number };
  childSpellingTotal: { correct: number; wrong: number; total: number };
  mathAccuracy: number;
  spellingAccuracy: number;
  filteredMathStats: any[];
  filteredSpellingStats: any[];
  allChildrenStats: { [childId: string]: { mathStats: any[], spellingStats: any[] } };
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  selectedChild,
  children,
  childMathTotal,
  childSpellingTotal,
  mathAccuracy,
  spellingAccuracy,
  filteredMathStats,
  filteredSpellingStats,
  allChildrenStats,
  filters,
  onFilterChange
}) => {
  const selectedChildName = children.find(child => child.id === selectedChild)?.username || '';

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Přehled</TabsTrigger>
        <TabsTrigger value="charts">Grafy</TabsTrigger>
        <TabsTrigger value="comparison">Porovnání</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <TimeFilters 
          filters={filters}
          onFilterChange={onFilterChange}
        />
        
        {selectedChild && (
          <>
            <SummaryStatistics 
              mathTotal={childMathTotal}
              spellingTotal={childSpellingTotal}
              mathAccuracy={mathAccuracy}
              spellingAccuracy={spellingAccuracy}
            />
            
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
  );
};
