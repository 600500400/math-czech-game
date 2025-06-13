
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserStreak } from "@/types/gamificationTypes";

export const useStreaks = () => {
  const { authState } = useAuth();
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user streak
  const fetchUserStreak = async () => {
    if (!authState.user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', authState.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        await createInitialStreak();
      } else {
        setUserStreak(data);
      }
    } catch (error) {
      console.error('Error fetching user streak:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create initial streak record
  const createInitialStreak = async () => {
    if (!authState.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: authState.user.id,
          current_streak: 0,
          longest_streak: 0,
          streak_type: 'daily'
        })
        .select()
        .single();

      if (error) throw error;
      setUserStreak(data);
    } catch (error) {
      console.error('Error creating initial streak:', error);
    }
  };

  // Update streak on activity
  const updateStreak = async () => {
    if (!authState.user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      if (!userStreak) {
        await fetchUserStreak();
        return;
      }

      const lastActivityDate = userStreak.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newCurrentStreak = userStreak.current_streak;
      let newLongestStreak = userStreak.longest_streak;

      if (lastActivityDate === today) {
        // Already played today, no streak change
        return userStreak.current_streak;
      } else if (lastActivityDate === yesterdayStr) {
        // Played yesterday, continue streak
        newCurrentStreak += 1;
      } else {
        // Streak broken, start new
        newCurrentStreak = 1;
      }

      // Update longest streak if needed
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', authState.user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserStreak(data);
      return newCurrentStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      return 0;
    }
  };

  // Check if streak is at risk (no activity yesterday)
  const isStreakAtRisk = () => {
    if (!userStreak?.last_activity_date) return false;
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const lastActivity = new Date(userStreak.last_activity_date);
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= 1;
  };

  useEffect(() => {
    if (authState.user?.id) {
      fetchUserStreak();
    }
  }, [authState.user?.id]);

  return {
    userStreak,
    isLoading,
    updateStreak,
    isStreakAtRisk,
    fetchUserStreak
  };
};
