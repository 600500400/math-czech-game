
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/authTypes";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing and retrieving user profile data
 * @param user - The authenticated user object
 * @returns Object containing profile data and loading state
 */
export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        // Transform database profile to UserProfile type
        if (data) {
          const transformedProfile: UserProfile = {
            id: data.id,
            username: data.full_name || undefined,
            full_name: data.full_name || undefined,
            role: (data.role as 'parent' | 'child' | 'teacher') || 'child',
            created_at: data.created_at,
            updated_at: data.updated_at || undefined
          };
          setProfile(transformedProfile);
        }
        
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to fetch profile");
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user?.id]);

  return { 
    profile, 
    isLoading, 
    error 
  };
};
