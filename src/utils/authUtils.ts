
import { secureCleanupAuthState } from './secureStorage';

// Enhanced utility function to clean up auth state in localStorage and sessionStorage
export const cleanupAuthState = () => {
  // Use the secure cleanup implementation
  return secureCleanupAuthState();
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
