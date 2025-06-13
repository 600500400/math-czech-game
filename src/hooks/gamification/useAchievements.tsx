
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Achievement, UserAchievement, GameSession } from "@/types/gamificationTypes";
import { toast } from "sonner";

export const useAchievements = () => {
  const { authState } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all available achievements
  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  // Fetch user's achievements
  const fetchUserAchievements = async () => {
    if (!authState.user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', authState.user.id);

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check and unlock achievements based on game session
  const checkAchievements = async (gameSession: GameSession) => {
    if (!authState.user?.id) return;

    try {
      // Check first correct answer
      if (gameSession.correct_answers > 0) {
        await checkAndUnlockAchievement('first_correct', 1);
      }

      // Check perfect game
      if (gameSession.perfect_game && gameSession.correct_answers >= 5) {
        await checkAndUnlockAchievement('perfect_game', 1);
      }

      // Check speed demon (10 questions in under 60 seconds)
      if (gameSession.correct_answers >= 10 && gameSession.game_duration < 60) {
        await checkAndUnlockAchievement('speed_demon', 1);
      }

      // Check subject masters
      if (gameSession.subject === 'math') {
        await updateProgressAchievement('math_master', gameSession.correct_answers);
      } else if (gameSession.subject === 'spelling') {
        await updateProgressAchievement('spelling_wizard', gameSession.correct_answers);
      }

      // Refresh user achievements
      await fetchUserAchievements();
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // Check and unlock a simple achievement
  const checkAndUnlockAchievement = async (achievementType: string, currentValue: number) => {
    const achievement = achievements.find(a => a.type === achievementType);
    if (!achievement) return;

    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
    if (userAchievement?.completed) return;

    const requiredValue = achievement.condition_data?.required || 1;
    
    if (currentValue >= requiredValue) {
      await unlockAchievement(achievement.id);
    }
  };

  // Update progress for cumulative achievements
  const updateProgressAchievement = async (achievementType: string, increment: number) => {
    const achievement = achievements.find(a => a.type === achievementType);
    if (!achievement) return;

    let userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
    const requiredValue = achievement.condition_data?.correct || 100;

    if (!userAchievement) {
      // Create new progress record
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: authState.user!.id,
          achievement_id: achievement.id,
          progress: increment,
          completed: increment >= requiredValue
        })
        .select()
        .single();

      if (error) throw error;
      
      if (increment >= requiredValue) {
        showAchievementNotification(achievement);
      }
    } else if (!userAchievement.completed) {
      // Update existing progress
      const newProgress = userAchievement.progress + increment;
      const isCompleted = newProgress >= requiredValue;

      const { error } = await supabase
        .from('user_achievements')
        .update({
          progress: newProgress,
          completed: isCompleted,
          unlocked_at: isCompleted ? new Date().toISOString() : userAchievement.unlocked_at
        })
        .eq('id', userAchievement.id);

      if (error) throw error;

      if (isCompleted) {
        showAchievementNotification(achievement);
      }
    }
  };

  // Unlock achievement
  const unlockAchievement = async (achievementId: string) => {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: authState.user!.id,
          achievement_id: achievementId,
          completed: true,
          progress: 1
        });

      if (error) throw error;

      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        showAchievementNotification(achievement);
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  // Show achievement notification
  const showAchievementNotification = (achievement: Achievement) => {
    toast.success(`🏆 Úspěch odemčen!`, {
      description: `${achievement.name} - ${achievement.description}`,
      duration: 5000,
    });
  };

  // Check streak achievements
  const checkStreakAchievements = async (currentStreak: number) => {
    if (currentStreak >= 3) await checkAndUnlockAchievement('streak_3', currentStreak);
    if (currentStreak >= 7) await checkAndUnlockAchievement('streak_7', currentStreak);
    if (currentStreak >= 30) await checkAndUnlockAchievement('streak_30', currentStreak);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (authState.user?.id) {
      fetchUserAchievements();
    }
  }, [authState.user?.id]);

  return {
    achievements,
    userAchievements,
    isLoading,
    checkAchievements,
    checkStreakAchievements,
    fetchUserAchievements
  };
};
