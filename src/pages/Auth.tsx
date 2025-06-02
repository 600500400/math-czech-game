
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppFooter from "@/components/layout/AppFooter";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthForm from "@/components/auth/AuthForm";
import GuestModeSection from "@/components/auth/GuestModeSection";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";

const Auth = () => {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const {
    handleSignIn,
    handleSignUp,
    handleGuestMode,
    authLoading
  } = useAuthHandlers();
  
  // Redirect if already authenticated
  if (authState.isAuthenticated && !authState.isLoading) {
    navigate("/");
    return null;
  }

  const handleFormSubmit = async (data: {
    email: string;
    password: string;
    username?: string;
    confirmPassword?: string;
  }) => {
    if (isSignUp && data.username) {
      await handleSignUp(data.email, data.password, data.username);
    } else {
      await handleSignIn(data.email, data.password);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Language switcher in top right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">{t('auth.title')}</CardTitle>
          <CardDescription className="text-gray-600">
            {t('auth.welcomeMessage')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AuthForm
            isSignUp={isSignUp}
            onSubmit={handleFormSubmit}
            authLoading={authLoading}
            onToggleMode={toggleMode}
          />
          
          <SocialAuthButtons />
          
          <GuestModeSection
            onGuestMode={handleGuestMode}
            authLoading={authLoading}
          />
        </CardContent>
      </Card>
      
      <AppFooter />
    </div>
  );
};

export default Auth;
