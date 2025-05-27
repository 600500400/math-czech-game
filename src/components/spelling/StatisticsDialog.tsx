
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import SpellingDetailedErrorsDialog from "./DetailedErrorsDialog";

interface StatisticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  answers?: any[];
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export const StatisticsDialog = ({
  open,
  onOpenChange,
  correctAnswers,
  wrongAnswers,
  totalAnswers,
  answers = [],
}: StatisticsDialogProps) => {
  const [showErrorsDialog, setShowErrorsDialog] = useState(false);
  
  // Prepare data for the chart
  const chartData: ChartDataItem[] = [
    { name: "Správně", value: correctAnswers, color: "#4ade80" },
    { name: "Špatně", value: wrongAnswers, color: "#f87171" },
  ];
  
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  
  const chartConfig = {
    correct: { color: "#4ade80" },
    wrong: { color: "#f87171" }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Statistika pravopisu</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
            
            {/* Graph with colored bars - fixed height and proper configuration */}
            {totalAnswers > 0 && (
              <div className="w-full h-40 mb-6">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      barCategoryGap="20%"
                    >
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar 
                        dataKey="value"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
            {wrongAnswers > 0 && (
              <Button 
                variant="outline"
                onClick={() => setShowErrorsDialog(true)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <AlertCircle size={16} className="mr-2" />
                Zobrazit chyby ({wrongAnswers})
              </Button>
            )}
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-orange-500 hover:bg-orange-600 flex-1"
            >
              Zavřít
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SpellingDetailedErrorsDialog
        open={showErrorsDialog}
        onOpenChange={setShowErrorsDialog}
        answers={answers}
      />
    </>
  );
};
