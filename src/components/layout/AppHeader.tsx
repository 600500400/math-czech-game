
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";

interface AppHeaderProps {
  databaseStatus: "checking" | "connected" | "disconnected" | "error";
  onCheckConnection: () => void;
}

const AppHeader = ({ databaseStatus, onCheckConnection }: AppHeaderProps) => {
  return (
    <header className="w-full max-w-md mx-auto flex justify-between mb-4">
      <h1 className="text-xl font-bold text-orange-500">Procvička App</h1>
      <div className="flex items-center gap-2">
        {/* Indikátor stavu databáze a tlačítko pro kontrolu */}
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onCheckConnection}
          title="Zkontrolovat připojení k databázi"
        >
          <Database className="h-4 w-4" />
          <div className={`h-2 w-2 rounded-full ${
            databaseStatus === "connected" ? "bg-green-500" : 
            databaseStatus === "disconnected" ? "bg-red-500" :
            databaseStatus === "checking" ? "bg-amber-500 animate-pulse" :
            "bg-gray-500"
          }`} />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
