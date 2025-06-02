
import { RefreshCw } from "lucide-react";
import { AdvancedSkeleton, StatisticsSkeleton } from "@/components/ui/advanced-skeleton";

interface LoadingStatisticsStateProps {
  hasRetried?: boolean;
}

const LoadingStatisticsState = ({ 
  hasRetried = false
}: LoadingStatisticsStateProps) => {
  return (
    <div className="pt-4 space-y-6">
      {/* Loading header with icon */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
          <div className="absolute inset-0 h-8 w-8 border-2 border-orange-200 rounded-full animate-ping" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-gray-700 font-medium">Načítání statistik...</p>
          <p className="text-xs text-gray-400">Načítání lokálních dat, prosím čekejte</p>
        </div>

        {hasRetried && (
          <div className="text-center bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-600 font-medium">
              Načítání trvá déle než obvykle.
            </p>
          </div>
        )}
      </div>

      {/* Skeleton loading content */}
      <div className="max-w-4xl mx-auto">
        <StatisticsSkeleton />
      </div>

      {/* Additional loading indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <AdvancedSkeleton variant="text" width="150px" />
          <AdvancedSkeleton variant="card" height="200px" />
        </div>
        <div className="space-y-4">
          <AdvancedSkeleton variant="text" width="150px" />
          <AdvancedSkeleton variant="card" height="200px" />
        </div>
      </div>
    </div>
  );
};

export default LoadingStatisticsState;
