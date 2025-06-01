
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";

/**
 * A hook that provides functions for fetching user profiles
 */
export const useProfileFetcher = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches a user profile from the database by user ID
   * @param userId - The ID of the user to fetch
   * @returns The user profile or null if not found
   */
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // Transform database profile to UserProfile type
      if (data) {
        const profile: UserProfile = {
          id: data.id,
          username: data.full_name || undefined,
          full_name: data.full_name || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at || undefined
        };
        return profile;
      }
      
      return null;
      
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Failed to fetch profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUserProfile, isLoading, error };
};
