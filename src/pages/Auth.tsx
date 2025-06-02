
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import AppFooter from "@/components/layout/AppFooter";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Auth = () => {
  const { authState, setLocalUser, signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redirect if already authenticated
  if (authState.isAuthenticated && !authState.isLoading) {
    navigate("/");
    return null;
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordMinLength');
    }
    
    if (isSignUp) {
      if (!username.trim()) {
        newErrors.username = t('auth.nameRequired');
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordRequired');
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordsMustMatch');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setAuthLoading(true);
    try {
      await signIn(email, password);
      toast.success(t('auth.loginSuccess'));
      navigate("/");
    } catch (error: any) {
      console.error("Sign in failed:", error);
      toast.error(error.message || "Chyba při přihlášení");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setAuthLoading(true);
    try {
      await signUp(email, password, username);
      toast.success(t('auth.registrationSuccess'));
      // After successful signup, automatically sign in
      setTimeout(async () => {
        try {
          await signIn(email, password);
          navigate("/");
        } catch (error) {
          console.error("Auto sign in failed:", error);
          toast.success("Registrace úspěšná! Nyní se můžete přihlásit.");
        }
      }, 1000);
    } catch (error: any) {
      console.error("Sign up failed:", error);
      toast.error(error.message || "Chyba při registraci");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestMode = async () => {
    const guestUser = {
      id: uuidv4(),
      username: t('user.guest'),
      role: "child"
    };
    
    await setLocalUser(guestUser);
    toast.success(t('auth.guestWelcome'));
    navigate("/");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setPassword("");
    setConfirmPassword("");
    if (!isSignUp) {
      setUsername("");
    }
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
          {/* Main Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {/* Username field for signup */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t('auth.yourName')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  className={`text-base ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">{errors.username}</p>
                )}
              </div>
            )}
            
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`text-base ${errors.email ? 'border-red-500' : ''}`}
                autoComplete={isSignUp ? "new-email" : "email"}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            
            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`text-base ${errors.password ? 'border-red-500' : ''}`}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password field for signup */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`text-base ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                )}
              </div>
            )}
            
            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
              disabled={authLoading}
            >
              {authLoading 
                ? (isSignUp ? t('auth.registering') : t('auth.signingIn'))
                : (isSignUp ? t('auth.signUp') : t('auth.signIn'))
              }
            </Button>
          </form>
          
          {/* Toggle between sign in and sign up */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </span>
            <Button
              variant="link"
              onClick={toggleMode}
              className="p-1 ml-1 text-blue-600 hover:text-blue-800"
            >
              {isSignUp ? t('auth.switchToSignIn') : t('auth.switchToSignUp')}
            </Button>
          </div>
          
          {/* Social login divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>
          
          {/* Social auth buttons */}
          <SocialAuthButtons />
          
          {/* Guest mode */}
          <div className="pt-4 border-t">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">{t('auth.guestModeDescription')}</p>
              <Button
                variant="outline"
                onClick={handleGuestMode}
                className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
                disabled={authLoading}
              >
                {t('auth.continueAsGuest')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AppFooter />
    </div>
  );
};

export default Auth;
