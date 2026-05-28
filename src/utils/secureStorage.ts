// Secure storage utility for handling sensitive data in localStorage
// Implements encryption and secure cleanup mechanisms

import { toast } from "sonner";

import { logger } from "@/utils/logger";
// Simple encryption utilities for localStorage security
const ENCRYPTION_KEY = 'sec_store_key_v1';

class SecureStorage {
  private static instance: SecureStorage;
  
  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  // Simple base64 encoding for basic obfuscation (not cryptographically secure)
  private encode(data: string): string {
    try {
      return btoa(encodeURIComponent(data));
    } catch (error) {
      console.warn('Failed to encode data:', error);
      return data;
    }
  }

  private decode(encodedData: string): string {
    try {
      return decodeURIComponent(atob(encodedData));
    } catch (error) {
      console.warn('Failed to decode data:', error);
      return encodedData;
    }
  }

  // Secure set with basic encoding
  setSecureItem(key: string, value: string): boolean {
    try {
      const encodedValue = this.encode(value);
      localStorage.setItem(key, encodedValue);
      return true;
    } catch (error) {
      console.error('Failed to set secure item:', error);
      toast.error('Failed to save data securely');
      return false;
    }
  }

  // Secure get with decoding
  getSecureItem(key: string): string | null {
    try {
      const encodedValue = localStorage.getItem(key);
      if (!encodedValue) return null;
      return this.decode(encodedValue);
    } catch (error) {
      console.error('Failed to get secure item:', error);
      return null;
    }
  }

  // Remove specific item securely
  removeSecureItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove secure item:', error);
      return false;
    }
  }

  // Secure cleanup with validation
  secureCleanup(patterns: string[]): { removed: string[], errors: string[] } {
    const result = { removed: [] as string[], errors: [] as string[] };
    
    try {
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        const shouldRemove = patterns.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace(/\*/g, '.*'));
            return regex.test(key);
          }
          return key.includes(pattern);
        });
        
        if (shouldRemove) {
          try {
            localStorage.removeItem(key);
            result.removed.push(key);
          } catch (error) {
            result.errors.push(`Failed to remove ${key}: ${error}`);
          }
        }
      });
    } catch (error) {
      result.errors.push(`Cleanup failed: ${error}`);
    }
    
    return result;
  }

  // Validate storage integrity
  validateStorageIntegrity(): boolean {
    try {
      const testKey = '__storage_test__';
      const testValue = 'test_data';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.error('Storage integrity check failed:', error);
      return false;
    }
  }
}

export const secureStorage = SecureStorage.getInstance();

// Enhanced auth state cleanup with secure patterns
export const secureCleanupAuthState = () => {
  const patterns = [
    'supabase.auth.*',
    'sb-*',
    'localUser'
  ];
  
  const preservePatterns = [
    '*Stats_*',
    'mathStats_*',
    'spellingStats_*',
    'theme',
    'audioSettings',
    'pwa-install-prompt-shown'
  ];
  
  const result = {
    removed: [] as string[],
    kept: [] as string[],
    errors: [] as string[]
  };
  
  try {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      // Check if should be preserved
      const shouldPreserve = preservePatterns.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(key);
        }
        return key.includes(pattern);
      });
      
      if (shouldPreserve) {
        result.kept.push(key);
        return;
      }
      
      // Check if should be removed
      const shouldRemove = patterns.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(key);
        }
        return key.includes(pattern);
      });
      
      if (shouldRemove) {
        try {
          localStorage.removeItem(key);
          result.removed.push(key);
        } catch (error) {
          result.errors.push(`Failed to remove ${key}: ${error}`);
        }
      }
    });
    
    // Also clean sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          try {
            sessionStorage.removeItem(key);
            result.removed.push(`sessionStorage:${key}`);
          } catch (error) {
            result.errors.push(`Failed to remove sessionStorage ${key}: ${error}`);
          }
        }
      });
    }
  } catch (error) {
    result.errors.push(`Cleanup failed: ${error}`);
  }
  
  logger.log("Secure auth state cleanup result:", result);
  return result;
};