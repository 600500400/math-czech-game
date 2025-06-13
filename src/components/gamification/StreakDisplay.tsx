
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, AlertTriangle } from "lucide-react";
import { UserStreak } from "@/types/gamificationTypes";

interface StreakDisplayProps {
  userStreak: UserStreak | null;
  isAtRisk: boolean;
  compact?: boolean;
}

export const StreakDisplay = ({ userStreak, isAtRisk, compact = false }: StreakDisplayProps) => {
  if (!userStreak) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={isAtRisk ? "destructive" : "outline"} 
          className="flex items-center gap-1"
        >
          <Flame className="w-3 h-3" />
          {userStreak.current_streak} dní
        </Badge>
        {isAtRisk && (
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        )}
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${isAtRisk ? 'text-orange-500' : 'text-orange-400'}`} />
          <span className="font-semibold">Denní šňůra</span>
        </div>
        {isAtRisk && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Ohroženo
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-orange-500">
            {userStreak.current_streak}
          </div>
          <div className="text-xs text-muted-foreground">Aktuální</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-500">
            {userStreak.longest_streak}
          </div>
          <div className="text-xs text-muted-foreground">Nejdelší</div>
        </div>
      </div>
      
      {userStreak.last_activity_date && (
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          Poslední aktivita: {new Date(userStreak.last_activity_date).toLocaleDateString('cs-CZ')}
        </div>
      )}
    </Card>
  );
};
