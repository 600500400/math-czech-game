
// Utility function to clean up auth state in localStorage and sessionStorage
export const cleanupAuthState = () => {
  const result = {
    removed: [] as string[],
    kept: [] as string[]
  };
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    // Only remove auth-related keys, NOT user data like statistics
    if ((key.startsWith('supabase.auth.') || key.includes('sb-') || key === 'localUser') 
        && !key.includes('Stats_')) {
      localStorage.removeItem(key);
      result.removed.push(key);
    } else if (key.includes('Stats_')) {
      // Ponecháváme statistiky
      result.kept.push(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
      result.removed.push(`sessionStorage:${key}`);
    }
  });
  
  console.log("Výsledek čištění auth stavu:", result);
  return result;
};

// Attempt a global sign out and ignore any errors
export const attemptGlobalSignOut = async (supabase: any) => {
  try {
    await supabase.auth.signOut({ scope: 'global' });
    return true;
  } catch (err) {
    // Continue even if this fails
    console.log("Global sign out attempt failed, continuing", err);
    return false;
  }
};

// Force page reload for clean state
export const forcePageReload = (path: string = '/') => {
  window.location.href = path;
};
