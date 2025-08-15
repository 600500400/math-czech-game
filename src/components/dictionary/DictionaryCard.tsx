
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

// Generate example sentences with the target word
const generateExampleSentences = (
  english: string,
  czech: string,
  direction: 'en_to_cz' | 'cz_to_en'
) => {
  const targetWord = direction === 'en_to_cz' ? english : czech;
  const wordLower = targetWord.toLowerCase();

  const czechTemplates = [
    `Včera jsem viděl ${wordLower} v obchodě.`,
    `Moje babička má doma krásný ${wordLower}.`,
    `V knize se psalo o ${wordLower}, který byl velmi zajímavý.`,
    `Děti si hrály s ${wordLower} na zahradě.`,
    `Na stole ležel ${wordLower}, který tam někdo zapomněl.`
  ];

  const englishTemplates = [
    `I love this ${wordLower} very much.`,
    `Yesterday I saw a beautiful ${wordLower} in the park.`,
    `My friend has a nice ${wordLower} at home.`,
    `The ${wordLower} was really interesting to watch.`,
    `Children often play with this ${wordLower} outside.`
  ];

  const templates = direction === 'en_to_cz' ? englishTemplates : czechTemplates;
  const shuffled = templates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

export default function DictionaryCard({ word, direction, showAnswer, showSentences = true, sentencesKey = 0, children }: DictionaryCardProps) {
  const { speak, stop, loading, error, supported } = useTextToSpeech();
  const questionWord = direction === 'en_to_cz' ? word.english_word : word.czech_translation;
  const answerWord = direction === 'en_to_cz' ? word.czech_translation : word.english_word;
  const exampleSentences = useMemo(() => generateExampleSentences(word.english_word, word.czech_translation, direction), [word.id, direction, sentencesKey]);

  const handlePronunciation = (text: string, language: 'en' | 'cz') => {
    const lang = language === 'cz' ? 'cs-CZ' : 'en-US';
    speak(text, lang);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 min-h-[3rem]">
            <div className="text-2xl font-bold text-center">
              {questionWord}
            </div>
            {supported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePronunciation(
                  questionWord,
                  direction === 'en_to_cz' ? 'en' : 'cz'
                )}
                disabled={loading}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Přehrát výslovnost"
              >
                {loading ? (
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
                  {supported && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePronunciation(
                        answerWord,
                        direction === 'en_to_cz' ? 'cz' : 'en'
                      )}
                      disabled={loading}
                      className="h-6 w-6 p-0 hover:bg-primary/10 ml-1"
                      aria-label="Přehrát výslovnost odpovědi"
                    >
                      {loading ? (
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
