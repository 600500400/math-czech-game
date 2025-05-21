
import { UserProfile, AuthState } from "@/types/authTypes";

export const useLocalUser = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  // Set local user without Supabase authentication
  const setLocalUser = (user: { id: string, username: string, role: string }) => {
    const localUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('localUser', JSON.stringify(localUser));
    
    setAuthState({
      user: { id: user.id } as any,
      profile: localUser as UserProfile,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
  };

  return { setLocalUser };
};
