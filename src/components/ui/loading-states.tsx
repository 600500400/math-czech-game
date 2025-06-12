
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  size = "md",
  variant = "spinner",
  message = "Načítám...",
  showProgress = false,
  progress = 0
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <Loader className={cn("animate-spin", sizes[size])} />;
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn("rounded-full bg-current animate-bounce", 
                  size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div className={cn("rounded-full bg-current animate-pulse", sizes[size])} />
        );
      default:
        return <Loader className={cn("animate-spin", sizes[size])} />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3 py-8", className)}>
      <div className="text-primary">
        {renderLoader()}
      </div>
      
      {message && (
        <p className="text-sm text-muted-foreground font-medium">
          {message}
        </p>
      )}
      
      {showProgress && (
        <div className="w-48 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Průběh</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ConnectionStateProps {
  status: "connected" | "connecting" | "disconnected" | "error";
  onRetry?: () => void;
  retrying?: boolean;
}

export const ConnectionState: React.FC<ConnectionStateProps> = ({
  status,
  onRetry,
  retrying = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          message: "Připojeno",
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200"
        };
      case "connecting":
        return {
          icon: RefreshCw,
          message: "Připojuji...",
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
          spin: true
        };
      case "disconnected":
        return {
          icon: WifiOff,
          message: "Odpojeno",
          color: "text-orange-600",
          bgColor: "bg-orange-50 border-orange-200"
        };
      case "error":
        return {
          icon: WifiOff,
          message: "Chyba připojení",
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={cn("border-2", config.bgColor)}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Icon 
            className={cn("h-5 w-5", config.color, config.spin && "animate-spin")} 
          />
          <span className={cn("font-medium", config.color)}>
            {config.message}
          </span>
        </div>
        
        {(status === "disconnected" || status === "error") && onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            disabled={retrying}
            className="ml-4"
          >
            {retrying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Zkusit znovu
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Komponenta pro inline loading
export const InlineLoader: React.FC<{
  size?: "sm" | "md";
  className?: string;
}> = ({ size = "sm", className }) => (
  <div className={cn("inline-flex items-center", className)}>
    <Loader className={cn("animate-spin", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
  </div>
);

// Komponenta pro overlay loading
export const OverlayLoader: React.FC<{
  message?: string;
  transparent?: boolean;
}> = ({ 
  message = "Načítám...",
  transparent = false
}) => (
  <div className={cn(
    "fixed inset-0 z-50 flex items-center justify-center",
    transparent ? "bg-black/20" : "bg-background/80 backdrop-blur-sm"
  )}>
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <LoadingState message={message} size="lg" />
      </CardContent>
    </Card>
  </div>
);
