
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Changed import to fix the error
import { AuthContext } from "@/contexts/AuthContext";

// Hook for using authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Hook for requiring authentication
export const useRequireAuth = (redirectTo = "/auth") => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate(redirectTo);
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate, redirectTo]);

  return authState;
};
