
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface StatTotals {
  correct: number;
  wrong: number;
  total: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface SummaryStatisticsProps {
  mathTotal: StatTotals;
  spellingTotal: StatTotals;
  mathAccuracy: number;
  spellingAccuracy: number;
}

export const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  mathTotal,
  spellingTotal,
  mathAccuracy,
  spellingAccuracy
}) => {
  // Chart data
  const mathChartData = [
    { name: "Správně", value: mathTotal.correct, color: "#4ade80" },
    { name: "Špatně", value: mathTotal.wrong, color: "#f87171" }
  ];
  
  const spellingChartData = [
    { name: "Správně", value: spellingTotal.correct, color: "#4ade80" },
    { name: "Špatně", value: spellingTotal.wrong, color: "#f87171" }
  ];
  
  // Chart config
  const chartConfig = {
    Správně: { color: "#4ade80" },
    Špatně: { color: "#f87171" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Souhrnné statistiky</CardTitle>
        <CardDescription>
          Celkové výsledky vybraného dítěte v matematice a pravopisu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Matematika */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Matematika</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Úspěšnost</span>
                <span className="font-medium">{mathAccuracy}%</span>
              </div>
              <Progress value={mathAccuracy} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-green-500">{mathTotal.correct}</p>
                <p className="text-sm text-gray-500">Správně</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">{mathTotal.wrong}</p>
                <p className="text-sm text-gray-500">Špatně</p>
              </div>
              <div>
                <p className="text-xl font-bold">{mathTotal.total}</p>
                <p className="text-sm text-gray-500">Celkem</p>
              </div>
            </div>
            {mathTotal.total > 0 && (
              <div className="h-48">
                <ChartContainer config={chartConfig}>
                  <BarChart data={mathChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" name="Počet">
                      {mathChartData.map((entry, index) => (
                        <CartesianGrid key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </div>
          
          {/* Pravopis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pravopis</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Úspěšnost</span>
                <span className="font-medium">{spellingAccuracy}%</span>
              </div>
              <Progress value={spellingAccuracy} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-green-500">{spellingTotal.correct}</p>
                <p className="text-sm text-gray-500">Správně</p>
              </div>
              <div>
                <p className="text-xl font-bold text-red-500">{spellingTotal.wrong}</p>
                <p className="text-sm text-gray-500">Špatně</p>
              </div>
              <div>
                <p className="text-xl font-bold">{spellingTotal.total}</p>
                <p className="text-sm text-gray-500">Celkem</p>
              </div>
            </div>
            {spellingTotal.total > 0 && (
              <div className="h-48">
                <ChartContainer config={chartConfig}>
                  <BarChart data={spellingChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" name="Počet">
                      {spellingChartData.map((entry, index) => (
                        <CartesianGrid key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
