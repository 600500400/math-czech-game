
// Utility function to clean up auth state in localStorage and sessionStorage
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'localUser') {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Attempt a global sign out and ignore any errors
export const attemptGlobalSignOut = async (supabase: any) => {
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    // Continue even if this fails
    console.log("Global sign out attempt failed, continuing", err);
  }
};

// Force page reload for clean state
export const forcePageReload = (path: string = '/') => {
  window.location.href = path;
};
