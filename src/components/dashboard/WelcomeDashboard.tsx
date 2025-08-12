import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { BookOpen, Calculator, BarChart3, Target, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const userName = authState.profile?.full_name || "Studente";
  const firstName = userName.split(" ")[0] || "Studente";

  // Calculate totals from individual statistics records
  const mathTotals = (mathStats || []).reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    acc.total += stat.correct_answers + stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0, total: 0 });

  const spellingTotals = (spellingStats || []).reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    acc.total += stat.correct_answers + stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0, total: 0 });

  // Calculate recent performance
  const mathAccuracy = mathTotals.total > 0 
    ? Math.round((mathTotals.correct / mathTotals.total) * 100)
    : 0;
  
  const spellingAccuracy = spellingTotals.total > 0
    ? Math.round((spellingTotals.correct / spellingTotals.total) * 100)
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
                {mathTotals.total} vyřešených příkladů
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
                {spellingTotals.total} napsaných slov
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/dictionary')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slovník</CardTitle>
            <Languages className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Procvičuj si slovíčka</p>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/dictionary'); }}
                className="w-full mt-2"
                size="sm"
              >
                Otevřít slovník
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
