
import { useLanguage } from "@/hooks/useLanguage";

export const useAuthValidation = () => {
  const { t } = useLanguage();

  const validateForm = (
    email: string,
    password: string,
    username: string,
    confirmPassword: string,
    isSignUp: boolean
  ) => {
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
    
    return newErrors;
  };

  return { validateForm };
};
