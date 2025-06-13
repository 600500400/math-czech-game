
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Music, Zap, TestTube } from 'lucide-react';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { useAdvancedHaptics } from '@/hooks/useAdvancedHaptics';

export const AudioSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    isSupported: audioSupported,
    isLoading,
    enableAudio,
    disableAudio,
    playCorrectSound,
    playIncorrectSound,
    playButtonClickSound,
    playCelebrationSound
  } = useAudioSystem();

  const {
    isSupported: hapticsSupported,
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerTapHaptic
  } = useAdvancedHaptics();

  const handleEnableAudio = async () => {
    if (settings.enabled) {
      disableAudio();
    } else {
      const success = await enableAudio();
      if (!success) {
        console.warn('Failed to enable audio system');
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] / 100 });
  };

  const testSound = (type: 'correct' | 'incorrect' | 'celebration') => {
    triggerTapHaptic();
    
    switch (type) {
      case 'correct':
        playCorrectSound();
        triggerSuccessHaptic();
        break;
      case 'incorrect':
        playIncorrectSound();
        triggerErrorHaptic();
        break;
      case 'celebration':
        playCelebrationSound();
        triggerCelebrationHaptic();
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings.enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            Zvukové efekty
            {!audioSupported && <Badge variant="secondary">Nepodporováno</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Povolit zvuky</p>
              <p className="text-sm text-muted-foreground">
                Zvukové efekty pro správné a špatné odpovědi
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={handleEnableAudio}
              disabled={!audioSupported || isLoading}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Hlasitost</p>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[settings.volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Zvukové efekty</p>
                  <p className="text-sm text-muted-foreground">
                    Tóny pro správné/špatné odpovědi
                  </p>
                </div>
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSettings({ soundEffects: checked })}
                />
              </div>

              {/* Test Sounds */}
              <div className="space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Vyzkoušet zvuky
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSound('correct')}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    ✓ Správně
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSound('incorrect')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    ✗ Špatně
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSound('celebration')}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    🎉 Oslava
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Haptic Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Vibrační odezva
            {!hapticsSupported && <Badge variant="secondary">Nepodporováno</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="font-medium">Stav podpory</p>
            <p className="text-sm text-muted-foreground">
              {hapticsSupported 
                ? "Vibrační odezva je podporována na tomto zařízení" 
                : "Vibrační odezva není na tomto zařízení dostupná"
              }
            </p>
          </div>

          {hapticsSupported && (
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Vyzkoušet vibrace
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerSuccessHaptic}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  ✓ Úspěch
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerErrorHaptic}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  ✗ Chyba
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerCelebrationHaptic}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  🎉 Oslava
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progressive Enhancement Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Pokročilé funkce
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Web Audio API</span>
              <Badge variant={audioSupported ? "default" : "secondary"}>
                {audioSupported ? "Podporováno" : "Nepodporováno"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Vibration API</span>
              <Badge variant={hapticsSupported ? "default" : "secondary"}>
                {hapticsSupported ? "Podporováno" : "Nepodporováno"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Offline podpora</span>
              <Badge variant="default">Aktivní</Badge>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Aplikace automaticky přizpůsobuje funkce podle možností vašeho zařízení.
            Na novějších zařízeních máte k dispozici pokročilé audio a haptické efekty.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
