
import { RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStatisticsStateProps {
  retryConnection?: () => void;
  hasRetried?: boolean;
}

const LoadingStatisticsState = ({ 
  retryConnection,
  hasRetried = false
}: LoadingStatisticsStateProps) => {
  return (
    <div className="pt-4 flex flex-col items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
      <p className="text-center text-gray-500">Načítání statistik...</p>
      <p className="text-xs text-gray-400 mt-1">Připojování k databázi, prosím čekejte</p>
      
      {hasRetried && (
        <div className="mt-4 text-center">
          <p className="text-xs text-amber-500 mb-2">Připojení trvá déle než obvykle.</p>
          {retryConnection && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retryConnection}
              className="mt-1"
            >
              <Database className="h-4 w-4 mr-1" />
              Zkontrolovat připojení
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingStatisticsState;
