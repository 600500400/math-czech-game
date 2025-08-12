import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain } from "lucide-react";

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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Jednoduchý</span>
              </div>
              <Switch
                checked={mode === 'advanced'}
                onCheckedChange={(checked) => onModeChange(checked ? 'advanced' : 'simple')}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">Pokročilý</span>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </div>
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