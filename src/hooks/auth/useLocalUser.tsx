
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
    
    // Inicializace prázdných polí pro statistiky s ID uživatele v klíči
    if (!localStorage.getItem(`mathStats_${user.id}`)) {
      localStorage.setItem(`mathStats_${user.id}`, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(`spellingStats_${user.id}`)) {
      localStorage.setItem(`spellingStats_${user.id}`, JSON.stringify([]));
    }
    
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
