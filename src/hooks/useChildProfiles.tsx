
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";
import { useProfileFetcher } from "./useProfileFetcher";

/**
 * Hook for fetching and managing child profiles for parent users
 * @param parentId - The ID of the parent user
 * @returns Object containing child profiles and loading state
 */
export const useChildProfiles = (parentId: string | null) => {
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserProfile } = useProfileFetcher();

  useEffect(() => {
    const fetchChildren = async () => {
      if (!parentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch child IDs linked to parent
        const { data: childLinks, error: linkError } = await supabase
          .from("parent_child")
          .select("child_id")
          .eq("parent_id", parentId);
        
        if (linkError) {
          console.error("Error fetching child links:", linkError);
          setError(linkError.message);
          return;
        }
        
        // Fetch each child's profile
        const childProfiles = [];
        for (const link of childLinks) {
          const profile = await fetchUserProfile(link.child_id);
          if (profile) {
            childProfiles.push(profile);
          }
        }
        
        setChildren(childProfiles);
      } catch (error: any) {
        console.error("Error fetching children:", error);
        setError(error.message || "Failed to fetch children");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChildren();
  }, [parentId, fetchUserProfile]);

  return { children, isLoading, error };
};
