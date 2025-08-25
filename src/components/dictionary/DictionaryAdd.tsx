import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Upload, LogIn, Languages, Loader2 } from "lucide-react";
import { useDictionaryWords } from "@/hooks/dictionary/useDictionaryWords";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebounce } from "@/hooks/useDebounce";
import { NewDictionaryWord } from "@/types/dictionaryTypes";
import { toast } from "sonner";

export default function DictionaryAdd() {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const userId = authState.user?.id || null;
  const { addWord, bulkImport, isAddingWord, isBulkImporting } = useDictionaryWords(userId);
  const { translate, isTranslating, error: translationError, clearError } = useTranslation();

  const [singleWord, setSingleWord] = useState({
    english_word: "",
    czech_translation: "",
    difficulty_level: "basic" as "basic" | "intermediate" | "advanced"
  });

  const [bulkText, setBulkText] = useState("");
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(true);
  const [userEditedTranslation, setUserEditedTranslation] = useState(false);
  
  // Debounce the English word input for auto-translation
  const debouncedEnglishWord = useDebounce(singleWord.english_word, 300);

  // Auto-translate effect
  useEffect(() => {
    const performAutoTranslation = async () => {
      if (
        autoTranslateEnabled &&
        debouncedEnglishWord.trim() &&
        !userEditedTranslation
      ) {
        clearError();
        const translation = await translate(debouncedEnglishWord.trim());
        if (translation) {
          setSingleWord(prev => ({
            ...prev,
            czech_translation: translation
          }));
        }
      }
    };

    performAutoTranslation();
  }, [debouncedEnglishWord, autoTranslateEnabled, userEditedTranslation, translate, clearError]);

  const handleManualTranslate = async () => {
    if (!singleWord.english_word.trim()) {
      toast.error("Nejdříve zadej anglické slovo");
      return;
    }

    clearError();
    const translation = await translate(singleWord.english_word.trim());
    if (translation) {
      setSingleWord(prev => ({
        ...prev,
        czech_translation: translation
      }));
      setUserEditedTranslation(false);
    } else if (translationError) {
      toast.error(`Překlad se nepodařil: ${translationError}`);
    }
  };

  const handleAddSingleWord = () => {
    if (!singleWord.english_word.trim() || !singleWord.czech_translation.trim()) {
      toast.error("Vyplň anglické slovo i český překlad");
      return;
    }

    addWord(singleWord);
    setSingleWord({
      english_word: "",
      czech_translation: "",
      difficulty_level: "basic"
    });
    setUserEditedTranslation(false);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) {
      toast.error("Zadej slovíčka v požadovaném formátu");
      return;
    }

    const lines = bulkText.trim().split('\n');
    const words: NewDictionaryWord[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.includes('→')) {
        const [english, czech] = trimmedLine.split('→').map(s => s.trim());
        if (english && czech) {
          words.push({
            english_word: english,
            czech_translation: czech,
            difficulty_level: "basic"
          });
        }
      } else {
        toast.error(`Neplatný formát řádku: ${trimmedLine}`);
        return;
      }
    }

    if (words.length === 0) {
      toast.error("Žádná platná slovíčka nebyla nalezena");
      return;
    }

    bulkImport(words);
    setBulkText("");
  };

  return (
    <div className="space-y-6">
      {/* Single Word Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Přidat jedno slovíčko
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Anglické slovo
              </label>
              <Input
                placeholder="Například: house"
                value={singleWord.english_word}
                onChange={(e) => {
                  setSingleWord(prev => ({
                    ...prev,
                    english_word: e.target.value
                  }));
                  // Reset user edited flag when changing English word
                  if (e.target.value !== singleWord.english_word) {
                    setUserEditedTranslation(false);
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Český překlad
                </label>
                <div className="flex items-center gap-2">
                  {autoTranslateEnabled && isTranslating && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Překládám...
                    </div>
                  )}
                  {(translationError || userEditedTranslation) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleManualTranslate}
                      disabled={isTranslating || !singleWord.english_word.trim()}
                      className="h-6 px-2 text-xs"
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      Přeložit
                    </Button>
                  )}
                </div>
              </div>
              <Input
                placeholder="Například: dům"
                value={singleWord.czech_translation}
                onChange={(e) => {
                  setSingleWord(prev => ({
                    ...prev,
                    czech_translation: e.target.value
                  }));
                  setUserEditedTranslation(true);
                }}
              />
              {translationError && (
                <p className="text-xs text-destructive mt-1">
                  Překlad selhal: {translationError}
                </p>
              )}
            </div>
          </div>


          <Button
            onClick={handleAddSingleWord}
            disabled={isAddingWord || !singleWord.english_word.trim() || !singleWord.czech_translation.trim()}
            className="w-full"
          >
            {isAddingWord ? "Přidávám..." : "Přidat slovíčko"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Bulk Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Hromadný import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Slovíčka (jedno na řádek, formát: anglické→české)
            </label>
            <Textarea
              placeholder={`Příklad:
house→dům
cat→kočka
beautiful→krásný`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Formát:</p>
            <p>• Každé slovíčko na novém řádku</p>
            <p>• Použij šipku → mezi anglickým slovem a českým překladem</p>
            <p>• Příklad: "apple→jablko"</p>
          </div>

          <Button
            onClick={handleBulkImport}
            disabled={isBulkImporting || !bulkText.trim()}
            className="w-full"
          >
            {isBulkImporting ? "Importuji..." : "Importovat slovíčka"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}