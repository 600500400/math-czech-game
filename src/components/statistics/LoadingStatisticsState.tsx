
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-states";
import { StatisticsLoadingSkeleton, DataLoadingSkeleton } from "@/components/ui/skeleton-collection";

interface LoadingStatisticsStateProps {
  hasRetried?: boolean;
  retryCount?: number;
  showDetailedSkeleton?: boolean;
}

const LoadingStatisticsState = ({ 
  hasRetried = false,
  retryCount = 0,
  showDetailedSkeleton = false
}: LoadingStatisticsStateProps) => {
  
  // Show skeleton after first retry for better UX
  if (showDetailedSkeleton || retryCount > 0) {
    return (
      <div className="pt-4 space-y-6">
        <Card>
          <CardContent className="p-6">
            <DataLoadingSkeleton 
              title="Načítám statistiky..."
              description="Analýza vašich výsledků"
              showProgress={true}
            />
          </CardContent>
        </Card>
        
        <StatisticsLoadingSkeleton />
        
        {hasRetried && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-amber-700 font-medium">
                Načítání trvá déle než obvykle, prosím čekejte...
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Pokus {retryCount} - používám lokální data jako fallback
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-6">
      <Card>
        <CardContent className="p-8">
          <LoadingState 
            size="lg"
            variant="spinner"
            message="Načítám statistiky..."
            showProgress={false}
          />
        </CardContent>
      </Card>
      
      {hasRetried && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-700">
              Kontroluji lokální data...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoadingStatisticsState;
