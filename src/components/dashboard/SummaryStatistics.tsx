
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import StatDisplay from "./StatDisplay";
import StatChart from "./StatChart";

interface StatTotals {
  correct: number;
  wrong: number;
  total: number;
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
            <StatDisplay 
              title="Matematika"
              accuracy={mathAccuracy}
              correct={mathTotal.correct}
              wrong={mathTotal.wrong}
              total={mathTotal.total}
            />
            <StatChart 
              data={mathChartData} 
              showChart={mathTotal.total > 0} 
            />
          </div>
          
          {/* Pravopis */}
          <div className="space-y-4">
            <StatDisplay 
              title="Pravopis"
              accuracy={spellingAccuracy}
              correct={spellingTotal.correct}
              wrong={spellingTotal.wrong}
              total={spellingTotal.total}
            />
            <StatChart 
              data={spellingChartData} 
              showChart={spellingTotal.total > 0} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
