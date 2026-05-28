// Enhanced authentication hook with additional security measures

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { secureStorage } from "@/utils/secureStorage";
import { validateUserInput } from "@/utils/xssProtection";
import { toast } from "sonner";

import { logger } from "@/utils/logger";
export const useSecureAuth = () => {
  const [securityMetrics, setSecurityMetrics] = useState({
    storageIntegrity: true,
    lastSecurityCheck: null as Date | null,
    suspiciousActivity: [] as string[]
  });

  // Check storage integrity on mount
  useEffect(() => {
    const checkStorageIntegrity = () => {
      const isValid = secureStorage.validateStorageIntegrity();
      
      setSecurityMetrics(prev => ({
        ...prev,
        storageIntegrity: isValid,
        lastSecurityCheck: new Date()
      }));
      
      if (!isValid) {
        console.warn('Storage integrity check failed');
        toast.error('Security warning: Storage may be compromised');
      }
    };

    checkStorageIntegrity();
    
    // Check integrity every 5 minutes
    const interval = setInterval(checkStorageIntegrity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Secure user input validation
  const validateAndSanitizeInput = (input: string, context: string = 'general') => {
    const validation = validateUserInput(input, 500);
    
    if (!validation.isValid) {
      setSecurityMetrics(prev => ({
        ...prev,
        suspiciousActivity: [
          ...prev.suspiciousActivity,
          `${context}: ${validation.warnings.join(', ')}`
        ].slice(-10) // Keep last 10 entries
      }));
      
      console.warn(`Security validation failed for ${context}:`, validation.warnings);
    }
    
    return validation;
  };

  // Secure auth state management
  const secureSignIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      const emailValidation = validateAndSanitizeInput(email, 'email');
      const passwordValidation = validateAndSanitizeInput(password, 'password');
      
      if (!emailValidation.isValid || !passwordValidation.isValid) {
        throw new Error('Invalid input detected');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValidation.sanitized,
        password: passwordValidation.sanitized,
      });

      if (error) throw error;

      // Log successful authentication
      logger.log('Secure authentication successful');
      
      return { data, error: null };
    } catch (error) {
      console.error('Secure sign in failed:', error);
      return { data: null, error };
    }
  };

  // Enhanced session monitoring
  const monitorSession = () => {
    return supabase.auth.onAuthStateChange((event, session) => {
      // Log auth events for security monitoring
      logger.log('Auth state change:', event, session?.user?.id);
      
      // Detect potential session hijacking
      if (event === 'SIGNED_IN' && session) {
        const lastLoginTime = secureStorage.getSecureItem('last_login_time');
        const currentTime = new Date().getTime();
        
        if (lastLoginTime) {
          const timeDiff = currentTime - parseInt(lastLoginTime);
          
          // Flag if multiple logins within short time
          if (timeDiff < 60000) { // 1 minute
            setSecurityMetrics(prev => ({
              ...prev,
              suspiciousActivity: [
                ...prev.suspiciousActivity,
                `Rapid login detected: ${timeDiff}ms since last login`
              ].slice(-10)
            }));
          }
        }
        
        secureStorage.setSecureItem('last_login_time', currentTime.toString());
      }
      
      // Clear sensitive data on sign out
      if (event === 'SIGNED_OUT') {
        secureStorage.secureCleanup(['last_login_time', 'user_preferences']);
      }
    });
  };

  // Security health check
  const performSecurityHealthCheck = () => {
    const checks = {
      storageIntegrity: secureStorage.validateStorageIntegrity(),
      authState: !!supabase.auth.getUser(),
      recentActivity: securityMetrics.suspiciousActivity.length < 5
    };
    
    const isHealthy = Object.values(checks).every(Boolean);
    
    return {
      isHealthy,
      checks,
      recommendations: isHealthy ? [] : [
        !checks.storageIntegrity && 'Storage integrity compromised - consider clearing browser data',
        !checks.recentActivity && 'High suspicious activity detected - review recent actions'
      ].filter(Boolean)
    };
  };

  return {
    securityMetrics,
    validateAndSanitizeInput,
    secureSignIn,
    monitorSession,
    performSecurityHealthCheck
  };
};