
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { BookOpen, Calculator, BarChart3, Target, Brain } from "lucide-react";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";

interface WelcomeDashboardProps {
  onNavigateToTab: (tab: "practice" | "statistics") => void;
  onNavigateToPractice: (defaultTab: "spelling" | "math") => void;
}

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  onNavigateToTab,
  onNavigateToPractice,
}) => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);

  const userName = authState.profile?.full_name || "Studente";
  const firstName = userName.split(" ")[0];

  // Calculate recent performance
  const mathAccuracy = mathStats?.total_problems > 0 
    ? Math.round((mathStats.correct_answers / mathStats.total_problems) * 100)
    : 0;
  
  const spellingAccuracy = spellingStats?.total_words > 0
    ? Math.round((spellingStats.correct_words / spellingStats.total_words) * 100)
    : 0;

  // Get performance badges
  const getMathBadge = () => {
    if (mathAccuracy >= 90) return { text: "Expert", color: "bg-yellow-500" };
    if (mathAccuracy >= 75) return { text: "Pokročilý", color: "bg-green-500" };
    if (mathAccuracy >= 50) return { text: "Učím se", color: "bg-blue-500" };
    return { text: "Začátečník", color: "bg-gray-500" };
  };

  const getSpellingBadge = () => {
    if (spellingAccuracy >= 90) return { text: "Mistr pravopisu", color: "bg-purple-500" };
    if (spellingAccuracy >= 75) return { text: "Pokročilý", color: "bg-green-500" };
    if (spellingAccuracy >= 50) return { text: "Učím se", color: "bg-blue-500" };
    return { text: "Začátečník", color: "bg-gray-500" };
  };

  const mathBadge = getMathBadge();
  const spellingBadge = getSpellingBadge();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Vítej zpět, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Připraven na další učení? Pojďme se podívat na tvůj pokrok!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matematika</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{mathAccuracy}%</span>
                <Badge className={`${mathBadge.color} text-white`}>
                  {mathBadge.text}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {mathStats?.total_problems || 0} vyřešených příkladů
              </p>
              <Button 
                onClick={() => onNavigateToPractice("math")}
                className="w-full mt-2"
                size="sm"
              >
                Procvičovat matematiku
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pravopis</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{spellingAccuracy}%</span>
                <Badge className={`${spellingBadge.color} text-white`}>
                  {spellingBadge.text}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {spellingStats?.total_words || 0} napsaných slov
              </p>
              <Button 
                onClick={() => onNavigateToPractice("spelling")}
                className="w-full mt-2"
                size="sm"
              >
                Procvičovat pravopis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <AIInsights 
        mathStats={mathStats}
        spellingStats={spellingStats}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => onNavigateToTab("statistics")}>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold mb-2">Podrobné statistiky</h3>
            <p className="text-sm text-muted-foreground">
              Zobraz si detailní přehled svého pokroku
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigateToTab("practice")}>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-orange-600" />
            <h3 className="font-semibold mb-2">Všechna procvičování</h3>
            <p className="text-sm text-muted-foreground">
              Přejdi na stránku s procvičováním
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Integration */}
      <AIAssistantDrawer />
    </div>
  );
};

export default WelcomeDashboard;
