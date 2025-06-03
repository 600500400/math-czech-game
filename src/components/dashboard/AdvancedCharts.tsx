
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface AdvancedChartsProps {
  mathStats: any[];
  spellingStats: any[];
  selectedChild: string | null;
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({
  mathStats,
  spellingStats,
  selectedChild
}) => {
  // Prepare data for progress over time chart
  const progressData = React.useMemo(() => {
    const mathData = mathStats.map(stat => ({
      date: format(new Date(stat.created_at), 'dd.MM', { locale: cs }),
      math: stat.correct_answers / (stat.correct_answers + stat.wrong_answers) * 100 || 0,
      mathTotal: stat.correct_answers + stat.wrong_answers
    }));

    const spellingData = spellingStats.map(stat => ({
      date: format(new Date(stat.created_at), 'dd.MM', { locale: cs }),
      spelling: stat.correct_answers / (stat.correct_answers + stat.wrong_answers) * 100 || 0,
      spellingTotal: stat.correct_answers + stat.wrong_answers
    }));

    // Combine and sort by date
    const combined = [...mathData, ...spellingData];
    const uniqueDates = [...new Set(combined.map(item => item.date))];
    
    return uniqueDates.map(date => {
      const mathItem = mathData.find(item => item.date === date);
      const spellingItem = spellingData.find(item => item.date === date);
      
      return {
        date,
        math: mathItem?.math || 0,
        spelling: spellingItem?.spelling || 0,
        mathTotal: mathItem?.mathTotal || 0,
        spellingTotal: spellingItem?.spellingTotal || 0
      };
    }).slice(-10); // Last 10 data points
  }, [mathStats, spellingStats]);

  // Prepare data for activity volume chart
  const activityData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'dd.MM', { locale: cs });
    }).reverse();

    return last7Days.map(date => {
      const mathCount = mathStats.filter(stat => 
        format(new Date(stat.created_at), 'dd.MM', { locale: cs }) === date
      ).length;
      
      const spellingCount = spellingStats.filter(stat => 
        format(new Date(stat.created_at), 'dd.MM', { locale: cs }) === date
      ).length;

      return {
        date,
        math: mathCount,
        spelling: spellingCount,
        total: mathCount + spellingCount
      };
    });
  }, [mathStats, spellingStats]);

  return (
    <div className="space-y-6">
      {/* Progress Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vývoj úspěšnosti v čase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  labelFormatter={(label) => `Datum: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="math" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Matematika (%)"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="spelling" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Pravopis (%)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivita za posledních 7 dní</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="math" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Matematika"
                />
                <Area 
                  type="monotone" 
                  dataKey="spelling" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Pravopis"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance by Operation/Subject */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Výkon podle operací</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMathOperationStats(mathStats)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="operation" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Úspěšnost']} />
                  <Bar dataKey="accuracy" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Výkon podle skupin slov</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSpellingGroupStats(spellingStats)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Úspěšnost']} />
                  <Bar dataKey="accuracy" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
function getMathOperationStats(mathStats: any[]) {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  
  return operations.map(op => {
    const stats = mathStats.filter(stat => stat.operation === op);
    const totalCorrect = stats.reduce((sum, stat) => sum + stat.correct_answers, 0);
    const totalWrong = stats.reduce((sum, stat) => sum + stat.wrong_answers, 0);
    const total = totalCorrect + totalWrong;
    
    return {
      operation: getOperationName(op),
      accuracy: total > 0 ? (totalCorrect / total) * 100 : 0,
      total
    };
  }).filter(item => item.total > 0);
}

function getSpellingGroupStats(spellingStats: any[]) {
  const groups = [...new Set(spellingStats.map(stat => stat.word_group))];
  
  return groups.map(group => {
    const stats = spellingStats.filter(stat => stat.word_group === group);
    const totalCorrect = stats.reduce((sum, stat) => sum + stat.correct_answers, 0);
    const totalWrong = stats.reduce((sum, stat) => sum + stat.wrong_answers, 0);
    const total = totalCorrect + totalWrong;
    
    return {
      group: group || 'Neznámá skupina',
      accuracy: total > 0 ? (totalCorrect / total) * 100 : 0,
      total
    };
  }).filter(item => item.total > 0);
}

function getOperationName(operation: string): string {
  const names = {
    addition: 'Sčítání',
    subtraction: 'Odčítání',
    multiplication: 'Násobení',
    division: 'Dělení'
  };
  return names[operation as keyof typeof names] || operation;
}
