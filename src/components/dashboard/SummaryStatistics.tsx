
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator, PenTool, Trophy, Target } from "lucide-react";
import { UserTheme } from "@/hooks/useUserTheme";

interface SummaryStatisticsProps {
  mathTotal: { correct: number; wrong: number; total: number };
  spellingTotal: { correct: number; wrong: number; total: number };
  mathAccuracy: number;
  spellingAccuracy: number;
  selectedTheme?: UserTheme;
}

export const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({
  mathTotal,
  spellingTotal,
  mathAccuracy,
  spellingAccuracy,
  selectedTheme
}) => {
  const overallAccuracy = mathTotal.total + spellingTotal.total > 0 
    ? Math.round(((mathTotal.correct + spellingTotal.correct) / (mathTotal.total + spellingTotal.total)) * 100)
    : 0;

  const primaryColor = selectedTheme?.primaryColor || 'rgb(59, 130, 246)';
  const secondaryColor = selectedTheme?.secondaryColor || 'rgb(147, 197, 253)';
  const accentColor = selectedTheme?.accentColor || 'rgb(29, 78, 216)';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Math Statistics */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Matematika</CardTitle>
          <Calculator className="h-4 w-4" style={{ color: primaryColor }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>
            {mathAccuracy}%
          </div>
          <Progress 
            value={mathAccuracy} 
            className="mt-2" 
            style={{
              '--progress-background': secondaryColor,
              '--progress-foreground': primaryColor
            } as React.CSSProperties}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {mathTotal.correct} správně, {mathTotal.wrong} špatně
          </p>
        </CardContent>
      </Card>

      {/* Spelling Statistics */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pravopis</CardTitle>
          <PenTool className="h-4 w-4" style={{ color: primaryColor }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>
            {spellingAccuracy}%
          </div>
          <Progress 
            value={spellingAccuracy} 
            className="mt-2"
            style={{
              '--progress-background': secondaryColor,
              '--progress-foreground': primaryColor
            } as React.CSSProperties}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {spellingTotal.correct} správně, {spellingTotal.wrong} špatně
          </p>
        </CardContent>
      </Card>

      {/* Overall Performance */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Celková úspěšnost</CardTitle>
          <Trophy className="h-4 w-4" style={{ color: primaryColor }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>
            {overallAccuracy}%
          </div>
          <Progress 
            value={overallAccuracy} 
            className="mt-2"
            style={{
              '--progress-background': secondaryColor,
              '--progress-foreground': primaryColor
            } as React.CSSProperties}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Napříč všemi cvičeními
          </p>
        </CardContent>
      </Card>

      {/* Total Activity */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Celková aktivita</CardTitle>
          <Target className="h-4 w-4" style={{ color: primaryColor }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: accentColor }}>
            {mathTotal.total + spellingTotal.total}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Celkem odpovězených otázek
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Mat:</span> {mathTotal.total}
            </div>
            <div>
              <span className="font-medium">Prav:</span> {spellingTotal.total}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
