
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, Wifi } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-amber-50 border-amber-200 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Offline režim
              </p>
              <p className="text-xs text-amber-700">
                Aplikace funguje i bez internetu
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineIndicator;
