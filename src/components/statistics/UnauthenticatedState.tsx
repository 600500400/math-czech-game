
import { Button } from "@/components/ui/button";
import { LogIn, Database } from "lucide-react";
import { Link } from "react-router-dom";
import DatabaseConnectionStatus from "./DatabaseConnectionStatus";

interface UnauthenticatedStateProps {
  dbConnectionStatus?: "checking" | "connected" | "disconnected" | "error";
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const UnauthenticatedState = ({
  dbConnectionStatus,
  isRefreshing,
  onRefresh
}: UnauthenticatedStateProps) => {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-center text-gray-500">Pro zobrazení statistik se přihlaste.</p>
      
      <Link to="/auth">
        <Button variant="outline" size="sm" className="mt-2">
          <LogIn className="h-4 w-4 mr-1" />
          Přihlásit se
        </Button>
      </Link>
      
      {dbConnectionStatus && onRefresh && (
        <div className="mt-3 pt-2 border-t border-gray-100 w-full">
          <p className="text-xs text-gray-400 mb-2">Status databázového připojení:</p>
          <DatabaseConnectionStatus
            status={dbConnectionStatus}
            isRefreshing={isRefreshing || false}
            onRefresh={onRefresh}
            showButton={true}
            compact={false}
          />
        </div>
      )}
    </div>
  );
};

export default UnauthenticatedState;
