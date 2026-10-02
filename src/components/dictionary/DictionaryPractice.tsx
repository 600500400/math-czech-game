import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Play, RotateCcw, Shuffle, Eye, EyeOff, RefreshCcw } from "lucide-react";
import DictionaryCard from "./DictionaryCard";
import DictionaryModeToggle from "./DictionaryModeToggle";
import { useDictionaryGame } from "@/hooks/dictionary/useDictionaryGame";
import { useAuth } from "@/hooks/useAuth";
import { StatisticsDialog } from "../spelling/StatisticsDialog";

export default function DictionaryPractice() {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  
  const {
    currentWord,
    userAnswer,
    showAnswer,
    gameStarted,
    mode,
    direction,
    source,
    setSource,
    personalWordsCount,
    schoolWordsCount,
    totalWordsCount,
    correctAnswers,
    wrongAnswers,
    showStatsDialog,
    startGame,
    endGame,
    resetGame,
    handleSimpleAnswer,
    handleAdvancedAnswer,
    setMode,
    setDirection,
    setUserAnswer,
    setShowStatsDialog,
    currentIndex,
    totalWords,
    showSentences,
    setShowSentences,
    shuffleDeck,
  } = useDictionaryGame(userId);
  const [sentencesKey, setSentencesKey] = useState(0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mode === 'advanced' && !showAnswer) {
      handleAdvancedAnswer();
    }
  };

  const totalAnswers = correctAnswers + wrongAnswers;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-heading text-xl">Procvičování slovíček</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Výběr slovníku */}
            <div>
              <h3 className="text-sm font-semibold mb-2.5 text-foreground">Vyber slovník k procvičování:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Button
                  type="button"
                  variant={source === 'personal' ? 'default' : 'outline'}
                  onClick={() => setSource('personal')}
                  className={`flex flex-col h-auto py-3 px-3 items-center text-center gap-1 transition-all ${
                    source === 'personal' ? 'ring-2 ring-primary shadow-sm' : ''
                  }`}
                >
                  <span className="font-semibold text-sm">📝 Můj slovník</span>
                  <span className="text-xs opacity-75">{personalWordsCount} vlastních slov</span>
                </Button>
                <Button
                  type="button"
                  variant={source === 'school' ? 'default' : 'outline'}
                  onClick={() => setSource('school')}
                  className={`flex flex-col h-auto py-3 px-3 items-center text-center gap-1 transition-all ${
                    source === 'school' ? 'ring-2 ring-primary shadow-sm' : ''
                  }`}
                >
                  <span className="font-semibold text-sm">🎒 Školní (A1–A2)</span>
                  <span className="text-xs opacity-75">{schoolWordsCount} základních slov</span>
                </Button>
                <Button
                  type="button"
                  variant={source === 'all' ? 'default' : 'outline'}
                  onClick={() => setSource('all')}
                  className={`flex flex-col h-auto py-3 px-3 items-center text-center gap-1 transition-all ${
                    source === 'all' ? 'ring-2 ring-primary shadow-sm' : ''
                  }`}
                >
                  <span className="font-semibold text-sm">🌐 Všechna slovíčka</span>
                  <span className="text-xs opacity-75">{totalWordsCount} slov celkem</span>
                </Button>
              </div>
            </div>

            {/* Styl procvičování */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Styl procvičování:</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === 'simple' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('simple')}
                  className="flex-1"
                >
                  🃏 Kartičky (Vím / Nevím)
                </Button>
                <Button
                  type="button"
                  variant={mode === 'advanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('advanced')}
                  className="flex-1"
                >
                  ✍️ Psaní překladu
                </Button>
              </div>
            </div>

            {/* Směr překladu */}
            <DictionaryModeToggle
              direction={direction}
              onDirectionChange={setDirection}
            />

            <div className="text-center pt-2">
              <Button onClick={startGame} size="lg" className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md">
                <Play className="h-5 w-5" />
                Začít procvičování
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>Žádná slovíčka k procvičování v tomto slovníku</p>
          <Button onClick={resetGame} className="mt-4">
            Zpět na výběr
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getSourceBadgeLabel = () => {
    switch (source) {
      case 'personal':
        return '📝 Můj slovník';
      case 'school':
        return '🎒 Školní (A1–A2)';
      case 'all':
      default:
        return '🌐 Všechna slovíčka';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-3 py-1 font-medium">
                {getSourceBadgeLabel()}
              </Badge>
              <Button variant="ghost" size="sm" onClick={resetGame} className="text-xs">
                Změnit výběr
              </Button>
            </div>

            <DictionaryModeToggle
              direction={direction}
              onDirectionChange={setDirection}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Slovíčko <span className="font-semibold text-foreground">{(currentIndex ?? 0) + 1}</span> z <span className="font-semibold text-foreground">{totalWords ?? 0}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={shuffleDeck} aria-label="Zamíchat slovíčka" className="gap-2">
                  <Shuffle className="h-4 w-4" /> Zamíchat
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowSentences(!showSentences)} aria-label="Skrýt/Zobrazit věty" className="gap-2">
                  {showSentences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showSentences ? 'Skrýt věty' : 'Zobrazit věty'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSentencesKey((k) => k + 1)} aria-label="Vygenerovat nové věty" className="gap-2">
                  <RefreshCcw className="h-4 w-4" /> Nové věty
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Card */}
      <DictionaryCard 
        word={currentWord} 
        direction={direction} 
        showAnswer={showAnswer}
        showSentences={showSentences}
        sentencesKey={sentencesKey}
      >
        {mode === 'simple' && !showAnswer && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleSimpleAnswer(true)}
              className="gap-2 bg-subject-dictionary hover:opacity-90 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Vím
            </Button>
            <Button
              onClick={() => handleSimpleAnswer(false)}
              variant="destructive"
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Nevím
            </Button>
          </div>
        )}

        {mode === 'advanced' && !showAnswer && (
          <div className="space-y-4">
            <Input
              placeholder="Zadej překlad..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg"
              autoFocus
            />
            <Button
              onClick={handleAdvancedAnswer}
              disabled={!userAnswer.trim()}
              className="w-full"
            >
              Zkontrolovat
            </Button>
          </div>
        )}

        {showAnswer && mode === 'advanced' && (
          <div className="text-center">
            <div className={`text-lg font-semibold ${
              userAnswer.trim().toLowerCase() === 
              (direction === 'en_to_cz' ? currentWord.czech_translation : currentWord.english_word).toLowerCase()
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {userAnswer.trim().toLowerCase() === 
               (direction === 'en_to_cz' ? currentWord.czech_translation : currentWord.english_word).toLowerCase()
                ? '✓ Správně!' 
                : '✗ Špatně'}
            </div>
            {userAnswer.trim().toLowerCase() !== 
             (direction === 'en_to_cz' ? currentWord.czech_translation : currentWord.english_word).toLowerCase() && (
              <div className="text-sm text-muted-foreground mt-1">
                Tvoje odpověď: {userAnswer}
              </div>
            )}
          </div>
        )}
      </DictionaryCard>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={endGame} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Ukončit
        </Button>
      </div>

      {/* Statistics Dialog */}
      <StatisticsDialog
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
      />
    </div>
  );
}