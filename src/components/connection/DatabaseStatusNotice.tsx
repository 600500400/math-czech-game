
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Database, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatabaseStatusNoticeProps {
  status: "checking" | "connected" | "disconnected" | "error";
  onCheck: () => void;
}

const DatabaseStatusNotice = ({ status, onCheck }: DatabaseStatusNoticeProps) => {
  if (status === "connected") return null;
  
  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          <p className="text-center text-amber-600 flex items-center justify-center gap-2 font-medium">
            {status === "checking" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> 
                Kontroluji připojení k databázi...
              </>
            ) : status === "disconnected" ? (
              <>
                <WifiOff className="h-4 w-4" />
                Problém s připojením k databázi. Statistiky budou uloženy lokálně.
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Chyba při komunikaci s databází. Statistiky budou uloženy lokálně.
              </>
            )}
          </p>
          
          <div className="flex justify-center mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onCheck}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${status === "checking" ? "animate-spin" : ""}`} />
              Zkusit znovu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStatusNotice;
