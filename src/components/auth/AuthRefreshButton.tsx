
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuthCleaner } from "@/hooks/auth/useAuthCleaner";
import { toast } from "sonner";

export const AuthRefreshButton = () => {
  const { forceAuthRefresh } = useAuthCleaner();

  const handleRefresh = async () => {
    toast.info("Obnovuji auth stav...");
    await forceAuthRefresh();
  };

  return (
    <Button
      onClick={handleRefresh}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Obnovit Auth
    </Button>
  );
};
