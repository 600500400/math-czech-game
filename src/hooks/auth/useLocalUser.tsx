import type { AuthState } from '@/types/authTypes';
import { supabase } from '@/integrations/supabase/client';
export const useLocalUser = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const setLocalUser = async (user: { id: string; username: string; role: string }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw new Error('Nejprve se odhlas z účtu. Místní profil se nepodařilo přepnout.');
    }
    const role = user.role === 'parent' ? 'parent' : 'child';
    localStorage.setItem('localUser', JSON.stringify({ ...user, role }));
    setAuthState({ mode: 'local', user: { id: user.id, username: user.username, role }, profile: { id: user.id, username: user.username, full_name: user.username, role, created_at: new Date().toISOString() }, isLoading: false, isAuthenticated: true, error: null });
  };
  return { setLocalUser };
};

