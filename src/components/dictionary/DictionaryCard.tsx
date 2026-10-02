
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useMemo } from "react";
import { DictionaryWord } from "@/types/dictionaryTypes";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface DictionaryCardProps {
  word: DictionaryWord;
  direction: 'en_to_cz' | 'cz_to_en';
  showAnswer: boolean;
  showSentences?: boolean;
  sentencesKey?: number;
  children?: React.ReactNode;
}

import { DEFAULT_DICTIONARY_WORDS } from "@/data/dictionaryData";

// Get pedagogically correct example sentences
const getExampleSentences = (
  word: DictionaryWord,
  direction: 'en_to_cz' | 'cz_to_en'
): string[] => {
  const matched = DEFAULT_DICTIONARY_WORDS.find(
    w => w.english_word.toLowerCase() === word.english_word.toLowerCase()
  );
  if (matched?.example_en && matched?.example_cz) {
    return [
      direction === 'en_to_cz'
        ? `${matched.example_en} — ${matched.example_cz}`
        : `${matched.example_cz} — ${matched.example_en}`
    ];
  }
  return [`${word.english_word} = ${word.czech_translation}`];
};

export default function DictionaryCard({ word, direction, showAnswer, showSentences = true, sentencesKey = 0, children }: DictionaryCardProps) {
  const { speak, stop, isLoading, error, isSupported } = useTextToSpeech();
  const questionWord = direction === 'en_to_cz' ? word.english_word : word.czech_translation;
  const answerWord = direction === 'en_to_cz' ? word.czech_translation : word.english_word;
  const exampleSentences = useMemo(() => getExampleSentences(word, direction), [word.id, word.english_word, direction, sentencesKey]);

  const handlePronunciation = (text: string) => {
    speak(text, 'en-US');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 min-h-[3rem]">
            <div className="text-2xl font-bold text-center">
              {questionWord}
            </div>
            {isSupported && direction === 'en_to_cz' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePronunciation(questionWord)}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Přehrát výslovnost"
              >
                {isLoading ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          {showAnswer && (
            <div className="text-lg text-muted-foreground border-t pt-4 space-y-3">
              <div>
                <div className="font-medium">Překlad:</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="text-xl text-foreground">{answerWord}</div>
                  {isSupported && direction === 'cz_to_en' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePronunciation(answerWord)}
                      disabled={isLoading}
                      className="h-6 w-6 p-0 hover:bg-primary/10 ml-1"
                      aria-label="Přehrát výslovnost odpovědi"
                    >
                      {isLoading ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {showSentences && (
            <div className="mt-4 border-t pt-3">
              <div className="font-medium text-sm mb-2">Příklady použití:</div>
              <div className="space-y-1">
                {exampleSentences.map((sentence, index) => (
                  <div key={index} className="text-sm text-muted-foreground italic">
                    "{sentence}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
