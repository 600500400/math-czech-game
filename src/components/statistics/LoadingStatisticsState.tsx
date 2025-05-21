
import { RefreshCw } from "lucide-react";

const LoadingStatisticsState = () => {
  return (
    <div className="pt-4 flex flex-col items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
      <p className="text-center text-gray-500">Načítání statistik...</p>
    </div>
  );
};

export default LoadingStatisticsState;
