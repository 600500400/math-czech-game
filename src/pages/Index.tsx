
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "./Home/HomePage";

const Index = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Přesměrování podle stavu autentizace
  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      // Pokud uživatel není přihlášen, přesměruj na výběr identity
      navigate('/select-user');
    } else if (authState.isAuthenticated && authState.profile?.role === 'parent') {
      // Pokud je přihlášený rodič, přesměruj na dashboard
      navigate('/parent-dashboard');
    }
  }, [authState.isAuthenticated, authState.isLoading, authState.profile?.role, navigate]);

  // Pokud je uživatel přihlášen jako dítě, zobraz domovskou stránku
  if (authState.isAuthenticated && authState.profile?.role === 'child') {
    return <HomePage />;
  }

  // Během načítání zobraz loading
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
};

export default Index;
