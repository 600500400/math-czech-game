import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AuthState } from '@/types/authTypes';
import { stateForSession } from '../useAuthState';
export const useSignIn = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => ({
  signIn: async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) throw new Error('Přihlášení nebylo potvrzené.');
      localStorage.removeItem('localUser');
      setAuthState(stateForSession(data.session));
      toast.success('Přihlášení úspěšné');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Přihlášení se nezdařilo.';
      setAuthState(prev => ({ ...prev, isLoading: false, error: message })); toast.error(message);
    }
  },
});

