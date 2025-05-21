
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/authTypes";
import { User } from "@supabase/supabase-js";
import { useProfileFetcher } from "./useProfileFetcher";

/**
 * Hook for managing and retrieving user profile data
 * @param user - The authenticated user object
 * @returns Object containing profile data and loading state
 */
export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { fetchUserProfile, isLoading, error } = useProfileFetcher();

  // Fetch profile when user changes
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const data = await fetchUserProfile(user.id);
        if (data) {
          setProfile(data);
        }
      };
      
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [user?.id, fetchUserProfile]);

  return { 
    profile, 
    isLoading, 
    error 
  };
};
