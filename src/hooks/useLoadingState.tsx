
import { useState, useCallback, useRef, useEffect } from "react";

interface LoadingStateConfig {
  minLoadingTime?: number; // Minimální doba zobrazení loading stavu
  showSkeletonAfter?: number; // Čas po kterém se zobrazí skeleton místo spinneru
  maxRetries?: number;
}

interface LoadingStateReturn {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  showSkeleton: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
  retry: () => void;
  reset: () => void;
}

export const useLoadingState = (config: LoadingStateConfig = {}): LoadingStateReturn => {
  const {
    minLoadingTime = 500,
    showSkeletonAfter = 2000,
    maxRetries = 3
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  const loadingStartTime = useRef<number | null>(null);
  const skeletonTimer = useRef<NodeJS.Timeout | null>(null);
  const minTimeTimer = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setShowSkeleton(false);
    loadingStartTime.current = Date.now();

    // Nastavit timer pro skeleton
    if (skeletonTimer.current) {
      clearTimeout(skeletonTimer.current);
    }
    
    skeletonTimer.current = setTimeout(() => {
      setShowSkeleton(true);
    }, showSkeletonAfter);
  }, [showSkeletonAfter]);

  const stopLoading = useCallback(() => {
    if (!loadingStartTime.current) {
      setIsLoading(false);
      setShowSkeleton(false);
      return;
    }

    const elapsed = Date.now() - loadingStartTime.current;
    const remainingTime = Math.max(0, minLoadingTime - elapsed);

    if (skeletonTimer.current) {
      clearTimeout(skeletonTimer.current);
      skeletonTimer.current = null;
    }

    if (remainingTime > 0) {
      minTimeTimer.current = setTimeout(() => {
        setIsLoading(false);
        setShowSkeleton(false);
        loadingStartTime.current = null;
      }, remainingTime);
    } else {
      setIsLoading(false);
      setShowSkeleton(false);
      loadingStartTime.current = null;
    }
  }, [minLoadingTime]);

  const handleSetError = useCallback((error: Error | null) => {
    setError(error);
    if (error) {
      stopLoading();
    }
  }, [stopLoading]);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(null);
      startLoading();
    }
  }, [retryCount, maxRetries, startLoading]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
    setShowSkeleton(false);
    loadingStartTime.current = null;
    
    if (skeletonTimer.current) {
      clearTimeout(skeletonTimer.current);
      skeletonTimer.current = null;
    }
    
    if (minTimeTimer.current) {
      clearTimeout(minTimeTimer.current);
      minTimeTimer.current = null;
    }
  }, []);

  // Cleanup na unmount
  useEffect(() => {
    return () => {
      if (skeletonTimer.current) {
        clearTimeout(skeletonTimer.current);
      }
      if (minTimeTimer.current) {
        clearTimeout(minTimeTimer.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    retryCount,
    showSkeleton,
    startLoading,
    stopLoading,
    setError: handleSetError,
    retry,
    reset
  };
};

// Hook pro async operace s automatickým loading stavem
export const useAsyncOperation = <T,>(config: LoadingStateConfig = {}) => {
  const loadingState = useLoadingState(config);

  const execute = useCallback(async (
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      loadingState.startLoading();
      const result = await operation();
      loadingState.stopLoading();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      loadingState.setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return null;
    }
  }, [loadingState]);

  return {
    ...loadingState,
    execute
  };
};
