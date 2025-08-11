import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search } from "lucide-react";
import { useDictionaryWords } from "@/hooks/dictionary/useDictionaryWords";
import { useAuth } from "@/hooks/useAuth";

export default function DictionaryList() {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { 
    words, 
    isLoading, 
    filterDifficulty, 
    setFilterDifficulty,
    deleteWord, 
    isDeletingWord 
  } = useDictionaryWords(userId);

  const [searchTerm, setSearchTerm] = useState("");

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'basic':
        return 'Základní';
      case 'intermediate':
        return 'Střední';
      case 'advanced':
        return 'Pokročilý';
      default:
        return level;
    }
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = searchTerm === "" || 
      word.english_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.czech_translation.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const userWords = filteredWords.filter(word => word.is_user_created);
  const systemWords = filteredWords.filter(word => !word.is_user_created);

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
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
            <Select 
              value={filterDifficulty} 
              onValueChange={(value: "all" | "basic" | "intermediate" | "advanced") => setFilterDifficulty(value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Vše</SelectItem>
                <SelectItem value="basic">Základní</SelectItem>
                <SelectItem value="intermediate">Střední</SelectItem>
                <SelectItem value="advanced">Pokročilý</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User's Words */}
      {userWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Moje slovíčka ({userWords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userWords.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge className={getDifficultyColor(word.difficulty_level)}>
                      {getDifficultyLabel(word.difficulty_level)}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium">{word.english_word}</div>
                      <div className="text-sm text-muted-foreground">
                        {word.czech_translation}
                      </div>
                    </div>
                  </div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Words */}
      <Card>
        <CardHeader>
          <CardTitle>Přednastavená slovíčka ({systemWords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {systemWords.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Žádná slovíčka nenalezena
            </p>
          ) : (
            <div className="space-y-2">
              {systemWords.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Badge className={getDifficultyColor(word.difficulty_level)}>
                    {getDifficultyLabel(word.difficulty_level)}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{word.english_word}</div>
                    <div className="text-sm text-muted-foreground">
                      {word.czech_translation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredWords.length === 0 && searchTerm && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Pro hledaný výraz "{searchTerm}" nebyla nalezena žádná slovíčka
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}