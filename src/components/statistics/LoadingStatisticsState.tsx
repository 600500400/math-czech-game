
import { RefreshCw } from "lucide-react";

const LoadingStatisticsState = () => {
  return (
    <div className="pt-4 flex flex-col items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
      <p className="text-center text-gray-500">Načítání statistik...</p>
      <p className="text-xs text-gray-400 mt-1">Připojování k databázi, prosím čekejte</p>
    </div>
  );
};

export default LoadingStatisticsState;
