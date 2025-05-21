
import { RefreshCw } from "lucide-react";

interface LoadingStatisticsStateProps {
  hasRetried?: boolean;
}

const LoadingStatisticsState = ({ 
  hasRetried = false
}: LoadingStatisticsStateProps) => {
  return (
    <div className="pt-4 flex flex-col items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
      <p className="text-center text-gray-500">Načítání statistik...</p>
      <p className="text-xs text-gray-400 mt-1">Načítání lokálních dat, prosím čekejte</p>
      
      {hasRetried && (
        <div className="mt-4 text-center">
          <p className="text-xs text-amber-500 mb-2">Načítání trvá déle než obvykle.</p>
        </div>
      )}
    </div>
  );
};

export default LoadingStatisticsState;
