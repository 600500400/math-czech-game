
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Zap, TestTube, ChevronDown, Settings } from 'lucide-react';
import { useEnhancedHaptics } from '@/hooks/useEnhancedHaptics';
import { useHapticDebugger } from '@/hooks/useHapticDebugger';
import { HapticDebugPanel } from '@/components/ui/haptic-debug-panel';

export const HapticSettings: React.FC = () => {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { debugInfo } = useHapticDebugger();
  const {
    triggerTapHaptic,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    userInteracted
  } = useEnhancedHaptics({ enabled: hapticsEnabled, intensity: 'medium' });

  const testButtons = [
    { name: 'Ťuknutí', action: triggerTapHaptic, color: 'blue' },
    { name: 'Úspěch', action: triggerSuccessHaptic, color: 'green' },
    { name: 'Chyba', action: triggerErrorHaptic, color: 'red' },
    { name: 'Oslava', action: triggerCelebrationHaptic, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Haptická odezva (vibrace)
            {!debugInfo.isSupported && (
              <Badge variant="secondary">Nepodporovano</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Povolit vibrace</p>
              <p className="text-sm text-muted-foreground">
                Vibrační odezva při interakcích s aplikací
              </p>
            </div>
            <Switch
              checked={hapticsEnabled}
              onCheckedChange={setHapticsEnabled}
              disabled={!debugInfo.isSupported}
            />
          </div>

          {/* Status Information */}
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>Podpora zařízení:</span>
              <Badge variant={debugInfo.isSupported ? "default" : "secondary"}>
                {debugInfo.isSupported ? "Podporováno" : "Nepodporováno"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Uživatel interagoval:</span>
              <Badge variant={userInteracted ? "default" : "secondary"}>
                {userInteracted ? "Ano" : "Ne"}
              </Badge>
            </div>
            {debugInfo.triggerCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span>Celkem spuštění:</span>
                <span>{debugInfo.triggerCount}</span>
              </div>
            )}
          </div>

          {/* Test Buttons */}
          {debugInfo.isSupported && hapticsEnabled && (
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Vyzkoušet vibrace
              </p>
              <div className="grid grid-cols-2 gap-2">
                {testButtons.map((button) => (
                  <Button
                    key={button.name}
                    size="sm"
                    variant="outline"
                    onClick={button.action}
                    className={`border-${button.color}-200 text-${button.color}-700 hover:bg-${button.color}-50`}
                  >
                    {button.name}
                  </Button>
                ))}
              </div>
              
              {!userInteracted && (
                <p className="text-xs text-muted-foreground">
                  💡 První kliknutí aktivuje vibrace (požadavek prohlížeče)
                </p>
              )}
            </div>
          )}

          {/* Help Text */}
          {!debugInfo.isSupported && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Haptická odezva není podporována</strong><br />
                Toto zařízení nebo prohlížeč nepodporuje Vibration API. 
                Zkuste použít Chrome nebo Firefox na Android zařízení.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Rozšířené nastavení a debugging
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <HapticDebugPanel show={true} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
