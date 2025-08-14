import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Search, Edit2, Download, Check, X } from "lucide-react";
import { useDictionaryWords } from "@/hooks/dictionary/useDictionaryWords";
import { useAuth } from "@/hooks/useAuth";
import { DictionaryWord } from "@/types/dictionaryTypes";

export default function DictionaryList() {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { 
    words, 
    isLoading, 
    updateWord,
    deleteWord, 
    exportToCSV,
    isDeletingWord,
    isUpdatingWord
  } = useDictionaryWords(userId);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ english_word: string; czech_translation: string; difficulty_level: 'basic' | 'intermediate' | 'advanced' }>({
    english_word: "",
    czech_translation: "",
    difficulty_level: "basic"
  });

  const filteredWords = words.filter(word => {
    const matchesSearch = searchTerm === "" || 
      word.english_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.czech_translation.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleStartEdit = (word: DictionaryWord) => {
    setEditingId(word.id);
    setEditForm({
      english_word: word.english_word,
      czech_translation: word.czech_translation,
      difficulty_level: word.difficulty_level
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateWord({ wordId: editingId, updates: editForm });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>Načítám slovíčka...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Export */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat slovíčka..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Words */}
      <Card>
        <CardHeader>
          <CardTitle>Slovník ({filteredWords.length} slovíček)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWords.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {searchTerm ? `Pro hledaný výraz "${searchTerm}" nebyla nalezena žádná slovíčka` : "Zatím nejsou přidána žádná slovíčka."}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {editingId === word.id ? (
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Anglické slovo"
                          value={editForm.english_word}
                          onChange={(e) => setEditForm(prev => ({ ...prev, english_word: e.target.value }))}
                        />
                        <Input
                          placeholder="Český překlad"
                          value={editForm.czech_translation}
                          onChange={(e) => setEditForm(prev => ({ ...prev, czech_translation: e.target.value }))}
                        />
                        <select
                          value={editForm.difficulty_level}
                          onChange={(e) => setEditForm(prev => ({ ...prev, difficulty_level: e.target.value as 'basic' | 'intermediate' | 'advanced' }))}
                          className="px-3 py-2 border rounded-md bg-background"
                        >
                          <option value="basic">Základní</option>
                          <option value="intermediate">Střední</option>
                          <option value="advanced">Pokročilá</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={isUpdatingWord}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{word.english_word}</div>
                        <div className="text-sm text-muted-foreground">{word.czech_translation}</div>
                        <div className="text-xs text-muted-foreground">
                          Obtížnost: {word.difficulty_level}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(word)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWord(word.id)}
                          disabled={isDeletingWord}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}