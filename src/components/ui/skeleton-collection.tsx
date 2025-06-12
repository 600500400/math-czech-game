
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Game Loading Skeleton
export const GameLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("w-full max-w-md mx-auto", className)}>
    <CardHeader className="space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-center">
        <Skeleton className="h-20 w-20 rounded-full animate-pulse" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Statistics Loading Skeleton
export const StatisticsLoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Dashboard Loading Skeleton
export const DashboardLoadingSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="text-center space-y-4">
      <Skeleton className="h-10 w-80 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// Data Loading Skeleton with animated progress
export const DataLoadingSkeleton: React.FC<{ 
  title?: string;
  description?: string;
  showProgress?: boolean;
}> = ({ 
  title = "Načítám data...",
  description = "Prosím čekejte",
  showProgress = true
}) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-6">
    <div className="relative">
      <Skeleton className="h-16 w-16 rounded-full animate-pulse" />
      <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
    </div>
    
    <div className="text-center space-y-2">
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    
    {showProgress && (
      <div className="w-64 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Probíhá...</span>
          <span className="animate-pulse">●●●</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary/60 rounded-full animate-pulse w-2/3 transition-all duration-1000" />
        </div>
      </div>
    )}
  </div>
);
