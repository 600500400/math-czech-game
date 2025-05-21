
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from "@/types/authTypes";
import { User } from "@supabase/supabase-js";

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initial auth state setup
  useEffect(() => {
    // Check for local user first
    const localUserStr = localStorage.getItem('localUser');
    
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        setAuthState({
          user: { id: localUser.id } as User,
          profile: localUser as UserProfile,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return;
      } catch (e) {
        console.error("Error parsing local user:", e);
        localStorage.removeItem('localUser');
      }
    }
    
    // If no local user, check Supabase session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update state synchronously
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }));

        if (session?.user) {
          // Defer profile loading to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profile => {
              setAuthState(prev => ({
                ...prev,
                profile,
                isLoading: false,
              }));
            });
          }, 0);
        }
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setAuthState({
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  return { authState, setAuthState };
};
