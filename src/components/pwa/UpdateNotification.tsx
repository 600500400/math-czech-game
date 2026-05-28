import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, X, Settings } from "lucide-react";
import { pwaUpdater } from "@/utils/pwaUpdater";
import { APP_VERSION } from "@/utils/version";
import { toast } from "sonner";

import { logger } from "@/utils/logger";
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
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = pwaUpdater.subscribe((state) => {
      setUpdateState(state);
      
      if (state.hasUpdate && !hasShownToast) {
        setHasShownToast(true);
        setShowNotification(true);
        toast.info("Nová verze aplikace je k dispozici!", {
          duration: 8000,
          action: {
            label: "Aktualizovat nyní",
            onClick: () => handleUpdate()
          },
          description: `Aktuální verze: ${APP_VERSION.getFullVersion()}`
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

  const handleShowDebug = async () => {
    try {
      const info = await pwaUpdater.debugInfo();
      setDebugInfo(info);
      setShowDebugInfo(true);
      logger.log('PWA Debug Info:', info);
    } catch (error) {
      toast.error("Nepodařilo se načíst debug informace");
    }
  };

  const handleManualCheck = async () => {
    toast.info("Kontroluji aktualizace...");
    const hasUpdate = await pwaUpdater.checkForUpdates();
    if (!hasUpdate) {
      toast.success("Aplikace je aktuální!");
    }
  };

  if (!showNotification || !updateState.hasUpdate) {
    return null;
  }

  return (
    <>
      {/* Hlavní update notifikace */}
      {showNotification && updateState.hasUpdate && (
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
                <br />
                <span className="text-muted-foreground">
                  Verze: {APP_VERSION.getFullVersion()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-2">
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
                        Aktualizovat nyní
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
                
                <div className="flex gap-1 justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleManualCheck}
                    className="text-xs h-6 px-2"
                  >
                    Zkontrolovat
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShowDebug}
                    className="text-xs h-6 px-2"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Debug
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug informace */}
      {showDebugInfo && debugInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">PWA Debug Info</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugInfo(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};