
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";
import { User } from "@supabase/supabase-js";

// Hook for fetching user profile data
export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data from the database
  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
        return null;
      }

      setProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error: any) {
      console.error("Unexpected error fetching profile:", error);
      setError(error.message || "Failed to fetch profile");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user?.id]);

  return { profile, isLoading, error, fetchUserProfile };
};
