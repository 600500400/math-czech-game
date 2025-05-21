
import { AuthState } from "@/types/authTypes";
import { useSignIn } from "./auth/useSignIn";
import { useSignUp } from "./auth/useSignUp";
import { useSignOut } from "./auth/useSignOut";
import { useLocalUser } from "./auth/useLocalUser";

export const useAuthMethods = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  // Compose all auth methods from smaller hooks
  const { signIn } = useSignIn(setAuthState);
  const { signUp } = useSignUp(setAuthState);
  const { signOut } = useSignOut(setAuthState);
  const { setLocalUser } = useLocalUser(setAuthState);

  return { signIn, signUp, signOut, setLocalUser };
};
