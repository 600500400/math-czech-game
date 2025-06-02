
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuthValidation } from "@/utils/authValidation";

interface AuthFormProps {
  isSignUp: boolean;
  onSubmit: (data: {
    email: string;
    password: string;
    username?: string;
    confirmPassword?: string;
  }) => Promise<void>;
  authLoading: boolean;
  onToggleMode: () => void;
}

const AuthForm = ({ isSignUp, onSubmit, authLoading, onToggleMode }: AuthFormProps) => {
  const { t } = useLanguage();
  const { validateForm } = useAuthValidation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(email, password, username, confirmPassword, isSignUp);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      await onSubmit({
        email,
        password,
        username: isSignUp ? username : undefined,
        confirmPassword: isSignUp ? confirmPassword : undefined,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="např. Gábi, Míša, Áďa..."
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
          onClick={onToggleMode}
          className="p-1 ml-1 text-blue-600 hover:text-blue-800"
        >
          {isSignUp ? t('auth.switchToSignIn') : t('auth.switchToSignUp')}
        </Button>
      </div>
    </>
  );
};

export default AuthForm;
