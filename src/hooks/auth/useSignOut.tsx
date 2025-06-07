
import { AuthState } from "@/types/authTypes";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useSignOut = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const navigate = useNavigate();
  
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      console.log("Odhlašování uživatele");
      
      // Odstraníme pouze lokálního uživatele (statistiky zůstávají)
      localStorage.removeItem('localUser');
      
      // Aktualizujeme stav
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
      
      toast.success("Uživatel byl odhlášen");
      
      // Přesměrujeme na výběr uživatele
      navigate('/select-user');
    } catch (error: any) {
      console.error("Chyba při odhlášení:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při odhlášení",
      }));
      toast.error(`Chyba při odhlášení: ${error.message || "Neznámá chyba"}`);
    }
  };

  return { signOut };
};
