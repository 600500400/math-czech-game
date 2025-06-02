
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  retryLabel?: string;
  homeLabel?: string;
  className?: string;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  isRetrying?: boolean;
}

export const EnhancedErrorState: React.FC<EnhancedErrorStateProps> = ({
  title = "Něco se pokazilo",
  message = "Zkuste to prosím znovu nebo se vraťte na hlavní stránku.",
  onRetry,
  onGoHome,
  retryLabel = "Zkusit znovu",
  homeLabel = "Zpět na domů",
  className,
  showRetryButton = true,
  showHomeButton = true,
  isRetrying = false
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 space-y-6",
      className
    )}>
      {/* Animated Error Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
        <div className="relative bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-full">
          <AlertTriangle 
            size={48} 
            className="text-red-500 animate-pulse" 
          />
        </div>
      </div>

      {/* Error Content */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetryButton && onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="hover:scale-105 transition-transform bg-red-500 hover:bg-red-600"
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Zkouším znovu...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                {retryLabel}
              </>
            )}
          </Button>
        )}
        
        {showHomeButton && onGoHome && (
          <Button
            onClick={onGoHome}
            variant="outline"
            className="hover:scale-105 transition-transform"
          >
            <Home size={16} className="mr-2" />
            {homeLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
