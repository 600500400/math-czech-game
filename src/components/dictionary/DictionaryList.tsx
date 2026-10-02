import { useState, useMemo } from "react";
import { DictionaryWord } from "@/types/dictionaryTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Volume2, Search } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useDictionaryWords } from "@/hooks/dictionary/useDictionaryWords";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const DictionaryList = () => {
  const { authState } = useAuth();
  const { 
    personalWords, 
    schoolWords, 
    allWords, 
    deleteWord, 
    updateWord 
  } = useDictionaryWords(authState.user?.id || null);

  const { speak, isLoading, error, isSupported } = useTextToSpeech();
  const [activeTab, setActiveTab] = useState<'personal' | 'school' | 'all'>('personal');
  const [searchQuery, setSearchQuery] = useState("");
  const [editingWord, setEditingWord] = useState<DictionaryWord | null>(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editCzech, setEditCzech] = useState("");

  const handlePronounce = (text: string) => {
    speak(text, 'en-US');
    if (error) {
      toast.error(`Chyba při výslovnosti: ${error}`);
    }
  };

  const handleStartEdit = (word: DictionaryWord) => {
    setEditingWord(word);
    setEditEnglish(word.english_word);
    setEditCzech(word.czech_translation);
  };

  const handleSaveEdit = async () => {
    if (!editingWord) return;
    if (!editEnglish.trim() || !editCzech.trim()) {
      toast.error("Vyplňte prosím anglické i české slovo");
      return;
    }

    try {
      updateWord({
        wordId: editingWord.id,
        updates: {
          english_word: editEnglish.trim(),
          czech_translation: editCzech.trim(),
        }
      });
      setEditingWord(null);
    } catch (err: any) {
      toast.error("Nepodařilo se uložit změny: " + (err.message || ""));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWord(id);
      toast.success("Slovíčko bylo vymazáno");
    } catch (err) {
      toast.error("Nepodařilo se vymazat slovíčko");
    }
  };

  const displayedWords = useMemo(() => {
    let list: DictionaryWord[] = [];
    if (activeTab === 'personal') {
      list = personalWords;
    } else if (activeTab === 'school') {
      list = schoolWords;
    } else {
      list = allWords;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      w => w.english_word.toLowerCase().includes(q) || w.czech_translation.toLowerCase().includes(q)
    );
  }, [activeTab, personalWords, schoolWords, allWords, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Category selector & search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
          <Button
            type="button"
            variant={activeTab === 'personal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('personal')}
            className="text-xs font-semibold px-3"
          >
            📝 Můj slovník ({personalWords.length})
          </Button>
          <Button
            type="button"
            variant={activeTab === 'school' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('school')}
            className="text-xs font-semibold px-3"
          >
            🎒 Školní ({schoolWords.length})
          </Button>
          <Button
            type="button"
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('all')}
            className="text-xs font-semibold px-3"
          >
            🌐 Vše ({allWords.length})
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat slovíčko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {displayedWords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-2xl p-6">
          {searchQuery ? "Nenalezena žádná odpovídající slovíčka." : "V tomto slovníku zatím nejsou žádná slovíčka."}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {displayedWords.map((word) => {
            const isSchoolWord = word.user_id === 'school';
            return (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-3.5 px-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{word.czech_translation}</span>
                      <Badge variant={isSchoolWord ? "secondary" : "outline"} className="text-[10px] py-0 px-1.5 font-normal">
                        {isSchoolWord ? "Školní" : "Osobní"}
                      </Badge>
                    </div>

                    {!isSchoolWord && (
                      <div className="flex gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(word)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Upravit slovíčko"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(word.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          title="Smazat slovíčko"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-mono">{word.english_word}</span>
                    {isSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-primary/10 ml-auto"
                        onClick={() => handlePronounce(word.english_word)}
                        disabled={isLoading}
                        aria-label={`Přehrát ${word.english_word}`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Word Dialog */}
      <Dialog open={!!editingWord} onOpenChange={(open) => !open && setEditingWord(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upravit slovíčko</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-english">Anglické slovo</Label>
              <Input
                id="edit-english"
                value={editEnglish}
                onChange={(e) => setEditEnglish(e.target.value)}
                placeholder="např. cat"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-czech">Český překlad</Label>
              <Input
                id="edit-czech"
                value={editCzech}
                onChange={(e) => setEditCzech(e.target.value)}
                placeholder="např. kočka"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingWord(null)}>
              Zrušit
            </Button>
            <Button onClick={handleSaveEdit}>
              Uložit změny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DictionaryList;
