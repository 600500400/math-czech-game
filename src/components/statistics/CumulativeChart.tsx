
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700">
        Kumulovaný progres v čase
      </h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Graf */}
        <div className="flex-1 h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={Math.max(0, Math.floor(chartData.length / 6))}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={[0, 'dataMax + 1']}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(label) => `Datum: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeCorrect" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={{ fill: "#4ade80", strokeWidth: 2, r: 3 }}
                  name="cumulativeCorrect"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeWrong" 
                  stroke="#f87171" 
                  strokeWidth={2}
                  dot={{ fill: "#f87171", strokeWidth: 2, r: 3 }}
                  name="cumulativeWrong"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeTotal" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  name="cumulativeTotal"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Legenda vedle grafu */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-600 mb-4">Legenda</h4>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium text-green-800">Celkem správných odpovědí</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="w-4 h-4 bg-red-400 rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium text-red-800">Celkem špatných odpovědí</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium text-blue-800">Celkem všech odpovědí</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CumulativeChart;
