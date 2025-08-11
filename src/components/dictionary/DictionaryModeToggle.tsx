import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DictionaryModeToggleProps {
  mode: 'simple' | 'advanced';
  direction: 'en_to_cz' | 'cz_to_en';
  onModeChange: (mode: 'simple' | 'advanced') => void;
  onDirectionChange: (direction: 'en_to_cz' | 'cz_to_en') => void;
}

export default function DictionaryModeToggle({
  mode,
  direction,
  onModeChange,
  onDirectionChange
}: DictionaryModeToggleProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Režim:</h3>
            <div className="flex gap-2">
              <Button
                variant={mode === 'simple' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('simple')}
                className="flex-1"
              >
                Jednoduchý
                <Badge variant="secondary" className="ml-2">
                  Vím/Nevím
                </Badge>
              </Button>
              <Button
                variant={mode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('advanced')}
                className="flex-1"
              >
                Pokročilý
                <Badge variant="secondary" className="ml-2">
                  Psaní
                </Badge>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Směr překladu:</h3>
            <div className="flex gap-2">
              <Button
                variant={direction === 'en_to_cz' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDirectionChange('en_to_cz')}
                className="flex-1"
              >
                🇬🇧 → 🇨🇿
              </Button>
              <Button
                variant={direction === 'cz_to_en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDirectionChange('cz_to_en')}
                className="flex-1"
              >
                🇨🇿 → 🇬🇧
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}