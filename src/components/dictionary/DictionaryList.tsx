
import { DictionaryWord } from "@/types/dictionaryTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";

interface DictionaryListProps {
  words: DictionaryWord[];
  onEdit: (word: DictionaryWord) => void;
  onDelete: (id: string) => void;
}

export const DictionaryList = ({ words, onEdit, onDelete }: DictionaryListProps) => {
  const { speak, isLoading, error } = useTextToSpeech();

  const handlePronounce = (text: string, language: 'cs' | 'en') => {
    const lang = language === 'cs' ? 'cs-CZ' : 'en-US';
    speak(text, lang);
    
    if (error) {
      toast.error(`Chyba při výslovnosti: ${error}`);
    }
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Zatím nemáte žádná slovíčka. Přidejte první slovíčko pomocí formuláře výše.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vaše slovíčka ({words.length})</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {words.map((word) => (
          <Card key={word.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{word.czech_word}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handlePronounce(word.czech_word, 'cs')}
                    disabled={isLoading}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(word)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(word.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{word.english_word}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handlePronounce(word.english_word, 'en')}
                  disabled={isLoading}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </div>
              {word.difficulty && (
                <div className="mt-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    {word.difficulty}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DictionaryList;
