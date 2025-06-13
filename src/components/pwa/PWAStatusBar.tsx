
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Sync, 
  Battery, 
  Smartphone,
  Gauge
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { getOfflineStatus, forceSyncOfflineData } from "@/utils/offlineManager";
import { getPerformanceInsights } from "@/utils/webVitals";

const PWAStatusBar = () => {
  const { isOnline, isStandalone, canInstall } = usePWA();
  const [offlineStatus, setOfflineStatus] = useState(getOfflineStatus());
  const [performanceScore, setPerformanceScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOfflineStatus(getOfflineStatus());
      
      const insights = getPerformanceInsights();
      setPerformanceScore(insights.score);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleForceSync = () => {
    forceSyncOfflineData();
    setTimeout(() => setOfflineStatus(getOfflineStatus()), 1000);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 90) return "🟢";
    if (score >= 70) return "🟡";
    return "🔴";
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="shadow-lg border-2 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>

            {/* PWA Status */}
            {isStandalone && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                PWA
              </Badge>
            )}

            {/* Offline Queue Status */}
            {offlineStatus.pendingActions > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {offlineStatus.pendingActions}
              </Badge>
            )}

            {/* Performance Score */}
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${getPerformanceColor(performanceScore)}`}
            >
              <Gauge className="w-3 h-3" />
              {performanceScore}
            </Badge>

            {/* Toggle Details */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-6 w-6 p-0"
            >
              {showDetails ? "−" : "+"}
            </Button>
          </div>

          {/* Detailed Status */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Stav:</span>
                  <div className="space-y-1">
                    <div>• Připojení: {isOnline ? "✅" : "❌"}</div>
                    <div>• PWA: {isStandalone ? "✅" : "❌"}</div>
                    <div>• Offline akce: {offlineStatus.pendingActions}</div>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Výkon:</span>
                  <div className="space-y-1">
                    <div>• Score: {getPerformanceIcon(performanceScore)} {performanceScore}</div>
                    <div>• Sync: {offlineStatus.syncInProgress ? "⏳" : "✅"}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 pt-2">
                {offlineStatus.pendingActions > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleForceSync}
                    disabled={!isOnline || offlineStatus.syncInProgress}
                    className="text-xs h-6"
                  >
                    <Sync className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                )}
                
                {canInstall && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAStatusBar;
