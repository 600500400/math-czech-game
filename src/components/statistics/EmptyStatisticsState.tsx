
import { RefreshCw, AlertTriangle, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import DatabaseConnectionStatus from "./DatabaseConnectionStatus";

interface EmptyStatisticsStateProps {
  dbConnectionStatus: "checking" | "connected" | "disconnected" | "error";
  isRefreshing: boolean;
  isLocalStorageMode: boolean;
  onRefresh: () => void;
}

const EmptyStatisticsState = ({
  dbConnectionStatus,
  isRefreshing,
  isLocalStorageMode,
  onRefresh
}: EmptyStatisticsStateProps) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-center text-gray-500">Zatím nemáte žádné statistiky. Zahrajte si hru!</p>
      
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          <DatabaseConnectionStatus 
            status={dbConnectionStatus}
            isRefreshing={isRefreshing}
            isLocalStorageMode={isLocalStorageMode}
            onRefresh={onRefresh}
            showButton={false}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="mt-1"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Kontroluji spojení..." : "Zkusit znovu připojení"}
        </Button>
        
        {dbConnectionStatus === "disconnected" && (
          <p className="text-amber-600 text-xs text-center mt-1 max-w-sm">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Aplikace nemůže navázat spojení se serverem. Data budou uložena lokálně a synchronizována později.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyStatisticsState;
