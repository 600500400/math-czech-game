
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/authTypes";

/**
 * Hook for fetching and managing child profiles for parent users
 * @param parentId - The ID of the parent user
 * @returns Object containing child profiles and loading state
 */
export const useChildProfiles = (parentId: string | null) => {
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      if (!parentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching children for parent:", parentId);
        
        // Get child IDs from parent_child relationships
        const { data: relationships, error: relError } = await supabase
          .from('parent_child')
          .select('child_id')
          .eq('parent_id', parentId);
        
        if (relError) {
          throw relError;
        }
        
        if (!relationships || relationships.length === 0) {
          setChildren([]);
          return;
        }
        
        // Get child profiles
        const childIds = relationships.map(rel => rel.child_id);
        const { data: childProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', childIds);
        
        if (profileError) {
          throw profileError;
        }
        
        const transformedChildren = (childProfiles || []).map(profile => ({
          id: profile.id,
          username: profile.full_name || 'Dítě',
          full_name: profile.full_name,
          role: profile.role as 'child',
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }));
        
        setChildren(transformedChildren);
        
      } catch (error: any) {
        console.error("Error fetching children:", error);
        setError(error.message || "Failed to fetch children");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChildren();
  }, [parentId]);

  return { children, isLoading, error };
};
