
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ChartDataItem } from "@/types/mathTypes";

interface StatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  correctPercentage: number;
}

const StatisticsDialog: React.FC<StatisticsDialogProps> = ({
  open,
  onOpenChange,
  correctAnswers,
  wrongAnswers,
  totalAnswers,
  correctPercentage,
}) => {
  // Chart data for statistics
  const chartData: ChartDataItem[] = [
    { name: "Správně", value: correctAnswers, color: "#4ade80" },
    { name: "Špatně", value: wrongAnswers, color: "#f87171" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Statistika matematiky</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Úspěšnost</span>
              <span className="font-medium">{correctPercentage}%</span>
            </div>
            <Progress value={correctPercentage} className="h-3" />
          </div>
          
          {/* Detailed statistics table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Typ</TableHead>
                <TableHead className="text-right">Počet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Správné odpovědi</TableCell>
                <TableCell className="text-right font-medium text-green-500">{correctAnswers}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Špatné odpovědi</TableCell>
                <TableCell className="text-right font-medium text-red-500">{wrongAnswers}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Celkem</TableCell>
                <TableCell className="text-right font-medium">{totalAnswers}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {/* Graph */}
          {totalAnswers > 0 && (
            <div className="h-48">
              <ChartContainer config={{
                correct: { color: "#4ade80" },
                wrong: { color: "#f87171" }
              }}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar 
                    dataKey="value" 
                    fill="#4ade80"
                    stroke="#4ade80"
                    name="Hodnota"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-orange-500 hover:bg-orange-600 w-full"
          >
            Zavřít
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticsDialog;
