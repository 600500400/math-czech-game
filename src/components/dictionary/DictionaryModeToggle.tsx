import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DictionaryModeToggleProps {
  direction: 'en_to_cz' | 'cz_to_en';
  onDirectionChange: (direction: 'en_to_cz' | 'cz_to_en') => void;
}

export default function DictionaryModeToggle({
  direction,
  onDirectionChange
}: DictionaryModeToggleProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div>
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