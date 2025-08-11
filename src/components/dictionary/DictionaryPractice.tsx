import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Play, RotateCcw } from "lucide-react";
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
  } = useDictionaryGame(userId);

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
            <CardTitle className="text-center">Procvičování slovíček</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DictionaryModeToggle
              mode={mode}
              direction={direction}
              onModeChange={setMode}
              onDirectionChange={setDirection}
            />
            
            <div className="text-center">
              <Button onClick={startGame} size="lg" className="gap-2">
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
          <p>Žádná slovíčka k procvičování</p>
          <Button onClick={resetGame} className="mt-4">
            Zpět
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Postup</span>
            <span className="text-sm text-muted-foreground">
              {correctAnswers} správně / {wrongAnswers} špatně
            </span>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-500">
              ✓ {correctAnswers}
            </Badge>
            <Badge variant="destructive">
              ✗ {wrongAnswers}
            </Badge>
            <Badge variant="secondary">
              {accuracy}% úspěšnost
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Word Card */}
      <DictionaryCard 
        word={currentWord} 
        direction={direction} 
        showAnswer={showAnswer}
      >
        {mode === 'simple' && !showAnswer && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleSimpleAnswer(true)}
              className="gap-2 bg-green-600 hover:bg-green-700"
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