
import { AlertTriangle, Database, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatabaseConnectionStatusProps {
  status: "checking" | "connected" | "disconnected" | "error";
  isRefreshing: boolean;
  onRefresh: () => void;
  isLocalStorageMode?: boolean;
  className?: string;
  showButton?: boolean;
  compact?: boolean;
}

const DatabaseConnectionStatus = ({
  status,
  isRefreshing,
  onRefresh,
  isLocalStorageMode = false,
  className = "",
  showButton = true,
  compact = false
}: DatabaseConnectionStatusProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {status === "connected" ? (
        <span className="text-green-500 flex items-center gap-1">
          <Wifi className="h-4 w-4" />
          {compact ? null : isLocalStorageMode ? "Lokální režim" : "Online"}
        </span>
      ) : status === "checking" ? (
        <span className="text-amber-500 flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          {!compact && "Kontrola spojení"}
        </span>
      ) : (
        <span className="text-red-500 flex items-center gap-1">
          <WifiOff className="h-4 w-4" />
          {!compact && "Offline režim"}
        </span>
      )}
      
      {showButton && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className={compact ? "h-8 p-1" : ""}
          title="Znovu zkontrolovat připojení"
        >
          <RefreshCw className={`h-4 w-4 ${!compact && "mr-1"} ${isRefreshing ? "animate-spin" : ""}`} />
          {!compact && "Obnovit"}
        </Button>
      )}
    </div>
  );
};

export default DatabaseConnectionStatus;
