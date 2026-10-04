import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState } from '@/types/authTypes';

export function stateForSession(session: Session): AuthState {
  const user = session.user;
  const role = ['child', 'parent', 'teacher'].includes(user.user_metadata.role) ? user.user_metadata.role as 'child' | 'parent' | 'teacher' : 'child';
  const name = user.user_metadata.full_name || user.user_metadata.username || user.email?.split('@')[0] || 'Můj účet';
  return { mode: 'cloud', user: { id: user.id, email: user.email, username: name, role }, profile: { id: user.id, full_name: name, username: name, role, created_at: user.created_at }, isLoading: false, isAuthenticated: true, error: null };
}
function localState(): AuthState {
  try {
    const user = JSON.parse(localStorage.getItem('localUser') || 'null');
    if (user && typeof user.id === 'string' && typeof user.username === 'string') {
      const role = user.role === 'parent' ? 'parent' : 'child';
      return { mode: 'local', user: { id: user.id, username: user.username, role }, profile: { id: user.id, username: user.username, full_name: user.username, role, created_at: user.created_at || new Date().toISOString() }, isLoading: false, isAuthenticated: true, error: null };
    }
  } catch { /* Damaged selection does not delete learning data. */ }
  return { mode: 'local', user: null, profile: null, isLoading: false, isAuthenticated: false, error: null };
}
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({ ...localState(), isLoading: true });
  useEffect(() => {
    let alive = true;
    let eventReceived = false;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      eventReceived = true;
      if (alive) setAuthState(session ? stateForSession(session) : localState());
    });
    void supabase.auth.getSession().then(({ data: result, error }) => {
      if (alive && !eventReceived) setAuthState(result.session ? stateForSession(result.session) : { ...localState(), error: error ? 'Přihlášení se zatím nepodařilo obnovit.' : null });
    }).catch(() => { if (alive && !eventReceived) setAuthState(localState()); });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, []);
  const cloudUserId = authState.mode === 'cloud' ? authState.user?.id : null;
  useEffect(() => {
    if (!cloudUserId) return;
    let alive = true;
    const id = cloudUserId;
    void supabase.from('profiles').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (alive && data) setAuthState(previous => previous.user?.id === id && previous.mode === 'cloud' ? { ...previous, profile: { ...previous.profile, ...data, role: previous.profile?.role, username: data.full_name || previous.profile?.username } } : previous);
    });
    return () => { alive = false; };
  }, [cloudUserId]);
  return { authState, setAuthState };
};

