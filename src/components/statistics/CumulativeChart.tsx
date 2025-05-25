
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatDate } from "@/utils/dateUtils";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

interface CumulativeChartProps {
  data: MathStatistics[] | SpellingStatistics[];
  type: "math" | "spelling";
}

interface ChartDataPoint {
  date: string;
  cumulativeCorrect: number;
  cumulativeWrong: number;
  cumulativeTotal: number;
  games: number;
}

const CumulativeChart: React.FC<CumulativeChartProps> = ({ data, type }) => {
  // Sort data by date and calculate cumulative values
  const sortedData = [...data].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const chartData: ChartDataPoint[] = [];
  let cumulativeCorrect = 0;
  let cumulativeWrong = 0;

  sortedData.forEach((stat, index) => {
    cumulativeCorrect += stat.correct_answers;
    cumulativeWrong += stat.wrong_answers;
    const cumulativeTotal = cumulativeCorrect + cumulativeWrong;

    chartData.push({
      date: formatDate(stat.created_at),
      cumulativeCorrect,
      cumulativeWrong,
      cumulativeTotal,
      games: index + 1
    });
  });

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Žádná data pro graf
      </div>
    );
  }

  const chartConfig = {
    cumulativeCorrect: {
      label: "Celkem správných odpovědí",
      color: "#4ade80"
    },
    cumulativeWrong: {
      label: "Celkem špatných odpovědí", 
      color: "#f87171"
    },
    cumulativeTotal: {
      label: "Celkem odpovědí",
      color: "#3b82f6"
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">
        Kumulovaný progres v čase
      </h3>
      
      <div className="h-64">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(label) => `Datum: ${label}`}
                formatter={(value, name) => {
                  return [value, chartConfig[name as keyof typeof chartConfig]?.label];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeCorrect" 
                stroke="#4ade80" 
                strokeWidth={3}
                dot={{ fill: "#4ade80", strokeWidth: 2, r: 4 }}
                name="cumulativeCorrect"
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeWrong" 
                stroke="#f87171" 
                strokeWidth={3}
                dot={{ fill: "#f87171", strokeWidth: 2, r: 4 }}
                name="cumulativeWrong"
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeTotal" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="cumulativeTotal"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span>Celkem správných odpovědí</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>Celkem špatných odpovědí</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Celkem všech odpovědí</span>
        </div>
      </div>
    </div>
  );
};

export default CumulativeChart;
