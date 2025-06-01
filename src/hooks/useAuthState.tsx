
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from "@/types/authTypes";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
    let mounted = true;

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, session?.user?.id);

        if (session?.user) {
          // User is authenticated with Supabase
          const profile: UserProfile = {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            role: session.user.user_metadata?.role || 'child',
            email: session.user.email,
            created_at: session.user.created_at,
          };

          setAuthState({
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Check for local user as fallback
          const localUserStr = localStorage.getItem('localUser');
          
          if (localUserStr) {
            try {
              const localUser = JSON.parse(localUserStr);
              console.log("Using local user:", localUser.id);
              
              setAuthState({
                user: { id: localUser.id } as any,
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

          // No user at all
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'child',
          email: session.user.email,
          created_at: session.user.created_at,
        };

        setAuthState({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Since there are no tables yet, we'll return null for now
      // This will be updated once the profiles table is created
      console.log("Profile fetch skipped - no tables exist yet");
      return null;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  return { authState, setAuthState };
};
