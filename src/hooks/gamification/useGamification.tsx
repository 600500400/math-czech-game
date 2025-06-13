
import { useAchievements } from "./useAchievements";
import { useLeveling } from "./useLeveling";
import { useStreaks } from "./useStreaks";
import { useLeaderboards } from "./useLeaderboards";
import { GameSession } from "@/types/gamificationTypes";

export const useGamification = () => {
  const achievements = useAchievements();
  const leveling = useLeveling();
  const streaks = useStreaks();
  const leaderboards = useLeaderboards();

  // Process game completion with all gamification elements
  const processGameCompletion = async (gameSession: GameSession) => {
    try {
      // Update streak first
      const newStreak = await streaks.updateStreak();
      
      // Calculate and award XP
      const xpAmount = leveling.calculateGameXP(
        gameSession.correct_answers,
        gameSession.wrong_answers,
        gameSession.perfect_game,
        gameSession.game_duration
      );
      await leveling.awardXP(xpAmount);
      
      // Check achievements
      await achievements.checkAchievements(gameSession);
      
      // Check streak achievements if we have a new streak
      if (newStreak && newStreak > 0) {
        await achievements.checkStreakAchievements(newStreak);
      }
      
      // Refresh leaderboards
      await leaderboards.fetchGlobalLeaderboard();
      await leaderboards.fetchWeeklyLeaderboard();
      
    } catch (error) {
      console.error('Error processing game completion:', error);
    }
  };

  return {
    achievements,
    leveling,
    streaks,
    leaderboards,
    processGameCompletion
  };
};
