
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
}

export const useLeaderboards = () => {
  const { authState } = useAuth();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch global leaderboard (top players by XP)
  const fetchGlobalLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Get top 50 users by total XP - first get user_levels data
      const { data: levelData, error: levelError } = await supabase
        .from('user_levels')
        .select('user_id, total_xp, current_level')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (levelError) throw levelError;

      if (!levelData || levelData.length === 0) {
        setGlobalLeaderboard([]);
        return;
      }

      // Get profiles for these users
      const userIds = levelData.map(entry => entry.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }

      // Get streak data for these users
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('user_id, current_streak, longest_streak')
        .in('user_id', userIds);

      if (streakError) {
        console.error('Error fetching streaks:', streakError);
      }

      // Combine data
      const leaderboard: LeaderboardEntry[] = levelData.map((entry, index) => {
        const profile = profiles?.find(p => p.id === entry.user_id);
        const streakInfo = streakData?.find(s => s.user_id === entry.user_id);
        return {
          user_id: entry.user_id,
          username: profile?.full_name || 'Uživatel',
          total_xp: entry.total_xp || 0,
          current_level: entry.current_level || 1,
          current_streak: streakInfo?.current_streak || 0,
          longest_streak: streakInfo?.longest_streak || 0,
          rank: index + 1
        };
      });

      setGlobalLeaderboard(leaderboard);

      // Find current user's rank
      if (authState.user?.id) {
        const userEntry = leaderboard.find(entry => entry.user_id === authState.user?.id);
        setUserRank(userEntry?.rank || null);
      }

    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weekly leaderboard (based on recent activity)
  const fetchWeeklyLeaderboard = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get users who were active in the last week
      const { data: recentMath } = await supabase
        .from('math_statistics')
        .select('user_id, correct_answers')
        .gte('created_at', oneWeekAgo.toISOString());

      const { data: recentSpelling } = await supabase
        .from('spelling_statistics')
        .select('user_id, correct_answers')
        .gte('created_at', oneWeekAgo.toISOString());

      // Calculate weekly points
      const weeklyPoints: { [key: string]: number } = {};
      
      recentMath?.forEach(entry => {
        weeklyPoints[entry.user_id] = (weeklyPoints[entry.user_id] || 0) + entry.correct_answers * 10;
      });

      recentSpelling?.forEach(entry => {
        weeklyPoints[entry.user_id] = (weeklyPoints[entry.user_id] || 0) + entry.correct_answers * 10;
      });

      // Get user profiles
      const activeUserIds = Object.keys(weeklyPoints);
      if (activeUserIds.length === 0) {
        setWeeklyLeaderboard([]);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', activeUserIds);

      // Create weekly leaderboard
      const weeklyLeaderboard: LeaderboardEntry[] = activeUserIds
        .map(userId => {
          const profile = profiles?.find(p => p.id === userId);
          return {
            user_id: userId,
            username: profile?.full_name || 'Uživatel',
            total_xp: weeklyPoints[userId],
            current_level: 0, // Not relevant for weekly
            current_streak: 0,
            longest_streak: 0,
            rank: 0
          };
        })
        .sort((a, b) => b.total_xp - a.total_xp)
        .slice(0, 20)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setWeeklyLeaderboard(weeklyLeaderboard);

    } catch (error) {
      console.error('Error fetching weekly leaderboard:', error);
    }
  };

  // Get user's position in leaderboard
  const getUserRank = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('total_xp')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      const { count } = await supabase
        .from('user_levels')
        .select('*', { count: 'exact', head: true })
        .gt('total_xp', data.total_xp);

      return (count || 0) + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchGlobalLeaderboard();
    fetchWeeklyLeaderboard();
  }, []);

  return {
    globalLeaderboard,
    weeklyLeaderboard,
    friendsLeaderboard,
    userRank,
    isLoading,
    fetchGlobalLeaderboard,
    fetchWeeklyLeaderboard,
    getUserRank
  };
};
