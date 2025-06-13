
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";
import { UserLevel } from "@/types/gamificationTypes";

interface LevelDisplayProps {
  userLevel: UserLevel | null;
  progress: number;
  compact?: boolean;
}

export const LevelDisplay = ({ userLevel, progress, compact = false }: LevelDisplayProps) => {
  if (!userLevel) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          Level {userLevel.current_level}
        </Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Zap className="w-3 h-3" />
          {userLevel.total_xp} XP
        </div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">Level {userLevel.current_level}</span>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {userLevel.total_xp} XP
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pokrok k další úrovni</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-muted-foreground text-center">
          {userLevel.xp_to_next_level} XP do Level {userLevel.current_level + 1}
        </div>
      </div>
    </Card>
  );
};
