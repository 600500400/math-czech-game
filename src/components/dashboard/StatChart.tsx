
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface StatChartProps {
  data: ChartDataItem[];
  showChart: boolean;
}

const StatChart: React.FC<StatChartProps> = ({ data, showChart }) => {
  // Chart config
  const chartConfig = {
    Správně: { color: "#4ade80" },
    Špatně: { color: "#f87171" }
  };

  if (!showChart) {
    return null;
  }

  return (
    <div className="h-48">
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" name="Počet">
            {data.map((entry, index) => (
              <CartesianGrid key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default StatChart;
