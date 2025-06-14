
import { LevelDisplay } from "@/components/gamification/LevelDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";

interface SpellingPracticeStatsProps {
  authState: {
    user: any;
  };
  leveling: {
    userLevel: any;
    getLevelProgress: () => number;
  };
  streaks: {
    userStreak: any;
    isStreakAtRisk: () => boolean;
  };
}

export const SpellingPracticeStats = ({ 
  authState, 
  leveling, 
  streaks 
}: SpellingPracticeStatsProps) => {
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
