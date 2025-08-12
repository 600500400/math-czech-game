import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => value && onModeChange(value as 'simple' | 'advanced')}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem value="simple" className="flex items-center justify-center gap-2 py-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Jednoduchý</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="advanced" className="flex items-center justify-center gap-2 py-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Pokročilý</span>
              </ToggleGroupItem>
            </ToggleGroup>
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