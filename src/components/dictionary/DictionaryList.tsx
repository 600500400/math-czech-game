
import { DictionaryWord } from "@/types/dictionaryTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useDictionaryWords } from "@/hooks/dictionary/useDictionaryWords";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const DictionaryList = () => {
  const { authState } = useAuth();
  const { words, deleteWord } = useDictionaryWords(authState.user?.id || null);
  const { speak, isLoading, error, isSupported } = useTextToSpeech();

  const handlePronounce = (text: string) => {
    speak(text, 'en-US');
    
    if (error) {
      toast.error(`Chyba při výslovnosti: ${error}`);
    }
  };

  const handleEdit = (word: DictionaryWord) => {
    // TODO: Implement edit functionality
    toast.info("Úprava slovíčka není zatím implementována");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWord(id);
      toast.success("Slovíčko bylo vymazáno");
    } catch (error) {
      toast.error("Nepodařilo se vymazat slovíčko");
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
                  <span>{word.czech_translation}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(word)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(word.id)}
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
                {isSupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handlePronounce(word.english_word)}
                    disabled={isLoading}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DictionaryList;
