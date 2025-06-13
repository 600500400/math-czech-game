
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserLevel } from "@/types/gamificationTypes";
import { toast } from "sonner";

export const useLeveling = () => {
  const { authState } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user level
  const fetchUserLevel = async () => {
    if (!authState.user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', authState.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create initial level record
        await createInitialLevel();
      } else {
        setUserLevel(data);
      }
    } catch (error) {
      console.error('Error fetching user level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create initial level record
  const createInitialLevel = async () => {
    if (!authState.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_levels')
        .insert({
          user_id: authState.user.id,
          current_level: 1,
          total_xp: 0,
          xp_to_next_level: 100
        })
        .select()
        .single();

      if (error) throw error;
      setUserLevel(data);
    } catch (error) {
      console.error('Error creating initial level:', error);
    }
  };

  // Award XP and check for level up
  const awardXP = async (xpAmount: number) => {
    if (!authState.user?.id || !xpAmount) return;

    try {
      // Call the database function to update level
      const { data, error } = await supabase.rpc('update_user_level', {
        p_user_id: authState.user.id,
        p_xp_gained: xpAmount
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        
        // Show level up notification
        if (result.level_up) {
          toast.success(`🎉 Level Up!`, {
            description: `Gratulace! Dosáhl jsi úrovně ${result.new_level}!`,
            duration: 5000,
          });
        } else {
          toast.success(`+${xpAmount} XP získáno!`, {
            duration: 2000,
          });
        }
      }

      // Refresh user level data
      await fetchUserLevel();
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  // Calculate XP from game session
  const calculateGameXP = (correctAnswers: number, wrongAnswers: number, perfectGame: boolean, gameDuration: number) => {
    let baseXP = correctAnswers * 10; // 10 XP per correct answer
    
    // Bonus for perfect game
    if (perfectGame && correctAnswers >= 5) {
      baseXP += 50;
    }
    
    // Speed bonus (extra XP for fast completion)
    if (gameDuration < 60 && correctAnswers >= 5) {
      baseXP += 25;
    }
    
    // Penalty for many wrong answers
    if (wrongAnswers > correctAnswers) {
      baseXP = Math.max(baseXP - (wrongAnswers * 2), correctAnswers * 5);
    }
    
    return Math.max(baseXP, 5); // Minimum 5 XP
  };

  // Get progress percentage to next level
  const getLevelProgress = () => {
    if (!userLevel) return 0;
    
    const totalXPForCurrentLevel = (userLevel.current_level - 1) * 100 + ((userLevel.current_level - 2) * 50);
    const totalXPForNextLevel = userLevel.current_level * 100 + ((userLevel.current_level - 1) * 50);
    const progressXP = userLevel.total_xp - totalXPForCurrentLevel;
    const neededXP = totalXPForNextLevel - totalXPForCurrentLevel;
    
    return Math.min((progressXP / neededXP) * 100, 100);
  };

  useEffect(() => {
    if (authState.user?.id) {
      fetchUserLevel();
    }
  }, [authState.user?.id]);

  return {
    userLevel,
    isLoading,
    awardXP,
    calculateGameXP,
    getLevelProgress,
    fetchUserLevel
  };
};
