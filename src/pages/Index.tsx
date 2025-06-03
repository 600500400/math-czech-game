
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "./Home/HomePage";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Redirect to parent dashboard if user is a parent
  useEffect(() => {
    if (authState.isAuthenticated && authState.profile?.role === 'parent') {
      navigate('/parent-dashboard');
    }
  }, [authState.isAuthenticated, authState.profile?.role, navigate]);

  return <HomePage />;
};

export default Index;
