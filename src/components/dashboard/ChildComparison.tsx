
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ChildComparisonProps {
  children: any[];
  childStats: { [childId: string]: { mathStats: any[], spellingStats: any[] } };
}

export const ChildComparison: React.FC<ChildComparisonProps> = ({
  children,
  childStats
}) => {
  // Calculate comparison data
  const comparisonData = React.useMemo(() => {
    return children.map(child => {
      const stats = childStats[child.id] || { mathStats: [], spellingStats: [] };
      
      const mathTotal = stats.mathStats.reduce((acc, stat) => {
        acc.correct += stat.correct_answers;
        acc.wrong += stat.wrong_answers;
        return acc;
      }, { correct: 0, wrong: 0 });

      const spellingTotal = stats.spellingStats.reduce((acc, stat) => {
        acc.correct += stat.correct_answers;
        acc.wrong += stat.wrong_answers;
        return acc;
      }, { correct: 0, wrong: 0 });

      const mathAccuracy = mathTotal.correct + mathTotal.wrong > 0 
        ? (mathTotal.correct / (mathTotal.correct + mathTotal.wrong)) * 100 
        : 0;

      const spellingAccuracy = spellingTotal.correct + spellingTotal.wrong > 0 
        ? (spellingTotal.correct / (spellingTotal.correct + spellingTotal.wrong)) * 100 
        : 0;

      const totalGames = stats.mathStats.length + stats.spellingStats.length;
      const averageAccuracy = (mathAccuracy + spellingAccuracy) / 2;

      return {
        name: child.username,
        id: child.id,
        mathAccuracy: Math.round(mathAccuracy),
        spellingAccuracy: Math.round(spellingAccuracy),
        averageAccuracy: Math.round(averageAccuracy),
        totalGames,
        mathGames: stats.mathStats.length,
        spellingGames: stats.spellingStats.length
      };
    });
  }, [children, childStats]);

  // Radar chart data
  const radarData = React.useMemo(() => {
    const subjects = ['Matematika', 'Pravopis', 'Aktivita', 'Konzistence'];
    
    return subjects.map(subject => {
      const dataPoint: any = { subject };
      
      comparisonData.forEach(child => {
        let value = 0;
        switch (subject) {
          case 'Matematika':
            value = child.mathAccuracy;
            break;
          case 'Pravopis':
            value = child.spellingAccuracy;
            break;
          case 'Aktivita':
            value = Math.min(child.totalGames * 10, 100); // Scale games to 0-100
            break;
          case 'Konzistence':
            value = child.mathGames > 0 && child.spellingGames > 0 ? 100 : 50;
            break;
        }
        dataPoint[child.name] = value;
      });
      
      return dataPoint;
    });
  }, [comparisonData]);

  if (children.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Porovnání dětí</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Pro porovnání potřebujete alespoň 2 děti
          </p>
        </CardContent>
      </Card>
    );
  }

  const averagePerformance = comparisonData.reduce((sum, child) => sum + child.averageAccuracy, 0) / comparisonData.length;

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Přehled výkonu všech dětí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="mathAccuracy" fill="#3b82f6" name="Matematika %" />
                <Bar dataKey="spellingAccuracy" fill="#10b981" name="Pravopis %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailní porovnání</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {comparisonData.map((child, index) => (
                  <Radar
                    key={child.id}
                    name={child.name}
                    dataKey={child.name}
                    stroke={getChildColor(index)}
                    fill={getChildColor(index)}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Performance Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonData.map(child => (
          <Card key={child.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{child.name}</CardTitle>
                {getPerformanceBadge(child.averageAccuracy, averagePerformance)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{child.mathAccuracy}%</p>
                  <p className="text-gray-500">Matematika</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">{child.spellingAccuracy}%</p>
                  <p className="text-gray-500">Pravopis</p>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <p className="text-xs text-gray-500">Celkem her: {child.totalGames}</p>
                <p className="text-xs text-gray-500">
                  Mat: {child.mathGames} | Prav: {child.spellingGames}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function getChildColor(index: number): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  return colors[index % colors.length];
}

function getPerformanceBadge(childAverage: number, globalAverage: number) {
  const difference = childAverage - globalAverage;
  
  if (difference > 5) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <TrendingUp className="h-3 w-3 mr-1" />
        Nad průměrem
      </Badge>
    );
  } else if (difference < -5) {
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <TrendingDown className="h-3 w-3 mr-1" />
        Pod průměrem
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline">
        <Minus className="h-3 w-3 mr-1" />
        Průměr
      </Badge>
    );
  }
}
