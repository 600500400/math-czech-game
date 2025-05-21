
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
    <div className="flex flex-col gap-2 items-center">
      <p className="text-center text-gray-500">Zatím nemáte žádné statistiky. Zahrajte si hru!</p>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
        <Database className="h-4 w-4" />
        <DatabaseConnectionStatus 
          status={dbConnectionStatus}
          isRefreshing={isRefreshing}
          isLocalStorageMode={isLocalStorageMode}
          onRefresh={onRefresh}
          showButton={true}
        />
      </div>
    </div>
  );
};

export default EmptyStatisticsState;
