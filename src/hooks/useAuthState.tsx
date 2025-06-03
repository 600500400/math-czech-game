
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

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          username: data.full_name || undefined,
          full_name: data.full_name || undefined,
          role: data.role || 'child',
          created_at: data.created_at,
          updated_at: data.updated_at || undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  // Initial auth state setup
  useEffect(() => {
    let mounted = true;

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, session?.user?.id);

        if (session?.user) {
          // User is authenticated with Supabase - fetch their profile
          const profile = await fetchUserProfile(session.user.id);
          
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || session.user.email?.split('@')[0] || 'User',
              created_at: session.user.created_at
            },
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
                user: { id: localUser.id, username: localUser.username },
                profile: {
                  ...localUser,
                  created_at: new Date().toISOString()
                } as UserProfile,
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || session.user.email?.split('@')[0] || 'User',
            created_at: session.user.created_at
          },
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

  return { authState, setAuthState };
};
