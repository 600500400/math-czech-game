
import React from "react";
import { cn } from "@/lib/utils";

interface ChartLegendProps {
  data: Array<{
    name: string;
    color: string;
    value?: number | string;
  }>;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  data,
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-4 justify-center", className)}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">
            {item.name}
            {item.value !== undefined && (
              <span className="font-medium ml-1">({item.value})</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
