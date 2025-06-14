
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Star } from 'lucide-react';

interface AIInsightsProps {
  mathStats?: any;
  spellingStats?: any;
  recentErrors?: string[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  mathStats,
  spellingStats,
  recentErrors = []
}) => {
  const generateInsights = () => {
    const insights: Array<{
      type: 'tip' | 'achievement' | 'improvement' | 'challenge';
      title: string;
      description: string;
      icon: React.ReactNode;
      color: string;
    }> = [];

    // Math insights
    if (mathStats) {
      const accuracy = mathStats.total_problems > 0 
        ? (mathStats.correct_answers / mathStats.total_problems) * 100 
        : 0;

      if (accuracy > 90) {
        insights.push({
          type: 'achievement',
          title: 'Matematický expert!',
          description: `Máš ${accuracy.toFixed(0)}% úspěšnost v matematice. Skvělá práce!`,
          icon: <Star className="h-4 w-4" />,
          color: 'text-yellow-600 bg-yellow-50'
        });
      } else if (accuracy < 70) {
        insights.push({
          type: 'improvement',
          title: 'Čas na procvičování',
          description: 'Zkus si procvičit základní operace. Každý den trochu pomůže!',
          icon: <Target className="h-4 w-4" />,
          color: 'text-blue-600 bg-blue-50'
        });
      }

      if (mathStats.average_time > 15) {
        insights.push({
          type: 'tip',
          title: 'Rychlost počítání',
          description: 'Zkus si procvičit násobilku - pomůže ti počítat rychleji!',
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'text-green-600 bg-green-50'
        });
      }
    }

    // Spelling insights
    if (spellingStats) {
      const accuracy = spellingStats.total_words > 0 
        ? (spellingStats.correct_words / spellingStats.total_words) * 100 
        : 0;

      if (accuracy > 85) {
        insights.push({
          type: 'achievement',
          title: 'Pravopisný mistr!',
          description: `${accuracy.toFixed(0)}% správně napsaných slov. Výborně!`,
          icon: <Star className="h-4 w-4" />,
          color: 'text-purple-600 bg-purple-50'
        });
      }
    }

    // Recent errors insights
    if (recentErrors.length > 0) {
      const errorTypes = recentErrors.reduce((acc, error) => {
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommonError = Object.entries(errorTypes)
        .sort(([,a], [,b]) => b - a)[0];

      if (mostCommonError) {
        insights.push({
          type: 'challenge',
          title: 'Běžná chyba',
          description: `Často děláš chybu v: ${mostCommonError[0]}. Zkus si to procvičit!`,
          icon: <TrendingDown className="h-4 w-4" />,
          color: 'text-orange-600 bg-orange-50'
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Začni procvičovat a uvidíš zde personalizované tipy!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI Doporučení</h3>
      <div className="grid gap-3">
        {insights.map((insight, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${insight.color}`}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.type === 'tip' && 'Tip'}
                      {insight.type === 'achievement' && 'Úspěch'}
                      {insight.type === 'improvement' && 'Zlepšení'}
                      {insight.type === 'challenge' && 'Výzva'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
