
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHapticDebugger } from '@/hooks/useHapticDebugger';
import { useEnhancedHaptics } from '@/hooks/useEnhancedHaptics';
import { Smartphone, Zap, TestTube, Trash2 } from 'lucide-react';

interface HapticDebugPanelProps {
  show?: boolean;
}

export const HapticDebugPanel: React.FC<HapticDebugPanelProps> = ({ show = false }) => {
  const { debugInfo, testVibration, clearDebugInfo } = useHapticDebugger();
  const { triggerTapHaptic, triggerSuccessHaptic, triggerErrorHaptic, triggerCelebrationHaptic, userInteracted } = useEnhancedHaptics();

  if (!show) return null;

  const testPatterns = [
    { name: 'Krátké ťuknutí', pattern: [50], trigger: triggerTapHaptic },
    { name: 'Úspěch', pattern: [50, 50, 100], trigger: triggerSuccessHaptic },
    { name: 'Chyba', pattern: [100, 100, 100], trigger: triggerErrorHaptic },
    { name: 'Oslava', pattern: [100, 50, 100, 50, 200], trigger: triggerCelebrationHaptic },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Haptic Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Support Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Podpora vibrací:</span>
            <Badge variant={debugInfo.isSupported ? "default" : "secondary"}>
              {debugInfo.isSupported ? "Podporováno" : "Nepodporováno"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uživatel interagoval:</span>
            <Badge variant={userInteracted ? "default" : "secondary"}>
              {userInteracted ? "Ano" : "Ne"}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Celkem spuštění:</strong> {debugInfo.triggerCount}
          </div>
          {debugInfo.lastTrigger && (
            <div className="text-sm">
              <strong>Poslední spuštění:</strong> {debugInfo.lastTrigger}
            </div>
          )}
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <TestTube className="h-4 w-4" />
            <span className="text-sm font-medium">Test vzorů:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {testPatterns.map((test, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={test.trigger}
                disabled={!debugInfo.isSupported}
                className="text-xs"
              >
                {test.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Test */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Manuální test:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => testVibration([200])}
              disabled={!debugInfo.isSupported}
            >
              Test 200ms
            </Button>
            <Button
              size="sm"
              onClick={() => testVibration([100, 100, 100])}
              disabled={!debugInfo.isSupported}
            >
              Test pattern
            </Button>
          </div>
        </div>

        {/* Errors */}
        {debugInfo.errors.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-red-600">Chyby:</span>
            <div className="text-xs space-y-1">
              {debugInfo.errors.slice(-3).map((error, index) => (
                <div key={index} className="text-red-500 font-mono">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={clearDebugInfo}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Vymazat debug info
        </Button>

        {/* Device Info */}
        <div className="text-xs text-muted-foreground">
          <strong>Zařízení:</strong> {debugInfo.userAgent.slice(0, 100)}...
        </div>
      </CardContent>
    </Card>
  );
};
