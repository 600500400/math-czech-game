
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md"
}) => {
  const sizes = {
    sm: { icon: 32, title: "text-lg", desc: "text-sm", spacing: "space-y-3" },
    md: { icon: 48, title: "text-xl", desc: "text-base", spacing: "space-y-4" },
    lg: { icon: 64, title: "text-2xl", desc: "text-lg", spacing: "space-y-6" }
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8",
      currentSize.spacing,
      className
    )}>
      <div className="relative">
        <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-full">
          <Icon 
            size={currentSize.icon} 
            className="text-gray-400 animate-bounce"
            style={{ animationDuration: "2s" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className={cn("font-semibold text-gray-900", currentSize.title)}>
          {title}
        </h3>
        <p className={cn("text-gray-500 max-w-md", currentSize.desc)}>
          {description}
        </p>
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="hover:scale-105 transition-transform"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
