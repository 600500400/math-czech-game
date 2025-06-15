
import { LevelDisplay } from "@/components/gamification/LevelDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { UserLevel, UserStreak } from "@/types/gamificationTypes";

interface GamificationStatsProps {
  authState: {
    user: any;
  };
  leveling: {
    userLevel: UserLevel | null;
    getLevelProgress: () => number;
  };
  streaks: {
    userStreak: UserStreak | null;
    isStreakAtRisk: () => boolean;
  };
}

export const GamificationStats = ({ 
  authState, 
  leveling, 
  streaks 
}: GamificationStatsProps) => {
  if (!authState.user) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <LevelDisplay 
        userLevel={leveling.userLevel} 
        progress={leveling.getLevelProgress()} 
      />
      <StreakDisplay 
        userStreak={streaks.userStreak} 
        isAtRisk={streaks.isStreakAtRisk()} 
      />
    </div>
  );
};
