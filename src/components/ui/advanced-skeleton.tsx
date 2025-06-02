
import React from "react";
import { cn } from "@/lib/utils";

interface AdvancedSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "circular" | "text" | "button";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const AdvancedSkeleton: React.FC<AdvancedSkeletonProps> = ({
  className,
  variant = "default",
  width,
  height,
  lines = 1
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded";
  
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-lg",
    circular: "rounded-full w-12 h-12",
    text: "h-4 w-3/4",
    button: "h-10 w-24 rounded-md"
  };

  const style = {
    width: width,
    height: height,
    animationDuration: "1.5s"
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              index === lines - 1 && "w-1/2",
              className
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      style={style}
    />
  );
};

export const StatisticsSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <AdvancedSkeleton variant="circular" />
      <div className="space-y-2 flex-1">
        <AdvancedSkeleton variant="text" width="60%" />
        <AdvancedSkeleton variant="text" width="40%" />
      </div>
    </div>
    <AdvancedSkeleton variant="card" />
    <div className="grid grid-cols-3 gap-4">
      <AdvancedSkeleton variant="button" />
      <AdvancedSkeleton variant="button" />
      <AdvancedSkeleton variant="button" />
    </div>
  </div>
);

export const GameLoadingSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    <div className="text-center space-y-4">
      <AdvancedSkeleton variant="text" width="200px" className="mx-auto" />
      <AdvancedSkeleton variant="card" height="120px" />
      <div className="flex justify-center space-x-4">
        <AdvancedSkeleton variant="button" width="80px" />
        <AdvancedSkeleton variant="button" width="80px" />
      </div>
    </div>
  </div>
);
