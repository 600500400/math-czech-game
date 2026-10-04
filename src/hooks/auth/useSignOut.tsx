import { supabase } from '@/integrations/supabase/client';
import type { AuthState } from '@/types/authTypes';
import { useNavigate } from 'react-router-dom';
export const useSignOut = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const navigate = useNavigate();
  return { signOut: async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) { setAuthState(prev => ({ ...prev, isLoading: false, error: 'Odhlášení se nezdařilo. Zkus to znovu.' })); return; }
    localStorage.removeItem('localUser');
    setAuthState({ mode: 'local', user: null, profile: null, isLoading: false, isAuthenticated: false, error: null });
    navigate('/select-user');
  } };
};

