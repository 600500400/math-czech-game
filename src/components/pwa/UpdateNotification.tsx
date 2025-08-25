import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, X } from "lucide-react";
import { pwaUpdater } from "@/utils/pwaUpdater";
import { toast } from "sonner";

interface UpdateState {
  hasUpdate: boolean;
  isUpdating: boolean;
  error: string | null;
}

export const UpdateNotification = () => {
  const [updateState, setUpdateState] = useState<UpdateState>({
    hasUpdate: false,
    isUpdating: false,
    error: null
  });
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaUpdater.subscribe((state) => {
      setUpdateState(state);
      
      if (state.hasUpdate && !hasShownToast) {
        setHasShownToast(true);
        setShowNotification(true);
        toast.info("Nová verze aplikace je k dispozici!", {
          duration: 5000,
          action: {
            label: "Aktualizovat",
            onClick: () => handleUpdate()
          }
        });
      }
      
      if (state.error) {
        toast.error(`Chyba aktualizace: ${state.error}`);
      }
    });

    // Only check for updates once on initial mount
    const timer = setTimeout(() => {
      pwaUpdater.checkForUpdates();
    }, 2000); // Delay to prevent interference with app startup

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []); // Remove showNotification dependency to prevent loops

  const handleUpdate = async () => {
    try {
      await pwaUpdater.applyUpdate();
      toast.success("Aplikace se aktualizuje...");
    } catch (error) {
      toast.error("Nepodařilo se aktualizovat aplikaci");
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification || !updateState.hasUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Aktualizace dostupná
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Je k dispozici nová verze aplikace s vylepšeními a opravami.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={updateState.isUpdating}
              className="flex-1"
            >
              {updateState.isUpdating ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Aktualizuji...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  Aktualizovat
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="px-3"
            >
              Později
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};